import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Footer = () => (
    <footer style={{
      background: `rgba(245, 245, 245, 0.98)`,
      borderBottom: `1px solid #eee`,
      top: `0`,
      width: `100%`,
    }}>
      <div style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `0px 1.0875rem`,
        display: `table`,
        width: `100%`,
        minHeight: 80,
        height: 300
      }}>
        <span>
          <p style={{ float: `left` }}>
            <Link to="/add/">Add a channel</Link><br />
            <Link to="/about/">About</Link>
          </p>
          <p style={{ float: `right` }}>
            <h2>Follow</h2>
            <ul>
              <li><a href="https://facebook.com/www.mirror.fm">Facebook</a></li>
              <li><a href="https://twitter.com/mirror_fm">Twitter</a></li>
              <li><a href="https://github.com/mirrorfm">Github</a></li>
              <li><a href="https://open.spotify.com/user/xlqeojt6n7on0j7coh9go8ifd?si=oj2_z5gQRt2TVfQhA4vDCw">Spotify</a></li>
            </ul>
          </p>
        </span>

      </div>
    </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
