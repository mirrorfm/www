import * as PropTypes from "prop-types"
import React, { Component } from 'react'
import axios from 'axios'
import Loader from 'react-loader-spinner'

import Layout from "../layouts/index"
import SEO from "../components/seo"
import Grid from "../components/channel/channel-grid"
import PaginationControls from "../components/pagination"
import SortDropdown from "../components/sort-dropdown"
import SearchBar from "../components/search-bar"

import { Link, navigate } from "gatsby"
import NumberFormat from 'react-number-format';

class Channels extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      loading: true,
      error: false,
      data: {
        youtube: {
          channels: [],
          total_count: 0
        }
      },
      genres: [],
      selectedGenres: [],
      page: 1,
      perPage: 100,
      sort: 'followers',
      search: ''
    }
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search)
    this.setState({
      page: parseInt(params.get('page')) || 1,
      sort: params.get('sort') || 'followers',
      search: params.get('search') || ''
    }, () => this.fetchChannels())
  }

  handleClick(e, selectedGenres) {
    this.setState({ selectedGenres })
  }

  handlePageChange = (page) => {
    this.updateAndFetch({ page })
  }

  handleSortChange = (sort) => {
    this.updateAndFetch({ sort, page: 1 })
  }

  handleSearchChange = (search) => {
    this.updateAndFetch({ search, page: 1 })
  }

  updateAndFetch = (newState) => {
    this.setState(newState, () => {
      const { page, sort, search } = this.state
      const params = new URLSearchParams()
      if (page > 1) params.set('page', page)
      if (sort !== 'followers') params.set('sort', sort)
      if (search) params.set('search', search)
      const qs = params.toString()
      navigate('/channels/' + (qs ? '?' + qs : ''))
      this.fetchChannels()
    })
  }

  render() {
    const { location } = this.props
    const { youtube } = this.state.data;

    return (
      <Layout location={ location } genres={ this.state.genres } handleClick={this.handleClick}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                  <p style={{ margin: 0 }}>
                    Found <span style={{ fontWeight: `bold`}}>{Math.round(youtube.found_tracks * 100 / youtube.total_tracks)}%</span> of <span style={{ fontWeight: `bold`}}><NumberFormat value={youtube.total_tracks} displayType={'text'} thousandSeparator={true} /></span> total tracks in <span style={{ fontWeight: `bold`}}>{youtube.total_count}</span> YouTube channels.
                    <Link style={{ marginLeft: '10px', fontSize: `30px`, textDecoration: `none` }} to="/add/">+</Link>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <SearchBar search={this.state.search} onSearchChange={this.handleSearchChange} />
                    <SortDropdown sort={this.state.sort} onSortChange={this.handleSortChange} />
                  </div>
                </div>
                <PaginationControls
                  page={this.state.page}
                  totalCount={youtube.total_count}
                  perPage={this.state.perPage}
                  onPageChange={this.handlePageChange}
                  compact
                />
                <Grid channels={ youtube.channels } selectedGenres={this.state.selectedGenres} />
                <PaginationControls
                  page={this.state.page}
                  totalCount={youtube.total_count}
                  perPage={this.state.perPage}
                  onPageChange={this.handlePageChange}
                />
              </>
          ) : (
              <p>Error fetching channels</p>
          )}
        </div>
      </Layout>
    )
  }

  fetchChannels = () => {
    this.setState({ loading: true })
    const { page, perPage, sort, search } = this.state
    const params = new URLSearchParams({ page, per_page: perPage, sort, order: 'desc' })
    if (search) params.set('search', search)

    axios
      .get(process.env['GATSBY_API_URL'] + 'channels?' + params.toString(), {
        responseType: 'json',
      })
      .then(({ data }) => {
        const genres = (data.all_genres || []).map(g => ({ genre: g }))

        this.setState({
          loading: false,
          data: {
            youtube: {
              channels: data.youtube || [],
              total_count: data.total_count,
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

export default Channels
