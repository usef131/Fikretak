import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../Services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState()
  const [loading, setLoading] = useState(true)

  // Verify token with backend on mount instead of trusting localStorage blindly
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('fk_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await authService.getProfile() // response already unwrapped: { user }
        setUser(data.user)
        localStorage.setItem('fk_user', JSON.stringify(data.user))
      } catch {
        setUser(null)
        localStorage.removeItem('fk_user')
        localStorage.removeItem('fk_token')
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    setUser(data.user)
    localStorage.setItem('fk_user', JSON.stringify(data.user))
    localStorage.setItem('fk_token', data.token)
    return data.user
  }

  const register = async (formData) => {
    const data = await authService.register(formData)
    setUser(data.user)
    localStorage.setItem('fk_user', JSON.stringify(data.user))
    localStorage.setItem('fk_token', data.token)
    return data.user
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fk_user')
    localStorage.removeItem('fk_token')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('fk_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}