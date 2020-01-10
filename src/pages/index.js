import React, { Component } from 'react'
import { Link } from "gatsby"
import axios from 'axios'

import Layout from "../components/layout"
import SEO from "../components/seo"

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
    console.log(youtube);
    return (
      <Layout>
        <SEO title="Home" />
        <p style={{ textAlign: "right" }}>{youtube.total_channels} YouTube channels</p>
        <ul style={{ columns: `3`, listStyleType: `none` }}>
          {youtube.channels.map((c, index) => (
              <li key={index}>
                <div class="container">
                  <div class="content content-bottom">
                    <a href={`https://youtube.com/playlist?list=${c.upload_playlist_id}`}>{c.channel_name}</a>
                  </div>
                  <img src={c.thumbnails.medium.url} />
                  <div class="content content-bottom content-bottom-high">
                    <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${c.spotify_playlist_id}`}>
                      {Math.round(c.found_tracks * 100 / c.count_tracks)}%
                    </a>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        {/* <div style={{ textAlign: 'center', width: '600px', margin: '50px auto' }}>
          <div>
            {this.state.loading ? (
              <p>Please hold, pupper incoming!</p>
            ) : img && breed ? (
              <>
                <h2>{`${breed} pupper!`}</h2>
                <img src={img} alt={`cute random `} style={{ maxWidth: 300 }} />
              </>
            ) : (
              <p>Oh noes, error fetching pupper :(</p>
            )}
          </div>
        </div> */}
        {/* <Link to="/page-2/">Go to page 2</Link> */}
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