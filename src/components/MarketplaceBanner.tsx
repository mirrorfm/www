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
      borderRadius: 10,
      padding: '24px 28px',
      marginBottom: 30,
      position: 'relative',
    }}>
      <button
        onClick={dismiss}
        style={{
          position: 'absolute', top: 12, right: 16,
          background: 'none', border: 'none', color: '#555',
          fontSize: 18, cursor: 'pointer', padding: 4,
        }}
        title="Dismiss permanently"
      >
        &times;
      </button>

      <div style={{ fontSize: 13, color: '#1DB954', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
        Coming soon
      </div>

      <h3 style={{ margin: '0 0 12px', fontWeight: 500, color: '#e0e0e0', fontSize: 18 }}>
        Mirror.FM Marketplace
      </h3>

      <p style={{ color: '#999', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px', maxWidth: 600 }}>
        A new way to connect artists and YouTube music channel curators.
        Artists can submit tracks directly to curators who match their genre.
        Channel owners can sign up to receive submissions and grow their audience.
      </p>

      <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#888', marginBottom: 20 }}>
        <div>
          <div style={{ color: '#1DB954', fontWeight: 700, fontSize: 20 }}>1,300+</div>
          <div>indexed channels</div>
        </div>
        <div>
          <div style={{ color: '#1DB954', fontWeight: 700, fontSize: 20 }}>$2</div>
          <div>per submission</div>
        </div>
        <div>
          <div style={{ color: '#1DB954', fontWeight: 700, fontSize: 20 }}>7 days</div>
          <div>to respond or refund</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {user ? (
          <>
            <Link to="/pitch/" style={{
              background: '#1DB954', color: 'white', padding: '8px 20px',
              borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              Submit your music
            </Link>
            <Link to="/about2/" style={{
              background: 'transparent', color: '#999', padding: '8px 20px',
              borderRadius: 20, textDecoration: 'none', fontSize: 14,
              border: '1px solid #444',
            }}>
              Channel owners
            </Link>
          </>
        ) : (
          <Link to="/signin/" style={{
            background: '#1DB954', color: 'white', padding: '8px 20px',
            borderRadius: 20, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          }}>
            Sign in to get started
          </Link>
        )}
      </div>
    </div>
  )
}
