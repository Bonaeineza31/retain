import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
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
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

// Shows the expenses as a table on big screens and as cards on phones.
export default function ExpenseList({ expenses, categoryNames, onEdit, onDelete }: Props) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('sm'))

  // The name of the category an expense belongs to.
  function categoryOf(expense: Expense) {
    return categoryNames[expense.categoryId] || 'Unknown'
  }

  // The edit and delete buttons of one expense.
  function actionsFor(expense: Expense) {
    return (
      <>
        <IconButton
          size="small"
          aria-label={`Edit ${expense.title}`}
          onClick={() => onEdit(expense)}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label={`Delete ${expense.title}`}
          onClick={() => onDelete(expense)}
        >
          <DeleteOutlined fontSize="small" />
        </IconButton>
      </>
    )
  }

  // phones get cards, a table would be too wide
  if (!isWide) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
              {actionsFor(expense)}
            </Box>
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
            <TableCell align="right">Actions</TableCell>
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
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                {actionsFor(expense)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
