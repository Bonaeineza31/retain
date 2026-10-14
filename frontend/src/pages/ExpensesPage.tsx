import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseList from '../components/ExpenseList'
import { listCategories } from '../services/categoryService'
import { listExpenses } from '../services/expenseService'
import { setPage, type ExpenseFiltersState } from '../store/expenseFiltersSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Category } from '../types/category'
import type { ExpenseList as ExpenseListResult } from '../types/expense'

export default function ExpensesPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.expenseFilters)

  const [categories, setCategories] = useState<Category[]>([])
  // the data we have, and the filters it was loaded with
  const [loaded, setLoaded] = useState<{
    filters: ExpenseFiltersState
    data: ExpenseListResult
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
  }, [])

  // load again whenever a filter, the sort or the page changes
  useEffect(() => {
    let outdated = false

    listExpenses(filters)
      .then((data) => {
        if (!outdated) {
          setLoaded({ filters, data })
          setError('')
        }
      })
      .catch((err) => {
        if (!outdated) setError(err.message)
      })

    // if the filters change again before this finishes, ignore this answer
    return () => {
      outdated = true
    }
  }, [filters])

  const result = loaded ? loaded.data : { items: [], total: 0 }
  // still loading while the data on screen belongs to older filters
  const loading = !error && (!loaded || loaded.filters !== filters)

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c.id] = c.name
    })
    return names
  }, [categories])

  const pageCount = Math.max(1, Math.ceil(result.total / filters.pageSize))

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Expenses
      </Typography>

      <ExpenseFilters categories={categories} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && result.items.length === 0 ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : result.total === 0 ? (
        <Typography sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
          No expenses match your filters.
        </Typography>
      ) : (
        <>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            {result.total} {result.total === 1 ? 'expense' : 'expenses'}
          </Typography>
          <ExpenseList expenses={result.items} categoryNames={categoryNames} />
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pageCount}
                page={filters.page}
                onChange={(_event, page) => dispatch(setPage(page))}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
