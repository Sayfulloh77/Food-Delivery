import http from './http'

export const cartApi = {
  get: () => http.order.get('/cart'),
  addItem: (data) => http.order.post('/cart/items', data),
  removeItem: (itemId) => http.order.delete(`/cart/items/${itemId}`),
}

export const orderApi = {
  getAll: () => http.order.get('/orders'),
  getById: (id) => http.order.get(`/orders/${id}`),
  create: (data) => http.order.post('/orders', data),
  updateStatus: (id, status) => http.order.patch(`/orders/${id}/status`, { status }),
  assignCourier: (id, courierId) => http.order.post(`/orders/${id}/assign-courier`, { courierId }),
}
