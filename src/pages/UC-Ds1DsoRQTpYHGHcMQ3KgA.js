import * as PropTypes from "prop-types"
import React, { Component } from 'react'


import Layout from "../layouts/index"


class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isModal: PropTypes.bool
  }

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

  render() {
    const { location } = this.props

    return (
        <Layout location={location}>
          <div>
            <p>test</p>
            <p>test</p>
            <p>test</p>
            <p>test</p>
          </div>
        </Layout>
    )
  }
}

export default Home