import http from './http'

export interface Category {
  id: number
  name: string
}

export interface CategoryRequest {
  name: string
}

export interface CategoryMenu {
  id: number
  restaurant: string
  name: string
}

export interface CategoryMenuRequest {
  restaurant: string
  name: string
}

export interface PatchedCategoryMenuRequest {
  restaurant?: string
  name?: string
}

export interface Restaurant {
  id: string
  owner_user_id: number
  name: string
  description: string | null
  address: string | null
  is_open: boolean
  created_at: string
  restaurant_img: string | null
  categories: number[]
}

export interface RestaurantRequest {
  name: string
  description?: string | null
  address?: string | null
  is_open?: boolean
  restaurant_img?: File | null
  categories: number[]
}

export interface PatchedRestaurantRequest {
  name?: string
  description?: string | null
  address?: string | null
  is_open?: boolean
  restaurant_img?: File | null
  categories?: number[]
}

export interface MenuItem {
  id: number
  category: number[]
  restaurant_uuid: string | null
  name: string
  description: string | null
  price: string
  new_price: string | null
  discount: string | null
  discount_status: boolean
  promotion: string | null
  img_product: string | null
  delivery_time: string | null
}

export interface MenuItemRequest {
  category: number[]
  restaurant_uuid?: string | null
  name: string
  description?: string | null
  price: string
  new_price?: string | null
  discount?: string | null
  discount_status?: boolean
  promotion?: string | null
  img_product?: File | null
  delivery_time?: string | null
}

export interface PatchedMenuItemRequest {
  category?: number[]
  restaurant_uuid?: string | null
  name?: string
  description?: string | null
  price?: string
  new_price?: string | null
  discount?: string | null
  discount_status?: boolean
  promotion?: string | null
  img_product?: File | null
  delivery_time?: string | null
}

export interface Advertisement {
  id: number
  restaurant: string
  image_ads: string
  promotion: string
}

export interface AdvertisementRequest {
  restaurant: string
  image_ads: File
  promotion: string
}

export interface PatchedAdvertisementRequest {
  restaurant?: string
  image_ads?: File
  promotion?: string
}

export const categoryApi = {
  getAll: () => http.restaurant.get('/api/general-category'),
  create: (data: CategoryRequest) => http.restaurant.post('/api/general-category', data),
  update: (id: number, data: Partial<CategoryRequest>) => http.restaurant.patch(`/api/general-category/${id}`, data),
  delete: (id: number) => http.restaurant.delete(`/api/general-category/${id}`),
  getRestaurants: (categoryName: string) => http.restaurant.get(`/api/category/restaurants/${categoryName}`),
}

export const menuCategoryApi = {
  getAll: () => http.restaurant.get('/api/menu-category'),
  getById: (id: number) => http.restaurant.get(`/api/menu-category/${id}`),
  create: (data: CategoryMenuRequest | FormData) => http.restaurant.post('/api/menu-category', data),
  update: (id: number, data: PatchedCategoryMenuRequest) => http.restaurant.patch(`/api/menu-category/${id}`, data),
  delete: (id: number) => http.restaurant.delete(`/api/menu-category/${id}`),
}

export const restaurantApi = {
  getAll: () => http.restaurant.get('/api/restaurants'),
  getByOwner: (ownerId: number) => http.restaurant.get('/api/restaurants-by-owner-id', { params: { owner_id: ownerId } }),
  getById: (uuid: string) => http.restaurant.get(`/api/restaurant/${uuid}`),
  // These services also accept multipart/form-data for file uploads (restaurant_img, img_product,
  // image_ads) — the owner CRUD screens build a FormData directly instead of the typed payload.
  create: (data: RestaurantRequest | FormData) => http.restaurant.post('/api/restaurants', data),
  update: (uuid: string, data: PatchedRestaurantRequest | FormData) => http.restaurant.patch(`/api/restaurant/${uuid}`, data),
  delete: (uuid: string) => http.restaurant.delete(`/api/restaurant/${uuid}`),
  getMenu: (restaurantId: string) => http.restaurant.get(`/api/restaurants/${restaurantId}/menu`),
}

export const menuitemApi = {
  getAll: () => http.restaurant.get(`/api/menu-items`),
  getById: (id: number) => http.restaurant.get(`/api/menu-items/${id}`),
  create: (data: MenuItemRequest | FormData) => http.restaurant.post(`/api/menu-items`, data),
  update: (id: number, data: PatchedMenuItemRequest | FormData) => http.restaurant.patch(`/api/menu-items/${id}`, data),
  delete: (id: number) => http.restaurant.delete(`/api/menu-items/${id}`),
}

export const adsApi = {
  getAll: () => http.restaurant.get('/api/ads'),
  create: (data: AdvertisementRequest | FormData) => http.restaurant.post('/api/ads', data),
  update: (adId: number, data: PatchedAdvertisementRequest | FormData) => http.restaurant.patch(`/api/ads/${adId}`, data),
  delete: (adId: number) => http.restaurant.delete(`/api/ads/${adId}`),
}

export const searchApi = {
  search: (query: string) => http.restaurant.get('/api/search', { params: { query } }),
}