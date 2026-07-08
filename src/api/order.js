import http from './http'

export const orderApi = {
  getAll: () => http.order.get('/orders'),
  getById: (id) => http.order.get(`/orders/${id}`),
  getByRestaurant: (restaurantId) => http.order.get(`/orders/restaurant/${restaurantId}`),
  create: (data) => http.order.post('/orders', data),
  updateStatus: (id, status) => http.order.patch(`/orders/${id}/status`, { status }),
  // data: { courierId, orderId, courierName, phoneNumber } — matches the live order service's
  // POST /courier/assign-to-order (there is no /orders/:id/assign-courier endpoint).
  assignCourier: (data) => http.order.post('/courier/assign-to-order', data),
  getAvailableForCourier: () => http.order.get('/courier/available-orders'),
  getDeliveringForCourier: () => http.order.get('/courier/delivering-orders'),
  getCourierHistory: () => http.order.get('/courier/history'),
}
