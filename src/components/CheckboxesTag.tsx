import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

interface Genre {
  genre: string
}

interface CheckboxesTagProps {
  genres?: Genre[]
  selectedGenres?: Genre[]
  handleClick?: (e: any, value: Genre[]) => void
}

export default function CheckboxesTag({ genres = [], selectedGenres = [], handleClick }: CheckboxesTagProps) {
  return (
    <Autocomplete
      multiple
      options={genres}
      value={selectedGenres}
      limitTags={5}
      size="small"
      onChange={handleClick}
      disableCloseOnSelect
      getOptionLabel={(option) => option.genre}
      isOptionEqualToValue={(option, value) => option.genre === value.genre}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.genre}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
            size="small"
          />
          {option.genre}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Music genres" placeholder="" />
      )}
    />
  )
}
