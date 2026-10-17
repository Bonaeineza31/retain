import type { AdminInsights } from '../types/admin'
import { request } from './api'

// Gets the platform numbers for the admin dashboard. Admins only.
export function getInsights(): Promise<AdminInsights> {
  return request<AdminInsights>('/api/admin/insights')
}
