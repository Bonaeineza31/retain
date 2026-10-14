import type { ExpenseFiltersState } from '../store/expenseFiltersSlice'
import type { Expense, ExpenseInput, ExpenseList } from '../types/expense'
import { getSessionUserId } from './authService'
import { mockExpenses } from './mockData'

const EXPENSES_KEY = 'retain.expenses'

// Reads every expense from the browser's storage (mock only).
function getAllExpenses(): Expense[] {
  const saved = localStorage.getItem(EXPENSES_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return mockExpenses
}

// Saves every expense in the browser's storage (mock only).
function saveExpenses(expenses: Expense[]) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

// Gives the id of the signed in person, or stops if nobody is signed in.
function requireUserId(): string {
  const userId = getSessionUserId()
  if (!userId) {
    throw new Error('You need to sign in first')
  }
  return userId
}

// the expenses of the signed in user only
function getMyExpenses(): Expense[] {
  const userId = requireUserId()
  return getAllExpenses().filter((e) => e.userId === userId)
}

// every expense of every user, for the admin insights (mock only)
export function getEveryExpense(): Expense[] {
  return getAllExpenses()
}

// the helpers below are used by the budget and dashboard services.
// the real backend does this work inside those endpoints.

// expenses of the signed in user in one month (month looks like 2026-10)
export function getExpensesForMonth(month: string): Expense[] {
  return getMyExpenses().filter((e) => e.date.startsWith(month))
}

export function sumExpensesForMonth(month: string): number {
  return getExpensesForMonth(month).reduce((total, e) => total + e.amount, 0)
}

// the latest expenses of the signed in user, newest first
export function getRecentExpenses(limit: number): Expense[] {
  return [...getMyExpenses()]
    .sort((a, b) => {
      if (a.date === b.date) return b.createdAt.localeCompare(a.createdAt)
      return b.date.localeCompare(a.date)
    })
    .slice(0, limit)
}

// Says if one expense passes the search and all the filters.
function matchesFilters(expense: Expense, filters: ExpenseFiltersState): boolean {
  const search = filters.search.trim().toLowerCase()
  if (search) {
    const text = (expense.title + ' ' + (expense.notes || '')).toLowerCase()
    if (!text.includes(search)) return false
  }

  if (filters.categoryId && expense.categoryId !== filters.categoryId) return false
  if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) return false

  if (filters.dateFrom && expense.date < filters.dateFrom) return false
  if (filters.dateTo && expense.date > filters.dateTo) return false

  if (filters.minAmount !== null && expense.amount < filters.minAmount) return false
  if (filters.maxAmount !== null && expense.amount > filters.maxAmount) return false

  return true
}

// Puts the expenses in order: by date or amount, going up or down.
function sortExpenses(expenses: Expense[], filters: ExpenseFiltersState): Expense[] {
  const direction = filters.sortOrder === 'asc' ? 1 : -1

  return [...expenses].sort((a, b) => {
    if (filters.sortBy === 'amount') {
      return (a.amount - b.amount) * direction
    }
    // same date: the one added later counts as newer
    if (a.date === b.date) {
      return a.createdAt.localeCompare(b.createdAt) * direction
    }
    return a.date.localeCompare(b.date) * direction
  })
}

// Gets one page of the user's expenses, after search, filters and sorting.
export async function listExpenses(filters: ExpenseFiltersState): Promise<ExpenseList> {
  const matching = getMyExpenses().filter((e) => matchesFilters(e, filters))
  const sorted = sortExpenses(matching, filters)

  const start = (filters.page - 1) * filters.pageSize
  return {
    items: sorted.slice(start, start + filters.pageSize),
    total: sorted.length,
  }
}

// Gets a single expense. Fails if it belongs to someone else.
export async function getExpense(id: string): Promise<Expense> {
  const expense = getMyExpenses().find((e) => e.id === id)
  if (!expense) {
    throw new Error('Expense not found')
  }
  return expense
}

// Saves a new expense for the signed in person.
export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const userId = requireUserId()

  const expense: Expense = {
    ...input,
    id: 'e' + Date.now(),
    userId: userId,
    createdAt: new Date().toISOString(),
  }

  saveExpenses([...getAllExpenses(), expense])
  return expense
}

// Changes an existing expense.
export async function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  const existing = await getExpense(id)
  const updated: Expense = { ...existing, ...input }

  saveExpenses(getAllExpenses().map((e) => (e.id === id ? updated : e)))
  return updated
}

// used when an admin deletes a category: its expenses move to another one.
// the real backend does this inside the delete category endpoint.
export function moveExpensesToCategory(fromId: string, toId: string) {
  saveExpenses(
    getAllExpenses().map((e) =>
      e.categoryId === fromId ? { ...e, categoryId: toId } : e,
    ),
  )
}

export async function deleteExpense(id: string): Promise<void> {
  // this also makes sure the expense belongs to the signed in user
  await getExpense(id)
  saveExpenses(getAllExpenses().filter((e) => e.id !== id))
}
