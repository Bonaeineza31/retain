import type { DashboardData } from '../types/dashboard'
import { request } from './api'

// Gets everything the user dashboard shows, for one month like 2026-10.
export function getDashboard(month: string): Promise<DashboardData> {
  return request<DashboardData>('/api/dashboard', { query: { month } })
}
