import type { BudgetSummary } from './budget'
import type { Expense } from './expense'

export interface CategorySpending {
  categoryId: string
  total: number
}

export interface DashboardData {
  summary: BudgetSummary
  // the biggest single expense of the month, null when there are none
  highestExpense: Expense | null
  // biggest category first
  spendingByCategory: CategorySpending[]
  // the latest expenses overall, not only this month
  recentExpenses: Expense[]
}
