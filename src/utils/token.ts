export interface JwtPayload {
  id?: number
  user_id?: number
  name?: string
  email?: string
  role?: string
  roles?: string[]
  phone_number?: string
  exp?: number
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token)

  if (!payload?.exp) return true

  return payload.exp * 1000 < Date.now()
}
