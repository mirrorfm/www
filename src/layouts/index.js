import * as PropTypes from "prop-types"
import React from "react"
import { ModalRoutingContext } from "gatsby-plugin-modal-routing"
import GatsbyGramModal from "../components/modal"
import Header from "../components/header";
import Footer from "../components/footer";
import LogsDrawer from "../components/logs-drawer";
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';

import "./layout.css"

class Layout extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    channels: PropTypes.array,
    labels: PropTypes.array,
  }

  state = {
    mobileOpen: false
  }

  negateMobileOpen() {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  render() {
    const { location } = this.props

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <ModalRoutingContext.Consumer>
          {({ modal, channels, labels }) => (
              modal ? (
                  <GatsbyGramModal
                      location={location}
                      channels={channels}
                      labels={labels}
                  >
                    {this.props.children}
                  </GatsbyGramModal>
              ) : (
                  <div className="site">
                    <Header siteTitle="Mirror.FM" genres={this.props.genres} handleClick={this.props.handleClick} />
                    <AppBar position="fixed">
                      <Toolbar>
                        <Typography variant="h6" noWrap>
                          Permanent drawer
                        </Typography>
                      </Toolbar>
                    </AppBar>
                    <AppBar position="fixed">
                      <Toolbar>
                        <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          edge="start"
                          onClick={() => this.negateMobileOpen()}
                        >
                          <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                          Responsive drawer
                        </Typography>
                      </Toolbar>
                    </AppBar>
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
                    <Hidden smUp implementation="css">
                      <Drawer
                        container={container}
                        variant="temporary"
                        anchor='right'
                        open={this.state.mobileOpen}
                        onClose={() => this.negateMobileOpen()}
                        ModalProps={{
                          keepMounted: true, // Better open performance on mobile.
                        }}
                      >
                        <LogsDrawer />
                      </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                      <Drawer
                        variant="permanent"
                        anchor="right"
                        open
                      >
                        <LogsDrawer />
                      </Drawer>
                    </Hidden>
                    <Footer />
                  </div>
              )
          )}
        </ModalRoutingContext.Consumer>
    )
  }
}

export default Layout