import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isPrerelease } from '../lib/prerelease'
import { useAuth } from '../lib/auth'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const STORAGE_KEY = 'marketplace_banner_collapsed'

export default function MarketplaceBanner() {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  if (!isPrerelease()) return null

  const toggle = () => {
    const next = !collapsed
    if (next) {
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setCollapsed(next)
  }

  return (
    <div style={{
      borderBottom: '1px solid #2a2a2a',
      paddingBottom: collapsed ? 16 : 32,
      marginBottom: 32,
      position: 'relative',
    }}>
      <button
        onClick={toggle}
        style={{
          position: 'absolute', top: 0, right: 0,
          background: 'none', border: 'none', color: '#444',
          fontSize: 14, cursor: 'pointer', padding: 4,
          lineHeight: 1,
        }}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '+ Show' : '\u00d7'}
      </button>

      <div style={{
        display: 'inline-block', fontSize: 11, fontWeight: 600,
        color: '#1DB954', textTransform: 'uppercase', letterSpacing: 2,
        background: 'rgba(29, 185, 84, 0.1)', padding: '4px 10px',
        borderRadius: 4, marginBottom: collapsed ? 0 : 16,
        fontFamily: 'Arial, sans-serif',
      }}>
        Beta
      </div>

      {!collapsed && (
      <>
      <div style={{
        display: 'flex', gap: 32,
        flexWrap: 'wrap', alignItems: 'flex-start',
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ margin: '0 0 12px', fontWeight: 500, color: '#e0e0e0', fontSize: 24, lineHeight: 1.3 }}>
            Get your music heard by the right channels.
          </h2>
          <p style={{ color: '#777', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>
            Mirror.FM syncs YouTube music channels to Spotify playlists.
            Now we match artists to channels based on genre.
            Submit a track, we show it to curators who fit your sound.
          </p>
          <Link to={user ? "/join/" : "/signin/"} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#1DB954', color: 'white', padding: '10px 22px',
            borderRadius: 6, textDecoration: 'none', fontSize: 14,
            fontWeight: 600, transition: 'background 0.2s',
          }}>
            Get started <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>

        <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 14px', background: '#222', borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <MusicNoteIcon sx={{ fontSize: 16, color: '#1DB954' }} />
              <span style={{ color: '#d4d4d4', fontSize: 13, fontWeight: 600 }}>For artists</span>
            </div>
            <p style={{ color: '#777', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              Paste a Spotify link, we pitch it to matching YouTube channel
              curators. Free while we're in beta.
            </p>
          </div>
          <div style={{
            padding: '10px 14px', background: '#222', borderRadius: 8,
            border: '1px solid #2a2a2a',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <PlayCircleOutlineIcon sx={{ fontSize: 16, color: '#1DB954' }} />
              <span style={{ color: '#d4d4d4', fontSize: 13, fontWeight: 600 }}>For channel owners</span>
            </div>
            <p style={{ color: '#777', fontSize: 12, lineHeight: 1.5, margin: 0 }}>
              Claim your channel, receive track submissions
              from artists that fit your catalog.
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
