import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'

export default function TakedownPage() {
  const [channelUrl, setChannelUrl] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channelUrl.trim() || !email.trim()) return

    setLoading(true)
    setError(null)

    try {
      await api.post('takedown', {
        channel_url: channelUrl.trim(),
        email: email.trim(),
        message: message.trim(),
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Layout>
        <SEO title="Request received" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Request received</h2>
          <p style={{ color: '#999' }}>
            We'll review your request and get back to you within 48 hours.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Playlist opt-out" />
      <h2 style={{ fontWeight: 400 }}>Playlist opt-out request</h2>
      <p style={{ color: '#999', marginBottom: 30 }}>
        Mirror.FM automatically syncs YouTube music channels to Spotify playlists.
        If you're a channel owner and would like your playlist removed or modified,
        please fill out this form.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 500 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Your YouTube channel URL"
          placeholder="https://youtube.com/c/..."
          value={channelUrl}
          onChange={e => setChannelUrl(e.target.value)}
          required
        />
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Contact email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Message (optional)"
          multiline
          rows={3}
          placeholder="Tell us what you'd like — removal, name change, collaboration, etc."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        {error && (
          <p style={{ color: '#d32f2f', fontSize: 14, margin: 0 }}>{error}</p>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !channelUrl.trim() || !email.trim()}
          sx={{
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1aa34a' },
            textTransform: 'none',
            alignSelf: 'flex-start',
            px: 4,
          }}
        >
          {loading ? 'Sending...' : 'Submit request'}
        </Button>
      </form>
    </Layout>
  )
}
