import { configureStore } from '@reduxjs/toolkit'
import expenseFiltersReducer from './expenseFiltersSlice'

// The one Redux store for the whole app.
export const store = configureStore({
  reducer: {
    expenseFilters: expenseFiltersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
