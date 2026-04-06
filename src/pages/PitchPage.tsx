import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { Grid as GridLoader } from 'react-loader-spinner'
import { NumericFormat } from 'react-number-format'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

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

export default function PitchPage() {
  const { user, loading: authLoading } = useAuth()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('session_id')
  const [success, setSuccess] = useState(params.get('success') === 'true')
  const canceled = params.get('canceled') === 'true'

  // Load submission history
  useEffect(() => {
    if (!user) return
    api.get('submissions')
      .then(({ data }) => setSubmissions(data.submissions || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [user])

  // Confirm Stripe payment on redirect
  useEffect(() => {
    if (!sessionId || !user || success) return
    api.post('pitch/confirm', { session_id: sessionId })
      .then(() => setSuccess(true))
      .catch(() => setError('Payment verification failed. Please contact support.'))
  }, [sessionId, user])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const { data } = await api.post('submit/analyze', { url: url.trim() })
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const BETA_FREE = true // flip to false to enable Stripe payments

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
        window.location.href = '/pitch/?success=true'
      } else {
        const { data } = await api.post('pitch/checkout', payload)
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit.')
      setSubmitting(false)
    }
  }

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="Pitch your music" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to pitch your music</h2>
          <p style={{ color: '#999' }}>Submit your tracks directly to YouTube channel curators.</p>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Pitch your music" />

      {success && (
        <div style={{ padding: 20, background: '#1a2e1a', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Your track has been submitted!</p>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 0 }}>
            All matching curators will see it in their inbox.
          </p>
        </div>
      )}

      {canceled && (
        <div style={{ padding: 16, background: '#2e2a1a', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 15, marginBottom: 0, color: '#666' }}>Checkout canceled. No charges were made.</p>
        </div>
      )}

      <h2 style={{ fontWeight: 400 }}>Pitch your music</h2>
      <p style={{ color: '#666', marginBottom: 30 }}>
        Paste a Spotify track link to find matching YouTube channels.
        {BETA_FREE
          ? ' Free during beta — your track goes to all matching curators.'
          : ' Submit for $5 and your track goes to all matching curators. Auto-refund if no one features it within 3 months.'
        }
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <TextField
          fullWidth variant="outlined" size="small"
          placeholder="https://open.spotify.com/track/..."
          value={url} onChange={e => setUrl(e.target.value)} disabled={loading}
        />
        <Button type="submit" variant="contained" disabled={loading || !url.trim()}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', whiteSpace: 'nowrap', px: 3 }}>
          Find channels
        </Button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ justifyContent: 'center' }} />
          <p style={{ color: '#999', marginTop: 15 }}>Analyzing your track...</p>
        </div>
      )}

      {error && <p style={{ color: '#d32f2f', marginBottom: 20 }}>{error}</p>}

      {result && !success && (
        <>
          {/* Track card */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 20, background: '#262626', borderRadius: 8, marginBottom: 30 }}>
            {result.track.image && (
              <img src={result.track.image} alt={result.track.name} style={{ width: 80, height: 80, borderRadius: 4, filter: 'none' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{result.track.name}</div>
              <div style={{ color: '#666', marginBottom: 8 }}>{result.track.artist}</div>
              <div>
                {result.track.genres.map(g => (
                  <Chip key={g} size="small" label={g} className="chip-mui-selected" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </div>
            </div>
          </div>

          {result.matches.length > 0 ? (
            <>
              <h4>Your top {result.matches.length} channel match{result.matches.length !== 1 ? 'es' : ''}</h4>
              <p style={{ color: '#888', fontSize: 13, marginTop: -8, marginBottom: 16 }}>
                Based on genre overlap between your track and each channel's catalog.
                Your track will be prioritized to these curators.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {result.matches.map(match => (
                  <div key={match.channel_id} style={{
                    display: 'flex', alignItems: 'center', gap: 15, padding: 15,
                    border: '1px solid #333', borderRadius: 8, background: '#222',
                  }}>
                    {match.thumbnail && (
                      <img src={match.thumbnail} alt={match.channel_name} style={{ width: 60, height: 60, borderRadius: 4, filter: 'none' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{match.channel_name}</span>
                        <span style={{ backgroundColor: '#1DB954', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>
                          {Math.round(match.score * 100)}%
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 6, fontFamily: 'Arial, sans-serif' }}>
                        <NumericFormat value={match.followers} displayType="text" thousandSeparator="," /> followers
                        {' · '}
                        <NumericFormat value={match.found_tracks} displayType="text" thousandSeparator="," /> tracks on Spotify
                      </div>
                      <div>
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
                padding: 24, background: 'linear-gradient(135deg, #1a2a1a 0%, #1a1a2a 100%)',
                border: '1px solid #2a3a2a', borderRadius: 10, marginBottom: 30,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: BETA_FREE ? 0 : 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#e0e0e0' }}>
                      Submit to {result.matches.length} channel{result.matches.length !== 1 ? 's' : ''}
                      {BETA_FREE
                        ? <span style={{ color: '#1DB954', marginLeft: 8, fontSize: 13, fontWeight: 400 }}>Free during beta</span>
                        : ' — $5'
                      }
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
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
                    sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', px: 4, fontSize: 15 }}
                  >
                    {submitting ? 'Submitting...' : BETA_FREE ? 'Submit' : 'Submit — $5'}
                  </Button>
                </div>

                {!BETA_FREE && (
                  <div style={{ borderTop: '1px solid #333', paddingTop: 14, color: '#888', fontSize: 13, lineHeight: 1.7 }}>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#1DB954' }}>Best case:</span> Curators feature your track on their YouTube channel — it automatically appears on their Spotify playlist too.
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ color: '#1DB954' }}>No response:</span> Full refund after 3 months. We verify automatically whether your track was added.
                    </div>
                    <div>
                      <span style={{ color: '#1DB954' }}>Even after refund:</span> Curators can still discover and feature your track at any time — your submission stays visible.
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 30, color: '#666' }}>
              <p>No matching channels found for this track's genres.</p>
            </div>
          )}
        </>
      )}
      {/* Submission history */}
      {!loadingHistory && submissions.length > 0 && (
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, marginTop: 40 }}>
          <h3 style={{ fontWeight: 400, fontSize: 17, marginBottom: 16 }}>Your submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                <div key={trackUrl} style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, background: '#262626' }}>
                    {first.track_image && (
                      <img src={first.track_image} alt={first.track_name} style={{ width: 40, height: 40, borderRadius: 4, filter: 'none' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{first.track_name}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>{first.track_artist}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#888', textAlign: 'right' }}>
                      {subs.length} channel{subs.length !== 1 ? 's' : ''}
                      {accepted > 0 && <span style={{ color: '#1DB954' }}> · {accepted} featured</span>}
                      {pending > 0 && <span> · {pending} pending</span>}
                    </div>
                  </div>
                  <div style={{ padding: '0 12px 8px' }}>
                    {subs.map(sub => (
                      <div key={sub.submission_id} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '6px 0', borderTop: '1px solid #2a2a2a', fontSize: 13,
                      }}>
                        <span>{sub.channel_name}</span>
                        <span style={{ color: statusColors[sub.status] || '#666', fontSize: 12 }}>
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
    </Layout>
  )
}
