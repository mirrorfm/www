/* eslint-disable no-use-before-define */

import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PropTypes from "prop-types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CheckBoxesTag = ({ genres }) => {
  // const [value, setValue] = React.useState(options[0]);

  return <Autocomplete
    multiple
    options={genres}
    limitTags={5}
    size="small"
    onChange={(event, newValue) => {
      // setValue(newValue);
    }}
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
    )}
  />
}

CheckBoxesTag.propTypes = {
  genres: PropTypes.array,
}

CheckBoxesTag.defaultProps = {
  genres: [],
}

export default CheckBoxesTag
