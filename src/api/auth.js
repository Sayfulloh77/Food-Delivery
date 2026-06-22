import http from './http'

export const authApi = {
  sentOtp: (email) => http.auth.post('/auth/sent-otp', { email }),
  verifyOtp: (email, code) => http.auth.post('/auth/verify-otp', { email, code }),
  register: (data) => http.auth.post('/auth/register', data),
  // data: { name, email, password, role_id: 1, otpToken }
  login: (email, password) => http.auth.post('/auth/login', { email, password }),
}
