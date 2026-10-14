import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { PaymentMethod } from '../types/expense'

export type SortBy = 'date' | 'amount'
export type SortOrder = 'asc' | 'desc'

export interface ExpenseFiltersState {
  search: string
  // an empty string means "all"
  categoryId: string
  paymentMethod: PaymentMethod | ''
  // YYYY-MM-DD, empty means no limit
  dateFrom: string
  dateTo: string
  // null means no limit
  minAmount: number | null
  maxAmount: number | null
  sortBy: SortBy
  sortOrder: SortOrder
  page: number
  pageSize: number
}

export const initialFilters: ExpenseFiltersState = {
  search: '',
  categoryId: '',
  paymentMethod: '',
  dateFrom: '',
  dateTo: '',
  minAmount: null,
  maxAmount: null,
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
}

const expenseFiltersSlice = createSlice({
  name: 'expenseFilters',
  initialState: initialFilters,
  reducers: {
    // every filter change sends the user back to page 1,
    // otherwise they could end up on a page that no longer exists
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setCategory(state, action: PayloadAction<string>) {
      state.categoryId = action.payload
      state.page = 1
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod | ''>) {
      state.paymentMethod = action.payload
      state.page = 1
    },
    setDateRange(state, action: PayloadAction<{ from: string; to: string }>) {
      state.dateFrom = action.payload.from
      state.dateTo = action.payload.to
      state.page = 1
    },
    setAmountRange(
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>,
    ) {
      state.minAmount = action.payload.min
      state.maxAmount = action.payload.max
      state.page = 1
    },
    setSort(state, action: PayloadAction<{ sortBy: SortBy; sortOrder: SortOrder }>) {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload
      state.page = 1
    },
    resetFilters() {
      return initialFilters
    },
  },
})

export const {
  setSearch,
  setCategory,
  setPaymentMethod,
  setDateRange,
  setAmountRange,
  setSort,
  setPage,
  setPageSize,
  resetFilters,
} = expenseFiltersSlice.actions

export default expenseFiltersSlice.reducer
