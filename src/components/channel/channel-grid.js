import PropTypes from "prop-types"
import React from "react"
import {useTheme, withStyles} from "@material-ui/core/styles";
import Thumbnail from "./channel-thumbnail"

const styles = theme => ({
  root: {
    columnGap: 20,
    marginLeft: 0,
    listStyleType: `none`,
    [useTheme().breakpoints.up('lg')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('md')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('sm')]: {
      columns: 3,
    },
    [useTheme().breakpoints.down('xs')]: {
      columns: 2,
    },
  },
});

function ChannelGrid(props) {
  let { classes, channels, category, selectedGenres = [] } = props;

  let selectedGenresArr = selectedGenres.map(g => g.genre)
  return (
    <ul className={classes.root}>
      {channels.map((c, index) => (
        (selectedGenresArr.length === 0 || (c.genres ? c.genres : []).map(t => t.name).some(g => selectedGenresArr.includes(g))) ? (
          <li style={{
            WebkitColumnBreakInside: `avoid`,
            pageBreakInside: `avoid`,
            breakInside: `avoid`
          }} key={index}>
            <Thumbnail channel={c}
                       channels={channels}
                       category={category}
                       selectedGenresArr={selectedGenresArr}/>
          </li>
        ) : (
          <></>
        )
      ))}
    </ul>
  )
}

ChannelGrid.propTypes = {
  channels: PropTypes.array,
  classes: PropTypes.object.isRequired,
}

ChannelGrid.defaultProps = {
  channels: []
}

export default withStyles(styles)(ChannelGrid);
