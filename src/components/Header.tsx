import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/mirrorfm-icon.png'
import AuthStatus from './AuthStatus'
import { isPrerelease } from '../lib/prerelease'

interface HeaderProps {
  siteTitle?: string
  toolbar?: ReactNode
}

export default function Header({ toolbar }: HeaderProps) {
  return (
    <header style={{
      background: 'rgba(34, 34, 34, 0.98)',
      borderBottom: '1px solid #333',
      position: 'fixed',
      overflow: 'hidden',
      top: 0,
      width: '100%',
      zIndex: 1,
    }}>
      <div style={{
        margin: '0 auto',
        maxWidth: 1280,
        padding: '0px 1.0875rem',
        display: 'flex',
        alignItems: 'center',
        position: 'relative' as const,
        width: '100%',
        minHeight: 60,
        gap: 12,
      }}>
        {toolbar ? (
          <>
            <Link to="/" style={{ color: '#d4d4d4', textDecoration: 'none', flexShrink: 0 }}>
              <img width="50" alt="Mirror.FM logo" src={logo} />
            </Link>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
              {toolbar}
            </div>
            {isPrerelease() && <Link to="/join/" style={{ color: '#1DB954', textDecoration: 'none', fontSize: 14, flexShrink: 0 }}>Join</Link>}
            {isPrerelease() && <AuthStatus />}
          </>
        ) : (
          <>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/browse/" style={{ color: '#999', textDecoration: 'none', fontSize: 14 }}>Browse</Link>
            </div>
            <Link to="/" style={{ color: '#d4d4d4', textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <img width="60" alt="Mirror.FM logo" src={logo} />
            </Link>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
              {isPrerelease() && <Link to="/join/" style={{ color: '#1DB954', textDecoration: 'none', fontSize: 14 }}>Join</Link>}
              {isPrerelease() && <AuthStatus />}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
