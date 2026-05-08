import { useState } from 'react'
import API from './useApi'

export function useAuth() {
  // initialise depuis localStorage pour que le token survive aux rechargements de page
  const [token, setToken] = useState(localStorage.getItem('token'))

  const login = async (email, password) => {
    const { data } = await API.post('/api/auth/login', { email, password })
    // persiste le token pour que le token survive à un refresh
    localStorage.setItem('token', data.token)
    setToken(data.token)
    return data.token
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  // !! convertit le token en boolean (null devient false, string devient true)
  return { token, isAdmin: !!token, login, logout }
}
