import * as PropTypes from "prop-types"
import React, { Component } from 'react'

import { Router } from "@reach/router"

import Layout from "../layouts/index"
import ChannelDetail from "../components/channel/channel-detail"

import axios from "axios";
import Loader from 'react-loader-spinner'
import SEO from "../components/seo";

class YouTube extends Component {
  static propTypes = {
    channel: PropTypes.shape({
      channel_name: PropTypes.object.isRequired
    })
  }

  state = {
    loading: true,
    error: false,
    channel: {
      channel_name: ""
    }
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
        {this.state.loading && !this.state.channel ? (
          <Loader
            type="Grid"
            color="lightgrey"
            height={50}
            width={50}
            timeout={9000}
            style={{ textAlign: "center" }}
          />
        ) : this.state.channel ? (
          <>
            <SEO title={`${channel.channel_name} YouTube channel on Spotify`} />
            <Router>
              <ChannelDetail path="/youtube/:id/:name" channel={channel} />
            </Router>
          </>
        ) : (
          <p>Error fetching YouTube channel</p>
        )}
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannel = id => {
    axios
      .get(process.env['GATSBY_API_URL'] + `channels/${id}`)
      .then(({ data }) => {
        this.setState({
          loading: false,
          channel: data.channel
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default YouTube