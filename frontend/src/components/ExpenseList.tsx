import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
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

// Shows the expenses as a table on big screens and as cards on phones.
// Tapping a card or a row opens the details of that expense.
export default function ExpenseList({ expenses, categoryNames, onEdit, onDelete }: Props) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('sm'))
  const navigate = useNavigate()

  // The name of the category an expense belongs to.
  function categoryOf(expense: Expense) {
    return categoryNames[expense.categoryId] || 'Unknown'
  }

  // Goes to the details page of an expense.
  function openDetails(expense: Expense) {
    navigate(`/expenses/${expense.id}`)
  }

  // Stops a click on a button from also counting as a click on the card or row.
  function keepClick(event: MouseEvent) {
    event.stopPropagation()
  }

  // The title of an expense, as a link to its details page.
  function titleLink(expense: Expense) {
    return (
      <Link
        component={RouterLink}
        to={`/expenses/${expense.id}`}
        onClick={keepClick}
        color="inherit"
        underline="hover"
        sx={{ fontWeight: 600, wordBreak: 'break-word' }}
      >
        {expense.title}
      </Link>
    )
  }

  // The edit and delete buttons of one expense.
  function editAndDelete(expense: Expense) {
    return (
      <>
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
          <Paper
            key={expense.id}
            onClick={() => openDetails(expense)}
            sx={{ p: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              {titleLink(expense)}
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
                mt: 0.5,
              }}
            >
              <Button
                size="small"
                component={RouterLink}
                to={`/expenses/${expense.id}`}
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
              key={expense.id}
              hover
              onClick={() => openDetails(expense)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
              <TableCell>
                {titleLink(expense)}
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
                  to={`/expenses/${expense.id}`}
                  onClick={keepClick}
                  aria-label={`View details of ${expense.title}`}
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
