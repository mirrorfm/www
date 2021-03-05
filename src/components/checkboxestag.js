/* eslint-disable no-use-before-define */

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

class CheckBoxesTag extends React.Component {
  render() {
    return <Autocomplete
      multiple
      options={this.props.genres}
      limitTags={5}
      size="small"
      onChange={this.props.handleClick}
      disableCloseOnSelect
      getOptionLabel={option => option.genre}
      renderOption={(option, {selected}) => (
        <React.Fragment>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
            size="small"
          />
          {option.genre}
        </React.Fragment>
      )}
      renderInput={params => (
        <TextField {...params} variant="outlined" label="Music genres" placeholder=""/>
      )} />
  }
}

export default CheckBoxesTag
