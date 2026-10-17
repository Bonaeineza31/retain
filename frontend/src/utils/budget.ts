import type { BudgetStatus } from '../types/budget'

// the backend decides the status. here we only say how to show it
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
