import http from './http'

export interface AdminPayload {
  name: string
  email: string
  password?: string
  role_id: number | null
}

export const usersApi = {
  getAll: () => http.auth.get('/users', { params: { limit: 100 } }),
  activate: (id: number) => http.auth.patch(`/users/activate/${id}`),
  updateRole: (userId: number, roleId: number) => http.auth.patch('/users/role-update', { user_id: userId, role_id: roleId }),
  remove: (id: number) => http.auth.delete(`/users/${id}`),
}

export const customersApi = {
  getAll: () => http.auth.get('/customers'),
  update: (id: number, data: Record<string, unknown>) => http.auth.patch(`/customers/${id}`, data),
  remove: (id: number) => http.auth.delete(`/customers/${id}`),
}

export const couriersApi = {
  getAll: () => http.auth.get('/couriers'),
  update: (id: number, data: Record<string, unknown>) => http.auth.patch(`/couriers/${id}`, data),
  remove: (id: number) => http.auth.delete(`/couriers/${id}`),
}

export const restaurantOwnersApi = {
  getAll: () => http.auth.get('/restaurant-owners'),
  update: (id: number, data: Record<string, unknown>) => http.auth.patch(`/restaurant-owners/${id}`, data),
  remove: (id: number) => http.auth.delete(`/restaurant-owners/${id}`),
}

export const adminsApi = {
  getAll: () => http.auth.get('/admins'),
  getById: (id: number) => http.auth.get(`/admins/${id}`),
  create: (data: AdminPayload) => http.auth.post('/admins', data),
  update: (id: number, data: Partial<AdminPayload>) => http.auth.patch(`/admins/${id}`, data),
  remove: (id: number) => http.auth.delete(`/admins/${id}`),
}

export const rolesApi = {
  getAll: () => http.auth.get('/roles'),
  getForClient: () => http.auth.get('/roles/for-client'),
}
