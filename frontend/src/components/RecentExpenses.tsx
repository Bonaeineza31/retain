import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import type { Expense } from '../types/expense'
import { formatDate, formatRWF } from '../utils/format'

interface Props {
  expenses: Expense[]
  // category id -> category name
  categoryNames: Record<string, string>
}

// A short list of the latest expenses.
export default function RecentExpenses({ expenses, categoryNames }: Props) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Recent expenses
      </Typography>

      {expenses.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>Nothing recorded yet.</Typography>
      ) : (
        <Box>
          {expenses.map((expense, index) => (
            <Box key={expense.id}>
              {index > 0 && <Divider />}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>
                    {expense.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDate(expense.date)} · {categoryNames[expense.categoryId] || 'Unknown'}
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

      <Button component={RouterLink} to="/expenses" sx={{ mt: 1 }}>
        View all expenses
      </Button>
    </Paper>
  )
}
