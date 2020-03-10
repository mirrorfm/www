import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Grid from "../components/grid"

import { Link } from "gatsby"
import NumberFormat from 'react-number-format';

class Home extends Component {
  state = {
    loading: false,
    error: false,
    data: {
      youtube: {
        channels: [],
        total_channels: 0
      }
    }
  }

  componentDidMount() {
    this.fetchChannels()
  }

  render() {
    const { youtube } = this.state.data;
    return (
      <Layout>
        <SEO title="Home" />
        <div>
          {this.state.loading ? (
            <Loader
              type="Grid"
              color="lightgrey"
              height={50}
              width={50}
              timeout={9000}
              style={{ paddingTop: 200, textAlign: "center" }}
            />
          ) : this.state.data ? (
            <>
              <p style={{ textAlign: `right` }}>
                <Link style={{ fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
              </p>
              <Grid channels={ youtube.channels } />
              <span>
                Found <span style={{ fontWeight: `bold`}}>{Math.round(youtube.found_tracks * 100 / youtube.total_tracks)}%</span> of <span style={{ fontWeight: `bold`}}><NumberFormat value={youtube.total_tracks} displayType={'text'} thousandSeparator={true} /></span> total tracks in <span style={{ fontWeight: `bold`}}>{youtube.total_channels}</span> YouTube channels.
                <Link style={{ float: `right` }} to="/about/">About</Link>
              </span>
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
      .get(`https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/mirrorfm/channels`)
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