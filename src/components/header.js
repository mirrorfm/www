import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import CheckboxesTag from "./checkboxestag";
import { StaticImage } from "gatsby-plugin-image"

const Header = ({ siteTitle, genres, selectedGenres, handleClick }) => (
  <header style={{
    background: `rgba(245, 245, 245, 0.98)`,
    borderBottom: `1px solid #eee`,
    position: `fixed`,
    overflow: `hidden`,
    top: `0`,
    width: `100%`,
    zIndex: `1`
  }}>
    {genres ? (
      <div style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `0px 1.0875rem`,
        display: `table`,
        width: `100%`,
        minHeight: 80
      }}>
        <div style={{
          display: `table-cell`,
          width: 100,
          float: `left`
        }}>
          <Link
            to="/"
            style={{
              color: `black`,
              textDecoration: `none`,
              width: `80px`,
              top: `-36px`,
              float: `left`,
              position:`relative`
            }}>
            <StaticImage style={{
              position:`absolute`
            }} alt="Mirror.FM logo" src={'../images/mirrorfm-icon.png'} />
          </Link>
        </div>
        <div style={{
          display: `table-cell`,
          width: `100%`,
          paddingTop: 20
        }}>
          <CheckboxesTag genres={genres} selectedGenres={selectedGenres} handleClick={handleClick} />
        </div>
      </div>
     ) : (
      <div style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `0px 1.0875rem`,
        width: `100%`,
        minHeight: 80
      }}>
        <h1 style={{ margin: 0, textAlign: `center` }}>
          <Link
            to="/"
            style={{
              color: `black`,
              textDecoration: `none`,
            }}
          >
            <StaticImage width="80" src={'../images/mirrorfm-icon.png'} />
          </Link>
        </h1>
      </div>
    )}
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
