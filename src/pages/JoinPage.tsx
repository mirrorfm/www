import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { Grid as GridLoader } from 'react-loader-spinner'
import { NumericFormat } from 'react-number-format'
import Autocomplete from '@mui/material/Autocomplete'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import InboxIcon from '@mui/icons-material/Inbox'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'
import { getYouTubeAccessToken, refreshYouTubeAccessToken } from '../lib/firebase'

type Role = 'artist' | 'curator'

// --- Artist types ---
interface TrackInfo {
  name: string
  artist: string
  image: string
  genres: string[]
  spotify_url: string
}

interface Genre {
  name: string
  count: number
}

interface ChannelMatch {
  channel_id: string
  channel_name: string
  thumbnail: string
  playlist_id: string
  followers: number
  found_tracks: number
  total_tracks: number
  score: number
  matching_genres: string[]
  top_genres: Genre[]
}

interface AnalyzeResponse {
  track: TrackInfo
  matches: ChannelMatch[]
  genre_source?: string
  all_artist_genres?: string[]
}

interface Submission {
  submission_id: string
  channel_name: string
  track_url: string
  track_name: string
  track_artist: string
  track_image: string
  status: string
  created_at: string
}

// --- Curator types ---
interface CuratorChannel {
  channel_id: string
  channel_name: string
  thumbnail: string
  tracked: boolean
}

interface CuratorSubmission {
  submission_id: string
  artist_user_id: string
  channel_id: string
  channel_name: string
  track_url: string
  track_name: string
  track_artist: string
  track_image: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: '#888',
  accepted: '#1DB954',
  rejected: '#d32f2f',
  archived: '#666',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Featured',
  rejected: 'Passed',
  archived: 'Archived',
}

// --- Shared components ---

function StepIndicator({ number, label }: { number: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1DB954, #17a34a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Arial, sans-serif',
        flexShrink: 0,
      }}>
        {number}
      </div>
      <span style={{ fontSize: 13, color: '#999', fontFamily: 'Arial, sans-serif' }}>{label}</span>
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 90 }}>
      <div style={{
        flex: 1, height: 6, borderRadius: 3,
        background: '#333', overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 3,
          background: pct >= 70 ? 'linear-gradient(90deg, #1DB954, #1ed760)' :
                     pct >= 40 ? 'linear-gradient(90deg, #b8860b, #daa520)' :
                     'linear-gradient(90deg, #666, #888)',
          transition: 'width 0.6s ease-out',
        }} />
      </div>
      <span style={{
        fontSize: 12, fontWeight: 700, fontFamily: 'Arial, sans-serif',
        color: pct >= 70 ? '#1DB954' : pct >= 40 ? '#daa520' : '#888',
        minWidth: 32, textAlign: 'right',
      }}>
        {pct}%
      </span>
    </div>
  )
}

// --- Main page ---

