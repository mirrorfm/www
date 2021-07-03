import * as PropTypes from "prop-types"
import React, { Component } from 'react'

import { Router } from "@reach/router"

import Layout from "../layouts/index"
import LabelDetail from "../components/label-detail"

import axios from "axios";
import Loader from 'react-loader-spinner'
import SEO from "../components/seo";

class Discogs extends Component {
  static propTypes = {
    label: PropTypes.shape({
      label_name: PropTypes.object.isRequired
    })
  }

  state = {
    loading: true,
    error: false,
    label: {
      label_name: ""
    }
  }

  componentDidMount() {
    const { location } = this.props
    if (location.state) {
      this.setState({
        label: location.state.label
      })
    } else {
      const id = location.pathname.split(`/`)[2];
      this.fetchLabel(id)
    }
  }

  render() {
    const { location } = this.props
    const { label } = this.state
    return (
      <Layout location={location}>
        {this.state.loading && !this.state.label ? (
          <Loader
            type="Grid"
            color="lightgrey"
            height={50}
            width={50}
            timeout={9000}
            style={{ textAlign: "center" }}
          />
        ) : this.state.label ? (
          <>
            <SEO title={`${label.label_name} Discogs label on Spotify`} />
            <Router>
              <LabelDetail path="/discogs/:id/:name" label={label} />
            </Router>
          </>
        ) : (
          <p>Error fetching Discogs label</p>
        )}
      </Layout>
    )
  }

  // This data is fetched at run time on the client.
  fetchLabel = id => {
    axios
      .get(process.env['GATSBY_API_URL'] + `discogs/${id}`)
      .then(({ data }) => {
        this.setState({
          loading: false,
          label: data.label
        })
      })
      .catch(error => {
        this.setState({ loading: false, error })
      })
  }
}

export default Discogs