import type { AdminExpenseList, AdminInsights, AdminUserList } from '../types/admin'
import { request } from './api'

// Gets the platform numbers for the admin dashboard. Admins only.
export function getInsights(): Promise<AdminInsights> {
  return request<AdminInsights>('/api/admin/insights')
}

// Gets one page of the registered users. Admins only.
export function listUsers(search: string, page: number): Promise<AdminUserList> {
  return request<AdminUserList>('/api/admin/users', { query: { search: search.trim(), page } })
}

// Gets one page of the expenses of all users. Admins only.
export function listAllExpenses(search: string, categoryId: string, page: number): Promise<AdminExpenseList> {
  return request<AdminExpenseList>('/api/admin/expenses', { query: { search: search.trim(), categoryId, page } })
}
