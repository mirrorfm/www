import React, { Component } from 'react'
import axios from 'axios'

import Layout from "../components/layout"
import SEO from "../components/seo"
import { LazyLoadImage } from 'react-lazy-load-image-component';

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
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : this.state.data ? (
            <>
              <p style={{ textAlign: "right" }}>{Math.round(youtube.found_tracks * 100 / youtube.total_tracks)}% tracks in {youtube.total_channels} YouTube channels</p>
              <ul style={{ columns: `4`, listStyleType: `none` }}>
                {youtube.channels.map((c, index) => (
                  <li key={index}>
                    <div className="container">
                      <div className="content content-top">
                        <a href={`https://youtube.com/playlist?list=${c.upload_playlist_id}`}>{c.channel_name}</a>
                      </div>
                      <LazyLoadImage
                        alt={c.channel_name}
                        height={c.thumbnails.medium.height}
                        src={c.thumbnails.medium.url}
                        width={c.thumbnails.medium.width} />

                      <div className="content content-bottom content-bottom-high">
                        <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${c.spotify_playlist_id}`}>
                          {Math.round(c.found_tracks * 100 / c.count_tracks)}%
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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