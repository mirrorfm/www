import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Grid as GridLoader } from 'react-loader-spinner'
import Moment from 'react-moment'
import slugify from 'react-slugify'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { API_URL } from '../config'

export default function LogsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    axios.get(API_URL + 'events')
      .then(({ data }) => { setLoading(false); setData(data) })
      .catch(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    return Object.values(data.reduce((acc: Record<string, any>, event: any) => {
      const id = event.spotify_playlist
      if (!acc[id]) {
        acc[id] = { ...event }
      } else {
        acc[id].added += event.added
      }
      return acc
    }, {}))
  }, [data])

  return (
    <Layout>
      <SEO title="Event logs" />
      <div>
        {loading ? (
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ textAlign: 'center' }} />
        ) : grouped.length > 0 ? (
          <>
            <h2>Event logs (last 24 hours)</h2>
            <ul style={{ listStyleType: 'none', marginLeft: 0 }}>
              {grouped.map((e: any, index: number) => (
                <li key={index}>
                  Added {e.added} tracks to{' '}
                  <a href={`/${e.host === 'yt' ? 'youtube' : 'discogs'}/${e.entity_id}/${slugify(e.entity_name)}/`}>
                    {e.host === 'yt' ? 'YouTube channel' : 'Discogs label'} {e.entity_name}
                  </a>{' '}
                  <Moment fromNow unix>{e.timestamp}</Moment>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Error fetching event logs</p>
        )}
      </div>
    </Layout>
  )
}
