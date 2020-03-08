import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import {LazyLoadImage} from "react-lazy-load-image-component";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import {makeStyles} from "@material-ui/core/styles";

function generate(genres) {
  return Object.entries((genres || {}))
      .sort((a, b) => (b[1] - a[1]))
      .slice(0, 4);
}

const classes = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

const Thumbnail = ({ channel }) => (
    <div className="container">
      <LazyLoadImage
          alt={channel.channel_name}
          height={channel.thumbnails.medium.height}
          src={channel.thumbnails.medium.url}
          width={channel.thumbnails.medium.width} />
      <div style={{ height: `200px`}}>
        <div style={{ whiteSpace: `nowrap`, overflow: `hidden`, height: `20px`, fontSize: `12px` }}>
          <a href={`https://youtube.com/playlist?list=${channel.upload_playlist_id}`}>{channel.channel_name}</a>
          <a style={{float: `right`}} href={`https://open.spotify.com/playlist/${channel.spotify_playlist_id}`}>
            {Math.round(channel.found_tracks * 100 / channel.count_tracks)}%
          </a>
        </div>
        <Typography>
          <div className={classes.root}>
            {generate(channel.genres).map(([label, count]) =>
                <Chip
                    avatar={<Avatar>{count}</Avatar>}
                    key={label}
                    size="small"
                    label={label}
                    style={{ margin: `2px` }}
                />
            )}
          </div>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <NumberFormat value={channel.count_tracks} displayType={'text'} thousandSeparator={true} /> tracks
        </Typography>
        <Typography variant="body2" gutterBottom color="textSecondary">
          Updated <Moment fromNow unix>{channel.last_found_time}</Moment> • {channel.count_followers} followers
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
