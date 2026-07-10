import http from './http'

export interface RegisterPayload  {
  name: string
  email: string
  phone_number: string
  password: string
  role_id: number
  otpToken: string
}

export const authApi = {
  sentOtp: (email: string) => http.auth.post('/auth/sent-otp', { email }),
  verifyOtp: (email: string, code: string) => http.auth.post('/auth/verify-otp', { email, code }),
  register: (data: RegisterPayload) => http.auth.post('/auth/register', data),
  // data: { name, email, password, role_id, otpToken }
  login: (email: string, password: string) => http.auth.post('/auth/login', { email, password }),
  me: () => http.auth.get('/auth/me'),
  logout: () => http.auth.post('/auth/logout'),
  refresh: (userId: number, refreshToken: string) => http.auth.post('/auth/refresh', { user_id: userId, refresh_token: refreshToken }),
}
