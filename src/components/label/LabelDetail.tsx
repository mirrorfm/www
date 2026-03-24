import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Loader from '../Loader'

interface LabelDetailProps {
  label: any
}

export default function LabelDetail({ label }: LabelDetailProps) {
  let { label_id, playlist_id, label_name, found_tracks, count_tracks, genres } = label

  const found_ratio = Math.round(found_tracks * 100 / count_tracks)
  genres = genres || []
  const primary_genres = genres.slice(0, 4)
  const secondary_genres = genres.slice(4)

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        textAlign: 'center',
        backgroundColor: '#222',
        margin: '0 auto',
        padding: '30px',
        width: { xs: 310, sm: 500, md: 700 },
        px: { xs: 0, sm: '30px' },
      }}
    >
      {playlist_id ? (
        <>
          <h4>{label_name} <a href={`https://discogs.com/label/${label_id}`}>Discogs</a> label</h4>
          <iframe
            src={`https://open.spotify.com/embed/playlist/${playlist_id}`}
            style={{ height: 380, width: '100%' }}
            frameBorder="0"
            allow="encrypted-media"
            title="Spotify playlist"
          />
          <p>
            {found_ratio}% found on <a href={`https://open.spotify.com/embed/playlist/${playlist_id}`}>Spotify</a> • {found_tracks} tracks
          </p>
          <p>
            {primary_genres.map((g: any) => (
              <Chip key={g.name} label={g.name} className="chip-mui" style={{ margin: 2 }} avatar={<Avatar>{g.count}</Avatar>} />
            ))}
          </p>
          <p>
            {secondary_genres.map((g: any) => (
              <Chip key={g.name} avatar={<Avatar>{g.count}</Avatar>} size="small" className="chip-mui" label={g.name} style={{ margin: 2 }} />
            ))}
          </p>
        </>
      ) : (
        <Loader />
      )}
    </Box>
  )
}
