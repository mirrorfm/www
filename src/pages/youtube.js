import * as PropTypes from "prop-types"
import React, { Component } from 'react'

import { Router } from "@reach/router"

import Layout from "../layouts/index"
import ChannelDetail from "../components/channel-detail"

import axios from "axios";
import SEO from "../components/seo";

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
        channel: location.state.channel
      })
    } else {
      const id = location.pathname.split(`/`)[2];
      this.fetchChannel(id)
    }
  }

  render() {
    const { location } = this.props
    const { channel } = this.state
    return (
      <Layout location={location}>
        <SEO title={`${channel.channel_name} YouTube channel on Spotify`} />
        <Router>
          <ChannelDetail path="/youtube/:id/*" channel={channel} />
        </Router>
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannel = id => {
    this.setState({ loading: true })

    axios
      .get(process.env['GATSBY_API_URL'] + `channels?id=${id}`)
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