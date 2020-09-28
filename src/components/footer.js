import { Link } from "gatsby"
import PropTypes from "prop-types"
import { SocialIcon } from 'react-social-icons';
import React from "react"


const Footer = () => (
    <footer style={{
      background: `rgba(236, 236, 236)`,
      borderTop: `1px solid #eee`,
    }}>
      <div style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `50px 1.0875rem`,
        display: `table`,
        width: `100%`,
        minHeight: 80,
        height: 170
      }}>
        <span>
          <p style={{ float: `left` }}>
            <Link to="/">Home</Link><br />
            <Link to="/channels/">All channels</Link><br />
            <Link to="/add/">Add a channel</Link><br />
            <Link to="/about/">About</Link><br />
            <Link to="/logs/">Event logs</Link>
          </p>
          <p style={{ float: `right` }}>
            <br />
            <hr />
            <SocialIcon url="https://twitter.com/mirror_fm" />
            <SocialIcon url="https://facebook.com/www.mirror.fm" />
            <SocialIcon url="https://open.spotify.com/user/xlqeojt6n7on0j7coh9go8ifd?si=oj2_z5gQRt2TVfQhA4vDCw" />
            <SocialIcon url="https://github.com/mirrorfm" />
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
