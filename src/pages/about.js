import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => (
  <Layout>
    <SEO title="About" />
    <h1>About this project</h1>
    <p>Welcome to mirror.fm</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
