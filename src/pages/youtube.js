import * as PropTypes from "prop-types"
import React, { Component } from 'react'

import { Router } from "@reach/router"

import Layout from "../layouts/index"
import axios from "axios";

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    loading: false,
    error: false,
    channel: {}
  }

  componentDidMount() {
    const { location } = this.props
    if (location.state) {
      this.setState({
        channel: {
          spotify_playlist_id: location.state.channel.spotify_playlist_id
        }
      })
    } else {
      const id = location.pathname.split(`/youtube/`)[1].replace(/\/$/, "")
      this.fetchChannel(id)
    }
  }

  render() {
    const SomeSubPage = () => {
      return <iframe src={`https://open.spotify.com/embed/playlist/${this.state.channel.spotify_playlist_id}`}
                     width="600" height="380" frameBorder="0" allow="encrypted-media"></iframe>
    }
    const { location } = this.props
    return (
      <Layout location={location}>
        <Router>
          <SomeSubPage path="/youtube/:id" />
        </Router>
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannel = id => {
    this.setState({ loading: true })

    axios
        .get(`https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/mirrorfm/channels?id=${id}`)
        .then(({ data }) => {
          this.setState({
            loading: false,
            channel: data
          })
        })
        .catch(error => {
          this.setState({ loading: false, error })
        })
  }
}

export default Home