import React from "react"
import Chip from "@material-ui/core/Chip";
import Avatar from '@material-ui/core/Avatar';
import {useTheme, withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Loader from 'react-loader-spinner'

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

function LabelDetail(props) {
  const { classes, label } = props;

  let {
    label_id,
    playlist_id,
    label_name,
    found_tracks,
    count_tracks,
    genres
  } = label

  const found_ratio = Math.round(found_tracks * 100 / count_tracks)
  genres = genres || [];
  let primary_genres = genres.slice(0, 4)
  let secondary_genres = genres.slice(4)

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={classes.root}>
      {playlist_id ? (
          <>
            <h4>{label_name} <a href={`https://discogs.com/label/${label_id}`}>Discogs</a> label</h4>
            <iframe src={`https://open.spotify.com/embed/playlist/${playlist_id}`}
                    className={classes.frame} frameBorder="0" allow="encrypted-media"/>
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
          </>
        ) :
        <Loader
          type="Grid"
          color="lightgrey"
          height={50}
          width={50}
          timeout={9000}
          style={{ textAlign: "center" }}
        />
      }
    </div>
  )
}

LabelDetail.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LabelDetail);
