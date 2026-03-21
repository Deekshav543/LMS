/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react'
import api, { setAuthToken } from '../api/axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  // Only block render while validating an existing token (signup-first UX when logged out)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  const value = useMemo(
    () => ({
      user,
      token,
      login: async ({ email, password }) => {
        const res = await api.post('/api/auth/login', { email, password })
        setToken(res.data.token)
        localStorage.setItem('token', res.data.token)
        setAuthToken(res.data.token)
        setUser(res.data.user)
        return res.data.user
      },
      signup: async ({ name, email, password }) => {
        const res = await api.post('/api/auth/signup', { name, email, password })
        return res.data.user
      },
      logout: () => {
        localStorage.removeItem('token')
        setToken('')
        setAuthToken('')
        setUser(null)
      },
      refreshMe: async () => {
        const res = await api.get('/api/auth/me')
        setUser(res.data.user)
        return res.data.user
      },
    }),
    [user, token]
  )

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) {
      setAuthToken(stored)
      api
        .get('/api/auth/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
          setToken('')
          setAuthToken('')
        })
        .finally(() => setLoading(false))
    }
  }, [])

  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

