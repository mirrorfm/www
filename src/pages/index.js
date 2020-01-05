import React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <p style={{ textAlign: "right" }}>{data.allInternalChannels.totalCount} YouTube channels</p>
    <ul style={{ columns: `3`, listStyleType: `none` }}>
      {data.allInternalChannels.nodes
        .map((c, index) => (
          <li key={index}>
            <div class="container">
              <div class="content content-top">
                <a href={`https://youtube.com/playlist?list=${c.upload_playlist_id}`}>{c.channel_name}</a>
              </div>
              <img src={c.thumbnails.medium.url} />
              <div class="content content-bottom">
                <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${c.spotify_playlist_id}`}>
                  {Math.round(c.found_tracks * 100 / c.count_tracks)}%
                </a>
              </div>
            </div>
          </li>
        ))}
    </ul>
    {/* <Link to="/page-2/">Go to page 2</Link> */}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allInternalChannels(filter: {id: {ne: "dummy"}}) {
      nodes {
        id
        channel_name
        upload_playlist_id
        thumbnails {
          medium {
            width
            url
            height
          }
        }
        spotify_playlist_id
        found_tracks
        count_tracks
        count_followers
      }
      totalCount
    }
  }`