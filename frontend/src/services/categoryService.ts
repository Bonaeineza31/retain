import type { Category, CategoryInput } from '../types/category'
import { request } from './api'

// Gets all the categories.
export function listCategories(): Promise<Category[]> {
  return request<Category[]>('/api/categories')
}

// Creates a category. Admins only.
export function createCategory(input: CategoryInput): Promise<Category> {
  return request<Category>('/api/categories', { method: 'POST', body: input })
}

// Renames a category. Admins only.
export function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  return request<Category>(`/api/categories/${id}`, { method: 'PUT', body: input })
}

// Deletes a category. Its expenses move to the default category. Admins only.
export function deleteCategory(id: string): Promise<{ movedExpenses: number }> {
  return request<{ movedExpenses: number }>(`/api/categories/${id}`, { method: 'DELETE' })
}
