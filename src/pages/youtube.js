import * as PropTypes from "prop-types"
import React, { Component } from 'react'

import { Router } from "@reach/router"

import Layout from "../layouts/index"

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  render() {
    const { location } = this.props
    const SomeSubPage = props => {
      return <iframe src={`https://open.spotify.com/embed/playlist/${location.state.channel.spotify_playlist_id}`}
                     width="600" height="380" frameBorder="0" allow="encrypted-media"></iframe>
    }
    return (
      <Layout location={location}>
        <Router>
          <SomeSubPage path="/youtube/:id" />
        </Router>
      </Layout>
    )
  }
}

export default Home