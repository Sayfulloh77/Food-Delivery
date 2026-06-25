import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/auth', component: () => import('@/views/auth/AuthView.vue') },

    // Customer
    { path: '/', redirect: '/restaurants' },
    { path: '/restaurants', component: () => import('@/views/customer/restaurants/index.vue') },
    { path: '/restaurants/:id', component: () => import('@/views/customer/restaurants/DetailView.vue') },
    { path: '/cart', component: () => import('@/views/customer/cart/index.vue') },
    { path: '/orders', component: () => import('@/views/customer/orders/index.vue') },
    { path: '/notifications', component: () => import('@/views/customer/notifications/index.vue') },

    // Admin — requires ADMIN or SUPERADMIN role
    { path: '/admin/users', meta: { requiresAdmin: true }, component: () => import('@/views/admin/users/index.vue') },
    { path: '/admin/menu', meta: { requiresAdmin: true }, component: () => import('@/views/admin/menu/index.vue') },
    { path: '/admin/orders', meta: { requiresAdmin: true }, component: () => import('@/views/admin/orders/index.vue') },

    // Forbidden page
    { path: '/forbidden', component: () => import('@/views/ForbiddenView.vue') },
  ],
})

// Runs before every page navigation
router.beforeEach((to) => {
  if (!to.meta.requiresAdmin) return true

  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    return '/auth'
  }

  // JWT payload might have role as string or inside roles array
  const role = authStore.user?.role ?? authStore.user?.roles?.[0]
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN'

  if (!isAdmin) {
    return '/forbidden'
  }

  return true
})

export default router
