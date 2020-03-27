import PropTypes from "prop-types"
import React from "react"
import {useTheme, withStyles} from "@material-ui/core/styles";
import Thumbnail from "../components/thumbnail"

const styles = theme => ({
  root: {
    columnGap: 20,
    marginLeft: 0,
    listStyleType: `none`,
    [useTheme().breakpoints.up('lg')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('md')]: {
      columns: 5,
    },
    [useTheme().breakpoints.down('sm')]: {
      columns: 4,
    },
    [useTheme().breakpoints.down('xs')]: {
      columns: 2,
    },
  },
});

function Grid(props) {
  const {classes} = props;
  const channels = props.channels.slice(0, 96);
  return (
    <ul className={classes.root}>
      {channels.map((c, index) => (
        <li style={{
          marginBottom: `20px`,
          webkitColumnBreakInside: `avoid`,
          pageBreakInside: `avoid`,
          breakInside: `avoid`
        }} key={index}>
          <Thumbnail channel={c}/>
        </li>
      ))}
    </ul>
  )
}

Grid.propTypes = {
  channels: PropTypes.object,
  classes: PropTypes.object.isRequired,
}

Grid.defaultProps = {
  channels: {}
}

export default withStyles(styles)(Grid);