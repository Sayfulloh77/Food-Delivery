import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/login', component: () => import('@/views/auth/LoginView.vue') },
    { path: '/register', component: () => import('@/views/auth/RegisterView.vue') },

    // Customer
    { path: '/', redirect: '/restaurants' },
    { path: '/restaurants', component: () => import('@/views/customer/restaurants/index.vue') },
    { path: '/cart', component: () => import('@/views/customer/cart/index.vue') },
    { path: '/orders', component: () => import('@/views/customer/orders/index.vue') },
    { path: '/notifications', component: () => import('@/views/customer/notifications/index.vue') },

    // Admin (guard will be added later)
    { path: '/admin/users', component: () => import('@/views/admin/users/index.vue') },
    { path: '/admin/menu', component: () => import('@/views/admin/menu/index.vue') },
    { path: '/admin/orders', component: () => import('@/views/admin/orders/index.vue') },
  ],
})

export default router
