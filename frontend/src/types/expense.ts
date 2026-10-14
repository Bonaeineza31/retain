// The ways to pay. The form and the filter both use this list.
export const PAYMENT_METHODS = [
  'cash',
  'mobile money',
  'card',
  'bank transfer',
] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

// One thing the user spent money on.
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

// What the expense form sends: everything except what the system fills in.
export type ExpenseInput = Omit<Expense, 'id' | 'userId' | 'createdAt'>

// one page of expenses, plus how many match in total
export interface ExpenseList {
  items: Expense[]
  total: number
}
