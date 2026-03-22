import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@mui/material/Chip'
import slugify from 'react-slugify'
import moment from 'moment'
import dgLogo from '../../assets/dg-logo.png'
import whiteBg from '../../assets/white-bg.png'

let touched = false

interface LabelThumbnailProps {
  label: any
  labels?: any[]
  category?: string
  selectedGenresArr?: string[]
}

export default function LabelThumbnail({ label, labels, category, selectedGenresArr }: LabelThumbnailProps) {
  const [hovering, setHovering] = useState(false)

  let sortDiv: React.ReactNode = null
  switch (category) {
    case 'lastUpdated':
      sortDiv = <div>Updated {moment(label.last_found_time).fromNow()}</div>
      break
    case 'mostFollowed':
      sortDiv = <div>{label.count_followers} followers</div>
      break
    case 'mostUploads':
      sortDiv = <div>{label.count_tracks} YouTube uploads</div>
      break
    case 'rarestUploads':
      sortDiv = <div>{(label.found_tracks * 100 / label.count_tracks).toFixed(2)}% found</div>
      break
    case 'lastTerminated':
      sortDiv = <div>Archived {moment(label.terminated_datetime.Time).fromNow()}</div>
      break
    case 'recentlyAdded':
      sortDiv = <div>Submitted {moment(label.added_datetime.Time).fromNow()}</div>
      break
  }

  const labelName = label.label_name || label.label?.label_name
  const thumbnail = label.thumbnail_medium?.Valid ? label.thumbnail_medium.String : undefined
  const [imgError, setImgError] = useState(false)
  let genres = label.genres || label.label?.genres || []
  genres = genres.slice(0, 6)

  return (
    <div className="container">
      <div style={{ height: '100%', width: '100%' }}>
        <Link
          data-testid="label"
          to={`/discogs/${label.label_id}/${slugify(labelName)}/`}
          state={{ modal: true, labels, label }}
          onTouchStart={() => { touched = true }}
          onMouseEnter={() => { if (!touched) setHovering(true) }}
          onMouseLeave={() => { if (!touched) setHovering(false) }}
          style={{
            display: 'block',
            flex: '1 0 0%',
            width: '100%',
            maxWidth: 290.1,
            position: 'relative',
            textDecoration: 'none',
          }}
        >
          <div className="label">
            {thumbnail && !imgError ? (
              <LazyLoadImage alt={labelName} height="240" src={thumbnail} width="240" onError={() => setImgError(true)} />
            ) : (
              <img alt={labelName} height="240" src={whiteBg} width="240" />
            )}
          </div>
          <div style={{
            paddingTop: 5,
            fontWeight: 700,
            fontSize: 15,
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <img width="20" height="20" alt="Discogs logo" src={dgLogo} /> {labelName}
          </div>
        </Link>
      </div>
      <div style={{ fontFamily: 'Arial', fontVariant: 'small-caps', textTransform: 'uppercase', fontSize: 12 }}>{sortDiv}</div>
      <div style={{ height: 140 }}>
        {genres.map((g: any) => (
          <Chip
            key={g.name}
            size="small"
            label={g.name}
            className={(selectedGenresArr || []).includes(g.name) ? 'chip-mui-selected' : 'chip-mui'}
          />
        ))}
      </div>
    </div>
  )
}
