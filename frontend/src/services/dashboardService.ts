import type { CategorySpending, DashboardData } from '../types/dashboard'
import type { Expense } from '../types/expense'
import { getBudgetSummary } from './budgetService'
import { getExpensesForMonth, getRecentExpenses } from './expenseService'

// Finds the most expensive expense in a list.
function findHighest(expenses: Expense[]): Expense | null {
  let highest: Expense | null = null
  for (const expense of expenses) {
    if (!highest || expense.amount > highest.amount) {
      highest = expense
    }
  }
  return highest
}

// Adds up the spending of each category, biggest first.
function totalsByCategory(expenses: Expense[]): CategorySpending[] {
  const totals: Record<string, number> = {}
  for (const expense of expenses) {
    totals[expense.categoryId] = (totals[expense.categoryId] || 0) + expense.amount
  }

  return Object.entries(totals)
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total)
}

// everything the user dashboard shows, for one month (like 2026-10)
export async function getDashboard(month: string): Promise<DashboardData> {
  const summary = await getBudgetSummary(month)
  const monthExpenses = getExpensesForMonth(month)

  return {
    summary: summary,
    highestExpense: findHighest(monthExpenses),
    spendingByCategory: totalsByCategory(monthExpenses),
    recentExpenses: getRecentExpenses(5),
  }
}
