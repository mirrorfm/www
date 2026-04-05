import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'

export default function ReportPage() {
  const [trackUrl, setTrackUrl] = useState('')
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackUrl.trim() || !playlistUrl.trim()) return
    setLoading(true)
    setError(null)
    try {
      await api.post('report', {
        track_url: trackUrl.trim(),
        playlist_url: playlistUrl.trim(),
        reason: reason.trim(),
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Layout>
        <SEO title="Report received" />
        <div style={{ paddingTop: 40 }}>
          <h2 style={{ fontWeight: 400 }}>Thanks for reporting</h2>
          <p style={{ color: '#999', lineHeight: 1.6 }}>
            We'll review the track and update the playlist if needed.
            Reports like yours help us improve matching accuracy across all playlists.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Report incorrect track" />

      <h2 style={{ fontWeight: 400, marginBottom: 8 }}>Report an incorrect track</h2>

      <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 8, maxWidth: 560 }}>
        Mirror.FM automatically matches YouTube video titles to Spotify tracks.
        This works well most of the time, but mistakes happen — wrong artist,
        wrong version, or a non-music video matched to a song.
      </p>
      <p style={{ color: '#777', fontSize: 14, lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>
        If you spot a track that doesn't belong in a playlist, let us know.
        No account needed.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 500 }}>
        <TextField
          fullWidth variant="outlined" size="small"
          label="Spotify track URL or name"
          placeholder="https://open.spotify.com/track/... or track name"
          value={trackUrl}
          onChange={e => setTrackUrl(e.target.value)}
          required
        />
        <TextField
          fullWidth variant="outlined" size="small"
          label="Playlist URL or channel name"
          placeholder="https://open.spotify.com/playlist/... or channel name"
          value={playlistUrl}
          onChange={e => setPlaylistUrl(e.target.value)}
          required
        />
        <TextField
          fullWidth variant="outlined" size="small"
          label="What's wrong? (optional)"
          multiline rows={2}
          placeholder="Wrong artist, wrong version, not a song, etc."
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        {error && <p style={{ color: '#d32f2f', fontSize: 13, margin: 0 }}>{error}</p>}

        <Button
          type="submit" variant="contained"
          disabled={loading || !trackUrl.trim() || !playlistUrl.trim()}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', alignSelf: 'flex-start', px: 4 }}
        >
          {loading ? 'Sending...' : 'Report track'}
        </Button>
      </form>
    </Layout>
  )
}
