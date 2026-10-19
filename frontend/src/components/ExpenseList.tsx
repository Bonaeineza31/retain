import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
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
import type { MouseEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import type { Expense } from '../types/expense'
import { formatDate, formatRWF } from '../utils/format'

interface Props {
  expenses: Expense[]
  // category id -> category name
  categoryNames: Record<string, string>
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export default function ExpenseList({ expenses, categoryNames, onEdit, onDelete }: Props) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('sm'))
  const navigate = useNavigate()

  function categoryOf(expense: Expense) {
    return categoryNames[expense.categoryId] || 'Unknown'
  }

  function openDetails(expense: Expense) {
    navigate(`/expenses/${expense._id}`)
  }

  function keepClick(event: MouseEvent) {
    event.stopPropagation()
  }

  function editAndDelete(expense: Expense) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          aria-label={`Edit ${expense.title}`}
          onClick={(event) => {
            keepClick(event)
            onEdit(expense)
          }}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label={`Delete ${expense.title}`}
          onClick={(event) => {
            keepClick(event)
            onDelete(expense)
          }}
        >
          <DeleteOutlineOutlined fontSize="small" />
        </IconButton>
      </Box>
    )
  }

  // Mobile view
  if (!isWide) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5 }}>
        {expenses.map((expense) => (
          <Paper
            key={expense._id}
            onClick={() => openDetails(expense)}
            sx={{ p: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Link
                component={RouterLink}
                to={`/expenses/${expense._id}`}
                onClick={keepClick}
                color="inherit"
                underline="hover"
                sx={{ fontWeight: 600, wordBreak: 'break-word' }}
              >
                {expense.title}
              </Link>
              <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatRWF(expense.amount)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {formatDate(expense.date)} · {categoryOf(expense)} · {expense.paymentMethod}
            </Typography>
            {expense.notes && (
              <Typography variant="body2" sx={{ mt: 0.5 }} noWrap>
                {expense.notes}
              </Typography>
            )}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
                pt: 1,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                size="small"
                component={RouterLink}
                to={`/expenses/${expense._id}`}
                onClick={keepClick}
                sx={{ ml: -1 }}
              >
                View details
              </Button>
              <Box>{editAndDelete(expense)}</Box>
            </Box>
          </Paper>
        ))}
      </Box>
    )
  }

  // Desktop view
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
            <TableRow
              key={expense._id}
              hover
              onClick={() => openDetails(expense)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/expenses/${expense._id}`}
                  onClick={keepClick}
                  color="inherit"
                  underline="hover"
                  sx={{ fontWeight: 600, wordBreak: 'break-word' }}
                >
                  {expense.title}
                </Link>
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
                <IconButton
                  size="small"
                  component={RouterLink}
                  to={`/expenses/${expense._id}`}
                  onClick={keepClick}
                  aria-label={`View details of ${expense.title}`}
                  sx={{ mr: 0.5 }}
                >
                  <VisibilityOutlined fontSize="small" />
                </IconButton>
                {editAndDelete(expense)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
