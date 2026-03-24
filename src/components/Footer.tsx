import { Link } from 'react-router-dom'
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer style={{ background: '#222', borderTop: '1px solid #333' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: 1280,
        padding: '20px 1.0875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <Link to="/about/">About</Link>
          <Link to="/logs/">Event logs</Link>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <SocialIcon url="https://twitter.com/mirror_fm" style={{ width: 30, height: 30 }} />
          <SocialIcon url="https://facebook.com/www.mirror.fm" style={{ width: 30, height: 30 }} />
          <SocialIcon url="https://open.spotify.com/user/xlqeojt6n7on0j7coh9go8ifd?si=oj2_z5gQRt2TVfQhA4vDCw" style={{ width: 30, height: 30 }} />
          <SocialIcon url="https://github.com/mirrorfm" style={{ width: 30, height: 30 }} />
          <SocialIcon url="https://instagram.com/mirror.fm" style={{ width: 30, height: 30 }} />
          <SocialIcon url="https://www.youtube.com/c/MirrorFM" style={{ width: 30, height: 30 }} />
        </div>
      </div>
    </footer>
  )
}
