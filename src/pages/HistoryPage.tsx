import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Chip from '@mui/material/Chip'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

interface Submission {
  submission_id: string
  channel_name: string
  track_url: string
  track_name: string
  track_artist: string
  track_image: string
  status: string
  created_at: string
  responded_at: string | null
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

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    api.get('submissions')
      .then(({ data }) => setSubmissions(data.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="My Submissions" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to see your submissions</h2>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  // Group by track
  const tracks = submissions.reduce<Record<string, Submission[]>>((acc, sub) => {
    const key = sub.track_url
    if (!acc[key]) acc[key] = []
    acc[key].push(sub)
    return acc
  }, {})

  const daysAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <Layout>
      <SEO title="My Submissions" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 400, margin: 0 }}>My Submissions</h2>
        <Link to="/pitch/" style={{
          background: '#1DB954', color: 'white', padding: '6px 16px',
          borderRadius: 16, textDecoration: 'none', fontSize: 13, fontWeight: 600,
        }}>
          Submit a track
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#999' }}>Loading...</p>
      ) : Object.keys(tracks).length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <p>No submissions yet.</p>
          <p style={{ fontSize: 14 }}>
            <Link to="/pitch/" style={{ color: '#1DB954' }}>Submit your first track</Link> to get matched with curators.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {Object.entries(tracks).map(([trackUrl, subs]) => {
            const first = subs[0]
            const accepted = subs.filter(s => s.status === 'accepted').length
            const pending = subs.filter(s => s.status === 'pending').length

            return (
              <div key={trackUrl} style={{
                border: '1px solid #333', borderRadius: 10, overflow: 'hidden',
              }}>
                {/* Track header */}
                <div style={{
                  display: 'flex', gap: 15, alignItems: 'center', padding: 16,
                  background: '#262626',
                }}>
                  {first.track_image && (
                    <img src={first.track_image} alt={first.track_name}
                      style={{ width: 50, height: 50, borderRadius: 4, filter: 'none' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{first.track_name}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{first.track_artist}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>
                    <div>Submitted {daysAgo(first.created_at)}</div>
                    <div style={{ marginTop: 2 }}>
                      {subs.length} channel{subs.length !== 1 ? 's' : ''}
                      {accepted > 0 && <span style={{ color: '#1DB954' }}> · {accepted} featured</span>}
                      {pending > 0 && <span> · {pending} pending</span>}
                    </div>
                  </div>
                </div>

                {/* Channel list */}
                <div style={{ padding: '0 16px 12px' }}>
                  {subs.map(sub => (
                    <div key={sub.submission_id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderTop: '1px solid #2a2a2a',
                    }}>
                      <span style={{ fontSize: 14 }}>{sub.channel_name}</span>
                      <Chip
                        size="small"
                        label={statusLabels[sub.status] || sub.status}
                        sx={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${statusColors[sub.status] || '#666'}`,
                          color: statusColors[sub.status] || '#666',
                          fontSize: 11,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
