import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/auth', component: () => import('@/views/auth/AuthView.vue') },

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
