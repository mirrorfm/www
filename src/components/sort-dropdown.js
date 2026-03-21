import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

class SortDropdown extends React.Component {
  render() {
    const { sort, onSortChange } = this.props
    return (
      <FormControl variant="outlined" size="small">
        <Select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          style={{ fontSize: 14 }}
        >
          <MenuItem value="followers">Most followers</MenuItem>
          <MenuItem value="added">Recently added</MenuItem>
          <MenuItem value="tracks">Most tracks</MenuItem>
          <MenuItem value="updated">Recently updated</MenuItem>
        </Select>
      </FormControl>
    )
  }
}

export default SortDropdown
