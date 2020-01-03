import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `black`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <div style={{ "float": `right` }}>
        <div style={{ 'textAlign': `right` }}>
          <iframe src="https://open.spotify.com/follow/1/?uri=spotify:user:xlqeojt6n7on0j7coh9go8ifd&size=basic&theme=light" width="200" height="25" scrolling="no" frameBorder="0" style={{border: `none`, overflow: `hidden` }} allowtransparency="true"></iframe>
        </div>
      </div>
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
