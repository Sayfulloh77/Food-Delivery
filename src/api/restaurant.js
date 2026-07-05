import http from './http'

export const categoryApi = {
  getAll: () => http.restaurant.get('/api/general-category'),
  getById: (id) => http.restaurant.get(`/api/general-category/${id}`),
  create: (data) => http.restaurant.post('/api/general-category', data),
  delete: (id) => http.restaurant.delete(`/api/general-category/${id}`),
  getRestaurants: (categoryName) => http.restaurant.get(`/api/category/restaurants/${categoryName}`),
}

export const menuCategoryApi = {
  getAll: () => http.restaurant.get('/api/menu-category'),
  getById: (id) => http.restaurant.get(`/api/menu-category/${id}`),
  create: (data) => http.restaurant.post('/api/menu-category', data),
  delete: (id) => http.restaurant.delete(`/api/menu-category/${id}`),
}

export const restaurantApi = {
  getAll: () => http.restaurant.get('/api/restaurants'),
  getByOwner: (ownerId) => http.restaurant.get('/api/restaurants-by-owner-id', { params: { owner_id: ownerId } }),
  getById: (uuid) => http.restaurant.get(`/api/restaurant/${uuid}`),
  create: (data) => http.restaurant.post('/api/restaurants', data),
  update: (uuid, data) => http.restaurant.patch(`/api/restaurant/${uuid}`, data),
  delete: (uuid) => http.restaurant.delete(`/api/restaurant/${uuid}`),
  getMenu: (restaurantId) => http.restaurant.get(`/api/restaurants/${restaurantId}/menu`),
}

export const menuitemApi = {
  getAll: () => http.restaurant.get(`/api/menu-items`),
  getById: (id) => http.restaurant.get(`/api/menu-items/${id}`),
  create: (data) => http.restaurant.post(`/api/menu-items`, data),
  delete: (id) => http.restaurant.delete(`/api/menu-items/${id}`),
}

export const adsApi = {
  getAll: () => http.restaurant.get('/api/ads'),
  create: (data) => http.restaurant.post('/api/ads', data),
  delete: (adId) => http.restaurant.delete(`/api/ads/${adId}`),
}

export const searchApi = {
  search: (query) => http.restaurant.get('/api/search', { params: { query } }),
}