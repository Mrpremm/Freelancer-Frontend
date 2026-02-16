import { createContext, useState, useContext, useEffect } from 'react'
import { authApi } from '../api/auth'

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userData = await authApi.getProfile()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    localStorage.setItem('token', response.token)
    setUser(response)
    return response
  }

  const register = async (userData) => {
    const response = await authApi.register(userData)
    localStorage.setItem('token', response.token)
    setUser(response)
    return response
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfile = async (userData) => {
    const response = await authApi.updateProfile(userData)
    setUser(prev => ({ ...prev, ...response }))
    return response
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isClient: user?.role === 'client',
    isFreelancer: user?.role === 'freelancer',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}