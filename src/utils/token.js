export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = decodeToken(token)

  if (!payload?.exp) return true
  
  return payload.exp * 1000 < Date.now()
}
