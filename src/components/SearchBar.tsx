import { useState, useRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { MdSearch } from 'react-icons/md'

interface SearchBarProps {
  search?: string
  onSearchChange: (value: string) => void
}

export default function SearchBar({ search = '', onSearchChange }: SearchBarProps) {
  const [value, setValue] = useState(search)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => { clearTimeout(timer.current) }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onSearchChange(v), 300)
  }

  return (
    <TextField
      variant="outlined"
      size="small"
      placeholder="Search..."
      value={value}
      onChange={handleChange}
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
