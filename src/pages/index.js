import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../components/layout"
import SEO from "../components/seo"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from "gatsby"

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
            <p style={{ textAlign: "center" }}>
              <Loader
                type="Grid"
                color="lightgrey"
                height={50}
                width={50}
                timeout={3000}
              />
            </p>
          ) : this.state.data ? (
            <>
              <p style={{ textAlign: `right` }}>
                <Link style={{ fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
              </p>
              <ul style={{ columns: `6`, columnGap: `20px`, listStyleType: `none`, marginLeft: `0` }}>
                {youtube.channels.map((c, index) => (
                  <li style={{ marginBottom: `20px` }} key={index}>
                    <div className="container">
                      <LazyLoadImage
                        alt={c.channel_name}
                        height={c.thumbnails.medium.height}
                        src={c.thumbnails.medium.url}
                        width={c.thumbnails.medium.width} />
                      <div style={{ whiteSpace: `nowrap`, overflow: `hidden`, height: `20px`, fontSize: `12px` }}>
                        <a href={`https://youtube.com/playlist?list=${c.upload_playlist_id}`}>{c.channel_name}</a>
                        <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${c.spotify_playlist_id}`}>
                          {Math.round(c.found_tracks * 100 / c.count_tracks)}%
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <span>
                <span style={{ fontWeight: `bold`}}>{Math.round(youtube.found_tracks * 100 / youtube.total_tracks)}%</span> tracks found in <span style={{ fontWeight: `bold`}}>{youtube.total_channels}</span> YouTube channels
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
      .get(`https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/get`)
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