import PropTypes from "prop-types"
import React from "react"
import {useTheme, withStyles} from "@material-ui/core/styles";
import Thumbnail from "./label-thumbnail"

const styles = () => ({
  root: {
    columnGap: 20,
    marginLeft: 0,
    listStyleType: `none`,
    [useTheme().breakpoints.up('lg')]: {
      columns: 6,
    },
    [useTheme().breakpoints.down('md')]: {
      columns: 4,
    },
    [useTheme().breakpoints.down('sm')]: {
      columns: 2,
    },
    [useTheme().breakpoints.down('xs')]: {
      columns: 2,
      columnGap: 5,
      columnWidth: 0,
    },
  },
});

function Grid(props) {
  let { classes, labels, category, selectedGenres = [] } = props;

  let selectedGenresArr = selectedGenres.map(g => g.genre)
  return (
    <ul className={classes.root}>
      {labels.map((c, index) => (
        (selectedGenresArr.length === 0 || (c.genres ? c.genres : []).map(t => t.name).some(g => selectedGenresArr.includes(g))) ? (
          <li style={{
            marginBottom: `20px`,
            WebkitColumnBreakInside: `avoid`,
            pageBreakInside: `avoid`,
            breakInside: `avoid`
          }} key={index}>
            <Thumbnail label={c}
                       labels={labels}
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

Grid.propTypes = {
  labels: PropTypes.array,
  classes: PropTypes.object.isRequired,
}

Grid.defaultProps = {
  labels: []
}

export default withStyles(styles)(Grid);
