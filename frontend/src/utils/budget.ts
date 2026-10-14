import type { BudgetStatus } from '../types/budget'

// "approaching" starts once 80% of the budget is spent
export const APPROACHING_AT = 0.8

// Decides within, approaching or over, from what was spent and the budget.
export function getBudgetStatus(spent: number, budgetAmount: number): BudgetStatus {
  if (spent > budgetAmount) return 'over'
  if (spent >= budgetAmount * APPROACHING_AT) return 'approaching'
  return 'within'
}

export const STATUS_LABEL: Record<BudgetStatus, string> = {
  within: 'Within budget',
  approaching: 'Approaching budget',
  over: 'Over budget',
}

// these match the success, warning and error colors in the theme
export const STATUS_COLOR: Record<BudgetStatus, 'success' | 'warning' | 'error'> = {
  within: 'success',
  approaching: 'warning',
  over: 'error',
}
