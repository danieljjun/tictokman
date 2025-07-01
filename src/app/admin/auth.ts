'use client'

export const checkAdminAuth = () => {
  if (typeof window === 'undefined') return false
  
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  const adminUser = localStorage.getItem('adminUser')
  
  return isLoggedIn && adminUser === 'admin@infinitygym.com'
}

export const loginAdmin = (email: string, password: string) => {
  if (email === 'admin@infinitygym.com' && password === 'admin123') {
    localStorage.setItem('adminLoggedIn', 'true')
    localStorage.setItem('adminUser', email)
    return true
  }
  return false
}

export const logoutAdmin = () => {
  localStorage.removeItem('adminLoggedIn')
  localStorage.removeItem('adminUser')
} 