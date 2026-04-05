import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'
import { signInWithYouTubeScope } from '../lib/firebase'

type RequestType = 'unofficial' | 'remove_thumbnail' | 'takedown' | 'other'

export default function ChannelOwnersPage() {
  const { user } = useAuth()
  const [step, setStep] = useState<'info' | 'form' | 'verify' | 'done'>('info')
  const [requestType, setRequestType] = useState<RequestType>('unofficial')
  const [channelUrl, setChannelUrl] = useState('')
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
      await api.post('takedown', {
        channel_url: channelUrl.trim(),
        email: user?.email || '',
        message: `[${requestType}] ${message}`.trim(),
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

      <h2 style={{ fontWeight: 400, marginBottom: 8 }}>For channel owners</h2>

      <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 600 }}>
        Mirror.FM automatically creates Spotify playlists that stay in sync
        with YouTube music channels. We do this so listeners can enjoy
        a channel's catalog on Spotify without anyone having to maintain it manually.
      </p>

      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, marginBottom: 32 }}>
        <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 16 }}>
          How it works
        </h3>
        <div style={{ color: '#777', fontSize: 14, lineHeight: 1.8, maxWidth: 560 }}>
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

      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, marginBottom: 32 }}>
        <h3 style={{ fontWeight: 400, fontSize: 17, color: '#d4d4d4', marginBottom: 16 }}>
          Your options
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
          <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, marginBottom: 4 }}>Keep the playlist, add "Unofficial"</div>
            <div style={{ color: '#777', fontSize: 13 }}>
              We add "(Unofficial)" to the playlist title and remove any channel
              branding. Your listeners keep access to the Spotify mirror.
            </div>
          </div>
          <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, marginBottom: 4 }}>Remove channel thumbnail only</div>
            <div style={{ color: '#777', fontSize: 13 }}>
              We replace your proprietary thumbnail with a generic one.
              Playlist stays as-is otherwise.
            </div>
          </div>
          <div style={{ padding: 16, border: '1px solid #333', borderRadius: 8 }}>
            <div style={{ color: '#d4d4d4', fontWeight: 500, marginBottom: 4 }}>Full removal</div>
            <div style={{ color: '#777', fontSize: 13 }}>
              We delete the playlist entirely. Your channel will be removed
              from our index.
            </div>
          </div>
          <div style={{ padding: 16, border: '1px solid #2a3a2a', borderRadius: 8, background: '#1a2a1a' }}>
            <div style={{ color: '#1DB954', fontWeight: 500, marginBottom: 4 }}>Take ownership (recommended)</div>
            <div style={{ color: '#777', fontSize: 13 }}>
              Claim your channel on Mirror.FM, receive artist submissions,
              and let us keep the playlist synced for you — for free.{' '}
              <Link to="/inbox/" style={{ color: '#1DB954' }}>Go to curator dashboard</Link>
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
            <RadioGroup value={requestType} onChange={e => setRequestType(e.target.value as RequestType)}>
              <FormControlLabel value="unofficial" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Mark as "Unofficial"</span>} />
              <FormControlLabel value="remove_thumbnail" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Remove thumbnail only</span>} />
              <FormControlLabel value="takedown" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Full removal</span>} />
              <FormControlLabel value="other" control={<Radio sx={{ color: '#555', '&.Mui-checked': { color: '#1DB954' } }} />}
                label={<span style={{ fontSize: 14 }}>Something else</span>} />
            </RadioGroup>

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
              label="Anything else? (optional)"
              multiline rows={2}
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
