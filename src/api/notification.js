import http from './http'

export const notificationApi = {
  getAll: () => http.notification.get('/notifications'),
  markRead: (id) => http.notification.patch(`/notifications/${id}/read`),
  markAllRead: () => http.notification.patch(`/notifications/read-all`),
}
