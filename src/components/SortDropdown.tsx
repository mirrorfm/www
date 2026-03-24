import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

interface SortDropdownProps {
  sort: string
  onSortChange: (value: string) => void
}

export default function SortDropdown({ sort, onSortChange }: SortDropdownProps) {
  return (
    <FormControl variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { height: 40 } }}>
      <Select
        value={sort}
        onChange={(e: SelectChangeEvent) => onSortChange(e.target.value)}
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
