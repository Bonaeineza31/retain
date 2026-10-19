import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { listAllExpenses } from '../services/adminService'
import { listCategories } from '../services/categoryService'
import type { AdminExpenseList } from '../types/admin'
import type { Category } from '../types/category'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatRWF } from '../utils/format'

// The expenses of all users, a page at a time. Admins can search and pick a category.
export default function AdminExpensesPage() {
  // what is typed in the box, and what was last searched
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState<{ key: string; data: AdminExpenseList } | null>(null)
  const [error, setError] = useState('')

  const key = `${search}|${categoryId}|${page}`

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    let outdated = false

    listAllExpenses(search, categoryId, page)
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
  }, [search, categoryId, page, key])

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c._id] = c.name
    })
    return names
  }, [categories])

  const loading = !error && loaded?.key !== key
  const expenses = loaded?.data.items ?? []
  const total = loaded?.data.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / (loaded?.data.pageSize ?? 10)))
  const filtered = search !== '' || categoryId !== ''

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setPage(1)
    setSearch(searchText)
  }

  function handleClear() {
    setSearchText('')
    setSearch('')
    setCategoryId('')
    setPage(1)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="h5">All expenses</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {total} {total === 1 ? 'expense' : 'expenses'}
          {filtered ? ' match' : ' from all users'}
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            label="Search title or notes"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setPage(1)
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained">
            Search
          </Button>
          {(filtered || searchText) && (
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
        ) : expenses.length === 0 ? (
          <Typography sx={{ color: 'text.secondary' }}>
            {filtered ? 'No expense matches your search.' : 'Nothing recorded yet.'}
          </Typography>
        ) : (
          expenses.map((expense, index) => (
            <Box key={expense._id}>
              {index > 0 && <Divider />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {expense.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {expense.userName} · {formatDate(expense.date)} ·{' '}
                    {categoryNames[expense.categoryId] || 'Unknown'} ·{' '}
                    <Typography component="span" variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {expense.paymentMethod}
                    </Typography>
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: 'primary.main' }}>
                  {formatRWF(expense.amount)}
                </Typography>
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
