import type { ExpenseFiltersState } from '../store/expenseFiltersSlice'
import type { Expense, ExpenseInput, ExpenseList } from '../types/expense'
import { request } from './api'

// Gets one page of the user's expenses, after search, filters and sorting.
export function listExpenses(filters: ExpenseFiltersState): Promise<ExpenseList> {
  return request<ExpenseList>('/api/expenses', {
    query: {
      search: filters.search.trim(),
      categoryId: filters.categoryId,
      paymentMethod: filters.paymentMethod,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  })
}

// Gets a single expense.
export function getExpense(id: string): Promise<Expense> {
  return request<Expense>(`/api/expenses/${id}`)
}

// Saves a new expense.
export function createExpense(input: ExpenseInput): Promise<Expense> {
  return request<Expense>('/api/expenses', { method: 'POST', body: input })
}

// Changes an existing expense.
export function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  return request<Expense>(`/api/expenses/${id}`, { method: 'PUT', body: input })
}

// Deletes an expense.
export async function deleteExpense(id: string): Promise<void> {
  await request(`/api/expenses/${id}`, { method: 'DELETE' })
}
