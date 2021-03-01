import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'
import slugify from 'react-slugify';
import Moment from 'react-moment';

let touched = false

class Thumbnail extends React.Component {
  static propTypes = {
    channel: PropTypes.shape({
      channel_id: PropTypes.string.isRequired,
    }).isRequired,
  }

  constructor() {
    super()
    this.state = {
      hovering: false,
    }
  }

  render() {
    const channel = this.props.channel
    const category = this.props.category

    let sortDiv;
    switch(category) {
      case "lastUpdated":
        sortDiv = (
          <div>Updated <Moment fromNow>{channel.last_found_time}</Moment></div>
        )
        break;
      case "mostFollowed":
        sortDiv = (
          <div>{channel.count_followers} followers</div>
        )
        break;
      case "mostUploads":
        sortDiv = (
          <div>{channel.count_tracks} YouTube uploads</div>
        )
        break;
      case "rarestUploads":
        sortDiv = (
          <div>{(channel.count_tracks / channel.found_tracks).toFixed(2)}% found</div>
        )
        break;
      case "lastTerminated":
        sortDiv = (
          <div>Terminated <Moment fromNow>{channel.terminated_datetime.Time}</Moment></div>
        )
        break;
      case "recentlyAdded":
        sortDiv = (
          <div>Submitted <Moment fromNow>{channel.added_datetime.Time}</Moment></div>
        )
        break;
    }
    const channelName = channel.channel_name || channel.channel.channel_name;
    const thumbnail = channel.thumbnail_medium || channel.channel.thumbnail_medium;
    let genres = channel.genres || (channel.channel ? channel.channel.genres : []) || [];
    genres = genres.slice(0, 6);
    return (
      <div className="container">
        <div style={{height: `100%`, width: `100%`}}>
          <Link
            data-testid="channel"
            to={`/youtube/${channel.channel_id}/${slugify(channelName)}/`}
            state={{
              modal: true,
              channels: this.props.channels,
              channel
            }}
            onTouchStart={() => (touched = true)}
            onMouseEnter={() => {
              if (!touched) {
                this.setState({hovering: true})
              }
            }}
            onMouseLeave={() => {
              if (!touched) {
                this.setState({hovering: false})
              }
            }}
            css={{
              display: `block`,
              flex: `1 0 0%`,
              width: `100%`,
              maxWidth: 290.1,
              position: `relative`,
              ":last-child": {
                marginRight: 0,
              }
            }}
            style={{
              textDecoration: `none`
            }}
          >
            <LazyLoadImage
              alt={channelName}
              height="240"
              src={thumbnail}
              width="240"
            />
            <div style={{
              paddingTop: `5px`,
              fontWeight: 700,
              fontSize: 15,
              display: `block`,
              whiteSpace: `nowrap`,
              overflow: `hidden`,
              textOverflow: `ellipsis`
            }}>{channelName}</div>
          </Link>
        </div>
        <div style={{ fontFamily: `Arial`, fontVariant: `small-caps`, textTransform: `uppercase`, fontSize: 12 }}>{sortDiv}</div>
        <div style={{ height: `140px` }}>
          {genres.map((g) =>
            <Chip
              key={g.name}
              size="small"
              label={g.name}
              className="chip-mui"
            />
          )}
        </div>
      </div>
    )
  }
}

export default Thumbnail
