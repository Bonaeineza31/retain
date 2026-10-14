import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import BudgetSummaryCard from '../components/BudgetSummaryCard'
import CategoryBreakdown from '../components/CategoryBreakdown'
import RecentExpenses from '../components/RecentExpenses'
import useAuth from '../hooks/useAuth'
import { listCategories } from '../services/categoryService'
import { getDashboard } from '../services/dashboardService'
import type { Category } from '../types/category'
import type { DashboardData } from '../types/dashboard'
import { currentMonth, formatDate, formatRWF } from '../utils/format'
import { validateBudgetMonth } from '../utils/validators'
import { getErrorMessage } from '../utils/errors'

// The home screen: this month's budget, spending and recent expenses.
export default function DashboardPage() {
  const { user } = useAuth()

  const [month, setMonth] = useState(currentMonth())
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState<{ month: string; data: DashboardData } | null>(null)
  const [error, setError] = useState('')

  const monthIsValid = validateBudgetMonth(month) === null

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    if (!monthIsValid) return
    let outdated = false

    getDashboard(month)
      .then((data) => {
        if (!outdated) {
          setLoaded({ month, data })
          setError('')
        }
      })
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [month, monthIsValid])

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c.id] = c.name
    })
    return names
  }, [categories])

  const loading = monthIsValid && !error && loaded?.month !== month
  const data = loaded?.data

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Hello, {user?.name}
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
        <Typography sx={{ color: 'text.secondary' }}>Choose a month to see your summary.</Typography>
      ) : loading || !data ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 3fr) minmax(0, 2fr)' },
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 3 }}>
            <BudgetSummaryCard month={month} summary={data.summary} />
            {!data.summary.budget && (
              <Box>
                <Button component={RouterLink} to="/budget" variant="contained">
                  Set a budget
                </Button>
              </Box>
            )}
            <CategoryBreakdown items={data.spendingByCategory} categoryNames={categoryNames} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 3 }}>
            <Paper sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Highest expense
              </Typography>
              {data.highestExpense ? (
                <>
                  <Typography variant="h4">{formatRWF(data.highestExpense.amount)}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{data.highestExpense.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDate(data.highestExpense.date)} ·{' '}
                    {categoryNames[data.highestExpense.categoryId] || 'Unknown'}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>No expenses this month.</Typography>
              )}
            </Paper>

            <RecentExpenses expenses={data.recentExpenses} categoryNames={categoryNames} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
