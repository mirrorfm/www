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
  let { classes, channels, category } = props;

  if (channels.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>No channels found.</p>
  }
  return (
    <ul className={classes.root}>
      {channels.map((c, index) => (
        <li style={{
          WebkitColumnBreakInside: `avoid`,
          pageBreakInside: `avoid`,
          breakInside: `avoid`
        }} key={index}>
          <Thumbnail channel={c}
                     channels={channels}
                     category={category}/>
        </li>
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
