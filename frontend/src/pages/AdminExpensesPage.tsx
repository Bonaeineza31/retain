import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminListFrame from '../components/AdminListFrame'
import AdminListRow from '../components/AdminListRow'
import AdminSearchBar from '../components/AdminSearchBar'
import usePagedList from '../hooks/usePagedList'
import { listAllExpenses } from '../services/adminService'
import { listCategories } from '../services/categoryService'
import {
  clearExpensesFilters,
  setExpensesCategory,
  setExpensesPage,
  setExpensesSearch,
} from '../store/adminListsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Category } from '../types/category'
import { formatDate, formatRWF } from '../utils/format'

// The expenses of all users, a page at a time. Admins can search and pick a category.
export default function AdminExpensesPage() {
  const dispatch = useAppDispatch()
  const { search, categoryId, page } = useAppSelector((state) => state.adminLists.expenses)

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // the names are only for the filter and the rows, so a failed load just leaves them as "Unknown"
    listCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  const categoryNames = useMemo(() => {
    const names: Record<string, string> = {}
    categories.forEach((c) => {
      names[c._id] = c.name
    })
    return names
  }, [categories])

  const fetcher = useCallback(() => listAllExpenses(search, categoryId, page), [search, categoryId, page])
  const { items: expenses, total, pageCount, loading, error } = usePagedList(fetcher)

  const filtered = search !== '' || categoryId !== ''

  return (
    <AdminListFrame
      title="All expenses"
      summary={`${total} ${total === 1 ? 'expense' : 'expenses'}${filtered ? ' match' : ' from all users'}`}
      searchBar={
        <AdminSearchBar
          label="Search title or notes"
          search={search}
          active={filtered}
          onSearch={(text) => dispatch(setExpensesSearch(text))}
          onClear={() => dispatch(clearExpensesFilters())}
        >
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(e) => dispatch(setExpensesCategory(e.target.value))}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </AdminSearchBar>
      }
      error={error}
      loading={loading}
      emptyText={filtered ? 'No expense matches your search.' : 'Nothing recorded yet.'}
      page={page}
      pageCount={pageCount}
      onPageChange={(value) => dispatch(setExpensesPage(value))}
    >
      {expenses.map((expense) => (
        <AdminListRow
          key={expense._id}
          title={expense.title}
          details={
            <>
              {expense.userName} · {formatDate(expense.date)} · {categoryNames[expense.categoryId] || 'Unknown'} ·{' '}
              <Typography component="span" variant="body2" sx={{ textTransform: 'capitalize' }}>
                {expense.paymentMethod}
              </Typography>
            </>
          }
          amount={formatRWF(expense.amount)}
          highlight
        />
      ))}
    </AdminListFrame>
  )
}
