import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

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
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    api.get('curator/submissions')
      .then(({ data }) => setSubmissions(data.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

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

      {loading ? (
        <p style={{ color: '#999' }}>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <p>No pending submissions.</p>
          <p style={{ fontSize: 14 }}>When artists submit tracks to your channels, they'll appear here.</p>
        </div>
      ) : (
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
                  sx={{ textTransform: 'none', borderColor: '#ccc', color: '#666' }}>
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
