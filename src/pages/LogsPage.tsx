import { useState, useEffect, useMemo } from 'react'
import Loader from '../components/Loader'
import moment from 'moment'
import slugify from 'react-slugify'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'

export default function LogsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    api.get('events')
      // The API returns null/[] when there are no events in the last 24 hours,
      // so coerce to an array to keep the render safe.
      .then(({ data }) => { setLoading(false); setData(Array.isArray(data) ? data : []) })
      .catch(() => { setLoading(false); setError(true) })
  }, [])

  const grouped = useMemo(() => {
    return Object.values((data ?? []).reduce((acc: Record<string, any>, event: any) => {
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
          <Loader />
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
                  {moment.unix(e.timestamp).fromNow()}
                </li>
              ))}
            </ul>
          </>
        ) : error ? (
          <p>Couldn't load event logs. Please try again later.</p>
        ) : (
          <>
            <h2>Event logs (last 24 hours)</h2>
            <p>No events in the last 24 hours.</p>
          </>
        )}
      </div>
    </Layout>
  )
}
