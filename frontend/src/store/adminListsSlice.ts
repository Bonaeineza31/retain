import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// What the admin typed or chose on the page with all users.
export interface AdminUsersState {
  search: string
  page: number
}

// What the admin typed or chose on the page with all expenses. An empty categoryId means "all".
export interface AdminExpensesState {
  search: string
  categoryId: string
  page: number
}

export interface AdminListsState {
  users: AdminUsersState
  expenses: AdminExpensesState
}

const initialState: AdminListsState = {
  users: { search: '', page: 1 },
  expenses: { search: '', categoryId: '', page: 1 },
}

// Keeps the search and the page of the two admin lists. A new search or filter goes back to page 1.
const adminListsSlice = createSlice({
  name: 'adminLists',
  initialState,
  reducers: {
    setUsersSearch(state, action: PayloadAction<string>) {
      state.users.search = action.payload
      state.users.page = 1
    },
    setUsersPage(state, action: PayloadAction<number>) {
      state.users.page = action.payload
    },
    setExpensesSearch(state, action: PayloadAction<string>) {
      state.expenses.search = action.payload
      state.expenses.page = 1
    },
    setExpensesCategory(state, action: PayloadAction<string>) {
      state.expenses.categoryId = action.payload
      state.expenses.page = 1
    },
    setExpensesPage(state, action: PayloadAction<number>) {
      state.expenses.page = action.payload
    },
    clearExpensesFilters(state) {
      state.expenses = initialState.expenses
    },
    resetAdminLists() {
      return initialState
    },
  },
})

export const {
  setUsersSearch,
  setUsersPage,
  setExpensesSearch,
  setExpensesCategory,
  setExpensesPage,
  clearExpensesFilters,
  resetAdminLists,
} = adminListsSlice.actions
export default adminListsSlice.reducer
