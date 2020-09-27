import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../layouts/index"
import SEO from "../components/seo"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from "gatsby"

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';


import Moment from 'react-moment';

class Home extends Component {
  state = {
    loading: false,
    error: false,
    data: {
      events: [],
      total: 0,
    }
  }

  componentDidMount() {
    this.fetchChannels()
  }

  render() {
    const { events } = this.state.data;

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
                  <p style={{ textAlign: `right` }}>
                    <Link style={{ fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
                  </p>
                  <ul style={{ listStyleType: `none`, marginLeft: `0` }}>
                    {events.map((e, index) => (
                        <li key={index}>
                          Added {e.added} {Object.keys(e.genres)[0]} tracks to {e.channel_name} <Moment fromNow unix>{e.timestamp}</Moment>
                        </li>
                    ))}
                  </ul>
                  <span>
              </span>
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
        .get(`https://qdfngarl1b.execute-api.eu-west-1.amazonaws.com/mirrorfm/events`)
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