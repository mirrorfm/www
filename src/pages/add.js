import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Add = () => (
  <Layout>
    <SEO title="Add" />
    <Link style={{ float: `right`, textDecoration: `none`, fontSize: `30px` }} to="/">←</Link>
    <h2>Add</h2>
    <div>
        <p>
            Please only submit music channels:
        </p>
        <ul>
            <li>where channel tracks seem to be formatted correctly, for example: Artist – Track</li>
            <li>with at least 100 tracks</li>
            <li>that don't belong to a single artist</li>
        </ul>
        <p>
            To submit a YouTube channel:
        </p>
        <ul>
            <li>Edit <a href="https://github.com/mirrorfm/data/blob/master/youtube-channels.csv">this file on Github</a></li>
            <li>Add the YouTube channel ID and name to the end of the file</li>
            <li>Once approved the Spotify playlist will sync automatically.</li>
        </ul>
        <p style={{ textAlign: `center` }}>
            <span>Github commit → Youtube channel → Spotify playlist</span>
        </p>
    </div>
  </Layout>
)

export default Add
