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
    loading: true,
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
    let allGenres = {};
    const { channels } = youtube;
    for (let i=0; i < channels.length; i++) {
      channels[i].genres.forEach(function(genre) {
        if (!allGenres[genre.name]) {
          allGenres[genre.name] = 0
        }
        allGenres[genre.name] += genre.count
      });
    }

    let genresArray = [];
    for (let genre in allGenres) {
      genresArray.push({ genre, count: allGenres[genre] });
    }

    return (
        <Layout location={ location } genres={ genresArray } channels={ channels }>
          <SEO title="All YouTube channels" />
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
                </>
            ) : (
                <p>Error fetching channels</p>
            )}
          </div>
        </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannels = () => {
    axios
        .get(process.env['GATSBY_API_URL'] + 'channels', {
          responseType: 'json',
        })
        .then(({ data }) => {
          this.setState({
            loading: false,
            data: {
              youtube: {
                channels: data.youtube,
                total_channels: data.total_channels,
                found_tracks: data.found_tracks,
                total_tracks: data.total_tracks
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