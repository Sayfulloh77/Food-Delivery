import http from './http'

export const usersApi = {
  getAll: () => http.auth.get('/users'),
  activate: (id) => http.auth.patch(`/users/activate/${id}`),
  updateRole: (userId, roleId) => http.auth.patch('/users/role-update', { user_id: userId, role_id: roleId }),
  remove: (id) => http.auth.delete(`/users/${id}`),
}

export const customersApi = {
  getAll: () => http.auth.get('/customers'),
  update: (id, data) => http.auth.patch(`/customers/${id}`, data),
  remove: (id) => http.auth.delete(`/customers/${id}`),
}

export const couriersApi = {
  getAll: () => http.auth.get('/couriers'),
  update: (id, data) => http.auth.patch(`/couriers/${id}`, data),
  remove: (id) => http.auth.delete(`/couriers/${id}`),
}

export const restaurantOwnersApi = {
  getAll: () => http.auth.get('/restaurant-owners'),
  update: (id, data) => http.auth.patch(`/restaurant-owners/${id}`, data),
  remove: (id) => http.auth.delete(`/restaurant-owners/${id}`),
}

export const adminsApi = {
  getAll: () => http.auth.get('/admins'),
  getById: (id) => http.auth.get(`/admins/${id}`),
  create: (data) => http.auth.post('/admins', data),
  update: (id, data) => http.auth.patch(`/admins/${id}`, data),
  remove: (id) => http.auth.delete(`/admins/${id}`),
}

export const rolesApi = {
  getAll: () => http.auth.get('/roles'),
  getForClient: () => http.auth.get('/roles/for-client'),
}
