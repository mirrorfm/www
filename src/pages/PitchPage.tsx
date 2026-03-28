import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import { Grid as GridLoader } from 'react-loader-spinner'
import { NumericFormat } from 'react-number-format'

import Layout from '../layouts/Layout'
import SEO from '../components/SEO'
import { api } from '../config'
import { useAuth } from '../lib/auth'

interface TrackInfo {
  name: string
  artist: string
  image: string
  genres: string[]
  spotify_url: string
}

interface Genre {
  name: string
  count: number
}

interface ChannelMatch {
  channel_id: string
  channel_name: string
  thumbnail: string
  playlist_id: string
  followers: number
  found_tracks: number
  total_tracks: number
  score: number
  matching_genres: string[]
  top_genres: Genre[]
}

interface AnalyzeResponse {
  track: TrackInfo
  matches: ChannelMatch[]
}

interface SubmissionResult {
  submission_id: string
  channel_name: string
  status: string
}

export default function PitchPage() {
  const { user, loading: authLoading } = useAuth()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set())
  const [balance, setBalance] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<SubmissionResult[] | null>(null)

  useEffect(() => {
    if (!user) return
    api.get('credits').then(({ data }) => setBalance(data.balance)).catch(() => {})
  }, [user])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedChannels(new Set())
    setSubmitted(null)
    try {
      const { data } = await api.post('submit/analyze', { url: url.trim() })
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => {
      const next = new Set(prev)
      next.has(channelId) ? next.delete(channelId) : next.add(channelId)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!result || selectedChannels.size === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const channels = result.matches
        .filter(m => selectedChannels.has(m.channel_id))
        .map(m => ({ id: m.channel_id, name: m.channel_name }))

      const { data } = await api.post('submissions', {
        track_url: url.trim(),
        track_name: result.track.name,
        track_artist: result.track.artist,
        track_image: result.track.image,
        channels,
      })
      setSubmitted(data.submissions)
      if (balance !== null) setBalance(balance - channels.length)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to submit.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) return null

  if (!user) {
    return (
      <Layout>
        <SEO title="Pitch your music" />
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h2 style={{ fontWeight: 400 }}>Sign in to pitch your music</h2>
          <p style={{ color: '#999' }}>Submit your tracks directly to YouTube channel curators.</p>
          <Link to="/signin/" style={{ color: '#1DB954' }}>Sign in</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title="Pitch your music" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 400, margin: 0 }}>Pitch your music</h2>
        <div style={{ color: '#999', fontSize: 14 }}>
          Balance: <strong style={{ color: '#1DB954' }}>{balance ?? '...'}</strong> credits
          {' · '}
          <Link to="/wallet/" style={{ color: '#1DB954', fontSize: 13 }}>Buy more</Link>
        </div>
      </div>

      <p style={{ color: '#666', marginBottom: 30 }}>
        Paste a Spotify track link, select channels, and submit. Curators have 7 days to respond.
        No response = credits refunded.
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <TextField
          fullWidth variant="outlined" size="small"
          placeholder="https://open.spotify.com/track/..."
          value={url} onChange={e => setUrl(e.target.value)} disabled={loading}
        />
        <Button type="submit" variant="contained" disabled={loading || !url.trim()}
          sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', whiteSpace: 'nowrap', px: 3 }}>
          Find channels
        </Button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ justifyContent: 'center' }} />
          <p style={{ color: '#999', marginTop: 15 }}>Analyzing your track...</p>
        </div>
      )}

      {error && <p style={{ color: '#d32f2f', marginBottom: 20 }}>{error}</p>}

      {submitted && (
        <div style={{ padding: 25, background: '#f0faf4', borderRadius: 8, marginBottom: 30, textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>
            Submitted to {submitted.length} channel{submitted.length !== 1 ? 's' : ''}!
          </p>
          <p style={{ color: '#666', marginBottom: 0 }}>
            Curators have 7 days to respond. You'll get a refund for any that don't.
          </p>
        </div>
      )}

      {result && !submitted && (
        <>
          {/* Track card */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 20, background: '#f9f9f9', borderRadius: 8, marginBottom: 30 }}>
            {result.track.image && (
              <img src={result.track.image} alt={result.track.name} style={{ width: 80, height: 80, borderRadius: 4, filter: 'none' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{result.track.name}</div>
              <div style={{ color: '#666', marginBottom: 8 }}>{result.track.artist}</div>
              <div>
                {result.track.genres.map(g => (
                  <Chip key={g} size="small" label={g} className="chip-mui-selected" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </div>
            </div>
          </div>

          {result.matches.length > 0 ? (
            <>
              <h4>{result.matches.length} matching channel{result.matches.length !== 1 ? 's' : ''}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {result.matches.map(match => (
                  <div key={match.channel_id} style={{
                    display: 'flex', alignItems: 'center', gap: 15, padding: 15,
                    border: '1px solid #eee', borderRadius: 8,
                    background: selectedChannels.has(match.channel_id) ? '#f0faf4' : 'white',
                  }}>
                    <Checkbox
                      checked={selectedChannels.has(match.channel_id)}
                      onChange={() => toggleChannel(match.channel_id)}
                      sx={{ '&.Mui-checked': { color: '#1DB954' } }}
                    />
                    {match.thumbnail && (
                      <img src={match.thumbnail} alt={match.channel_name} style={{ width: 60, height: 60, borderRadius: 4, filter: 'none' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{match.channel_name}</span>
                        <span style={{ backgroundColor: '#1DB954', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>
                          {Math.round(match.score * 100)}%
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 6, fontFamily: 'Arial, sans-serif' }}>
                        <NumericFormat value={match.followers} displayType="text" thousandSeparator="," /> followers
                        {' · '}
                        <NumericFormat value={match.found_tracks} displayType="text" thousandSeparator="," /> tracks on Spotify
                      </div>
                      <div>
                        {(match.top_genres || []).map(g => (
                          <Chip key={g.name} size="small" label={g.name}
                            className={(match.matching_genres || []).includes(g.name) ? 'chip-mui-selected' : 'chip-mui'} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit button */}
              <div style={{ padding: 20, background: '#f9f9f9', borderRadius: 8, marginBottom: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {selectedChannels.size} channel{selectedChannels.size !== 1 ? 's' : ''} selected
                  </div>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    Cost: {selectedChannels.size} credit{selectedChannels.size !== 1 ? 's' : ''}
                    {balance !== null && selectedChannels.size > balance && (
                      <span style={{ color: '#d32f2f' }}>
                        {' '}(need {selectedChannels.size - balance} more — <Link to="/wallet/" style={{ color: '#1DB954' }}>buy credits</Link>)
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="contained"
                  disabled={selectedChannels.size === 0 || submitting || (balance !== null && selectedChannels.size > balance)}
                  onClick={handleSubmit}
                  sx={{ backgroundColor: '#1DB954', '&:hover': { backgroundColor: '#1aa34a' }, textTransform: 'none', px: 4 }}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 30, color: '#666' }}>
              <p>No matching channels found for this track's genres.</p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
