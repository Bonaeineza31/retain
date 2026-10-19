import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import BudgetForm from '../components/BudgetForm'
import BudgetSummaryCard from '../components/BudgetSummaryCard'
import { getBudgetSummary } from '../services/budgetService'
import type { BudgetSummary } from '../types/budget'
import { getErrorMessage } from '../utils/errors'
import { currentMonth, formatMonth, formatRWF, todayAsText } from '../utils/format'
import { validateBudgetMonth } from '../utils/validators'

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonth())
  const [loaded, setLoaded] = useState<{ month: string; summary: BudgetSummary } | null>(null)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [message, setMessage] = useState('')

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
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [month, monthIsValid, reloadCount])

  const loading = monthIsValid && !error && loaded?.month !== month

  function handleSaved() {
    setMessage('Budget saved')
    setReloadCount((prev) => prev + 1)
  }

  const [todayDate] = useState(() => todayAsText())

  // Calculate days remaining in the chosen month
  const daysInfo = useMemo(() => {
    if (!loaded?.summary?.budget) return null
    const [year, m] = month.split('-').map(Number)
    const isCurrentMonth = month === todayDate.slice(0, 7)

    if (!isCurrentMonth) {
      return { isCurrentMonth: false, daysRemaining: 0, dailyAllowance: 0 }
    }

    const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const totalDaysInMonth = daysInMonths[m - 1] || 30

    const currentDay = Number(todayDate.slice(8, 10))
    const daysRemaining = Math.max(1, totalDaysInMonth - currentDay + 1)
    const remaining = loaded.summary.remaining
    const dailyAllowance = remaining > 0 ? Math.round(remaining / daysRemaining) : 0

    return { isCurrentMonth: true, daysRemaining, dailyAllowance }
  }, [month, loaded, todayDate])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            Budget
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Spending target for {formatMonth(month)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            label="Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 175 }}
          />
          {month !== currentMonth() && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setMonth(currentMonth())}
            >
              This month
            </Button>
          )}
        </Box>
      </Paper>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {!monthIsValid ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            Choose a month to see its budget.
          </Typography>
        </Paper>
      ) : loading || !loaded ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Dual-Panel Studio Grid */
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.2fr) minmax(0, 1fr)' },
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <BudgetSummaryCard month={month} summary={loaded.summary} />

            {daysInfo?.isCurrentMonth && loaded.summary.budget && (
              <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h6" gutterBottom>
                  Daily allowance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  With <strong>{daysInfo.daysRemaining} days</strong> left in {formatMonth(month)}:
                </Typography>
                <Typography variant="h4" sx={{ color: loaded.summary.remaining < 0 ? 'error.main' : 'primary.main', my: 0.5 }}>
                  {formatRWF(daysInfo.dailyAllowance)} / day
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {loaded.summary.remaining < 0
                    ? 'You have exceeded your monthly allowance.'
                    : 'Pacing within this daily limit will keep you safely on track.'}
                </Typography>
              </Paper>
            )}
          </Box>

          <Box>
            <BudgetForm
              key={month + '-' + (loaded.summary.budget?.amount ?? 'none')}
              month={month}
              currentAmount={loaded.summary.budget?.amount}
              onSaved={handleSaved}
            />
          </Box>
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
