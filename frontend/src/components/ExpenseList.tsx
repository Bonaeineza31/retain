import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { Expense } from '../types/expense'
import { formatDate, formatRWF } from '../utils/format'

interface Props {
  expenses: Expense[]
  // category id -> category name
  categoryNames: Record<string, string>
}

export default function ExpenseList({ expenses, categoryNames }: Props) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('sm'))

  function categoryOf(expense: Expense) {
    return categoryNames[expense.categoryId] || 'Unknown'
  }

  // phones get cards, a table would be too wide
  if (!isWide) {
    return (
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {expenses.map((expense) => (
          <Paper key={expense.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>{expense.title}</Typography>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatRWF(expense.amount)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {formatDate(expense.date)} · {categoryOf(expense)} · {expense.paymentMethod}
            </Typography>
            {expense.notes && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {expense.notes}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{expense.title}</Typography>
                {expense.notes && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {expense.notes}
                  </Typography>
                )}
              </TableCell>
              <TableCell>{categoryOf(expense)}</TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{expense.paymentMethod}</TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
                {formatRWF(expense.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
