import React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>yt</h1>
    {/* <p>x channels</p> */}
    <ul style={{ columns: `5`, 'list-style-type': `none` }}>
      {data.allInternalChannels.nodes
        .map(({ channel_name, channel_id, thumbnails }, index) => (
          <li key={index}>
            <a href={`https://youtube.com/channel/${channel_id}`}>
              {/* {channel_name} */}
              <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
                <img style={{ opacity: 0.9 }} src={thumbnails.medium.url} />
              </div>
            </a>
          </li>
        ))}
    </ul>
    {/* <Link to="/page-2/">Go to page 2</Link> */}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allInternalChannels {
      nodes {
        id
        channel_name
        channel_id
        thumbnails {
          medium {
            width
            url
            height
          }
        }
      }
    }
  }`