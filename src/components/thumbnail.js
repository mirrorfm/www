import PropTypes from "prop-types"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";
import Chip from "@material-ui/core/Chip";
import { Link } from 'gatsby'

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
            to={`/${channel.channel_id}/`}
            state={{
              modal: true
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
                height={channel.thumbnails.medium.height}
                src={channel.thumbnails.medium.url}
                width={channel.thumbnails.medium.width}/>
          </Link>
        </div>


        {/*<Modal*/}
        {/*    open={open}*/}
        {/*    onClose={handleClose}*/}
        {/*    aria-labelledby="simple-modal-title"*/}
        {/*    aria-describedby="simple-modal-description"*/}
        {/*>*/}
        {/*  <div>*/}
        {/*    <a href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>*/}
        {/*    <a href={`https://open.spotify.com/playlist/${channel.spotify_playlist_id}`}>*/}
        {/*      {Math.round(channel.found_tracks * 100 / channel.count_tracks)}%*/}
        {/*    </a>*/}
        {/*    <iframe src={`https://open.spotify.com/embed/playlist/${channel.spotify_playlist_id}`} width="100%" height="680"*/}
        {/*            frameBorder="0" allow="encrypted-media"></iframe>*/}
        {/*  </div>*/}
        {/*</Modal>*/}
        <div style={{height: `170px`}}>
          <a style={{
            paddingTop: `7px`,
            paddingBottom: `5px`,
            paddingLeft: `5px`,
            fontWeight: 700,
            textDecoration: `none`,
            display: `block`,
            whiteSpace: `nowrap`,
            overflow: `hidden`,
            textOverflow: `ellipsis`
          }} href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>
          {generate(channel.genres).map(([label, count]) =>
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
