import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'
import { signInWithYouTubeScope } from '../lib/firebase'

interface CuratorChannel {
  channel_id: string
  channel_name: string
  thumbnail: string
  tracked: boolean
}

interface Submission {
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

export default function CuratorInboxPage() {
  const { user, loading: authLoading } = useAuth()
  const [channels, setChannels] = useState<CuratorChannel[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingChannels, setLoadingChannels] = useState(true)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimResult, setClaimResult] = useState<{ channels: CuratorChannel[], linked: number } | null>(null)
  const [responding, setResponding] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load curator's channels
  useEffect(() => {
    if (!user) return
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
  }, [user])

  const handleClaim = async () => {
    setClaiming(true)
    setError(null)
    setClaimResult(null)
    try {
      const accessToken = await signInWithYouTubeScope()
      if (!accessToken) {
        setError('Failed to get YouTube access. Please try again.')
        setClaiming(false)
        return
      }
      const { data } = await api.post('curator/claim', { youtube_access_token: accessToken })
      setClaimResult(data)
      if (data.linked > 0) {
        // Refresh channels and submissions
        const chRes = await api.get('curator/channels')
        setChannels(chRes.data.channels || [])
        const subRes = await api.get('curator/submissions')
        setSubmissions(subRes.data.submissions || [])
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify YouTube account.')
    } finally {
      setClaiming(false)
    }
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

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="Curator Inbox" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to view your inbox</h2>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Curator Inbox" />
      <h2 style={{ fontWeight: 400 }}>Curator Inbox</h2>

      {/* Channel claim section */}
      {!loadingChannels && channels.length === 0 && !claimResult && (
        <div style={{
          padding: 24, background: 'linear-gradient(135deg, #222 0%, #1e2e1e 60%, #243a24 100%)',
          border: '1px solid #333', borderRadius: 10, marginBottom: 30,
        }}>
          <h3 style={{ margin: '0 0 8px', fontWeight: 500, color: '#e0e0e0', fontSize: 16 }}>
            Claim your YouTube channel
          </h3>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
            Connect your YouTube account to verify channel ownership.
            Once linked, you'll receive track submissions from artists matched to your channel's genres.
          </p>
          <Button
            variant="contained"
            disabled={claiming}
            onClick={handleClaim}
            sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none' }}
          >
            {claiming ? 'Connecting...' : 'Connect YouTube account'}
          </Button>
          {error && <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>}
        </div>
      )}

      {/* Claim result */}
      {claimResult && (
        <div style={{
          padding: 20, background: claimResult.linked > 0 ? '#1a2e1a' : '#2e2a1a',
          borderRadius: 8, marginBottom: 24,
        }}>
          {claimResult.linked > 0 ? (
            <p style={{ margin: 0, fontSize: 15 }}>
              {claimResult.linked} channel{claimResult.linked !== 1 ? 's' : ''} linked! Track submissions will appear below.
            </p>
          ) : (
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 15 }}>
                We found your channel{claimResult.channels.length !== 1 ? 's' : ''} but {claimResult.channels.length === 1 ? "it's" : "they're"} not tracked by Mirror.FM yet.
              </p>
              {claimResult.channels.map(ch => (
                <div key={ch.channel_id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  {ch.thumbnail && <img src={ch.thumbnail} alt="" style={{ width: 32, height: 32, borderRadius: 4 }} />}
                  <span style={{ color: '#ccc' }}>{ch.channel_name}</span>
                </div>
              ))}
              <p style={{ margin: '12px 0 0', color: '#888', fontSize: 13 }}>
                We'll add your channel to our index soon. You'll be notified when it's ready.
              </p>
            </div>
          )}
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
            onClick={handleClaim}
            disabled={claiming}
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
              display: 'flex', alignItems: 'center', gap: 15, padding: 15,
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
    </Layout>
  )
}
