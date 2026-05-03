import { useState } from 'react'
import API from './useApi'

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const login = async (email, password) => {
    const { data } = await API.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    return data.token
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return { token, isAdmin: !!token, login, logout }
}