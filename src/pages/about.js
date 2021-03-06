import React from "react"
import { Link } from "gatsby"

import Layout from "../layouts/index"
import SEO from "../components/seo"

const About = () => (
  <Layout>
    <SEO title="About" />
    <Link style={{ float: `right`, textDecoration: `none`, fontSize: `30px` }} to="/">←</Link>
    <h2>About</h2>
    <p>Inspired from <a href="https://resident-archive.github.io">Resident Archive</a> and adapted to YouTube
    music channels. Some of the goals are:</p>
    <ul>
      <li>Keep channels in sync with playlists</li>
      <li>Find channels genres</li>
      <li>Provide a backup solution in case channels or songs are deleted</li>
    </ul>
  </Layout>
)

export default About