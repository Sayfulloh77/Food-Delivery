import http from './http'

export const authApi = {
  sentOtp: (email) => http.auth.post('/auth/sent-otp', { email }),
  verifyOtp: (email, code) => http.auth.post('/auth/verify-otp', { email, code }),
  register: (data) => http.auth.post('/auth/register', data),
  // data: { name, email, password, role_id, otpToken }
  login: (email, password) => http.auth.post('/auth/login', { email, password }),
  me: () => http.auth.get('/auth/me'),
  logout: () => http.auth.post('/auth/logout'),
  refresh: (userId, refreshToken) => http.auth.post('/auth/refresh', { user_id: userId, refresh_token: refreshToken }),
}
