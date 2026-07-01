import http from './http'

export const orderApi = {
  getAll: () => http.order.get('/orders'),
  getById: (id) => http.order.get(`/orders/${id}`),
  create: (data) => http.order.post('/orders', data),
  updateStatus: (id, status) => http.order.patch(`/orders/${id}/status`, { status }),
  assignCourier: (id, courierId) => http.order.post(`/orders/${id}/assign-courier`, { courierId }),
}
