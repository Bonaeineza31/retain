import AddOutlined from '@mui/icons-material/AddOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import { listCategories } from '../services/categoryService'
import { deleteExpense, listExpenses } from '../services/expenseService'
import { setPage, type ExpenseFiltersState } from '../store/expenseFiltersSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Category } from '../types/category'
import type { Expense, ExpenseList as ExpenseListResult } from '../types/expense'
import { getErrorMessage } from '../utils/errors'
import { formatRWF } from '../utils/format'

export default function ExpensesPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.expenseFilters)

  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState<{
    filters: ExpenseFiltersState
    data: ExpenseListResult
  } | null>(null)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | undefined>(undefined)
  const [deleting, setDeleting] = useState<Expense | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    let outdated = false

    listExpenses(filters)
      .then((data) => {
        if (outdated) return
        if (data.items.length === 0 && filters.page > 1) {
          dispatch(setPage(filters.page - 1))
          return
        }
        setLoaded({ filters, data })
        setError('')
      })
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [filters, reloadCount, dispatch])

  const result = loaded ? loaded.data : { items: [], total: 0 }
  const loading = !error && (!loaded || loaded.filters !== filters)

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c._id] = c.name
    })
    return names
  }, [categories])

  const pageCount = Math.max(1, Math.ceil(result.total / filters.pageSize))
  const pageTotal = result.items.reduce((sum, item) => sum + item.amount, 0)

  function openAdd() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(expense: Expense) {
    setEditing(expense)
    setFormOpen(true)
  }

  function handleSaved(text: string) {
    setFormOpen(false)
    setMessage(text)
    setReloadCount((prev) => prev + 1)
  }

  async function handleConfirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await deleteExpense(deleting._id)
      setMessage('Expense deleted')
      setReloadCount((prev) => prev + 1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
    setDeleteBusy(false)
    setDeleting(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Top Banner Header */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3">
            Expenses
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {result.total} {result.total === 1 ? 'expense' : 'expenses'} recorded
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {result.items.length > 0 && (
            <Chip
              label={`Page sum: ${formatRWF(pageTotal)}`}
              size="small"
              variant="outlined"
            />
          )}
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={openAdd}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add expense
          </Button>
        </Box>
      </Paper>

      {/* Filter Component */}
      <ExpenseFilters categories={categories} />

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Results Container */}
      {loading && result.items.length === 0 ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : result.total === 0 ? (
        <Paper sx={{ py: 6, px: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            No expenses match your filters.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ExpenseList
            expenses={result.items}
            categoryNames={categoryNames}
            onEdit={openEdit}
            onDelete={setDeleting}
          />

          {pageCount > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2,
              }}
            >
              <Pagination
                count={pageCount}
                page={filters.page}
                onChange={(_event, page) => dispatch(setPage(page))}
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}

      {/* Expense Modal Form */}
      {formOpen && (
        <ExpenseForm
          categories={categories}
          expense={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        title="Delete this expense?"
        message={
          deleting
            ? `"${deleting.title}" (${formatRWF(deleting.amount)}) will be removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={message !== ''}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Box>
  )
}
