export const PAYMENT_METHODS = [
  'cash',
  'mobile money',
  'card',
  'bank transfer',
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export interface Expense {
  id: string
  userId: string
  title: string
  // in RWF
  amount: number
  categoryId: string
  // YYYY-MM-DD
  date: string
  paymentMethod: PaymentMethod
  notes?: string
  createdAt: string
}

export type ExpenseInput = Omit<Expense, 'id' | 'userId' | 'createdAt'>

// one page of expenses, plus how many match in total
export interface ExpenseList {
  items: Expense[]
  total: number
}
