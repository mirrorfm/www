import { useState } from 'react'
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

export default function SubmitPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set())
  const [email, setEmail] = useState('')
  const [interestSubmitted, setInterestSubmitted] = useState(false)
  const [interestError, setInterestError] = useState<string | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedChannels(new Set())
    setInterestSubmitted(false)

    try {
      const { data } = await api.post('submit/analyze', { url: url.trim() })
      setResult(data)
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => {
      const next = new Set(prev)
      if (next.has(channelId)) {
        next.delete(channelId)
      } else {
        next.add(channelId)
      }
      return next
    })
  }

  const handleInterest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || selectedChannels.size === 0) return

    setInterestError(null)
    try {
      await api.post('submit/interest', {
        email: email.trim(),
        track_url: url.trim(),
        channel_ids: Array.from(selectedChannels),
      })
      setInterestSubmitted(true)
    } catch {
      setInterestError('Failed to save. Please try again.')
    }
  }

  return (
    <Layout>
      <SEO title="Submit your music" />
      <Link style={{ float: 'right', textDecoration: 'none', fontSize: 30 }} to="/">&#8592;</Link>

      <h2>Find YouTube channels for your music</h2>
      <p style={{ color: '#666', marginBottom: 30 }}>
        Paste a Spotify track link to discover which of our 1,300+ curated YouTube music channels
        match your sound.
      </p>

      <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="https://open.spotify.com/track/..."
          value={url}
          onChange={e => setUrl(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !url.trim()}
          sx={{
            backgroundColor: '#1DB954',
            '&:hover': { backgroundColor: '#1aa34a' },
            textTransform: 'none',
            whiteSpace: 'nowrap',
            px: 3,
          }}
        >
          Find channels
        </Button>
      </form>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <GridLoader color="lightgrey" height={50} width={50} wrapperStyle={{ justifyContent: 'center' }} />
          <p style={{ color: '#999', marginTop: 15 }}>Analyzing your track...</p>
        </div>
      )}

      {error && (
        <p style={{ color: '#d32f2f', marginBottom: 20 }}>{error}</p>
      )}

      {result && (
        <>
          {/* Track card */}
          <div style={{
            display: 'flex',
            gap: 20,
            alignItems: 'center',
            padding: 20,
            background: '#262626',
            borderRadius: 8,
            marginBottom: 30,
          }}>
            {result.track.image && (
              <img
                src={result.track.image}
                alt={result.track.name}
                style={{ width: 80, height: 80, borderRadius: 4, filter: 'none' }}
              />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{result.track.name}</div>
              <div style={{ color: '#666', marginBottom: 8 }}>{result.track.artist}</div>
              <div>
                {result.track.genres.map(g => (
                  <Chip key={g} size="small" label={g} className="chip-mui-selected" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
                {result.track.genres.length === 0 && (
                  <span style={{ color: '#999', fontSize: 14 }}>No genre data available on Spotify for this artist</span>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {result.matches.length > 0 ? (
            <>
              <h4>{result.matches.length} matching channel{result.matches.length !== 1 ? 's' : ''}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
                {result.matches.map(match => (
                  <div
                    key={match.channel_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 15,
                      padding: 15,
                      border: '1px solid #333',
                      borderRadius: 8,
                      background: selectedChannels.has(match.channel_id) ? '#1a2e1a' : '#222',
                    }}
                  >
                    <Checkbox
                      checked={selectedChannels.has(match.channel_id)}
                      onChange={() => toggleChannel(match.channel_id)}
                      sx={{ '&.Mui-checked': { color: '#1DB954' } }}
                    />

                    {match.thumbnail && (
                      <img
                        src={match.thumbnail}
                        alt={match.channel_name}
                        style={{ width: 60, height: 60, borderRadius: 4, filter: 'none' }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{match.channel_name}</span>
                        <span style={{
                          backgroundColor: '#1DB954',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: 'Arial, sans-serif',
                        }}>
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
                          <Chip
                            key={g.name}
                            size="small"
                            label={g.name}
                            className={(match.matching_genres || []).includes(g.name) ? 'chip-mui-selected' : 'chip-mui'}
                          />
                        ))}
                      </div>
                    </div>

                    {match.playlist_id && (
                      <a
                        href={`https://open.spotify.com/playlist/${match.playlist_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13, color: '#1DB954', whiteSpace: 'nowrap' }}
                      >
                        Playlist &#8599;
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Email capture */}
              {!interestSubmitted ? (
                <div style={{
                  padding: 25,
                  background: '#262626',
                  borderRadius: 8,
                  marginBottom: 30,
                }}>
                  <h4 style={{ marginBottom: 10 }}>Get notified when submissions open</h4>
                  <p style={{ color: '#666', fontSize: 15, marginBottom: 15 }}>
                    Select the channels you're interested in above, and we'll let you know
                    when you can submit your music directly.
                  </p>
                  <form onSubmit={handleInterest} style={{ display: 'flex', gap: 10 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!email.trim() || selectedChannels.size === 0}
                      sx={{
                        backgroundColor: '#1DB954',
                        '&:hover': { backgroundColor: '#1aa34a' },
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        px: 3,
                      }}
                    >
                      Notify me
                    </Button>
                  </form>
                  {selectedChannels.size === 0 && (
                    <p style={{ color: '#999', fontSize: 13, marginTop: 8, marginBottom: 0 }}>
                      Check at least one channel above to continue.
                    </p>
                  )}
                  {interestError && (
                    <p style={{ color: '#d32f2f', fontSize: 13, marginTop: 8, marginBottom: 0 }}>{interestError}</p>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: 25,
                  background: '#1a2e1a',
                  borderRadius: 8,
                  marginBottom: 30,
                  textAlign: 'center',
                }}>
                  <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>
                    Thanks! We'll notify you when submissions open.
                  </p>
                  <p style={{ color: '#666', marginBottom: 0 }}>
                    {selectedChannels.size} channel{selectedChannels.size !== 1 ? 's' : ''} saved.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 30, color: '#666' }}>
              <p>No matching channels found for this track's genres.</p>
              <p style={{ fontSize: 14 }}>
                This can happen if the artist has no genre data on Spotify,
                or if their genres don't overlap with any of our indexed channels.
              </p>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
