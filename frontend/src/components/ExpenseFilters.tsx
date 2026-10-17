import FilterListOutlined from '@mui/icons-material/FilterListOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import {
  resetFilters,
  setAmountRange,
  setCategory,
  setDateRange,
  setPaymentMethod,
  setSearch,
  setSort,
  type SortBy,
  type SortOrder,
} from '../store/expenseFiltersSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Category } from '../types/category'
import { PAYMENT_METHODS, type PaymentMethod } from '../types/expense'
import { validateAmountRange, validateDateRange } from '../utils/validators'

interface Props {
  categories: Category[]
}

const SORT_OPTIONS: { value: string; label: string; sortBy: SortBy; sortOrder: SortOrder }[] = [
  { value: 'date-desc', label: 'Newest first', sortBy: 'date', sortOrder: 'desc' },
  { value: 'date-asc', label: 'Oldest first', sortBy: 'date', sortOrder: 'asc' },
  { value: 'amount-desc', label: 'Highest amount', sortBy: 'amount', sortOrder: 'desc' },
  { value: 'amount-asc', label: 'Lowest amount', sortBy: 'amount', sortOrder: 'asc' },
]

// turns what was typed into a number, or null when the box is empty or not a number
function toAmount(text: string): number | null {
  if (text.trim() === '') return null
  const value = Number(text)
  return Number.isNaN(value) ? null : value
}

// The search box, the filters and the sort choice above the expense list.
export default function ExpenseFilters({ categories }: Props) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.expenseFilters)

  // the text boxes keep their own copy so typing feels instant.
  // the store is only updated once the user pauses.
  const [searchText, setSearchText] = useState(filters.search)
  const [minText, setMinText] = useState(filters.minAmount?.toString() ?? '')
  const [maxText, setMaxText] = useState(filters.maxAmount?.toString() ?? '')
  // on a phone: are the filters open?
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText !== filters.search) {
        dispatch(setSearch(searchText))
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchText, filters.search, dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      const min = toAmount(minText)
      const max = toAmount(maxText)
      if (min !== filters.minAmount || max !== filters.maxAmount) {
        dispatch(setAmountRange({ min, max }))
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [minText, maxText, filters.minAmount, filters.maxAmount, dispatch])

  // Clears every filter and empties the boxes.
  function handleReset() {
    dispatch(resetFilters())
    setSearchText('')
    setMinText('')
    setMaxText('')
  }

  const sortValue = filters.sortBy + '-' + filters.sortOrder

  // how many of the hidden filters are in use, shown on the Filters button
  const activeCount = [
    filters.categoryId,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
    filters.minAmount,
    filters.maxAmount,
  ].filter((value) => value !== '' && value !== null).length

  // tell the user when a range can never match anything
  const dateRangeError = validateDateRange(filters.dateFrom, filters.dateTo)
  const amountRangeError = validateAmountRange(toAmount(minText), toAmount(maxText))

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, sm: 2 },
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        <TextField
          label="Search"
          placeholder="Title or notes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ gridColumn: { md: 'span 2' } }}
        />

        {/* on a phone the filters are hidden until this button is pressed, so the expenses stay in view */}
        <Button
          variant="outlined"
          startIcon={<FilterListOutlined />}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="more-filters"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          {activeCount > 0 ? `Filters (${activeCount})` : 'Filters'}
        </Button>

        {/* "contents" lets these fields sit in the grid as if the box was not there */}
        <Box id="more-filters" sx={{ display: { xs: open ? 'contents' : 'none', sm: 'contents' } }}>
          <TextField
            select
            label="Category"
            value={filters.categoryId}
            onChange={(e) => dispatch(setCategory(e.target.value))}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Payment"
            value={filters.paymentMethod}
            onChange={(e) => dispatch(setPaymentMethod(e.target.value as PaymentMethod | ''))}
          >
            <MenuItem value="">All methods</MenuItem>
            {PAYMENT_METHODS.map((method) => (
              <MenuItem key={method} value={method} sx={{ textTransform: 'capitalize' }}>
                {method}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => dispatch(setDateRange({ from: e.target.value, to: filters.dateTo }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={(e) => dispatch(setDateRange({ from: filters.dateFrom, to: e.target.value }))}
            error={Boolean(dateRangeError)}
            helperText={dateRangeError}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Min (RWF)"
            type="number"
            value={minText}
            onChange={(e) => setMinText(e.target.value)}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <TextField
            label="Max (RWF)"
            type="number"
            value={maxText}
            onChange={(e) => setMaxText(e.target.value)}
            error={Boolean(amountRangeError)}
            helperText={amountRangeError}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Box>

        <TextField
          select
          label="Sort by"
          value={sortValue}
          onChange={(e) => {
            const option = SORT_OPTIONS.find((o) => o.value === e.target.value)
            if (option) {
              dispatch(setSort({ sortBy: option.sortBy, sortOrder: option.sortOrder }))
            }
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleReset}>Clear filters</Button>
        </Box>
      </Box>
    </Paper>
  )
}
