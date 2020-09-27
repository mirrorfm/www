import React from "react"
import Chip from "@material-ui/core/Chip";
import Avatar from '@material-ui/core/Avatar';
import {useTheme, withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
  frame: {
    height: 380,
    width: `100%`
  },
  root: {
    textAlign: `center`,
    backgroundColor: `white`,
    margin: `0 auto`,
    padding: `30px`,
    [useTheme().breakpoints.up('md')]: {
      width: 700,
    },
    [useTheme().breakpoints.down('sm')]: {
      width: 500,
    },
    [useTheme().breakpoints.down('xs')]: {
      width: 310,
      padding: `20px 0`
    },
  }
});

function ChannelDetail(props) {
  const { classes, channel } = props;
  let {
    playlist_id,
    upload_playlist_id,
    channel_name,
    found_tracks,
    count_tracks,
    genres
  } = channel

  const found_ratio = Math.round(found_tracks * 100 / count_tracks)
  genres = genres || [];
  let primary_genres = genres.slice(0, 4)
  let secondary_genres = genres.slice(4)

  return (
    <div className={classes.root}>
      <h4>{channel_name} <a href={`https://youtube.com/playlist?list=${upload_playlist_id}`}>YouTube</a> channel</h4>
      {playlist_id ? (
          <iframe src={`https://open.spotify.com/embed/playlist/${playlist_id}`}
                  className={classes.frame} frameBorder="0" allow="encrypted-media"></iframe>
      ) : <p>Loading playlist...</p>
      }
      <p>
        {found_ratio}% found on <a href={`https://open.spotify.com/embed/playlist/${playlist_id}`}>Spotify</a> • {found_tracks} tracks
      </p>
      <p>
        {primary_genres.map((g) =>
          <Chip
            key={g.name}
            label={g.name}
            className="chip-mui"
            style={{ margin: `2px` }}
            avatar={<Avatar>{g.count}</Avatar>}
          />
        )}
      </p>
      <p>
        {secondary_genres.map((g) =>
          <Chip
            key={g.name}
            avatar={<Avatar>{g.count}</Avatar>}
            size="small"
            className="chip-mui"
            label={g.name}
            style={{ margin: `2px` }}
          />
        )}
      </p>
    </div>
  )
}

ChannelDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ChannelDetail);
