import type { Expense } from './expense'
import type { User } from './user'

// How much one category is used, counting all users.
export interface CategoryStat {
  categoryId: string
  name: string
  // how many expenses use this category
  count: number
  // total RWF spent in this category
  total: number
}

// An expense plus the name of the person who made it.
export interface AdminExpense extends Expense {
  userName: string
}

// All the numbers on the admin dashboard.
export interface AdminInsights {
  totalUsers: number
  totalExpenses: number
  // in RWF
  totalValue: number
  expensesThisMonth: number
  // every category, biggest total first
  spendingPerCategory: CategoryStat[]
  topCategories: CategoryStat[]
  bottomCategories: CategoryStat[]
  recentExpenses: AdminExpense[]
  recentUsers: User[]
}
