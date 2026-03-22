import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Grid as GridLoader } from 'react-loader-spinner'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import ChannelGrid from '../components/channel/ChannelGrid'
import { api } from '../config'

interface HomeData {
  lastUpdated: any[]
  mostFollowed: any[]
  mostUploads: any[]
  recentlyAdded: any[]
  lastTerminated: any[]
  rarestUploads: any[]
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<HomeData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('home')
      .then(({ data }) => { setLoading(false); setData(data) })
      .catch((err) => { setLoading(false); setError(err.rateLimited ? 'Too many requests. Please wait a moment and try again.' : 'Error fetching channels') })
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <div>
        {loading ? (
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ textAlign: 'center' }} />
        ) : data ? (
          <>
            <p style={{ textAlign: 'left' }}>
              <Link style={{ float: 'right', fontSize: 60, textDecoration: 'none' }} to="/submit/">+</Link>
            </p>
            <h4>New playlists</h4>
            <ChannelGrid channels={data.recentlyAdded} category="recentlyAdded" />
            <h4>Most popular playlists</h4>
            <ChannelGrid channels={data.mostFollowed} category="mostFollowed" />
            <h4>Last updated</h4>
            <ChannelGrid channels={data.lastUpdated} category="lastUpdated" />
            <h4>Largest channels</h4>
            <ChannelGrid channels={data.mostUploads} category="mostUploads" />
            <h4>Channels with rare uploads</h4>
            <ChannelGrid channels={data.rarestUploads} category="rarestUploads" />
            <h4>Terminated channels</h4>
            <ChannelGrid channels={data.lastTerminated} category="lastTerminated" />
          </>
        ) : (
          <p>{error}</p>
        )}
      </div>
    </Layout>
  )
}
