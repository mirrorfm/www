import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'
import { signInWithYouTubeScope } from '../lib/firebase'

export default function ChannelOwnersPage() {
  const { user } = useAuth()
  const [step, setStep] = useState<'info' | 'form' | 'verify' | 'done'>('info')
  const [checks, setChecks] = useState({ unofficial: false, remove_thumbnail: false, make_private: false, own_account: false })
  const [channelUrl, setChannelUrl] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [verifiedChannel, setVerifiedChannel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    try {
      const accessToken = await signInWithYouTubeScope()
      if (accessToken) {
        setVerifiedChannel('verified')
        setStep('form')
      }
    } catch {
      setError('Failed to verify YouTube account.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channelUrl.trim()) return
    setLoading(true)
    setError(null)
    try {
      const selected = Object.entries(checks).filter(([, v]) => v).map(([k]) => k).join(', ')
      await api.post('takedown', {
        channel_url: channelUrl.trim(),
        email: email.trim() || user?.email || '',
        message: `[${selected || 'other'}] ${message}`.trim(),
      })
      setStep('done')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') {
    return (
      <Layout>
        <SEO title="Request received" />
        <div style={{ paddingTop: 40 }}>
          <h2 style={{ fontWeight: 400 }}>Request received</h2>
          <p style={{ color: '#999', lineHeight: 1.6 }}>
            We'll review your request and get back to you within 48 hours.
            If you'd like to explore how Mirror.FM can work for your channel,
            check out the <Link to="/inbox/" style={{ color: '#1DB954' }}>curator dashboard</Link>.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Channel Owners" />

      <h2 style={{ fontWeight: 400, marginBottom: 24 }}>For channel owners</h2>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        {/* Left column */}
        <div style={{ flex: '1 1 300px' }}>
          <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, margin: '0 0 24px' }}>
            Mirror.FM automatically creates Spotify playlists that stay in sync
            with YouTube music channels. We do this so listeners can enjoy
            a channel's catalog on Spotify without anyone having to maintain it manually.
          </p>

          <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 12 }}>
            How it works
          </h3>
          <div style={{ color: '#777', fontSize: 14, lineHeight: 1.8 }}>
            <p style={{ margin: '0 0 12px' }}>
              When a channel is added to our index, we scan its uploads,
              match each video title to a Spotify track, and add matches
              to a playlist. The playlist updates automatically as new
              videos are uploaded.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              All playlists are clearly marked as <strong style={{ color: '#ccc' }}>"Unofficial"</strong> and
              we don't use channel branding or thumbnails without permission.
              We're not trying to compete with your channel — we're extending
              its reach to Spotify listeners.
            </p>
            <p style={{ margin: 0 }}>
              From experience, manually maintained playlists tend to fall behind
              when channels go inactive. Our automated sync keeps the Spotify
              presence alive regardless — which benefits your listeners and
              discoverability.
            </p>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: '1 1 280px' }}>
          <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 16 }}>
            Your options
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '10px 12px', border: '1px solid #333', borderRadius: 6 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, fontSize: 13 }}>Mark as "Unofficial"</div>
            <div style={{ color: '#777', fontSize: 12 }}>Add "(Unofficial)" to the playlist title.</div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px solid #333', borderRadius: 6 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, fontSize: 13 }}>Remove thumbnail</div>
            <div style={{ color: '#777', fontSize: 12 }}>Replace your thumbnail with a generic one.</div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px solid #333', borderRadius: 6 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, fontSize: 13 }}>Make private</div>
            <div style={{ color: '#777', fontSize: 12 }}>Hidden from search. Existing followers keep access.</div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px solid #2a3a2a', borderRadius: 6, background: '#1a2a1a' }}>
            <div style={{ color: '#1DB954', fontWeight: 500, fontSize: 13 }}>Take ownership (recommended)</div>
            <div style={{ color: '#777', fontSize: 12 }}>
              Claim your channel, receive artist submissions, free sync.{' '}
              <Link to="/inbox/" style={{ color: '#1DB954' }}>Curator dashboard</Link>
            </div>
          </div>
          <div style={{ padding: '10px 12px', border: '1px dashed #444', borderRadius: 6 }}>
            <div style={{ color: '#999', fontWeight: 500, fontSize: 13 }}>
              Playlist on your own account
              <span style={{ fontSize: 10, color: '#666', marginLeft: 6, fontWeight: 400 }}>Gauging interest</span>
            </div>
            <div style={{ color: '#666', fontSize: 12 }}>
              Connect your Spotify, we sync to a playlist you own.
              Let us know below if you'd use this.
            </div>
          </div>
          </div>
        </div>
      </div>

      {step === 'info' && (
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24 }}>
          <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 12 }}>
            Submit a request
          </h3>
          <p style={{ color: '#777', fontSize: 14, marginBottom: 16 }}>
            To verify you own the channel, we'll ask you to sign in with the
            Google account linked to your YouTube channel.
          </p>
          {user ? (
            <Button
              variant="contained"
              onClick={() => setStep('form')}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none' }}
            >
              Continue to request form
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none' }}
            >
              {loading ? 'Connecting...' : 'Sign in with YouTube to verify'}
            </Button>
          )}
          {error && <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 12 }}>{error}</p>}
        </div>
      )}

      {step === 'form' && (
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24 }}>
          <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 16 }}>
            What would you like?
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 500 }}>
            <div>
              <FormControlLabel
                control={<Checkbox checked={checks.unofficial} onChange={e => setChecks(p => ({ ...p, unofficial: e.target.checked }))} sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Mark as "Unofficial"</span>} />
              <FormControlLabel
                control={<Checkbox checked={checks.remove_thumbnail} onChange={e => setChecks(p => ({ ...p, remove_thumbnail: e.target.checked }))} sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Remove thumbnail</span>} />
              <FormControlLabel
                control={<Checkbox checked={checks.make_private} onChange={e => setChecks(p => ({ ...p, make_private: e.target.checked }))} sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Make private</span>} />
              <FormControlLabel
                control={<Checkbox checked={checks.own_account} onChange={e => setChecks(p => ({ ...p, own_account: e.target.checked }))} sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>I'd like the playlist on my own Spotify account</span>} />
            </div>

            <TextField
              fullWidth variant="outlined" size="small"
              label="Your YouTube channel URL"
              placeholder="https://youtube.com/c/..."
              value={channelUrl}
              onChange={e => setChannelUrl(e.target.value)}
              required
            />
            <TextField
              fullWidth variant="outlined" size="small"
              label="Your email (optional, for us to reply)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              fullWidth variant="outlined" size="small"
              label="Comments or questions"
              multiline rows={3}
              placeholder="Tell us what you'd like, ask a question, or just say hi."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            {error && <p style={{ color: '#d32f2f', fontSize: 13, margin: 0 }}>{error}</p>}

            <Button
              type="submit" variant="contained"
              disabled={loading || !channelUrl.trim()}
              sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', alignSelf: 'flex-start', px: 4 }}
            >
              {loading ? 'Sending...' : 'Submit request'}
            </Button>
          </form>
        </div>
      )}
    </Layout>
  )
}
