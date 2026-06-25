import axios from 'axios'

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

function clearAndRedirect() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '/auth'
}

const instances = {
  auth: axios.create({ baseURL: import.meta.env.VITE_AUTH_URL }),
  order: axios.create({ baseURL: import.meta.env.VITE_ORDER_URL }),
  restaurant: axios.create({ baseURL: import.meta.env.VITE_RESTAURANT_URL }),
  notification: axios.create({ baseURL: import.meta.env.VITE_NOTIFICATION_URL }),
}

Object.values(instances).forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config

      // Only attempt refresh on 401, and not on the refresh call itself
      if (error.response?.status === 401 && !original._retry) {
        const storedRefresh = localStorage.getItem('refreshToken')

        if (!storedRefresh) {
          clearAndRedirect()
          return Promise.reject(error)
        }

        // If already refreshing, queue this request until new token is ready
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return instance(original)
          })
        }

        original._retry = true
        isRefreshing = true

        try {
          // Direct axios call to avoid circular dependency with authApi
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
          const res = await axios.post(
            `${import.meta.env.VITE_AUTH_URL}/auth/refresh`,
            { user_id: storedUser?.id, refresh_token: storedRefresh }
          )
          const { access_token, refresh_token } = res.data
          localStorage.setItem('accessToken', access_token)
          if (refresh_token) localStorage.setItem('refreshToken', refresh_token)
          processQueue(null, access_token)
          original.headers.Authorization = `Bearer ${access_token}`
          return instance(original)
        } catch (refreshError) {
          processQueue(refreshError, null)
          clearAndRedirect()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
})

export default instances
