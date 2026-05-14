/**
 * context/AuthContext.jsx — Global auth state management
 * Provides: user, token, login, logout, signup helpers
 */

import { createContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth.api'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // ── On mount: rehydrate user from token ──────────────────
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token')
      if (!savedToken) { setLoading(false); return }

      try {
        const { data } = await authAPI.getMe()
        setUser(data.user)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  // ── Signup ────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const { data } = await authAPI.signup({ name, email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  // ── Update user stats locally (after interview) ───────────
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getMe()
      setUser(data.user)
    } catch { /* silent */ }
  }, [])

  const value = { user, token, loading, login, signup, logout, refreshUser, isAuthenticated: !!user }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
