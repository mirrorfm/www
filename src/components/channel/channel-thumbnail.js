import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import {useTheme, withStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'
import slugify from 'react-slugify';
import Moment from 'react-moment';

import { StaticImage } from "gatsby-plugin-image"

const styles = () => ({
  root: {
    columnGap: 20,
    marginLeft: 0,
    listStyleType: `none`,
    [useTheme().breakpoints.up('lg')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('md')]: {
      columns: 5,
    },
    [useTheme().breakpoints.down('sm')]: {
      columns: 4,
    },
    [useTheme().breakpoints.down('xs')]: {
      columns: 2,
    },
  },
});

let touched = false

class ChannelThumbnail extends React.Component {
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
    const { channel, category, selectedGenresArr } = this.props

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
          <div>{(channel.found_tracks * 100 / channel.count_tracks).toFixed(2)}% found</div>
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
    const thumbnail = channel.thumbnail_medium.Valid ? channel.thumbnail_medium.String : "";
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
              src={thumbnail}
              height="240"
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
            }}>
              <StaticImage
                alt="Youtube logo"
                height="20"
                src={'../../images/yt-logo.png'}
                width="20"
              /> {channelName}
            </div>
          </Link>
        </div>
        <div style={{ fontFamily: `Arial`, fontVariant: `small-caps`, textTransform: `uppercase`, fontSize: 12 }}>{sortDiv}</div>
        <div style={{ height: `140px` }}>
          {genres.map((g) =>
            <Chip
              key={g.name}
              size="small"
              label={g.name}
              className={selectedGenresArr.includes(g.name) ? "chip-mui-selected" : "chip-mui"}
            />
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ChannelThumbnail);
