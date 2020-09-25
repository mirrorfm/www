import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'
import slugify from 'react-slugify';

function generate(genres) {
  return Object.entries((genres || {}))
    .sort((a, b) => (b[1] - a[1]))
    .slice(0, 4);
}

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
    return (
      <div className="container">
        <div style={{height: `100%`, width: `100%`}}>
          <Link
            data-testid="channel"
            to={`/youtube/${channel.channel_id}/${slugify(channel.channel_name)}/`}
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
              alt={channel.channel_name}
              height="240"
              src={channel.thumbnail_default}
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
            }}>{channel.channel_name}</div>
          </Link>
        </div>
        <div style={{ height: `140px` }}>
          {generate(channel.genres).map(([label]) =>
            <Chip
                key={label}
                size="small"
                label={label}
                className="chip-mui"
            />
          )}
        </div>
      </div>
    )
  }
}

export default Thumbnail
