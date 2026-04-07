import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isPrerelease } from '../lib/prerelease'
import { useAuth } from '../lib/auth'

const STORAGE_KEY = 'marketplace_banner_dismissed'

export default function MarketplaceBanner() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  if (!isPrerelease() || dismissed) return null

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div style={{
      borderBottom: '1px solid #2a2a2a',
      paddingBottom: 40,
      marginBottom: 32,
      position: 'relative',
    }}>
      <button
        onClick={dismiss}
        style={{
          position: 'absolute', top: 0, right: 0,
          background: 'none', border: 'none', color: '#444',
          fontSize: 14, cursor: 'pointer', padding: 4,
        }}
        title="Dismiss"
      >
        &times;
      </button>

      <p style={{ color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 12px' }}>
        Beta
      </p>

      <h2 style={{ margin: '0 0 12px', fontWeight: 400, color: '#d4d4d4', fontSize: 22, lineHeight: 1.3 }}>
        Get your music heard by the right channels.
      </h2>

      <p style={{ color: '#777', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 540 }}>
        Mirror.FM already syncs {'>'}1,300 YouTube music channels to Spotify playlists.
        Now we match artists to channels based on genre.
        Submit a track, we show it to curators who fit your sound.
      </p>

      <div style={{
        display: 'flex', gap: 32, marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ color: '#d4d4d4', fontSize: 14, marginBottom: 4 }}>For artists</div>
          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 240 }}>
            Paste a Spotify link, see which channels match your genre,
            and submit. Free while we're in beta.
          </p>
        </div>
        <div>
          <div style={{ color: '#d4d4d4', fontSize: 14, marginBottom: 4 }}>For channel owners</div>
          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 240 }}>
            Claim your channel, receive track submissions
            from artists that fit your catalog.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to={user ? "/join/" : "/signin/"} style={{
          background: '#1DB954', color: 'white', padding: '8px 20px',
          borderRadius: 4, textDecoration: 'none', fontSize: 14,
        }}>
          Get started
        </Link>
      </div>
    </div>
  )
}
