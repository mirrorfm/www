import { createFilterOptions } from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import InputAdornment from '@mui/material/InputAdornment'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import SearchIcon from '@mui/icons-material/Search'

const icon = <CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />
const checkedIcon = <CheckBoxIcon sx={{ fontSize: 16 }} />

interface Genre {
  genre: string
}

interface CheckboxesTagProps {
  genres?: Genre[]
  selectedGenres?: Genre[]
  handleClick?: (e: any, value: Genre[]) => void
  placeholder?: string
}

const filterOptions = createFilterOptions<Genre>({
  limit: 50,
  stringify: (option) => option.genre,
})

export default function CheckboxesTag({ genres = [], selectedGenres = [], handleClick, placeholder = 'Genres' }: CheckboxesTagProps) {
  return (
    <Autocomplete
      multiple
      options={genres}
      value={selectedGenres}
      limitTags={5}
      size="small"
      filterOptions={filterOptions}
      sx={{
        '& .MuiOutlinedInput-root': { height: 40, minHeight: 'unset', fontSize: 14, color: '#d4d4d4' },
        '& .MuiOutlinedInput-input::placeholder': { color: '#d4d4d4', opacity: 1 },
        '& .MuiAutocomplete-input': { padding: '2px 4px !important' },
      }}
      slotProps={{
        listbox: {
          sx: { '& .MuiAutocomplete-option': { fontSize: 13, minHeight: 28, py: 0.25 } },
        },
      }}
      onChange={handleClick}
      disableCloseOnSelect
      getOptionLabel={(option) => option.genre}
      isOptionEqualToValue={(option, value) => option.genre === value.genre}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.genre} style={{ fontSize: 13 }}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
            size="small"
            sx={{ padding: '2px 4px 2px 0' }}
          />
          {option.genre}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <SearchIcon sx={{ fontSize: 20, color: '#999' }} />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
