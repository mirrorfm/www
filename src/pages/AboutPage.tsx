import { Link } from 'react-router-dom'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'

export default function AboutPage() {
  return (
    <Layout>
      <SEO title="About" />
      <Link style={{ float: 'right', textDecoration: 'none', fontSize: 30 }} to="/">←</Link>
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
}
