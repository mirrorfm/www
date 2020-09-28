import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'
import slugify from 'react-slugify';

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
    const channelName = channel.channel_name || channel.channel.channel_name;
    const thumbnail = channel.thumbnail_default || channel.channel.thumbnail_default;
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
              },
            }}
          >
            <LazyLoadImage
              alt={channelName}
              height="240"
              src={thumbnail}
              width="240" />
            <div style={{
              paddingTop: `7px`,
              paddingBottom: `5px`,
              paddingLeft: `5px`,
              fontWeight: 700,
              textDecoration: `none`,
              display: `block`,
              whiteSpace: `nowrap`,
              overflow: `hidden`,
              textOverflow: `ellipsis`
            }}>{channelName}</div>
          </Link>
        </div>
        <div style={{ height: `80px` }}>
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
