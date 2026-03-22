import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Grid as GridLoader } from 'react-loader-spinner'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import LabelDetail from '../components/label/LabelDetail'
import { API_URL } from '../config'

export default function DiscogsPage() {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state as any

  const [loading, setLoading] = useState(true)
  const [label, setLabel] = useState<any>(state?.label || null)

  useEffect(() => {
    if (!state?.label && id) {
      axios.get(API_URL + `labels/${id}`)
        .then(({ data }) => { setLoading(false); setLabel(data.label) })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout>
      {loading && !label ? (
        <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ textAlign: 'center' }} />
      ) : label ? (
        <>
          <SEO title={`${label.label_name} Discogs label on Spotify`} />
          <LabelDetail label={label} />
        </>
      ) : (
        <p>Error fetching Discogs label</p>
      )}
    </Layout>
  )
}
