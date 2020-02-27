import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../components/layout"
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
      root: {
        flexGrow: 1,
      },
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
              <ul style={{ listStyleType: `none`, marginLeft: `0` }}>
                {youtube.channels.map((c, index) => (
                  <li style={{ marginBottom: `20px` }} key={index}>
                    <div className={classes.root}>
                      <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                          <Grid item>
                            <ButtonBase className={classes.image}>
                            <LazyLoadImage
                              alt={c.channel_name}
                              height="170px"
                              src={c.thumbnails.medium.url}
                              width="170px" />
                            </ButtonBase>
                          </Grid>
                          <Grid item xs={12} sm container direction="row">
                            <Grid item xs container direction="column" spacing={2}>
                              <Grid item>
                                <Typography gutterBottom variant="subtitle1">
                                  {c.channel_name} on&nbsp;
                                  <a href={`https://youtube.com/playlist?list=${c.upload_playlist_id}`}>
                                    YouTube
                                  </a>
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {c.count_tracks} tracks
                                </Typography>
                                <Typography variant="body2" gutterBottom color="textSecondary">
                                  Updated <Moment fromNow unix>{c.last_found_time}</Moment> • {c.count_followers} followers
                                </Typography>
                              </Grid>
                              <Grid item xs={5}>
                                <Typography style={{ float: `right` }} variant="subtitle1" gutterBottom>
                                  {Math.round(c.found_tracks * 100 / c.count_tracks)}% found on&nbsp;
                                  <a href={`https://open.spotify.com/playlist/${c.spotify_playlist_id}`}>
                                    Spotify
                                  </a>
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>
                                <div className={classes.root}>
                                  {generate(c.genres).map(([label, count]) =>
                                    <Chip
                                      avatar={<Avatar>{count}</Avatar>}
                                      key={label}
                                      size="small"
                                      label={label}
                                      style={{ margin: `2px` }}
                                    />
                                  )}
                                </div>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>
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