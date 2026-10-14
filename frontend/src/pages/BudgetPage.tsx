import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import BudgetSummaryCard from '../components/BudgetSummaryCard'
import { getBudgetSummary } from '../services/budgetService'
import type { BudgetSummary } from '../types/budget'
import { currentMonth } from '../utils/format'
import { validateBudgetMonth } from '../utils/validators'

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonth())
  const [loaded, setLoaded] = useState<{ month: string; summary: BudgetSummary } | null>(null)
  const [error, setError] = useState('')
  // goes up by one after the budget is saved, to load the summary again
  const [reloadCount, setReloadCount] = useState(0)
  const [message, setMessage] = useState('')

  // the month box can be cleared, so only load when it holds a real month
  const monthIsValid = validateBudgetMonth(month) === null

  useEffect(() => {
    if (!monthIsValid) return
    let outdated = false

    getBudgetSummary(month)
      .then((summary) => {
        if (!outdated) {
          setLoaded({ month, summary })
          setError('')
        }
      })
      .catch((err) => {
        if (!outdated) setError(err.message)
      })

    return () => {
      outdated = true
    }
  }, [month, monthIsValid, reloadCount])

  const loading = monthIsValid && !error && loaded?.month !== month

  function handleSaved() {
    setMessage('Budget saved')
    setReloadCount(reloadCount + 1)
  }

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Budget
      </Typography>

      <TextField
        label="Month"
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ mb: 3, minWidth: 200 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!monthIsValid ? (
        <Typography sx={{ color: 'text.secondary' }}>Choose a month to see its budget.</Typography>
      ) : loading || !loaded ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 3, maxWidth: 720 }}>
          <BudgetSummaryCard month={month} summary={loaded.summary} />
          <BudgetForm
            key={month + '-' + (loaded.summary.budget?.amount ?? 'none')}
            month={month}
            currentAmount={loaded.summary.budget?.amount}
            onSaved={handleSaved}
          />
        </Box>
      )}

      <Snackbar
        open={message !== ''}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Box>
  )
}
