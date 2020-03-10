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
      <LazyLoadImage
          alt={channel.channel_name}
          height={channel.thumbnails.medium.height}
          src={channel.thumbnails.medium.url}
          width={channel.thumbnails.medium.width} />
      {/*<div className="content content-top">*/}
      {/*  <a href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>*/}
      {/*</div>*/}
      {/*<div className="content content-top">*/}
      {/*  <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${channel.spotify_playlist_id}`}>*/}
      {/*    {Math.round(channel.found_tracks * 100 / channel.count_tracks)}%*/}
      {/*  </a>*/}
      {/*</div>*/}
      <div style={{ height: `130px` }}>
        <Typography>
          {generate(channel.genres).map(([label, count]) =>
              <Chip
                  avatar={<Avatar>{count}</Avatar>}
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
