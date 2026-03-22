import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Chip from '@mui/material/Chip'
import slugify from 'react-slugify'
import moment from 'moment'
import ytLogo from '../../assets/yt-logo.png'

let touched = false

interface ChannelThumbnailProps {
  channel: any
  channels?: any[]
  category?: string
  selectedGenresArr?: string[]
}

export default function ChannelThumbnail({ channel, channels, category, selectedGenresArr }: ChannelThumbnailProps) {
  const [hovering, setHovering] = useState(false)

  let sortDiv: React.ReactNode = null
  switch (category) {
    case 'lastUpdated':
      sortDiv = <div>Updated {moment(channel.last_found_time).fromNow()}</div>
      break
    case 'mostFollowed':
      sortDiv = <div>{channel.count_followers} followers</div>
      break
    case 'mostUploads':
      sortDiv = <div>{channel.count_tracks} YouTube uploads</div>
      break
    case 'rarestUploads':
      sortDiv = <div>{(channel.found_tracks * 100 / channel.count_tracks).toFixed(2)}% found</div>
      break
    case 'lastTerminated':
      sortDiv = <div>Terminated {moment(channel.terminated_datetime.Time).fromNow()}</div>
      break
    case 'recentlyAdded':
      sortDiv = <div>Submitted {moment(channel.added_datetime.Time).fromNow()}</div>
      break
  }

  const channelName = channel.channel_name || channel.channel?.channel_name
  const thumbnail = channel.thumbnail_medium?.Valid ? channel.thumbnail_medium.String : ''
  let genres = channel.genres || channel.channel?.genres || []
  genres = genres.slice(0, 6)

  return (
    <div className="container">
      <div style={{ height: '100%', width: '100%' }}>
        <Link
          data-testid="channel"
          to={`/youtube/${channel.channel_id}/${slugify(channelName)}/`}
          state={{ modal: true, channels, channel }}
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
          <LazyLoadImage alt={channelName} src={thumbnail} height="240" width="240" />
          <div style={{
            paddingTop: 5,
            fontWeight: 700,
            fontSize: 15,
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <img alt="Youtube logo" height="20" src={ytLogo} width="20" /> {channelName}
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
