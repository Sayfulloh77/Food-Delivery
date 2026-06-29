import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decodeToken, isTokenExpired } from '@/utils/token'
import { authApi } from '@/api/auth'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const orderToken = ref(localStorage.getItem('orderToken') || null)
  const user = ref(accessToken.value ? decodeToken(accessToken.value) : null)

  const isLoggedIn = computed(() => !!accessToken.value && !isTokenExpired(accessToken.value))

  // The order service uses its own JWT secret (separate from the auth service).
  // After login we fetch a token from the order service using the user's role.
  async function fetchOrderToken(role = 'CUSTOMER') {
    try {
      const res = await axios.get(`${import.meta.env.VITE_ORDER_URL}/auth/token?role=${role}`)
      const token = typeof res.data === 'string' ? res.data : null
      if (token) {
        orderToken.value = token
        localStorage.setItem('orderToken', token)
      }
    } catch {}
  }

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
    user.value = decodeToken(access)
    localStorage.setItem('accessToken', access)
    if (refresh) localStorage.setItem('refreshToken', refresh)
    if (user.value) localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function fetchMe() {
    try {
      const res = await authApi.me()
      user.value = res.data
    } catch {
      // JWT decoded data is still available as fallback
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // even if backend call fails, clear local state
    }
    accessToken.value = null
    refreshToken.value = null
    orderToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('orderToken')
    localStorage.removeItem('user')
  }

  async function refreshTokens() {
    try {
      const res = await authApi.refresh(user.value?.id, refreshToken.value)
      const { access_token, refresh_token } = res.data
      setTokens(access_token, refresh_token)
      return access_token
    } catch {
      await logout()
      return null
    }
  }

  return { accessToken, refreshToken, orderToken, user, isLoggedIn, setTokens, fetchMe, fetchOrderToken, logout, refreshTokens }
})
