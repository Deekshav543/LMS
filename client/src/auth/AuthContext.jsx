import { createContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

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
        try {
          const res = await api.post('/auth/login', { email, password })
          setToken(res.data.token)
          localStorage.setItem('token', res.data.token)
          setUser(res.data.user)
          return res.data.user
        } catch (err) {
          console.error('[auth] Login failed', err)
          throw err
        }
      },
      signup: async ({ name, email, password }) => {
        try {
          const res = await api.post('/auth/signup', { name, email, password })
          return res.data.user
        } catch (err) {
          console.error('[auth] Signup failed', err)
          throw err
        }
      },
      logout: () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
      },
      refreshMe: async () => {
        try {
          const res = await api.get('/auth/me')
          setUser(res.data.user)
          return res.data.user
        } catch (err) {
          console.error('[auth] refreshMe failed', err)
          throw err
        }
      },
    }),
    [user, token]
  )

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) {
      api
        .get('/auth/me')
        .then((res) => {
           setUser(res.data.user)
           setLoading(false)
        })
        .catch((err) => {
          console.error('[auth] initialization failed', err)
          localStorage.removeItem('token')
          setUser(null)
          setToken('')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


