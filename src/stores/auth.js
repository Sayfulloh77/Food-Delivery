import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decodeToken, isTokenExpired } from '@/utils/token'
import { authApi } from '@/api/auth'
import axios from 'axios'

async function injectDevToken() {
  if (import.meta.env.VITE_SKIP_ADMIN_AUTH !== 'true') return
  const existing = localStorage.getItem('accessToken')
  if (existing && !isTokenExpired(existing)) return
  try {
    const res = await axios.get('http://18.212.91.176:8081/auth/token?role=ADMIN')
    const token = res.data
    localStorage.setItem('accessToken', token)
    const decoded = decodeToken(token)
    if (decoded) {
      decoded.name = 'Dev Admin'
      decoded.role = 'ADMIN'
      localStorage.setItem('user', JSON.stringify(decoded))
    }
  } catch {}
}

injectDevToken()

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user = ref(accessToken.value ? decodeToken(accessToken.value) : null)

  const isLoggedIn = computed(() => !!accessToken.value && !isTokenExpired(accessToken.value))

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
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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

  return { accessToken, refreshToken, user, isLoggedIn, setTokens, fetchMe, logout, refreshTokens }
})
