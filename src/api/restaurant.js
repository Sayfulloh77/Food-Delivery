import http from './http'

export const categoryApi = {
  getAll: () => http.restaurant.get('/api/general-category'),
  getById: (id) => http.restaurant.get(`/api/general-category/${id}`),
  create: (data) => http.restaurant.post('/api/general-category', data),
  getRestaurants: (categoryName) => http.restaurant.get(`/api/categories/${categoryName}/restaurants`),
}

export const restaurantApi = {
  getAll: () => http.restaurant.get('/api/restaurants'),
  getById: (uuid) => http.restaurant.get(`/api/restaurant/${uuid}`),
  create: (data) => http.restaurant.post('/api/restaurants', data),
  getMenu: (restaurantId) => http.restaurant.get(`/api/restaurants/${restaurantId}/menu`),
}

export const menuitemApi = {
  getAll: () => http.restaurant.get(`/api/menu-items`),
  getById: (id) => http.restaurant.get(`/api/single-menu-item/${id}`),
  create: (data) => http.restaurant.post(`/api/menu-items`, data),
}

export const adsApi = {
  getAll: () => http.restaurant.get('/api/ads'),
  create: (data) => http.restaurant.post('/api/ads', data),
  delete: (adId) => http.restaurant.delete(`/api/ads/${adId}`),
}