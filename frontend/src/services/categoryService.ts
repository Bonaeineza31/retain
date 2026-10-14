import type { Category, CategoryInput } from '../types/category'
import { getSessionUser, requireAdmin } from './authService'
import { moveExpensesToCategory } from './expenseService'
import { mockCategories } from './mockData'

const CATEGORIES_KEY = 'retain.categories'

// Reads the categories from the browser's storage (mock only).
function getCategories(): Category[] {
  const saved = localStorage.getItem(CATEGORIES_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return mockCategories
}

// Saves the categories in the browser's storage (mock only).
function saveCategories(categories: Category[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}

// Stops if another category already uses this name.
function checkNameIsFree(name: string, ignoreId?: string) {
  const taken = getCategories().some(
    (c) => c.id !== ignoreId && c.name.toLowerCase() === name.toLowerCase(),
  )
  if (taken) {
    throw new Error('A category with this name already exists')
  }
}

// the plain list, for other mock services that need the categories (mock only)
export function getEveryCategory(): Category[] {
  return getCategories()
}

// any signed in user can read the categories
export async function listCategories(): Promise<Category[]> {
  if (!getSessionUser()) {
    throw new Error('You need to sign in first')
  }
  return getCategories()
}

// Creates a category. Admins only.
export async function createCategory(input: CategoryInput): Promise<Category> {
  requireAdmin()
  const name = input.name.trim()
  checkNameIsFree(name)

  const category: Category = {
    id: 'c' + Date.now(),
    name: name,
    isDefault: false,
    createdAt: new Date().toISOString(),
  }
  saveCategories([...getCategories(), category])
  return category
}

// Renames a category. Admins only.
export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  requireAdmin()
  const existing = getCategories().find((c) => c.id === id)
  if (!existing) {
    throw new Error('Category not found')
  }
  if (existing.isDefault) {
    throw new Error('The default category cannot be renamed')
  }

  const name = input.name.trim()
  checkNameIsFree(name, id)

  const updated: Category = { ...existing, name: name }
  saveCategories(getCategories().map((c) => (c.id === id ? updated : c)))
  return updated
}

// expenses in a deleted category move to the default one (Uncategorized)
export async function deleteCategory(id: string): Promise<void> {
  requireAdmin()
  const categories = getCategories()
  const existing = categories.find((c) => c.id === id)
  if (!existing) {
    throw new Error('Category not found')
  }
  if (existing.isDefault) {
    throw new Error('The default category cannot be deleted')
  }

  const fallback = categories.find((c) => c.isDefault)
  if (!fallback) {
    throw new Error('There is no default category to move the expenses to')
  }

  moveExpensesToCategory(id, fallback.id)
  saveCategories(categories.filter((c) => c.id !== id))
}
