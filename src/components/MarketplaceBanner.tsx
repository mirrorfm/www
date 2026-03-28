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
      background: 'linear-gradient(135deg, #1a2a1a 0%, #1a1a2a 100%)',
      border: '1px solid #2a3a2a',
      borderRadius: 8,
      padding: '14px 20px',
      marginBottom: 24,
      position: 'relative',
    }}>
      <button
        onClick={dismiss}
        style={{
          position: 'absolute', top: 8, right: 12,
          background: 'none', border: 'none', color: '#555',
          fontSize: 16, cursor: 'pointer', padding: 4,
        }}
        title="Dismiss permanently"
      >
        &times;
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: '0 0 6px', fontWeight: 500, color: '#e0e0e0', fontSize: 16 }}>
            Mirror.FM Marketplace
          </h3>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
            Submit your tracks to YouTube channel curators. $2/credit, 7-day response window, refund on silence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        {user ? (
          <>
            <Link to="/pitch/" style={{
              background: '#1DB954', color: 'white', padding: '6px 16px',
              borderRadius: 16, textDecoration: 'none', fontSize: 13, fontWeight: 600,
            }}>
              Submit your music
            </Link>
            <Link to="/about2/" style={{
              background: 'transparent', color: '#888', padding: '6px 16px',
              borderRadius: 16, textDecoration: 'none', fontSize: 13,
              border: '1px solid #444',
            }}>
              Channel owners
            </Link>
          </>
        ) : (
          <Link to="/signin/" style={{
            background: '#1DB954', color: 'white', padding: '6px 16px',
            borderRadius: 16, textDecoration: 'none', fontSize: 13, fontWeight: 600,
          }}>
            Sign in to get started
          </Link>
        )}
        </div>
      </div>
    </div>
  )
}