export default function JoinPage() {
  const { user, loading: authLoading } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialRole = searchParams.get('as') === 'curator' ? 'curator' : searchParams.get('as') === 'artist' ? 'artist' : null
  const [role, setRole] = useState<Role | null>(initialRole)

  const selectRole = (r: Role) => {
    setRole(r)
    setSearchParams({ as: r }, { replace: true })
  }

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="Get started" />
        <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 40 }}>
          <h2 style={{ fontWeight: 400, fontSize: 26, textAlign: 'center', marginBottom: 12 }}>
            Connect artists with curators
          </h2>
          <p style={{ color: '#777', fontSize: 15, textAlign: 'center', lineHeight: 1.6, marginBottom: 40 }}>
            Submit your tracks to YouTube channel curators who match your genre,
            or claim your channel and discover new music.
          </p>

          {/* How it works */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
            marginBottom: 40, textAlign: 'center',
          }}>
            {[
              { icon: <SearchIcon sx={{ fontSize: 28, color: '#1DB954' }} />, title: 'Analyze', desc: 'Paste a Spotify link, we detect your genres' },
              { icon: <SendIcon sx={{ fontSize: 28, color: '#1DB954' }} />, title: 'Match', desc: 'We find YouTube channels that fit your sound' },
              { icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: '#1DB954' }} />, title: 'Feature', desc: 'Curators review and add tracks they love' },
            ].map(step => (
              <div key={step.title} style={{
                padding: '24px 16px', background: '#222', borderRadius: 10,
                border: '1px solid #2a2a2a',
              }}>
                <div style={{ marginBottom: 10 }}>{step.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#d4d4d4' }}>{step.title}</div>
                <div style={{ color: '#777', fontSize: 12, lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/signin/" style={{
              display: 'inline-block', background: '#1DB954', color: 'white',
              padding: '12px 32px', borderRadius: 6, textDecoration: 'none',
              fontSize: 15, fontWeight: 600, transition: 'background 0.2s',
            }}>
              Sign in to get started
            </Link>
            <p style={{ color: '#555', fontSize: 13, marginTop: 12 }}>Uses your Google account</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title={role === 'artist' ? 'Pitch your music' : role === 'curator' ? 'Curator dashboard' : 'Get started'} />

      {/* Role selector */}
      {!role && (
        <p style={{ color: '#777', fontSize: 15, textAlign: 'center', marginBottom: 8 }}>
          How would you like to use Mirror.FM?
        </p>
      )}
      <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
        <button
          onClick={() => selectRole('artist')}
          style={{
            flex: 1,
            padding: '24px 20px',
            background: role === 'artist' ? '#1a2e1a' : '#222',
            border: role === 'artist' ? '2px solid #1DB954' : '1px solid #333',
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {role === 'artist' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #1DB954, #1ed760)',
            }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <MusicNoteIcon sx={{ fontSize: 22, color: role === 'artist' ? '#1DB954' : '#666' }} />
            <span style={{ color: role === 'artist' ? '#1DB954' : '#d4d4d4', fontWeight: 600, fontSize: 16 }}>
              I'm an artist
            </span>
          </div>
          <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5, paddingLeft: 34 }}>
            Submit your tracks to YouTube channel curators who match your genre
          </div>
        </button>
        <button
          onClick={() => selectRole('curator')}
          style={{
            flex: 1,
            padding: '24px 20px',
            background: role === 'curator' ? '#1a2e1a' : '#222',
            border: role === 'curator' ? '2px solid #1DB954' : '1px solid #333',
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {role === 'curator' && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #1DB954, #1ed760)',
            }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <PlayCircleOutlineIcon sx={{ fontSize: 22, color: role === 'curator' ? '#1DB954' : '#666' }} />
            <span style={{ color: role === 'curator' ? '#1DB954' : '#d4d4d4', fontWeight: 600, fontSize: 16 }}>
              I'm a curator
            </span>
          </div>
          <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5, paddingLeft: 34 }}>
            Claim your YouTube channel and receive track submissions from artists
          </div>
        </button>
      </div>

      {role === 'artist' && <ArtistFlow />}
      {role === 'curator' && <CuratorFlow />}
    </Layout>
  )
}

// --- Artist Flow ---
function ArtistFlow() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  // Genre editing state
  const [allGenres, setAllGenres] = useState<string[]>([])
  const [editedGenres, setEditedGenres] = useState<string[]>([])
  const [genresModified, setGenresModified] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('session_id')
  const [success, setSuccess] = useState(params.get('success') === 'true')
  const canceled = params.get('canceled') === 'true'

  useEffect(() => {
    api.get('submissions')
      .then(({ data }) => setSubmissions(data.submissions || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [])

  // Fetch genre list for autocomplete
  useEffect(() => {
    api.get('genres')
      .then(({ data }) => setAllGenres((data.genres || []).map((g: Genre) => g.name)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!sessionId || success) return
    api.post('pitch/confirm', { session_id: sessionId })
      .then(() => setSuccess(true))
      .catch(() => setError('Payment verification failed. Please contact support.'))
  }, [sessionId])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setGenresModified(false)
    try {
      const { data } = await api.post('submit/analyze', { url: url.trim() })
      setResult(data)
      setEditedGenres(data.track.genres || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenreChange = (newGenres: string[]) => {
    const capped = newGenres.slice(0, 3)
    setEditedGenres(capped)
    const original = result?.track.genres || []
    const changed = capped.length !== original.length || capped.some((g, i) => g !== original[i])
    setGenresModified(changed)
  }

  const handleUpdateMatches = async () => {
    if (editedGenres.length === 0) return
    setLoading(true)
    setError(null)
    setGenresModified(false)
    try {
      const { data } = await api.post('submit/analyze', { url: url.trim(), genres: editedGenres })
      setResult(data)
      setEditedGenres(data.track.genres || [])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const BETA_FREE = true

  const handleSubmit = async () => {
    if (!result || result.matches.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        track_url: url.trim(),
        track_name: result.track.name,
        track_artist: result.track.artist,
        track_image: result.track.image,
        channels: result.matches.map(m => ({ id: m.channel_id, name: m.channel_name })),
      }
      if (BETA_FREE) {
        await api.post('pitch/submit', payload)
        window.location.href = '/join/?as=artist&success=true'
      } else {
        const { data } = await api.post('pitch/checkout', payload)
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit.')
      setSubmitting(false)
    }
  }

  // Steps indicator
  const currentStep = success ? 3 : result ? 2 : 1

  return (
    <>
      {/* Progress steps */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
        padding: '14px 20px', background: '#1e1e1e', borderRadius: 8,
        flexWrap: 'wrap',
      }}>
        <StepIndicator number={1} label="Paste track" />
        <div style={{ width: 24, height: 1, background: currentStep >= 2 ? '#1DB954' : '#333' }} />
        <StepIndicator number={2} label="Review matches" />
        <div style={{ width: 24, height: 1, background: currentStep >= 3 ? '#1DB954' : '#333' }} />
        <StepIndicator number={3} label="Submit" />
      </div>

      {success && (
        <div style={{
          padding: 24, background: 'linear-gradient(135deg, #1a2e1a, #1e2e1e)',
          borderRadius: 10, marginBottom: 28, textAlign: 'center',
          border: '1px solid #2a3a2a',
        }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#1DB954', mb: 1 }} />
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Your track has been submitted!</p>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 0 }}>
            All matching curators will see it in their inbox. You'll be notified when they respond.
          </p>
        </div>
      )}

      {canceled && (
        <div style={{ padding: 16, background: '#2e2a1a', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 15, marginBottom: 0, color: '#666' }}>Checkout canceled. No charges were made.</p>
        </div>
      )}

      <p style={{ color: '#666', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
        Paste a Spotify track link to find matching YouTube channels.
        {BETA_FREE
          ? ' Free during beta — your track goes to all matching curators.'
          : ' Submit for $5 and your track goes to all matching curators. Auto-refund if no one features it within 3 months.'
        }
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <TextField
          fullWidth variant="outlined" size="small"
          placeholder="https://open.spotify.com/track/..."
          value={url} onChange={e => setUrl(e.target.value)} disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1DB954',
              },
            },
          }}
        />
        <Button type="submit" variant="contained" disabled={loading || !url.trim()}
          startIcon={<SearchIcon />}
          sx={{
            backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' },
            textTransform: 'none', whiteSpace: 'nowrap', px: 3, borderRadius: '8px',
            fontWeight: 600,
          }}>
          Find channels
        </Button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ justifyContent: 'center' }} />
          <p style={{ color: '#888', marginTop: 16, fontSize: 14 }}>Analyzing genres and finding matching channels...</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px', background: '#2e1a1a', borderRadius: 8,
          border: '1px solid #3a2222', marginBottom: 20,
        }}>
          <p style={{ color: '#d32f2f', marginBottom: 0, fontSize: 14 }}>{error}</p>
        </div>
      )}

      {result && !success && (
        <>
          {/* Track card */}
          <div style={{
            display: 'flex', gap: 20, alignItems: 'flex-start', padding: 20,
            background: 'linear-gradient(135deg, #262626, #2a2a2a)',
            borderRadius: 10, marginBottom: 28, flexWrap: 'wrap',
            border: '1px solid #333',
          }}>
            {result.track.image && (
              <img src={result.track.image} alt={result.track.name}
                style={{ width: 88, height: 88, borderRadius: 6, filter: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
            )}
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 2 }}>{result.track.name}</div>
              <div style={{ color: '#999', marginBottom: 12, fontSize: 14 }}>{result.track.artist}</div>

              {/* Editable genre selector */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Autocomplete
                  multiple
                  freeSolo={false as any}
                  options={allGenres.filter(g => !editedGenres.includes(g))}
                  value={editedGenres}
                  onChange={(_, value) => handleGenreChange(value)}
                  getOptionDisabled={() => editedGenres.length >= 3}
                  renderInput={(params) => (
                    <TextField {...params} size="small"
                      placeholder={editedGenres.length === 0 ? 'Pick up to 3 genres...' : editedGenres.length < 3 ? 'Add genre...' : ''}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip {...getTagProps({ index })} key={option} size="small" label={option} className="chip-mui-selected" />
                    ))
                  }
                  sx={{ flex: 1, minWidth: 200 }}
                  size="small"
                />
                {genresModified && (
                  <Button
                    variant="contained"
                    disabled={editedGenres.length === 0 || loading}
                    onClick={handleUpdateMatches}
                    startIcon={<SearchIcon />}
                    sx={{
                      backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' },
                      textTransform: 'none', borderRadius: '8px', fontWeight: 600, whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    Update matches
                  </Button>
                )}
              </div>
              <div style={{ fontSize: 11, marginTop: 6, color: editedGenres.length === 0 ? '#d32f2f' : '#888' }}>
                {editedGenres.length === 0 && 'Select at least 1 genre (up to 3 recommended) to find matching channels.'}
                {editedGenres.length === 1 && 'Add up to 2 more genres for better matches.'}
                {editedGenres.length === 2 && 'You can add 1 more genre.'}
                {editedGenres.length === 3 && ''}
                {result.genre_source === 'related' && !genresModified && editedGenres.length > 0 && (
                  <span style={{ fontStyle: 'italic' }}> Genres detected via similar artists.</span>
                )}
              </div>
            </div>
          </div>

          {result.matches.length > 0 ? (
            <>
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ marginBottom: 6 }}>
                  {result.matches.length} matching channel{result.matches.length !== 1 ? 's' : ''}
                </h4>
                <p style={{ color: '#777', fontSize: 13, marginBottom: 0, lineHeight: 1.5 }}>
                  Ranked by genre overlap between your track and each channel's Spotify catalog.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {result.matches.map((match, i) => (
                  <div key={match.channel_id} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: 16, flexWrap: 'wrap',
                    border: '1px solid #2a2a2a', borderRadius: 10,
                    background: i === 0 ? 'linear-gradient(135deg, #1a2a1a 0%, #222 40%)' : '#222',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {match.thumbnail ? (
                        <img src={match.thumbnail} alt={match.channel_name}
                          style={{ width: 64, height: 64, borderRadius: 8, filter: 'none' }} />
                      ) : (
                        <div style={{
                          width: 64, height: 64, borderRadius: 8, background: '#333',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <PlayCircleOutlineIcon sx={{ color: '#555', fontSize: 28 }} />
                        </div>
                      )}
                      {i === 0 && (
                        <div style={{
                          position: 'absolute', top: -6, right: -6,
                          background: '#1DB954', color: '#fff', borderRadius: 10,
                          fontSize: 10, fontWeight: 700, padding: '2px 6px',
                          fontFamily: 'Arial, sans-serif',
                        }}>
                          BEST
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{match.channel_name}</span>
                        {match.playlist_id && (
                          <a
                            href={`https://open.spotify.com/playlist/${match.playlist_id}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ color: '#1DB954', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}
                          >
                            Spotify <OpenInNewIcon sx={{ fontSize: 12 }} />
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#777', marginBottom: 8, fontFamily: 'Arial, sans-serif' }}>
                        <NumericFormat value={match.followers} displayType="text" thousandSeparator="," /> followers
                        {' · '}
                        <NumericFormat value={match.found_tracks} displayType="text" thousandSeparator="," /> tracks on Spotify
                      </div>
                      <ScoreBar score={match.score} />
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {(match.top_genres || []).map(g => (
                          <Chip key={g.name} size="small" label={g.name}
                            className={(match.matching_genres || []).includes(g.name) ? 'chip-mui-selected' : 'chip-mui'} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit section */}
              <div style={{
                padding: 28, borderRadius: 12, marginBottom: 32,
                background: 'linear-gradient(135deg, #1a2a1a 0%, #1a1a2a 100%)',
                border: '1px solid #2a3a2a',
                boxShadow: '0 4px 20px rgba(29, 185, 84, 0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: BETA_FREE ? 0 : 20, flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#e0e0e0', marginBottom: 4 }}>
                      Submit to {result.matches.length} channel{result.matches.length !== 1 ? 's' : ''}
                      {BETA_FREE && (
                        <span style={{
                          color: '#1DB954', marginLeft: 10, fontSize: 12, fontWeight: 600,
                          background: 'rgba(29, 185, 84, 0.15)', padding: '3px 10px', borderRadius: 12,
                        }}>
                          Free during beta
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>
                      {BETA_FREE
                        ? 'All matching curators will see your track in their inbox'
                        : 'One payment, all matching curators see your track'
                      }
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    disabled={submitting}
                    onClick={handleSubmit}
                    startIcon={<SendIcon />}
                    sx={{
                      backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' },
                      textTransform: 'none', px: 4, py: 1.2, fontSize: 15, fontWeight: 600,
                      borderRadius: '8px', boxShadow: '0 2px 8px rgba(29, 185, 84, 0.3)',
                    }}
                  >
                    {submitting ? 'Submitting...' : BETA_FREE ? 'Submit' : 'Submit — $5'}
                  </Button>
                </div>

                {!BETA_FREE && (
                  <div style={{ borderTop: '1px solid #333', paddingTop: 16, color: '#888', fontSize: 13, lineHeight: 1.7 }}>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#1DB954', fontWeight: 600 }}>Best case:</span> Curators feature your track on their YouTube channel — it automatically appears on their Spotify playlist too.
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#1DB954', fontWeight: 600 }}>No response:</span> Full refund after 3 months. We verify automatically whether your track was added.
                    </div>
                    <div>
                      <span style={{ color: '#1DB954', fontWeight: 600 }}>Even after refund:</span> Curators can still discover and feature your track at any time — your submission stays visible.
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: 40, color: '#666',
              background: '#1e1e1e', borderRadius: 10, border: '1px solid #2a2a2a',
            }}>
              <SearchIcon sx={{ fontSize: 40, color: '#444', mb: 1 }} />
              <p style={{ fontSize: 15, marginBottom: 4 }}>
                {editedGenres.length === 0
                  ? 'No genres found — pick genres above to find matching channels.'
                  : 'No matching channels found for these genres.'}
              </p>
              <p style={{ fontSize: 13, color: '#555' }}>
                {editedGenres.length > 0 && 'Try different genres above, or check back as we add more channels.'}
              </p>
            </div>
          )}
        </>
      )}

      {/* Submission history */}
      {!loadingHistory && submissions.length > 0 && (
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 28, marginTop: 40 }}>
          <h3 style={{ fontWeight: 500, fontSize: 17, marginBottom: 16 }}>Your submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(
              submissions.reduce<Record<string, Submission[]>>((acc, sub) => {
                if (!acc[sub.track_url]) acc[sub.track_url] = []
                acc[sub.track_url].push(sub)
                return acc
              }, {})
            ).map(([trackUrl, subs]) => {
              const first = subs[0]
              const accepted = subs.filter(s => s.status === 'accepted').length
              const pending = subs.filter(s => s.status === 'pending').length

              return (
                <div key={trackUrl} style={{
                  border: '1px solid #2a2a2a', borderRadius: 10, overflow: 'hidden',
                }}>
                  <div style={{
                    display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px',
                    background: 'linear-gradient(135deg, #262626, #2a2a2a)',
                  }}>
                    {first.track_image && (
                      <img src={first.track_image} alt={first.track_name}
                        style={{ width: 44, height: 44, borderRadius: 6, filter: 'none' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{first.track_name}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>{first.track_artist}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', textAlign: 'right', fontFamily: 'Arial, sans-serif' }}>
                      {subs.length} channel{subs.length !== 1 ? 's' : ''}
                      {accepted > 0 && <span style={{ color: '#1DB954', fontWeight: 600 }}> · {accepted} featured</span>}
                      {pending > 0 && <span> · {pending} pending</span>}
                    </div>
                  </div>
                  <div style={{ padding: '0 16px 8px' }}>
                    {subs.map(sub => (
                      <div key={sub.submission_id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0', borderTop: '1px solid #222', fontSize: 13,
                      }}>
                        <span style={{ color: '#bbb' }}>{sub.channel_name}</span>
                        <span style={{
                          color: statusColors[sub.status] || '#666', fontSize: 11, fontWeight: 600,
                          background: `${statusColors[sub.status] || '#666'}18`, padding: '2px 8px', borderRadius: 10,
                          fontFamily: 'Arial, sans-serif',
                        }}>
                          {statusLabels[sub.status] || sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

// --- Curator Flow ---
function CuratorFlow() {
  const [channels, setChannels] = useState<CuratorChannel[]>([])
  const [submissions, setSubmissions] = useState<CuratorSubmission[]>([])
  const [loadingChannels, setLoadingChannels] = useState(true)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [responding, setResponding] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Two-step claim: first verify (get token + list), then pick channel
  const [ytAccessToken, setYtAccessToken] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [ytChannels, setYtChannels] = useState<CuratorChannel[] | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [claiming, setClaiming] = useState(false)

  const autoVerifyDone = useRef(false)
  // Track if we have a cached token so we can skip the button entirely
  const hasCachedToken = useRef(!!getYouTubeAccessToken())

  useEffect(() => {
    api.get('curator/channels')
      .then(({ data }) => {
        setChannels(data.channels || [])
        if (data.channels?.length > 0) {
          setLoadingSubmissions(true)
          api.get('curator/submissions')
            .then(({ data }) => setSubmissions(data.submissions || []))
            .catch(() => {})
            .finally(() => setLoadingSubmissions(false))
        }
      })
      .catch(() => {})
      .finally(() => setLoadingChannels(false))
  }, [])

  // Auto-verify: if we have a cached token, fetch channels immediately (no popup)
  useEffect(() => {
    if (!loadingChannels && channels.length === 0 && !ytChannels && !autoVerifyDone.current) {
      autoVerifyDone.current = true
      const cached = getYouTubeAccessToken()
      if (cached) {
        handleVerifySilent(cached)
      } else {
        hasCachedToken.current = false
      }
    }
  }, [loadingChannels, channels.length])

  // Fetch channel list using a token
  const fetchChannelsWithToken = async (token: string) => {
    const { data } = await api.post('curator/claim', {
      youtube_access_token: token,
      channel_ids: ['__none__'],
    })
    setYtAccessToken(token)
    setYtChannels(data.channels || [])
    if (data.channels?.length === 1) {
      setSelectedChannelId(data.channels[0].channel_id)
    }
  }

  // Silent: try cached token, no popup. If it fails, clear cached flag so button shows.
  const handleVerifySilent = async (token: string) => {
    setVerifying(true)
    try {
      await fetchChannelsWithToken(token)
    } catch {
      hasCachedToken.current = false
      setVerifying(false)
    }
  }

  // Interactive: user clicked the button — go straight to popup
  const handleVerify = async () => {
    setVerifying(true)
    setError(null)
    try {
      const fresh = await refreshYouTubeAccessToken()
      if (!fresh) {
        setError('Failed to get YouTube access. Please try again.')
        return
      }
      await fetchChannelsWithToken(fresh)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify YouTube account.')
    } finally {
      setVerifying(false)
    }
  }

  // Step 2: Claim selected channel
  const handleClaim = async () => {
    if (!ytAccessToken || !selectedChannelId) return
    setClaiming(true)
    setError(null)
    try {
      const { data } = await api.post('curator/claim', {
        youtube_access_token: ytAccessToken,
        channel_ids: [selectedChannelId],
      })
      if (data.linked > 0) {
        setYtChannels(null)
        setSelectedChannelId(null)
        const chRes = await api.get('curator/channels')
        setChannels(chRes.data.channels || [])
        const subRes = await api.get('curator/submissions')
        setSubmissions(subRes.data.submissions || [])
      } else {
        setError('This channel is not in our index yet. Submit it via GitHub first.')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to claim channel.')
    } finally {
      setClaiming(false)
    }
  }

  // "Claim another" reuses cached token
  const handleClaimAnother = async () => {
    setError(null)
    setYtChannels(null)
    setSelectedChannelId(null)
    handleVerify()
  }

  const handleRespond = async (id: string, action: 'accept' | 'reject') => {
    setResponding(id)
    try {
      await api.put(`submissions/${id}/respond`, { action })
      setSubmissions(prev => prev.filter(s => s.submission_id !== id))
    } catch {
      alert('Failed to respond. Please try again.')
    } finally {
      setResponding(null)
    }
  }

  const daysAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <>
      {/* Step 1: Show channels or prompt to verify */}
      {!loadingChannels && channels.length === 0 && !ytChannels && (
        <div style={{
          padding: 28,
          background: 'linear-gradient(135deg, #222 0%, #1e2e1e 60%, #243a24 100%)',
          border: '1px solid #2a3a2a', borderRadius: 12, marginBottom: 32,
        }}>
          {(verifying || hasCachedToken.current) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#888', fontSize: 14 }}>
              <GridLoader color="#1DB954" height={20} width={20} wrapperStyle={{}} />
              <span>Loading your YouTube channels...</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <PlayCircleOutlineIcon sx={{ fontSize: 24, color: '#1DB954' }} />
                <h3 style={{ margin: 0, fontWeight: 600, color: '#e0e0e0', fontSize: 17 }}>
                  Claim your YouTube channel
                </h3>
              </div>
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 480 }}>
                We'll verify which YouTube channels are linked to your Google account
                and let you manage submissions for any channel in our index.
              </p>
              <Button
                variant="contained"
                onClick={handleVerify}
                startIcon={<PlayCircleOutlineIcon />}
                sx={{
                  backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' },
                  textTransform: 'none', borderRadius: '8px', fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(29, 185, 84, 0.3)',
                }}
              >
                Show my channels
              </Button>
              {error && (
                <div style={{
                  marginTop: 12, padding: '8px 12px', background: '#2e1a1a',
                  borderRadius: 6, border: '1px solid #3a2222',
                }}>
                  <p style={{ color: '#d32f2f', fontSize: 13, marginBottom: 0 }}>{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2: Pick a channel */}
      {ytChannels && ytChannels.length > 0 && (
        <div style={{
          padding: 24, border: '1px solid #2a2a2a', borderRadius: 12, marginBottom: 32,
          background: '#1e1e1e',
        }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 600, color: '#e0e0e0', fontSize: 16 }}>
            Select a channel to claim
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {ytChannels.filter(ch => ch.tracked).map(ch => (
              <button
                key={ch.channel_id}
                onClick={() => setSelectedChannelId(ch.channel_id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                  background: selectedChannelId === ch.channel_id ? '#1a2e1a' : '#262626',
                  border: selectedChannelId === ch.channel_id ? '2px solid #1DB954' : '1px solid #333',
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s ease',
                }}
              >
                {ch.thumbnail ? (
                  <img src={ch.thumbnail} alt="" style={{ width: 44, height: 44, borderRadius: 6 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircleOutlineIcon sx={{ color: '#555', fontSize: 20 }} />
                  </div>
                )}
                <div>
                  <div style={{ color: '#d4d4d4', fontWeight: 600, fontSize: 14 }}>{ch.channel_name}</div>
                  <div style={{ color: '#1DB954', fontSize: 12, fontWeight: 500 }}>Tracked by Mirror.FM</div>
                </div>
                {selectedChannelId === ch.channel_id && (
                  <CheckCircleOutlineIcon sx={{ marginLeft: 'auto', color: '#1DB954', fontSize: 20 }} />
                )}
              </button>
            ))}
            {ytChannels.filter(ch => !ch.tracked).map(ch => (
              <div
                key={ch.channel_id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                  background: '#222', border: '1px solid #2a2a2a',
                  borderRadius: 10, opacity: 0.5,
                }}
              >
                {ch.thumbnail ? (
                  <img src={ch.thumbnail} alt="" style={{ width: 44, height: 44, borderRadius: 6 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: '#333' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#d4d4d4', fontWeight: 600, fontSize: 14 }}>{ch.channel_name}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    Not in our index — <a href="https://github.com/mirrorfm/data" target="_blank" rel="noopener noreferrer" style={{ color: '#1DB954' }}>submit via GitHub</a> first
                  </div>
                </div>
              </div>
            ))}
          </div>
          {ytChannels.some(ch => ch.tracked) && (
            <Button
              variant="contained"
              disabled={claiming || !selectedChannelId}
              onClick={handleClaim}
              sx={{
                backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' },
                textTransform: 'none', borderRadius: '8px', fontWeight: 600,
              }}
            >
              {claiming ? 'Claiming...' : 'Claim this channel'}
            </Button>
          )}
          {error && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#2e1a1a', borderRadius: 6, border: '1px solid #3a2222' }}>
              <p style={{ color: '#d32f2f', fontSize: 13, marginBottom: 0 }}>{error}</p>
            </div>
          )}
        </div>
      )}

      {/* No channels found */}
      {ytChannels && ytChannels.length === 0 && (
        <div style={{
          padding: 28, background: '#1e1e1e', borderRadius: 10,
          marginBottom: 24, textAlign: 'center', border: '1px solid #2a2a2a',
        }}>
          <PlayCircleOutlineIcon sx={{ fontSize: 36, color: '#444', mb: 1 }} />
          <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 500 }}>No YouTube channels found</p>
          <p style={{ margin: 0, color: '#777', fontSize: 13, lineHeight: 1.5, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
            Make sure you're signed in with the Google account linked to your YouTube channel.
          </p>
        </div>
      )}

      {/* Managed channels */}
      {channels.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontFamily: 'Arial, sans-serif' }}>
            Your channels
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {channels.map(ch => (
              <div key={ch.channel_id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', background: '#262626', borderRadius: 20,
                border: '1px solid #333', fontSize: 13,
              }}>
                {ch.thumbnail ? (
                  <img src={ch.thumbnail} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
                ) : (
                  <PlayCircleOutlineIcon sx={{ fontSize: 16, color: '#666' }} />
                )}
                <span style={{ fontWeight: 500 }}>{ch.channel_name}</span>
              </div>
            ))}
          </div>
          <Button
            size="small"
            onClick={handleClaimAnother}
            disabled={verifying}
            sx={{ color: '#888', textTransform: 'none', fontSize: 12, '&:hover': { color: '#1DB954' } }}
          >
            + Claim another channel
          </Button>
        </div>
      )}

      {/* Submissions inbox */}
      {loadingChannels || loadingSubmissions ? (
        <div style={{ textAlign: 'center', padding: 30 }}>
          <GridLoader color="#1DB954" height={30} width={30} wrapperStyle={{ justifyContent: 'center' }} />
          <p style={{ color: '#888', marginTop: 12, fontSize: 14 }}>Loading submissions...</p>
        </div>
      ) : channels.length > 0 && submissions.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48, color: '#666',
          background: '#1e1e1e', borderRadius: 10, border: '1px solid #2a2a2a',
        }}>
          <InboxIcon sx={{ fontSize: 40, color: '#444', mb: 1 }} />
          <p style={{ fontSize: 15, marginBottom: 4 }}>No pending submissions</p>
          <p style={{ fontSize: 13, color: '#555', maxWidth: 320, margin: '0 auto' }}>
            When artists submit tracks matching your channel's genres, they'll appear here for review.
          </p>
        </div>
      ) : channels.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'Arial, sans-serif' }}>
            Submissions inbox ({submissions.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map(sub => (
              <div key={sub.submission_id} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 16, flexWrap: 'wrap',
                border: '1px solid #2a2a2a', borderRadius: 10, background: '#222',
                transition: 'border-color 0.2s',
              }}>
                {sub.track_image ? (
                  <img src={sub.track_image} alt={sub.track_name}
                    style={{ width: 64, height: 64, borderRadius: 8, filter: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: 8, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MusicNoteIcon sx={{ color: '#555', fontSize: 24 }} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{sub.track_name}</div>
                  <div style={{ color: '#999', fontSize: 13, marginBottom: 6 }}>{sub.track_artist}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip size="small" label={sub.channel_name}
                      sx={{ background: '#333', color: '#bbb', fontSize: 11 }} />
                    <span style={{ color: '#666', fontSize: 12 }}>{daysAgo(sub.created_at)}</span>
                    {sub.track_url && (
                      <a href={sub.track_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#1DB954', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        Listen <OpenInNewIcon sx={{ fontSize: 11 }} />
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Button size="small" variant="outlined"
                    disabled={responding === sub.submission_id}
                    onClick={() => handleRespond(sub.submission_id, 'reject')}
                    sx={{
                      textTransform: 'none', borderColor: '#444', color: '#999', borderRadius: '8px',
                      '&:hover': { borderColor: '#666', background: 'rgba(255,255,255,0.03)' },
                    }}>
                    Pass
                  </Button>
                  <Button size="small" variant="contained"
                    disabled={responding === sub.submission_id}
                    onClick={() => handleRespond(sub.submission_id, 'accept')}
                    sx={{
                      textTransform: 'none', backgroundColor: '#1DB954', borderRadius: '8px',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#1aa34a' },
                    }}>
                    Feature
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
