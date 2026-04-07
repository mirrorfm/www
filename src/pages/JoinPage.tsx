import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { Grid as GridLoader } from 'react-loader-spinner'
import { NumericFormat } from 'react-number-format'

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
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to get started</h2>
          <p style={{ color: '#999' }}>Submit tracks or claim your YouTube channel.</p>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title={role === 'artist' ? 'Pitch your music' : role === 'curator' ? 'Curator dashboard' : 'Get started'} />

      {/* Role selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => selectRole('artist')}
          style={{
            flex: 1,
            padding: '20px 16px',
            background: role === 'artist' ? '#1a2e1a' : '#222',
            border: role === 'artist' ? '2px solid #1DB954' : '1px solid #333',
            borderRadius: 10,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ color: role === 'artist' ? '#1DB954' : '#d4d4d4', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            I'm an artist
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>
            Submit your tracks to YouTube channel curators
          </div>
        </button>
        <button
          onClick={() => selectRole('curator')}
          style={{
            flex: 1,
            padding: '20px 16px',
            background: role === 'curator' ? '#1a2e1a' : '#222',
            border: role === 'curator' ? '2px solid #1DB954' : '1px solid #333',
            borderRadius: 10,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ color: role === 'curator' ? '#1DB954' : '#d4d4d4', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
            I'm a curator
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>
            Claim your YouTube channel and receive submissions
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
    try {
      const { data } = await api.post('submit/analyze', { url: url.trim() })
      setResult(data)
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

  return (
    <>
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

      <p style={{ color: '#666', marginBottom: 30 }}>
        Paste a Spotify track link to find matching YouTube channels.
        {BETA_FREE
          ? ' Free during beta — your track goes to all matching curators.'
          : ' Submit for $5 and your track goes to all matching curators. Auto-refund if no one features it within 3 months.'
        }
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 10, marginBottom: 30, flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 20, background: '#262626', borderRadius: 8, marginBottom: 30, flexWrap: 'wrap' }}>
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
                    display: 'flex', alignItems: 'center', gap: 15, padding: 15, flexWrap: 'wrap',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: BETA_FREE ? 0 : 16, flexWrap: 'wrap', gap: 12 }}>
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

  const verifyTriggered = useRef(false)

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

  // Auto-trigger YouTube OAuth when curator has no claimed channels
  useEffect(() => {
    if (!loadingChannels && channels.length === 0 && !ytChannels && !verifyTriggered.current) {
      verifyTriggered.current = true
      handleVerify()
    }
  }, [loadingChannels, channels.length])

  // Step 1: Get YouTube access token (cached from sign-in) and fetch channel list
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

  const handleVerify = async () => {
    setVerifying(true)
    setError(null)
    try {
      // Try cached token first (no popup)
      const cached = getYouTubeAccessToken()
      if (cached) {
        try {
          await fetchChannelsWithToken(cached)
          return
        } catch {
          // Token expired, fall through to refresh
        }
      }
      // Need fresh token (popup)
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
        setError('This channel is not tracked by Mirror.FM yet. We\'ll add it soon.')
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
      {/* Step 1: Verifying YouTube account (auto-triggered) */}
      {!loadingChannels && channels.length === 0 && !ytChannels && (
        <div style={{
          padding: 24, background: 'linear-gradient(135deg, #222 0%, #1e2e1e 60%, #243a24 100%)',
          border: '1px solid #333', borderRadius: 10, marginBottom: 30,
        }}>
          {verifying ? (
            <p style={{ margin: 0, color: '#888', fontSize: 14 }}>Connecting to YouTube...</p>
          ) : error ? (
            <>
              <p style={{ color: '#d32f2f', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
              <Button
                variant="contained"
                onClick={handleVerify}
                sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none' }}
              >
                Try again
              </Button>
            </>
          ) : null}
        </div>
      )}

      {/* Step 2: Pick a channel */}
      {ytChannels && ytChannels.length > 0 && (
        <div style={{
          padding: 24, border: '1px solid #333', borderRadius: 10, marginBottom: 30,
        }}>
          <h3 style={{ margin: '0 0 12px', fontWeight: 500, color: '#e0e0e0', fontSize: 16 }}>
            Select a channel to claim
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {ytChannels.map(ch => (
              <button
                key={ch.channel_id}
                onClick={() => setSelectedChannelId(ch.channel_id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                  background: selectedChannelId === ch.channel_id ? '#1a2e1a' : '#262626',
                  border: selectedChannelId === ch.channel_id ? '2px solid #1DB954' : '1px solid #333',
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                {ch.thumbnail && <img src={ch.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 4 }} />}
                <div>
                  <div style={{ color: '#d4d4d4', fontWeight: 600, fontSize: 14 }}>{ch.channel_name}</div>
                  {ch.tracked
                    ? <div style={{ color: '#1DB954', fontSize: 12 }}>Tracked by Mirror.FM</div>
                    : <div style={{ color: '#666', fontSize: 12 }}>Not yet tracked</div>
                  }
                </div>
              </button>
            ))}
          </div>
          <Button
            variant="contained"
            disabled={claiming || !selectedChannelId}
            onClick={handleClaim}
            sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none' }}
          >
            {claiming ? 'Claiming...' : 'Claim this channel'}
          </Button>
          {error && <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}
        </div>
      )}

      {/* No channels found */}
      {ytChannels && ytChannels.length === 0 && (
        <div style={{ padding: 20, background: '#2e2a1a', borderRadius: 8, marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 15 }}>No YouTube channels found for this Google account.</p>
        </div>
      )}

      {/* Managed channels */}
      {channels.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            {channels.map(ch => (
              <div key={ch.channel_id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', background: '#262626', borderRadius: 20, fontSize: 13,
              }}>
                {ch.thumbnail && <img src={ch.thumbnail} alt="" style={{ width: 20, height: 20, borderRadius: '50%' }} />}
                <span>{ch.channel_name}</span>
              </div>
            ))}
          </div>
          <Button
            size="small"
            onClick={handleClaimAnother}
            disabled={verifying}
            sx={{ color: '#888', textTransform: 'none', fontSize: 12 }}
          >
            + Claim another channel
          </Button>
        </div>
      )}

      {/* Submissions */}
      {loadingChannels || loadingSubmissions ? (
        <p style={{ color: '#999' }}>Loading...</p>
      ) : channels.length > 0 && submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <p>No pending submissions.</p>
          <p style={{ fontSize: 14 }}>When artists submit tracks matching your channel, they'll appear here.</p>
        </div>
      ) : channels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {submissions.map(sub => (
            <div key={sub.submission_id} style={{
              display: 'flex', alignItems: 'center', gap: 15, padding: 15, flexWrap: 'wrap',
              border: '1px solid #333', borderRadius: 8, background: '#222',
            }}>
              {sub.track_image && (
                <img src={sub.track_image} alt={sub.track_name}
                  style={{ width: 60, height: 60, borderRadius: 4, filter: 'none' }} />
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{sub.track_name}</div>
                <div style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>{sub.track_artist}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip size="small" label={sub.channel_name} />
                  <span style={{ color: '#999', fontSize: 12 }}>{daysAgo(sub.created_at)}</span>
                  {sub.track_url && (
                    <a href={sub.track_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#1DB954' }}>
                      Listen &#8599;
                    </a>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Button size="small" variant="outlined"
                  disabled={responding === sub.submission_id}
                  onClick={() => handleRespond(sub.submission_id, 'reject')}
                  sx={{ textTransform: 'none', borderColor: '#555', color: '#999' }}>
                  Pass
                </Button>
                <Button size="small" variant="contained"
                  disabled={responding === sub.submission_id}
                  onClick={() => handleRespond(sub.submission_id, 'accept')}
                  sx={{ textTransform: 'none', backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' } }}>
                  Feature
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
