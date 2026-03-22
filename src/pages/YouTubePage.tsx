import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Grid as GridLoader } from 'react-loader-spinner'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import ChannelDetail from '../components/channel/ChannelDetail'
import { API_URL } from '../config'

export default function YouTubePage() {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state as any

  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<any>(state?.channel || null)

  useEffect(() => {
    if (!state?.channel && id) {
      axios.get(API_URL + `channels/${id}`)
        .then(({ data }) => { setLoading(false); setChannel(data.channel) })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      {loading && !channel ? (
        <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ textAlign: 'center' }} />
      ) : channel ? (
        <>
          <SEO title={`${channel.channel_name} YouTube channel on Spotify`} />
          <ChannelDetail channel={channel} />
        </>
      ) : (
        <p>Error fetching YouTube channel</p>
      )}
    </Layout>
  )
}
