import * as PropTypes from "prop-types"
import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../layouts/index"
import SEO from "../components/seo"
import Grid from "../components/grid"

import { Link } from "gatsby"

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    data: PropTypes.shape({
      lastUpdated: PropTypes.array,
      mostFollowed: PropTypes.array,
      mostUploads: PropTypes.array,
      recentlyAdded: PropTypes.array
    })
  }

  state = {
    loading: false,
    error: false,
    data: {
      lastUpdated: [],
      mostFollowed: [],
      mostUploads: [],
      recentlyAdded: []
    }
  }

  componentDidMount() {
    this.fetchChannels()
  }

  render() {
    const { location } = this.props
    const { lastUpdated, mostFollowed, mostUploads, recentlyAdded } = this.state.data;

    return (
      <Layout location={ location } channels={ lastUpdated }>
        <SEO title="Home" />
        <div>
          {this.state.loading ? (
            <Loader
              type="Grid"
              color="lightgrey"
              height={50}
              width={50}
              timeout={9000}
              style={{ textAlign: "center" }}
            />
          ) : this.state.data ? (
            <>
              <p style={{ textAlign: `left` }}>
                <Link style={{ float: `right`, fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
              </p>
              <h4>Last updated</h4>
              <Grid channels={ lastUpdated } />
              <h4>Recently added</h4>
              <Grid channels={ recentlyAdded } />
              <h4>Most popular playlists</h4>
              <Grid channels={ mostFollowed } />
              <h4>Largest channels</h4>
              <Grid channels={ mostUploads } />
            </>
          ) : (
            <p>Oh noes, error fetching channels :(</p>
          )}
        </div>
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannels = () => {
    this.setState({ loading: true })

    axios
      .get(process.env['GATSBY_API_URL'] + "home", {
        responseType: 'json',
      })
      .then(({ data }) => {
        this.setState({
        loading: false,
        data
      })
    })
    .catch(error => {
      this.setState({ loading: false, error })
    })
  }
}

export default Home