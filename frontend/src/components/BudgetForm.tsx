import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type FormEvent } from 'react'
import { saveBudget } from '../services/budgetService'
import { getErrorMessage } from '../utils/errors'
import { formatMonth, formatRWF } from '../utils/format'
import { validateBudgetForm } from '../utils/validators'

interface Props {
  month: string
  // the budget that is already set for this month, if any
  currentAmount?: number
  onSaved: () => void
}

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000]

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
      setServerError(getErrorMessage(err))
    }
    setSubmitting(false)
  }

  function handlePresetClick(preset: number) {
    setAmount(String(preset))
    setError('')
    setServerError('')
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        {currentAmount !== undefined ? 'Update budget' : 'Set budget'} for {formatMonth(month)}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
        Specify the spending limit you plan to stick to for this month.
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2 }}>
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
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Quick presets:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESET_AMOUNTS.map((preset) => (
                <Chip
                  key={preset}
                  label={formatRWF(preset)}
                  size="small"
                  onClick={() => handlePresetClick(preset)}
                  variant={amount === String(preset) ? 'filled' : 'outlined'}
                  color={amount === String(preset) ? 'primary' : 'default'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : currentAmount !== undefined ? 'Update budget' : 'Set budget'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  )
}
