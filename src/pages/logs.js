import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import * as PropTypes from "prop-types"

import Layout from "../layouts/index"
import SEO from "../components/seo"

import Moment from 'react-moment';
import slugify from 'react-slugify';

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array
  }

  state = {
    loading: true,
    error: false,
    data: []
  }

  componentDidMount() {
    this.fetchEvents()
  }

  render() {
    // Group events by entity
    this.state.data = Object.values(this.state.data.reduce((eventsSoFar, event) => {
      let id = event["spotify_playlist"]
      if (!eventsSoFar[id]) {
        eventsSoFar[id] = event;
      } else {
        eventsSoFar[id].added += event.added;
      }
      return eventsSoFar;
    }, {}));

    return (
        <Layout>
          <SEO title="Event logs" />
          <div>
            {this.state.loading ? (
                <Loader
                    type="Grid"
                    color="lightgrey"
                    height={50}
                    width={50}
                    timeout={3000}
                    style={{ textAlign: "center" }}
                />
            ) : this.state.data ? (
                <>
                  <h2>Event logs (last 24 hours)</h2>
                  <ul style={{ listStyleType: `none`, marginLeft: `0` }}>
                    {this.state.data.map((e, index) => (
                        <li key={index}>
                          Added {e.added} tracks to <a
                            href={`/${e.host === "yt" ? "youtube" : "discogs"}/${e.entity_id}/${slugify(e.entity_name)}/`}
                        >{e.host === "yt" ? "YouTube channel" : "Discogs label"} {e.entity_name}</a> <Moment fromNow unix>{e.timestamp}</Moment>
                        </li>
                    ))}
                  </ul>
                </>
            ) : (
                <p>Error fetching event logs</p>
            )}
          </div>
        </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchEvents = () => {
    axios
        .get(process.env['GATSBY_API_URL'] + 'events')
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
