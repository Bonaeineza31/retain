import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
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
import { formatRWF } from '../utils/format'
import { getErrorMessage } from '../utils/errors'

// The expense list with search, filters, sorting, pages, and add, edit and delete.
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
  // goes up by one after an add, edit or delete, to load the list again
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

  // load again whenever a filter, the sort or the page changes
  useEffect(() => {
    let outdated = false

    listExpenses(filters)
      .then((data) => {
        if (outdated) return
        // the last expense of the last page was deleted: go back one page
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

    // if the filters change again before this finishes, ignore this answer
    return () => {
      outdated = true
    }
  }, [filters, reloadCount, dispatch])

  const result = loaded ? loaded.data : { items: [], total: 0 }
  // still loading while the data on screen belongs to older filters
  const loading = !error && (!loaded || loaded.filters !== filters)

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c._id] = c.name
    })
    return names
  }, [categories])

  const pageCount = Math.max(1, Math.ceil(result.total / filters.pageSize))

  // Opens the form empty, to add a new expense.
  function openAdd() {
    setEditing(undefined)
    setFormOpen(true)
  }

  // Opens the form filled in, to change an expense.
  function openEdit(expense: Expense) {
    setEditing(expense)
    setFormOpen(true)
  }

  // Closes the form, shows a message and loads the list again.
  function handleSaved(text: string) {
    setFormOpen(false)
    setMessage(text)
    setReloadCount(reloadCount + 1)
  }

  // Deletes the chosen expense after the user said yes.
  async function handleConfirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await deleteExpense(deleting._id)
      setMessage('Expense deleted')
      setReloadCount(reloadCount + 1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
    setDeleteBusy(false)
    setDeleting(null)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h3">Expenses</Typography>
        <Button variant="contained" onClick={openAdd} sx={{ whiteSpace: 'nowrap' }}>
          Add expense
        </Button>
      </Box>

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
          <ExpenseList
            expenses={result.items}
            categoryNames={categoryNames}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
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

      {formOpen && (
        <ExpenseForm
          categories={categories}
          expense={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

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
