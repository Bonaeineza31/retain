import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState, type FormEvent } from 'react'
import { listUsers } from '../services/adminService'
import type { AdminUserList } from '../types/admin'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatRWF } from '../utils/format'

// All registered users, a page at a time. Admins can search by name or email.
export default function AdminUsersPage() {
  // what is typed in the box, and what was last searched
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loaded, setLoaded] = useState<{ key: string; data: AdminUserList } | null>(null)
  const [error, setError] = useState('')

  const key = `${search}|${page}`

  useEffect(() => {
    let outdated = false

    listUsers(search, page)
      .then((data) => {
        if (outdated) return
        setLoaded({ key, data })
        setError('')
      })
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [search, page, key])

  const loading = !error && loaded?.key !== key
  const users = loaded?.data.items ?? []
  const total = loaded?.data.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / (loaded?.data.pageSize ?? 10)))

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setPage(1)
    setSearch(searchText)
  }

  function handleClear() {
    setSearchText('')
    setSearch('')
    setPage(1)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="h5">Registered users</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {total} {total === 1 ? 'user' : 'users'}
          {search ? ` matching "${search.trim()}"` : ''}
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            label="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
          {(search || searchText) && (
            <Button variant="outlined" onClick={handleClear}>
              Clear
            </Button>
          )}
        </Box>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography sx={{ color: 'text.secondary' }}>
            {search ? 'No user matches your search.' : 'No users yet.'}
          </Typography>
        ) : (
          users.map((person, index) => (
            <Box key={person._id}>
              {index > 0 && <Divider />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {person.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {person.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Joined {formatDate(person.createdAt.slice(0, 10))}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {formatRWF(person.totalSpent)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {person.expenseCount} {person.expenseCount === 1 ? 'expense' : 'expenses'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      )}
    </Box>
  )
}
