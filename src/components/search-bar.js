import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import { MdSearch } from 'react-icons/md'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.search || '' }
    this.debounceTimer = null
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.props.onSearchChange(value)
    }, 300)
  }

  componentWillUnmount() {
    clearTimeout(this.debounceTimer)
  }

  render() {
    return (
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={this.state.value}
        onChange={this.handleChange}
        style={{ minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MdSearch size={20} color="#999" />
            </InputAdornment>
          ),
        }}
      />
    )
  }
}

export default SearchBar
