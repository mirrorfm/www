import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'
import { isPrerelease } from '../lib/prerelease'

interface FooterProps {
  children?: ReactNode
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer style={{
      background: '#222',
      borderTop: '1px solid #333',
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
    }}>
      <div style={{
        margin: '0 auto',
        maxWidth: 1280,
        padding: '6px 1.0875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <Link to="/about/">About</Link>
          <Link to="/logs/">Event logs</Link>
          {isPrerelease() && <>
            <Link to="/pitch/" style={{ color: '#1DB954' }}>Pitch</Link>
            <Link to="/inbox/" style={{ color: '#1DB954' }}>Inbox</Link>
            <Link to="/owners/" style={{ color: '#1DB954' }}>Owners</Link>
            <Link to="/report/" style={{ color: '#1DB954' }}>Report</Link>
            <Link to="/genres/" style={{ color: '#1DB954' }}>Genres</Link>
          </>}
        </div>
        {children && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {children}
          </div>
        )}
        <div style={{ display: 'flex', gap: 4 }}>
          <SocialIcon url="https://twitter.com/mirror_fm" style={{ width: 24, height: 24 }} />
          <SocialIcon url="https://facebook.com/www.mirror.fm" style={{ width: 24, height: 24 }} />
          <SocialIcon url="https://open.spotify.com/user/xlqeojt6n7on0j7coh9go8ifd?si=oj2_z5gQRt2TVfQhA4vDCw" style={{ width: 24, height: 24 }} />
          <SocialIcon url="https://github.com/mirrorfm" style={{ width: 24, height: 24 }} />
          <SocialIcon url="https://instagram.com/mirror.fm" style={{ width: 24, height: 24 }} />
          <SocialIcon url="https://www.youtube.com/c/MirrorFM" style={{ width: 24, height: 24 }} />
        </div>
      </div>
    </footer>
  )
}
