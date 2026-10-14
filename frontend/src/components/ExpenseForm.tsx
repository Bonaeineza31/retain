import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { createExpense, updateExpense } from '../services/expenseService'
import type { Category } from '../types/category'
import { PAYMENT_METHODS, type Expense, type PaymentMethod } from '../types/expense'
import { todayAsText } from '../utils/format'
import {
  validateExpenseForm,
  type ExpenseFormValues,
  type FormErrors,
} from '../utils/validators'

interface Props {
  categories: Category[]
  // when this is given the form edits it, otherwise it adds a new expense
  expense?: Expense
  onClose: () => void
  onSaved: (message: string) => void
}

export default function ExpenseForm({ categories, expense, onClose, onSaved }: Props) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [values, setValues] = useState<ExpenseFormValues>({
    title: expense?.title ?? '',
    amount: expense ? String(expense.amount) : '',
    categoryId: expense?.categoryId ?? '',
    date: expense?.date ?? todayAsText(),
    paymentMethod: expense?.paymentMethod ?? '',
    notes: expense?.notes ?? '',
  })
  const [errors, setErrors] = useState<FormErrors<ExpenseFormValues>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: undefined })
    setServerError('')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const found = validateExpenseForm(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      return
    }

    const input = {
      title: values.title.trim(),
      amount: Number(values.amount),
      categoryId: values.categoryId,
      date: values.date,
      paymentMethod: values.paymentMethod as PaymentMethod,
      notes: values.notes.trim() || undefined,
    }

    setSubmitting(true)
    try {
      if (expense) {
        await updateExpense(expense.id, input)
        onSaved('Expense updated')
      } else {
        await createExpense(input)
        onSaved('Expense added')
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open
      onClose={submitting ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{expense ? 'Edit expense' : 'Add expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              autoFocus
              fullWidth
            />
            <TextField
              label="Amount (RWF)"
              name="amount"
              value={values.amount}
              onChange={handleChange}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              fullWidth
            />
            <TextField
              select
              label="Category"
              name="categoryId"
              value={values.categoryId}
              onChange={handleChange}
              error={Boolean(errors.categoryId)}
              helperText={errors.categoryId}
              fullWidth
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              error={Boolean(errors.date)}
              helperText={errors.date}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { max: todayAsText() },
              }}
              fullWidth
            />
            <TextField
              select
              label="Payment method"
              name="paymentMethod"
              value={values.paymentMethod}
              onChange={handleChange}
              error={Boolean(errors.paymentMethod)}
              helperText={errors.paymentMethod}
              fullWidth
            >
              {PAYMENT_METHODS.map((method) => (
                <MenuItem key={method} value={method} sx={{ textTransform: 'capitalize' }}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Notes (optional)"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              error={Boolean(errors.notes)}
              helperText={errors.notes || `${values.notes.length}/300`}
              multiline
              minRows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : expense ? 'Save changes' : 'Add expense'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
