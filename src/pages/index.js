import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Thumbnail from "../components/thumbnail"

import { Link } from "gatsby"
import NumberFormat from 'react-number-format';

import { makeStyles } from '@material-ui/core/styles';


function generate(genres) {
  return Object.entries((genres || {}))
               .sort((a, b) => (b[1] - a[1]))
               .slice(0, 4);
}

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
    const classes = makeStyles(theme => ({
      paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
          margin: theme.spacing(0.5),
        },
      },
    }));

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
              <ul style={{ columns: `5`, columnGap: `20px`, listStyleType: `none`, marginLeft: `0` }}>
                {youtube.channels.map((c, index) => (
                    <li style={{ marginBottom: `20px` }} key={index}>
                      <Thumbnail channel={c} />
                    </li>
                ))}
              </ul>
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