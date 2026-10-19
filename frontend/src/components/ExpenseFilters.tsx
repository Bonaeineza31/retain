import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
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
import { formatRWF } from '../utils/format'
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

function toAmount(text: string): number | null {
  if (text.trim() === '') return null
  const value = Number(text)
  return Number.isNaN(value) ? null : value
}

export default function ExpenseFilters({ categories }: Props) {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.expenseFilters)

  const [searchText, setSearchText] = useState(filters.search)
  const [minText, setMinText] = useState(filters.minAmount?.toString() ?? '')
  const [maxText, setMaxText] = useState(filters.maxAmount?.toString() ?? '')
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

  function handleReset() {
    dispatch(resetFilters())
    setSearchText('')
    setMinText('')
    setMaxText('')
  }

  const sortValue = filters.sortBy + '-' + filters.sortOrder

  const activeCount = [
    filters.categoryId,
    filters.paymentMethod,
    filters.dateFrom,
    filters.dateTo,
    filters.minAmount,
    filters.maxAmount,
  ].filter((value) => value !== '' && value !== null).length

  const dateRangeError = validateDateRange(filters.dateFrom, filters.dateTo)
  const amountRangeError = validateAmountRange(toAmount(minText), toAmount(maxText))

  const selectedCategoryName = categories.find((c) => c._id === filters.categoryId)?.name

  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 1.5, sm: 2 },
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        <TextField
          label="Search"
          placeholder="Title or notes"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ gridColumn: { md: 'span 2' } }}
        />

        {/* on a phone the filters are hidden until this button is pressed */}
        <Button
          variant="outlined"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="more-filters"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          {activeCount > 0 ? `Filters (${activeCount})` : 'Filters'}
        </Button>

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

      {/* Active filter pills (without icons) */}
      {(filters.categoryId ||
        filters.paymentMethod ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.minAmount !== null ||
        filters.maxAmount !== null ||
        filters.search) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Active:
          </Typography>

          {filters.search && (
            <Chip
              size="small"
              label={`Search: "${filters.search}"`}
              onDelete={() => {
                setSearchText('')
                dispatch(setSearch(''))
              }}
            />
          )}

          {filters.categoryId && (
            <Chip
              size="small"
              label={`Category: ${selectedCategoryName || 'Selected'}`}
              onDelete={() => dispatch(setCategory(''))}
            />
          )}

          {filters.paymentMethod && (
            <Chip
              size="small"
              label={`Payment: ${filters.paymentMethod}`}
              onDelete={() => dispatch(setPaymentMethod(''))}
              sx={{ textTransform: 'capitalize' }}
            />
          )}

          {filters.dateFrom && (
            <Chip
              size="small"
              label={`From: ${filters.dateFrom}`}
              onDelete={() => dispatch(setDateRange({ from: '', to: filters.dateTo }))}
            />
          )}

          {filters.dateTo && (
            <Chip
              size="small"
              label={`To: ${filters.dateTo}`}
              onDelete={() => dispatch(setDateRange({ from: filters.dateFrom, to: '' }))}
            />
          )}

          {filters.minAmount !== null && (
            <Chip
              size="small"
              label={`Min: ${formatRWF(filters.minAmount)}`}
              onDelete={() => {
                setMinText('')
                dispatch(setAmountRange({ min: null, max: filters.maxAmount }))
              }}
            />
          )}

          {filters.maxAmount !== null && (
            <Chip
              size="small"
              label={`Max: ${formatRWF(filters.maxAmount)}`}
              onDelete={() => {
                setMaxText('')
                dispatch(setAmountRange({ min: filters.minAmount, max: null }))
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  )
}
