/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    // Default: system preference
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      setTheme,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

