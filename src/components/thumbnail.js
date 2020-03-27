import PropTypes from "prop-types"
import React from "react"
import {LazyLoadImage} from "react-lazy-load-image-component";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

function generate(genres) {
  return Object.entries((genres || {}))
      .sort((a, b) => (b[1] - a[1]))
      .slice(0, 4);
}

const Thumbnail = ({ channel }) => (
    <div className="container">
      <div style={{ height: `100%%`, width: `100%` }}>
        <LazyLoadImage
          alt={channel.channel_name}
          height={channel.thumbnails.medium.height}
          src={channel.thumbnails.medium.url}
          width={channel.thumbnails.medium.width} />
      </div>
      {/*<div className="content content-top">*/}
      {/*  <a href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>*/}
      {/*</div>*/}
      {/*<div className="content content-top">*/}
      {/*  <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${channel.spotify_playlist_id}`}>*/}
      {/*    {Math.round(channel.found_tracks * 100 / channel.count_tracks)}%*/}
      {/*  </a>*/}
      {/*</div>*/}
      <div style={{ height: `170px` }}>
        <a style={{ paddingTop: `7px`, paddingBottom: `5px`, paddingLeft: `5px`, fontWeight: 700, textDecoration: `none`, display: `block`, whiteSpace: `nowrap`, overflow: `hidden`, textOverflow: `ellipsis` }} href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>
        <Typography>
          {generate(channel.genres).map(([label, count]) =>
            <Chip
              key={label}
              size="small"
              label={label}
              className="chip-mui"
            />
          )}
        </Typography>
      </div>
    </div>
)

Thumbnail.propTypes = {
  channel: PropTypes.object,
}

Thumbnail.defaultProps = {
  channel: {
    count_followers: 0,
    last_found_time: null
  },
}

export default Thumbnail
