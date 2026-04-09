import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isPrerelease } from '../lib/prerelease'
import { useAuth } from '../lib/auth'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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
          fontSize: 18, cursor: 'pointer', padding: 4,
          lineHeight: 1,
        }}
        title="Dismiss"
      >
        &times;
      </button>

      <div style={{
        display: 'inline-block', fontSize: 11, fontWeight: 600,
        color: '#1DB954', textTransform: 'uppercase', letterSpacing: 2,
        background: 'rgba(29, 185, 84, 0.1)', padding: '4px 10px',
        borderRadius: 4, marginBottom: 16,
        fontFamily: 'Arial, sans-serif',
      }}>
        Beta
      </div>

      <h2 style={{ margin: '0 0 12px', fontWeight: 500, color: '#e0e0e0', fontSize: 24, lineHeight: 1.3 }}>
        Get your music heard by the right channels.
      </h2>

      <p style={{ color: '#777', fontSize: 15, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 540 }}>
        Mirror.FM syncs 1,300+ YouTube music channels to Spotify playlists.
        Now we match artists to channels based on genre.
        Submit a track, we show it to curators who fit your sound.
      </p>

      <div style={{
        display: 'flex', gap: 24, marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <div style={{
          flex: 1, minWidth: 220, padding: '16px 20px',
          background: '#222', borderRadius: 10, border: '1px solid #2a2a2a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MusicNoteIcon sx={{ fontSize: 18, color: '#1DB954' }} />
            <span style={{ color: '#d4d4d4', fontSize: 14, fontWeight: 600 }}>For artists</span>
          </div>
          <p style={{ color: '#777', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Paste a Spotify link, see which channels match your genre,
            and submit. Free while we're in beta.
          </p>
        </div>
        <div style={{
          flex: 1, minWidth: 220, padding: '16px 20px',
          background: '#222', borderRadius: 10, border: '1px solid #2a2a2a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <PlayCircleOutlineIcon sx={{ fontSize: 18, color: '#1DB954' }} />
            <span style={{ color: '#d4d4d4', fontSize: 14, fontWeight: 600 }}>For channel owners</span>
          </div>
          <p style={{ color: '#777', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Claim your channel, receive track submissions
            from artists that fit your catalog.
          </p>
        </div>
      </div>

      <Link to={user ? "/join/" : "/signin/"} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#1DB954', color: 'white', padding: '10px 22px',
        borderRadius: 6, textDecoration: 'none', fontSize: 14,
        fontWeight: 600, transition: 'background 0.2s',
      }}>
        Get started <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </Link>
    </div>
  )
}
