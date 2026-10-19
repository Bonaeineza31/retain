import type { NotificationList } from '../types/notification'
import { request } from './api'

// Gets the latest notifications of the signed in person.
export function listNotifications(): Promise<NotificationList> {
  return request<NotificationList>('/api/notifications')
}

// Marks all the notifications of the signed in person as read.
export async function markAllRead(): Promise<void> {
  await request('/api/notifications/read', { method: 'PUT' })
}
