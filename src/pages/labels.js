import * as PropTypes from "prop-types"
import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../layouts/index"
import SEO from "../components/seo"
import Grid from "../components/label/labels-grid"

import { Link } from "gatsby"
import NumberFormat from 'react-number-format';

class Labels extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
    data: PropTypes.shape({
      discogs: PropTypes.shape({
        labels: PropTypes.array
      })
    })
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      loading: true,
      error: false,
      data: {
        discogs: {
          labels: [],
          total_labels: 0
        }
      },
      genres: [],
      selectedGenres: []
    }

  }

  componentDidMount() {
    this.fetchLabels()
  }

  handleClick(e, selectedGenres) {
    this.setState({
      selectedGenres
    })
  }

  render() {
    const { location } = this.props
    const { discogs } = this.state.data;

    return (
      <Layout location={ location } genres={ this.state.genres } labels={ this.state.labels } handleClick={this.handleClick}>
        <SEO title="All Discogs labels" />
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
                Found <span style={{ fontWeight: `bold`}}>{Math.round(discogs.found_tracks * 100 / discogs.total_tracks)}%</span> of <span style={{ fontWeight: `bold`}}><NumberFormat value={discogs.total_tracks} displayType={'text'} thousandSeparator={true} /></span> total tracks in <span style={{ fontWeight: `bold`}}>{discogs.total_labels}</span> Discogs labels.
                <Link style={{ float: `right`, fontSize: `60px`, textDecoration: `none` }} to="/add/">+</Link>
              </p>
              <Grid labels={ discogs.labels } selectedGenres={this.state.selectedGenres} />
            </>
          ) : (
            <p>Error fetching labels</p>
          )}
        </div>
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchLabels = () => {
    axios
      .get(process.env['GATSBY_API_URL'] + 'labels', {
        responseType: 'json',
      })
      .then(({ data }) => {
        let allGenres = []
        let labels = data.discogs
        for (let i=0; i < labels.length; i++) {
          if (labels[i].genres) {
            labels[i].genres.forEach(function (genre) {
              if (!allGenres[genre.name]) {
                allGenres[genre.name] = 0
              }
              allGenres[genre.name] += genre.count
            });
          }
        }

        let genres = [];
        for (let genre in allGenres) {
          genres.push({ genre, count: genres[genre]});
        }

        this.setState({
          loading: false,
          data: {
            discogs: {
              labels: data.discogs,
              total_labels: data.total_labels,
              found_tracks: data.found_tracks,
              total_tracks: data.total_tracks
            }
          },
          genres
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default Labels