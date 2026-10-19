import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import CategoryBreakdown from '../components/CategoryBreakdown'
import RankedCategories from '../components/RankedCategories'
import StatTile from '../components/StatTile'
import { getInsights } from '../services/adminService'
import type { AdminInsights } from '../types/admin'
import { getErrorMessage } from '../utils/errors'
import { formatDate, formatRWF } from '../utils/format'

export default function AdminDashboardPage() {
  const [insights, setInsights] = useState<AdminInsights | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getInsights()
      .then(setInsights)
      .catch((err: unknown) => setError(getErrorMessage(err)))
  }, [])

  const chart = useMemo(() => {
    const items = (insights?.spendingPerCategory ?? [])
      .filter((c) => c.total > 0)
      .map((c) => ({ categoryId: c.categoryId, total: c.total }))
    const names: Record<string, string> = {}
    insights?.spendingPerCategory.forEach((c) => {
      names[c.categoryId] = c.name
    })
    return { items, names }
  }, [insights])

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (!insights) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          label="Registered users"
          value={String(insights.totalUsers)}
        />
        <StatTile
          label="Expenses recorded"
          value={String(insights.totalExpenses)}
        />
        <StatTile
          label="Total value"
          value={formatRWF(insights.totalValue)}
        />
        <StatTile
          label="Expenses this month"
          value={String(insights.expensesThisMonth)}
        />
      </Box>

      <CategoryBreakdown items={chart.items} categoryNames={chart.names} />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          alignItems: 'start',
        }}
      >
        <RankedCategories title="Most used categories" items={insights.topCategories} />
        <RankedCategories title="Least used categories" items={insights.bottomCategories} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          alignItems: 'start',
        }}
      >
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Recently added expenses
          </Typography>

          {insights.recentExpenses.length === 0 ? (
            <Typography sx={{ color: 'text.secondary' }}>Nothing recorded yet.</Typography>
          ) : (
            <Box>
              {insights.recentExpenses.map((expense, index) => (
                <Box key={expense._id}>
                  {index > 0 && <Divider />}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }} noWrap>
                        {expense.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {expense.userName} · {formatDate(expense.date)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatRWF(expense.amount)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button component={RouterLink} to="/admin/expenses" sx={{ mt: 1.5 }}>
            View all expenses
          </Button>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Recently registered users
          </Typography>

          {insights.recentUsers.length === 0 ? (
            <Typography sx={{ color: 'text.secondary' }}>No users yet.</Typography>
          ) : (
            <Box>
              {insights.recentUsers.map((person, index) => (
                <Box key={person._id}>
                  {index > 0 && <Divider />}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }} noWrap>
                        {person.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {person.email}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {formatDate(person.createdAt.slice(0, 10))}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          <Button component={RouterLink} to="/admin/users" sx={{ mt: 1.5 }}>
            View all users
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}
