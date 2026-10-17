import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import ExpenseForm from '../components/ExpenseForm'
import { listCategories } from '../services/categoryService'
import { deleteExpense, getExpense } from '../services/expenseService'
import type { Category } from '../types/category'
import type { Expense } from '../types/expense'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatRWF } from '../utils/format'

// Shows everything about one expense, with buttons to edit or delete it.
export default function ExpenseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  // the expense we have, and which id it was loaded for
  const [loaded, setLoaded] = useState<{ id: string; expense: Expense } | null>(null)
  const [error, setError] = useState('')
  // goes up by one after an edit, to load the expense again
  const [reloadCount, setReloadCount] = useState(0)

  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  // load the expense whenever the address changes, or after an edit
  useEffect(() => {
    if (!id) return
    let outdated = false

    getExpense(id)
      .then((expense) => {
        if (!outdated) {
          setLoaded({ id, expense })
          setError('')
        }
      })
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [id, reloadCount])

  const expense = loaded && loaded.id === id ? loaded.expense : null
  const loading = !error && !expense

  // the name of the expense's category
  const categoryName =
    categories.find((c) => c._id === expense?.categoryId)?.name ?? 'Unknown'

  // Closes the form, shows a message and loads the expense again.
  function handleSaved(text: string) {
    setEditing(false)
    setMessage(text)
    setReloadCount(reloadCount + 1)
  }

  // Deletes the expense after the user said yes, then goes back to the list.
  async function handleConfirmDelete() {
    if (!expense) return
    setDeleteBusy(true)
    try {
      await deleteExpense(expense._id)
      navigate('/expenses', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setDeleteBusy(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Button component={RouterLink} to="/expenses" sx={{ mb: 2 }}>
        Back to expenses
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {expense && (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Amount
          </Typography>
          <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
            {formatRWF(expense.amount)}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1, mb: 3, wordBreak: 'break-word' }}>
            {expense.title}
          </Typography>

          <Divider />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              py: 3,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <Detail label="Category" value={categoryName} />
            <Detail label="Date" value={formatDate(expense.date)} />
            <Detail label="Payment method" value={expense.paymentMethod} capitalize />
            <Detail label="Added on" value={formatDate(expense.createdAt.slice(0, 10))} />
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Notes
          </Typography>
          <Typography sx={{ mb: 3, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {expense.notes || 'No notes'}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button variant="contained" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button color="error" variant="outlined" onClick={() => setConfirmingDelete(true)}>
              Delete
            </Button>
          </Box>
        </Paper>
      )}

      {editing && expense && (
        <ExpenseForm
          categories={categories}
          expense={expense}
          onClose={() => setEditing(false)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this expense?"
        message={
          expense
            ? `"${expense.title}" (${formatRWF(expense.amount)}) will be removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
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

// One labelled value, like Category or Date.
function Detail({
  label,
  value,
  capitalize = false,
}: {
  label: string
  value: string
  capitalize?: boolean
}) {
  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, textTransform: capitalize ? 'capitalize' : 'none' }}>
        {value}
      </Typography>
    </Box>
  )
}
