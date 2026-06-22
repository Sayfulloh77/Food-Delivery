import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decodeToken, isTokenExpired } from '@/utils/token'

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
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return { accessToken, refreshToken, user, isLoggedIn, setTokens, logout }
})
