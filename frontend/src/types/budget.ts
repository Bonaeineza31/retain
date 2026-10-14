// How the spending compares to the budget.
export type BudgetStatus = 'within' | 'approaching' | 'over'

// The amount a user plans to spend in one month.
export interface Budget {
  id: string
  userId: string
  // YYYY-MM
  month: string
  // in RWF
  amount: number
}

// What the budget form sends.
export interface BudgetInput {
  month: string
  amount: number
}

// A month's budget together with how much was spent.
export interface BudgetSummary {
  budget: Budget | null
  spent: number
  remaining: number
  status: BudgetStatus
}
