import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import ForkMeOnGithub from 'fork-me-on-github';

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
        <ForkMeOnGithub
          repo="https://github.com/mirrorfm/mirror.fm"
          colorBackground="white"
          colorOctocat="black"
        />
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
