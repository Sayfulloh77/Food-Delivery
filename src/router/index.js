import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/auth', component: () => import('@/views/auth/AuthView.vue') },

    // Customer — public
    { path: '/', redirect: '/restaurants' },
    { path: '/restaurants', component: () => import('@/views/customer/restaurants/index.vue') },
    { path: '/restaurants/:id', component: () => import('@/views/customer/restaurants/DetailView.vue') },

    // Customer — requires login
    { path: '/cart', meta: { requiresAuth: true }, component: () => import('@/views/customer/cart/index.vue') },
    { path: '/orders', meta: { requiresAuth: true }, component: () => import('@/views/customer/orders/index.vue') },
    { path: '/orders/:id', meta: { requiresAuth: true }, component: () => import('@/views/customer/orders/TrackView.vue') },
    { path: '/notifications', meta: { requiresAuth: true }, component: () => import('@/views/customer/notifications/index.vue') },

    // Admin — Users/Roles oversight + order oversight (assign courier, force status)
    { path: '/admin/users', meta: { roles: ['ADMIN', 'SUPERADMIN'] }, component: () => import('@/views/admin/users/index.vue') },
    { path: '/admin/orders', meta: { roles: ['ADMIN', 'SUPERADMIN'] }, component: () => import('@/views/admin/orders/index.vue') },

    // Restaurant Owner — restaurants, menu items, item categories, ads
    { path: '/owner/restaurants', meta: { roles: ['RESTAURANT_OWNER'] }, component: () => import('@/views/owner/menu/index.vue') },

    // Courier — own assigned deliveries only
    { path: '/courier/orders', meta: { roles: ['COURIER'] }, component: () => import('@/views/courier/orders/index.vue') },

    // Forbidden page
    { path: '/forbidden', component: () => import('@/views/ForbiddenView.vue') },
  ],
})

// Runs before every page navigation
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const requiresRole = to.meta.roles?.length > 0

  // Access token may have expired since the last navigation — try a
  // silent refresh before treating the user as logged out.
  if (!authStore.isLoggedIn && authStore.accessToken && authStore.refreshToken && (to.meta.requiresAuth || requiresRole)) {
    await authStore.refreshTokens()
  }

  // Pages that require any logged-in user (cart, orders, notifications)
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
    return true
  }

  // Role-gated pages (admin, owner, courier)
  if (requiresRole) {
    if (!authStore.isLoggedIn) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }

    // JWT payload might have role as string or inside roles array
    const role = authStore.user?.role ?? authStore.user?.roles?.[0]

    if (!to.meta.roles.includes(role)) return '/forbidden'
  }

  return true
})

export default router
