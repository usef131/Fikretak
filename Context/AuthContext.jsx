import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../Services/authService'

// at first we create a context object 
const AuthContext = createContext()

// then we create a provider component that will wrap our app and provide the auth state and functions to its children
export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  // Verify token with backend on mount 
  // This will check if the user is already logged in when the app loads depending on token timeout and validity
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('fk_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await authService.getProfile()
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
    // merge the updates with the current user state and update localStorage 
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