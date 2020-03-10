import PropTypes from "prop-types"
import React from "react"
import {useTheme} from "@material-ui/core/styles";
import Thumbnail from "../components/thumbnail"

const Grid = ({ channels }) => (
    <ul style={{
      flexDirection: `row`,
      columnGap: 20,
      listStyleType: `none`,
      marginLeft: 0,
      [useTheme().breakpoints.up('lg')]: {
        columns: 6,
      },
      [useTheme().breakpoints.up('lg')]: {
        columns: 5,
      },
      [useTheme().breakpoints.up('md')]: {
        columns: 4,
      },
      [useTheme().breakpoints.up('sm')]: {
        columns: 3,
      },
      [useTheme().breakpoints.down('sm')]: {
        columns: 2,
      },
      columns: 5,
    }}>
      {channels.map((c, index) => (
        <li style={{ marginBottom: `20px` }} key={index}>
          <Thumbnail channel={c} />
        </li>
      ))}
    </ul>
)

Grid.propTypes = {
  channel: PropTypes.object,
}

Grid.defaultProps = {
  channels: {}
}

export default Grid
