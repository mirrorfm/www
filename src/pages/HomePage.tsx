import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import SourceGrid from '../components/source/SourceGrid'
import { SourceItem } from '../components/source/SourceThumbnail'
import { api } from '../config'

interface HomeData {
  lastUpdated: any[]
  mostFollowed: any[]
  mostUploads: any[]
  recentlyAdded: any[]
  lastTerminated: any[]
  rarestUploads: any[]
}

function tagSource(items: any[], source: 'youtube' | 'discogs'): SourceItem[] {
  return items.map(item => ({ ...item, source }))
}

function mixSources(ytItems: any[], dgItems: any[]): SourceItem[] {
  const yt = tagSource(ytItems, 'youtube')
  const dg = tagSource(dgItems, 'discogs')
  // Interleave: insert labels proportionally among channels
  if (dg.length === 0) return yt
  if (yt.length === 0) return dg
  const result: SourceItem[] = []
  const ratio = Math.max(1, Math.floor(yt.length / (dg.length + 1)))
  let di = 0
  for (let i = 0; i < yt.length; i++) {
    result.push(yt[i])
    if ((i + 1) % ratio === 0 && di < dg.length) {
      result.push(dg[di++])
    }
  }
  while (di < dg.length) result.push(dg[di++])
  return result.slice(0, 6)
}

const sectionLink = (href: string) => ({
  color: '#e0e0e0',
  textDecoration: 'none',
  borderBottom: '1px dotted #555',
})

interface Section {
  title: string
  href: string
  category: string
  items: SourceItem[]
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('home'),
      api.get('labels?per_page=6&sort=added&order=desc'),
      api.get('labels?per_page=6&sort=followers&order=desc'),
      api.get('labels?per_page=6&sort=updated&order=desc'),
      api.get('labels?per_page=6&sort=tracks&order=desc'),
    ])
      .then(([homeRes, labelsNewRes, labelsPopRes, labelsUpdRes, labelsTracksRes]) => {
        const home: HomeData = homeRes.data
        const labelsNew = labelsNewRes.data.discogs || []
        const labelsPop = labelsPopRes.data.discogs || []
        const labelsUpd = labelsUpdRes.data.discogs || []
        const labelsTracks = labelsTracksRes.data.discogs || []

        setSections([
          {
            title: 'New',
            href: '/browse/?sort=added',
            category: 'recentlyAdded',
            items: mixSources(home.recentlyAdded, labelsNew),
          },
          {
            title: 'Popular',
            href: '/browse/?sort=followers',
            category: 'mostFollowed',
            items: mixSources(home.mostFollowed, labelsPop),
          },
          {
            title: 'Updated',
            href: '/browse/?sort=updated',
            category: 'lastUpdated',
            items: mixSources(home.lastUpdated, labelsUpd),
          },
          {
            title: 'Largest',
            href: '/browse/?sort=tracks',
            category: 'mostUploads',
            items: mixSources(home.mostUploads, labelsTracks),
          },
          {
            title: 'Rarest',
            href: '/browse/?sort=updated',
            category: 'rarestUploads',
            items: tagSource(home.rarestUploads, 'youtube'),
          },
          {
            title: 'Archived',
            href: '/browse/?source=youtube&sort=updated',
            category: 'lastTerminated',
            items: tagSource(home.lastTerminated, 'youtube'),
          },
        ])
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.rateLimited ? 'Too many requests. Please wait a moment and try again.' : 'Error fetching data')
      })
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <div>
        {loading ? (
          <Loader />
        ) : sections.length > 0 ? (
          <>
            {sections.map((section) => (
              <div key={section.category} style={{ marginBottom: 30 }}>
                <h4>
                  <Link to={section.href} style={sectionLink(section.href)}>
                    {section.title}
                  </Link>
                </h4>
                <SourceGrid items={section.items} category={section.category} />
              </div>
            ))}
          </>
        ) : (
          <p>{error}</p>
        )}
      </div>
    </Layout>
  )
}
