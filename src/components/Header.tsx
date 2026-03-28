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
            <Link to="/submit/" style={{ color: '#d4d4d4', textDecoration: 'none', fontSize: 28, lineHeight: 1, flexShrink: 0 }} title="Submit a channel or label">+</Link>
            {isPrerelease() && <AuthStatus />}
          </>
        ) : (
          <>
            <Link to="/browse/" style={{ color: '#999', textDecoration: 'none', fontSize: 14, flexShrink: 0 }}>Browse</Link>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Link to="/" style={{ color: '#d4d4d4', textDecoration: 'none' }}>
                <img width="60" alt="Mirror.FM logo" src={logo} />
              </Link>
            </div>
            <Link to="/submit/" style={{ color: '#999', textDecoration: 'none', fontSize: 14, flexShrink: 0 }}>Submit</Link>
            {isPrerelease() && <AuthStatus />}
          </>
        )}
      </div>
    </header>
  )
}
