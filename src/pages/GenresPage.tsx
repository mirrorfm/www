import { useState, useEffect } from 'react'
import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'

interface GenreCount {
  name: string
  count: number
}

export default function GenresPage() {
  const [genres, setGenres] = useState<GenreCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('genres')
      .then(({ data }) => setGenres(data.genres || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxCount = genres.length > 0 ? genres[0].count : 1

  return (
    <Layout>
      <SEO title="Genres" />
      <h2 style={{ fontWeight: 400, marginBottom: 4 }}>Genres</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
        {genres.length > 0 ? `${genres.length} genres across all channels and labels` : ''}
      </p>

      {loading ? (
        <p style={{ color: '#999' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {genres.map(g => (
            <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
              <div style={{ width: 200, fontSize: 13, color: '#ccc', textAlign: 'right', flexShrink: 0 }}>
                {g.name}
              </div>
              <div style={{ flex: 1, height: 16, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(g.count / maxCount) * 100}%`,
                  background: '#1DB954',
                  borderRadius: 2,
                  minWidth: 2,
                }} />
              </div>
              <div style={{ width: 50, fontSize: 12, color: '#666', flexShrink: 0 }}>
                {g.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
