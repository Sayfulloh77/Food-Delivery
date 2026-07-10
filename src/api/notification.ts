import http from './http'

export interface AppNotification {
  id: string
  title: string
  body: string
  type?: string
  is_read: boolean
  created_at: string
}

export const notificationApi = {
  getAll: () => http.notification.get('/notifications'),
  markRead: (id: string) => http.notification.patch(`/notifications/${id}/read`),
  markAllRead: () => http.notification.patch(`/notifications/read-all`),
}
