import type { Budget, BudgetInput, BudgetSummary } from '../types/budget'
import { request } from './api'

// Gets the budget of a month, what was spent, what is left and the status.
export function getBudgetSummary(month: string): Promise<BudgetSummary> {
  return request<BudgetSummary>('/api/budgets/summary', { query: { month } })
}

// Sets the budget of a month. It is created, or changed if the month already has one.
export function saveBudget(input: BudgetInput): Promise<Budget> {
  return request<Budget>('/api/budgets', { method: 'PUT', body: input })
}
