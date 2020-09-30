import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import * as PropTypes from "prop-types"

import Layout from "../layouts/index"
import SEO from "../components/seo"
import { Link } from "gatsby"

import Moment from 'react-moment';

class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array
  }

  state = {
    loading: false,
    error: false,
    data: []
  }

  componentDidMount() {
    this.fetchChannels()
  }

  render() {
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
                    timeout={3000}
                    style={{ textAlign: "center" }}
                />
            ) : this.state.data ? (
                <>
                  <ul style={{ listStyleType: `none`, marginLeft: `0` }}>
                    {this.state.data.map((e, index) => (
                        <li key={index}>
                          Added {e.added} tracks to {e.channel_name} <Moment fromNow unix>{e.timestamp}</Moment>
                        </li>
                    ))}
                  </ul>
                </>
            ) : (
                <p>Oh noes, error fetching logs :(</p>
            )}
          </div>
        </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchChannels = () => {
    this.setState({ loading: true })

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