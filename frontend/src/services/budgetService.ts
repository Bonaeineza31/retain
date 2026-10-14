import type { Budget, BudgetInput, BudgetSummary } from '../types/budget'
import { getBudgetStatus } from '../utils/budget'
import { getSessionUserId } from './authService'
import { sumExpensesForMonth } from './expenseService'
import { mockBudgets } from './mockData'

const BUDGETS_KEY = 'retain.budgets'

// Reads every budget from the browser's storage (mock only).
function getAllBudgets(): Budget[] {
  const saved = localStorage.getItem(BUDGETS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return mockBudgets
}

// Saves every budget in the browser's storage (mock only).
function saveBudgets(budgets: Budget[]) {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets))
}

// Gives the id of the signed in person, or stops if nobody is signed in.
function requireUserId(): string {
  const userId = getSessionUserId()
  if (!userId) {
    throw new Error('You need to sign in first')
  }
  return userId
}

// the budget and the spending of one month, for the signed in user
export async function getBudgetSummary(month: string): Promise<BudgetSummary> {
  const userId = requireUserId()
  const budget = getAllBudgets().find((b) => b.userId === userId && b.month === month)
  const spent = sumExpensesForMonth(month)

  if (!budget) {
    return { budget: null, spent: spent, remaining: 0, status: 'within' }
  }

  return {
    budget: budget,
    spent: spent,
    remaining: budget.amount - spent,
    status: getBudgetStatus(spent, budget.amount),
  }
}

// sets the budget of a month: creates it, or updates it if it already exists
export async function saveBudget(input: BudgetInput): Promise<Budget> {
  const userId = requireUserId()
  const budgets = getAllBudgets()
  const existing = budgets.find((b) => b.userId === userId && b.month === input.month)

  if (existing) {
    const updated: Budget = { ...existing, amount: input.amount }
    saveBudgets(budgets.map((b) => (b.id === existing.id ? updated : b)))
    return updated
  }

  const created: Budget = {
    id: 'b' + Date.now(),
    userId: userId,
    month: input.month,
    amount: input.amount,
  }
  saveBudgets([...budgets, created])
  return created
}
