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
import StatTile from '../components/StatTile'
import useAuth from '../hooks/useAuth'
import { listCategories } from '../services/categoryService'
import { getDashboard } from '../services/dashboardService'
import type { Category } from '../types/category'
import type { DashboardData } from '../types/dashboard'
import { STATUS_LABEL } from '../utils/budget'
import { getErrorMessage } from '../utils/errors'
import { currentMonth, formatMonth, formatRWF } from '../utils/format'
import { validateBudgetMonth } from '../utils/validators'

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
      names[c._id] = c.name
    })
    return names
  }, [categories])

  const loading = monthIsValid && !error && loaded?.month !== month
  const data = loaded?.data

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3">
            Hello, {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Overview for <strong>{formatMonth(month)}</strong>
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: { xs: '100%', sm: 'auto' },
            flexWrap: 'wrap',
          }}
        >
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
              sx={{ whiteSpace: 'nowrap' }}
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
            Choose a month to see your summary.
          </Typography>
        </Paper>
      ) : loading || !data ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            <StatTile
              label="Monthly budget"
              value={data.summary.budget ? formatRWF(data.summary.budget.amount) : 'Not set'}
              subtitle={data.summary.budget ? 'Target limit' : undefined}
            />
            <StatTile
              label="Total spent"
              value={formatRWF(data.summary.spent)}
              subtitle={
                data.summary.budget
                  ? `${Math.round((data.summary.spent / data.summary.budget.amount) * 100)}% of budget`
                  : undefined
              }
            />
            <StatTile
              label={data.summary.remaining < 0 ? 'Over budget by' : 'Remaining'}
              value={formatRWF(Math.abs(data.summary.remaining))}
              subtitle={STATUS_LABEL[data.summary.status]}
            />
            <StatTile
              label="Highest expense"
              value={data.highestExpense ? formatRWF(data.highestExpense.amount) : '0 RWF'}
              subtitle={data.highestExpense ? data.highestExpense.title : 'None recorded'}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 3fr) minmax(0, 2fr)' },
              alignItems: 'start',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <BudgetSummaryCard month={month} summary={data.summary} />

              {!data.summary.budget && (
                <Box>
                  <Button
                    component={RouterLink}
                    to="/budget"
                    variant="contained"
                  >
                    Set a budget
                  </Button>
                </Box>
              )}

              <CategoryBreakdown items={data.spendingByCategory} categoryNames={categoryNames} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <RecentExpenses expenses={data.recentExpenses} categoryNames={categoryNames} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
