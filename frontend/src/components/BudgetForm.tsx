import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type FormEvent } from 'react'
import { saveBudget } from '../services/budgetService'
import { formatMonth } from '../utils/format'
import { validateBudgetForm } from '../utils/validators'

interface Props {
  month: string
  // the budget that is already set for this month, if any
  currentAmount?: number
  onSaved: () => void
}

export default function BudgetForm({ month, currentAmount, onSaved }: Props) {
  const [amount, setAmount] = useState(currentAmount !== undefined ? String(currentAmount) : '')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const found = validateBudgetForm({ month, amount })
    if (found.amount || found.month) {
      setError(found.amount || found.month || '')
      return
    }

    setSubmitting(true)
    try {
      await saveBudget({ month, amount: Number(amount) })
      onSaved()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setSubmitting(false)
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        {currentAmount !== undefined ? 'Update budget' : 'Set budget'} for {formatMonth(month)}
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2, maxWidth: 360 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          <TextField
            label="Budget amount (RWF)"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError('')
              setServerError('')
            }}
            error={Boolean(error)}
            helperText={error}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : currentAmount !== undefined ? 'Update budget' : 'Set budget'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  )
}
