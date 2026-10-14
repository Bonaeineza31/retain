import type { AdminExpense, AdminInsights, CategoryStat } from '../types/admin'
import type { Category } from '../types/category'
import type { Expense } from '../types/expense'
import type { User } from '../types/user'
import { currentMonth } from '../utils/format'
import { getAllUsers, requireAdmin } from './authService'
import { getEveryCategory } from './categoryService'
import { getEveryExpense } from './expenseService'

function buildCategoryStats(categories: Category[], expenses: Expense[]): CategoryStat[] {
  return categories.map((category) => {
    const used = expenses.filter((e) => e.categoryId === category.id)
    return {
      categoryId: category.id,
      name: category.name,
      count: used.length,
      total: used.reduce((sum, e) => sum + e.amount, 0),
    }
  })
}

// platform wide numbers for the admin dashboard
export async function getInsights(): Promise<AdminInsights> {
  requireAdmin()

  const users = getAllUsers().filter((u) => u.role === 'user')
  const expenses = getEveryExpense()
  const stats = buildCategoryStats(getEveryCategory(), expenses)

  const userNames: Record<string, string> = {}
  getAllUsers().forEach((u) => {
    userNames[u.id] = u.name
  })

  const month = currentMonth()

  // most used first. when two are tied, the one with more money comes first
  const mostUsedFirst = [...stats].sort((a, b) => b.count - a.count || b.total - a.total)
  const leastUsedFirst = [...stats].sort((a, b) => a.count - b.count || a.total - b.total)

  const recentExpenses: AdminExpense[] = [...expenses]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((e) => ({ ...e, userName: userNames[e.userId] || 'Unknown user' }))

  const recentUsers: User[] = [...users]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  return {
    totalUsers: users.length,
    totalExpenses: expenses.length,
    totalValue: expenses.reduce((sum, e) => sum + e.amount, 0),
    expensesThisMonth: expenses.filter((e) => e.date.startsWith(month)).length,
    spendingPerCategory: [...stats].sort((a, b) => b.total - a.total),
    topCategories: mostUsedFirst.slice(0, 5),
    bottomCategories: leastUsedFirst.slice(0, 5),
    recentExpenses: recentExpenses,
    recentUsers: recentUsers,
  }
}
