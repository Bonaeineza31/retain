import { PAYMENT_METHODS } from '../types/expense'
import { todayAsText } from './format'

// Every validator returns an error message, or null when the value is fine.

// Checks the email looks right: one @, a proper domain and no spaces.
export function validateEmail(value: string): string | null {
  const email = value.trim()

  if (!email) return 'Email is required'
  if (email.length > 254) return 'Email is too long'
  if (/\s/.test(email)) return 'Email cannot contain spaces'

  const parts = email.split('@')
  if (parts.length < 2) return 'Email must contain an @'
  if (parts.length > 2) return 'Email can only contain one @'

  const [local, domain] = parts
  if (!local) return 'Email is missing the part before the @'
  if (local.length > 64) return 'The part before the @ is too long'
  if (!domain) return 'Email is missing the domain after the @'

  if (local.startsWith('.') || local.endsWith('.')) {
    return 'Email cannot start or end with a dot before the @'
  }
  if (email.includes('..')) return 'Email cannot contain two dots in a row'
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) {
    return 'Email contains a character that is not allowed'
  }

  if (!domain.includes('.')) return 'Email domain must contain a dot, like gmail.com'
  const labels = domain.split('.')
  for (const label of labels) {
    if (!label) return 'Email domain is not valid'
    if (!/^[A-Za-z0-9-]+$/.test(label)) return 'Email domain is not valid'
    if (label.startsWith('-') || label.endsWith('-')) {
      return 'Email domain is not valid'
    }
  }
  const ending = labels[labels.length - 1]
  if (ending.length < 2 || /\d/.test(ending)) {
    return 'Email must end with a valid domain like .com or .rw'
  }

  return null
}

// Checks the password is long enough and has a letter and a number.
export function validatePassword(value: string): string | null {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (value.length > 64) return 'Password must be 64 characters or fewer'
  if (/\s/.test(value)) return 'Password cannot contain spaces'
  if (!/[A-Za-z]/.test(value)) return 'Password needs at least one letter'
  if (!/\d/.test(value)) return 'Password needs at least one number'
  return null
}

// Checks the second password box matches the first.
export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return null
}

// Checks the name is made of letters and is not too short or long.
export function validateName(value: string): string | null {
  const name = value.trim()

  if (!name) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters'
  if (name.length > 50) return 'Name must be 50 characters or fewer'
  if (!/^\p{L}[\p{L}\s'.-]*$/u.test(name)) {
    return 'Name can only contain letters, spaces, apostrophes, dots and hyphens'
  }
  return null
}

// Checks the title is not empty and not too long.
export function validateTitle(value: string): string | null {
  const title = value.trim()

  if (!title) return 'Title is required'
  if (title.length < 2) return 'Title must be at least 2 characters'
  if (title.length > 80) return 'Title must be 80 characters or fewer'
  return null
}

// the form gives us text, so the amount arrives as a string
export function validateAmount(value: string): string | null {
  const text = value.trim()

  if (!text) return 'Amount is required'
  const amount = Number(text)
  if (Number.isNaN(amount)) return 'Amount must be a number'
  if (!Number.isFinite(amount)) return 'Amount is not valid'
  if (amount <= 0) return 'Amount must be greater than 0'
  if (!Number.isInteger(amount)) return 'Amount must be a whole number of RWF'
  if (amount > 1_000_000_000) return 'Amount is too large'
  return null
}

// expects YYYY-MM-DD, which is what the date input gives us
export function validateDate(value: string): string | null {
  if (!value) return 'Date is required'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Date is not valid'

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  if (!isRealDate) return 'That date does not exist'

  if (year < 2000) return 'Date is too far in the past'
  if (value > todayAsText()) return 'Date cannot be in the future'
  return null
}

// Checks that a category was picked.
export function validateCategoryChoice(value: string): string | null {
  if (!value) return 'Please choose a category'
  return null
}

// Checks that a payment method was picked and it is a real one.
export function validatePaymentMethod(value: string): string | null {
  if (!value) return 'Please choose a payment method'
  if (!(PAYMENT_METHODS as readonly string[]).includes(value)) {
    return 'Payment method is not valid'
  }
  return null
}

// Checks the notes are not too long.
export function validateNotes(value: string): string | null {
  if (value.length > 300) return 'Notes must be 300 characters or fewer'
  return null
}

// month looks like 2026-10
export function validateBudgetMonth(value: string): string | null {
  if (!value) return 'Month is required'
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return 'Month is not valid'
  return null
}

// Checks the budget is a whole number above zero.
export function validateBudgetAmount(value: string): string | null {
  const text = value.trim()

  if (!text) return 'Budget amount is required'
  const amount = Number(text)
  if (Number.isNaN(amount)) return 'Budget must be a number'
  if (amount <= 0) return 'Budget must be greater than 0'
  if (!Number.isInteger(amount)) return 'Budget must be a whole number of RWF'
  if (amount > 1_000_000_000) return 'Budget is too large'
  return null
}

// existingNames are the categories already in the system
export function validateCategoryName(
  value: string,
  existingNames: string[],
): string | null {
  const name = value.trim()

  if (!name) return 'Category name is required'
  if (name.length < 2) return 'Category name must be at least 2 characters'
  if (name.length > 30) return 'Category name must be 30 characters or fewer'

  const taken = existingNames.some((n) => n.toLowerCase() === name.toLowerCase())
  if (taken) return 'A category with this name already exists'
  return null
}

// Whole-form checks. Each returns only the fields that have an error,
// so an empty object means the form is valid.

export interface SignUpFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

function collect<T>(checks: [keyof T, string | null][]): FormErrors<T> {
  const errors: FormErrors<T> = {}
  for (const [field, message] of checks) {
    if (message) errors[field] = message
  }
  return errors
}

export function validateSignUpForm(
  values: SignUpFormValues,
): FormErrors<SignUpFormValues> {
  return collect<SignUpFormValues>([
    ['name', validateName(values.name)],
    ['email', validateEmail(values.email)],
    ['password', validatePassword(values.password)],
    ['confirmPassword', validateConfirmPassword(values.password, values.confirmPassword)],
  ])
}

export interface SignInFormValues {
  email: string
  password: string
}

// on sign in we only check that something was typed in,
// the real password rules apply when the account is created
export function validateSignInForm(
  values: SignInFormValues,
): FormErrors<SignInFormValues> {
  return collect<SignInFormValues>([
    ['email', validateEmail(values.email)],
    ['password', values.password ? null : 'Password is required'],
  ])
}

export interface ExpenseFormValues {
  title: string
  amount: string
  categoryId: string
  date: string
  paymentMethod: string
  notes: string
}

export function validateExpenseForm(
  values: ExpenseFormValues,
): FormErrors<ExpenseFormValues> {
  return collect<ExpenseFormValues>([
    ['title', validateTitle(values.title)],
    ['amount', validateAmount(values.amount)],
    ['categoryId', validateCategoryChoice(values.categoryId)],
    ['date', validateDate(values.date)],
    ['paymentMethod', validatePaymentMethod(values.paymentMethod)],
    ['notes', validateNotes(values.notes)],
  ])
}

export interface BudgetFormValues {
  month: string
  amount: string
}

export function validateBudgetForm(
  values: BudgetFormValues,
): FormErrors<BudgetFormValues> {
  return collect<BudgetFormValues>([
    ['month', validateBudgetMonth(values.month)],
    ['amount', validateBudgetAmount(values.amount)],
  ])
}
