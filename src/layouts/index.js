import * as PropTypes from "prop-types"
import React from "react"
import { ModalRoutingContext } from "gatsby-plugin-modal-routing"
import GatsbyGramModal from "../components/modal"
import Header from "../components/header";
import Footer from "../components/footer";

import "./layout.css"

class Layout extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    channels: PropTypes.array,
  }

  render() {
    const { location } = this.props
    return (
        <ModalRoutingContext.Consumer>
          {({ modal, channels }) => (
              modal ? (
                  <GatsbyGramModal
                      location={location}
                      channels={channels}
                  >
                    {this.props.children}
                  </GatsbyGramModal>
              ) : (
                  <div className="site">
                    <Header siteTitle="Mirror.FM" genres={this.props.genres} handleClick={this.props.handleClick} />
                    <div
                        className="site-content"
                        style={{
                          margin: `0 auto`,
                          maxWidth: 1280,
                          padding: `0px 1.0875rem 1.50rem`,
                          paddingTop: 0,
                        }}
                    >
                      <main>{this.props.children}</main>
                    </div>
                    <Footer />
                  </div>
              )
          )}
        </ModalRoutingContext.Consumer>
    )
  }
}

export default Layout