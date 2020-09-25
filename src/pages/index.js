import * as PropTypes from "prop-types"
import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../layouts/index"
import SEO from "../components/seo"
import Grid from "../components/grid"

import { Link } from "gatsby"
import NumberFormat from 'react-number-format';

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    data: PropTypes.shape({
      youtube: PropTypes.shape({
        channels: PropTypes.array
      })
    })
  }

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
    const { location } = this.props
    const { youtube } = this.state.data;
    let targetObj = {};
    const { channels } = youtube;
    for (let i=0; i < channels.length; i++) {
      for (let genre in channels[i].genres) {
        if (!targetObj.hasOwnProperty(genre)) {
          targetObj[genre] = 0;
        }
        targetObj[genre] += channels[i].genres[genre];
      }
    }
    let newArr = [];
    for (let genre in targetObj) {
      newArr.push({ genre, count: targetObj[genre] });
    }

    return (

      <Layout location={ location } genres={ newArr } channels={ channels }>
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
                Found <span style={{ fontWeight: `bold`}}>{Math.round(youtube.found_tracks * 100 / youtube.total_tracks)}%</span> of <span style={{ fontWeight: `bold`}}><NumberFormat value={youtube.total_tracks} displayType={'text'} thousandSeparator={true} /></span> total tracks in <span style={{ fontWeight: `bold`}}>{youtube.total_channels}</span> YouTube channels.

                <Link style={{ float: `right`, fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
              </p>
              <Grid channels={ youtube.channels } />
              <span>
                <Link style={{ float: `left` }} to="/about/">Add a channel</Link>
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
      .get(process.env['GATSBY_API_URL'], {
        responseType: 'json',
      })
      .then(({data}) => {
        this.setState({
          loading: false,
          data: {
            youtube: {
              channels: data.youtube,
              total_channels: 0
            }
          }
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default Home