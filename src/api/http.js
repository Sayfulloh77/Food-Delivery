import axios from 'axios'

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
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth'
      }
      return Promise.reject(error)
    }
  )
})

export default instances
