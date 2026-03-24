import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@mui/material/Chip'
import slugify from 'react-slugify'
import moment from 'moment'
import { FaYoutube } from 'react-icons/fa'
import { SiDiscogs } from 'react-icons/si'
import whiteBg from '../../assets/white-bg.png'

let touched = false

export type SourceType = 'youtube' | 'discogs'

export interface SourceItem {
  source: SourceType
  // YouTube fields
  channel_id?: string
  channel_name?: string
  // Discogs fields
  label_id?: number
  label_name?: string
  // Shared fields
  thumbnail_medium?: { Valid: boolean; String: string }
  genres?: { name: string }[]
  count_tracks?: number
  found_tracks?: number
  count_followers?: number
  last_found_time?: string
  added_datetime?: { Time: string }
  terminated_datetime?: { Time: string }
  channel?: any
  label?: any
}

interface SourceThumbnailProps {
  item: SourceItem
  items?: SourceItem[]
  category?: string
  selectedGenresArr?: string[]
}

export default function SourceThumbnail({ item, items, category, selectedGenresArr }: SourceThumbnailProps) {
  const [imgError, setImgError] = useState(false)
  const [hovering, setHovering] = useState(false)

  const isYoutube = item.source === 'youtube'
  const name = isYoutube
    ? (item.channel_name || item.channel?.channel_name)
    : (item.label_name || item.label?.label_name)
  const id = isYoutube ? item.channel_id : item.label_id
  const detailPath = isYoutube
    ? `/youtube/${id}/${slugify(name)}/`
    : `/discogs/${id}/${slugify(name)}/`

  const thumbnail = item.thumbnail_medium?.Valid ? item.thumbnail_medium.String : undefined
  let genres = item.genres || (isYoutube ? item.channel?.genres : item.label?.genres) || []
  genres = genres.slice(0, 2)

  let sortDiv: React.ReactNode = null
  switch (category) {
    case 'lastUpdated':
      sortDiv = <div>Updated {moment(item.last_found_time).fromNow()}</div>
      break
    case 'mostFollowed':
      sortDiv = <div>{item.count_followers} followers</div>
      break
    case 'mostUploads':
      sortDiv = <div>{item.count_tracks} tracks</div>
      break
    case 'rarestUploads':
      sortDiv = item.count_tracks ? <div>{((item.found_tracks || 0) * 100 / item.count_tracks).toFixed(1)}% found</div> : null
      break
    case 'lastTerminated':
      sortDiv = item.terminated_datetime ? <div>Archived {moment(item.terminated_datetime.Time).fromNow()}</div> : null
      break
    case 'recentlyAdded':
      sortDiv = item.added_datetime ? <div>Added {moment(item.added_datetime.Time).fromNow()}</div> : null
      break
  }

  // Build modal state depending on source type
  const linkState = isYoutube
    ? { modal: true, channels: items, channel: item }
    : { modal: true, labels: items, label: item }

  return (
    <div
      className="container"
      onMouseEnter={() => { if (!touched) setHovering(true) }}
      onMouseLeave={() => { if (!touched) setHovering(false) }}
      style={{
        padding: 10,
        borderRadius: 8,
        backgroundColor: hovering ? '#2a2a2a' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      <Link
        data-testid={isYoutube ? 'channel' : 'label'}
        to={detailPath}
        state={linkState}
        onTouchStart={() => { touched = true }}
        style={{
          display: 'block',
          width: '100%',
          position: 'relative',
          textDecoration: 'none',
        }}
      >
        <div className={isYoutube ? undefined : 'label'} style={{ position: 'relative' }}>
          {thumbnail && !imgError ? (
            <LazyLoadImage alt={name} src={thumbnail} height="240" width="240" style={{ width: '100%', height: 'auto' }} onError={() => setImgError(true)} />
          ) : (
            <img alt={name} src={whiteBg} height="240" width="240" style={{ width: '100%', height: 'auto' }} />
          )}
          <div style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#1DB954',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovering ? 1 : 0,
            transform: hovering ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}>
            <span style={{ color: '#000', fontSize: 18, marginLeft: 2 }}>&#9654;</span>
          </div>
        </div>
        <div style={{
          paddingTop: 8,
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {isYoutube ? <FaYoutube size={12} color="#999" style={{ flexShrink: 0 }} /> : <SiDiscogs size={12} color="#999" style={{ flexShrink: 0 }} />}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
        </div>
      </Link>
      {sortDiv && (
        <div style={{ fontFamily: 'Arial', fontVariant: 'small-caps', textTransform: 'uppercase', fontSize: 11, color: '#999' }}>{sortDiv}</div>
      )}
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', marginTop: 2, marginBottom: 4, transition: 'filter 0.2s ease', filter: hovering ? 'brightness(1.6)' : 'none' }}>
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
