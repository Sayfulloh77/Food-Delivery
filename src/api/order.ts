import http from './http'
import type { OrderStatus } from '@/constants/orderStatus'

export interface OrderItem {
  id: string
  name: string
  qty: number
  price: number | string
}

export interface Order {
  id: string
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number | string
  createdAt: string
  restaurantName?: string
  restaurantAddress?: string
  deliveryAddress?: string
  courierName?: string
}

export interface CreateOrderItemPayload {
  menuItemId: number
  name: string
  qty: number
  price: number | string
}

export interface CreateOrderPayload {
  restaurantId: string
  restaurantName: string
  currency: string
  deliveryAddress: string
  customerFullName: string
  items: CreateOrderItemPayload[]
}

export interface AssignCourierPayload {
  courierId: number
  orderId: string
  courierName: string
  phoneNumber: string
}

export const orderApi = {
  getAll: () => http.order.get('/orders'),
  getById: (id: string) => http.order.get(`/orders/${id}`),
  getByRestaurant: (restaurantId: string) => http.order.get(`/orders/restaurant/${restaurantId}`),
  create: (data: CreateOrderPayload) => http.order.post('/orders', data),
  updateStatus: (id: string, status: string) => http.order.patch(`/orders/${id}/status`, { status }),
  // matches the live order service's POST /courier/assign-to-order
  // (there is no /orders/:id/assign-courier endpoint).
  assignCourier: (data: AssignCourierPayload) => http.order.post('/courier/assign-to-order', data),
  getAvailableForCourier: () => http.order.get('/courier/available-orders'),
  getDeliveringForCourier: () => http.order.get('/courier/delivering-orders'),
  getCourierHistory: () => http.order.get('/courier/history'),
}
