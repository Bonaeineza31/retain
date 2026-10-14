export type BudgetStatus = 'within' | 'approaching' | 'over'

export interface Budget {
  id: string
  userId: string
  // YYYY-MM
  month: string
  // in RWF
  amount: number
}

export interface BudgetInput {
  month: string
  amount: number
}

export interface BudgetSummary {
  budget: Budget | null
  spent: number
  remaining: number
  status: BudgetStatus
}
