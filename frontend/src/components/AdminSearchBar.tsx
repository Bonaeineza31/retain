import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState, type FormEvent, type ReactNode } from 'react'

interface Props {
  label: string
  // the search that is applied now
  search: string
  onSearch: (text: string) => void
  onClear: () => void
  // true when a search or a filter is applied, so the Clear button shows
  active: boolean
  // more filters, shown between the search box and the buttons
  children?: ReactNode
}

// The search box and buttons at the top of an admin list.
export default function AdminSearchBar({ label, search, onSearch, onClear, active, children }: Props) {
  // what is typed in the box. it is only applied when the admin presses Search
  const [text, setText] = useState(search)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSearch(text)
  }

  function handleClear() {
    setText('')
    onClear()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <TextField
        label={label}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ flexGrow: 1, minWidth: 200 }}
      />
      {children}
      <Button type="submit" variant="contained">
        Search
      </Button>
      {(active || text) && (
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      )}
    </Box>
  )
}
