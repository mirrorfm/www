import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const About = () => (
  <Layout>
    <SEO title="About" />
    <Link style={{ float: `right`, textDecoration: `none`, fontSize: `30px` }} to="/">←</Link>
    <h2>About</h2>
    <ul>
      <li><a href="https://facebook.com/www.mirror.fm">Facebook</a></li>
      <li><a href="https://twitter.com/mirror_fm">Twitter</a></li>
      <li><a href="https://github.com/mirrorfm">Github</a></li>
      <li><a href="https://open.spotify.com/user/xlqeojt6n7on0j7coh9go8ifd?si=oj2_z5gQRt2TVfQhA4vDCw">Spotify</a></li>
    </ul>
  </Layout>
)

export default About