// Why a notification was made.
export type NotificationType = 'new_user' | 'budget_set' | 'budget_warning'

// One message for the person who is signed in.
export interface Notification {
  _id: string
  type: NotificationType
  message: string
  read: boolean
  createdAt: string
}

// the latest notifications, plus how many of all are still unread
export interface NotificationList {
  items: Notification[]
  unreadCount: number
}
