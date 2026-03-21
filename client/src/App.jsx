import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext, AuthProvider } from './auth/AuthContext'
import RequireAuth from './auth/RequireAuth'
import { ToastProvider } from './components/ToastProvider'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import CourseDetails from './pages/CourseDetails'
import Dashboard from './pages/Dashboard'
import Learning from './pages/Learning'
import { ThemeProvider } from './theme/ThemeContext'

const AUTH_ROUTES = ['/login', '/signup']
const LANDING_ROUTE = '/'

function AppShell() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const isAuthRoute = AUTH_ROUTES.includes(location.pathname)
  const isLanding = location.pathname === LANDING_ROUTE
  const showNavbar = !isAuthRoute // show on landing + authenticated pages

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', transition: 'background 0.3s ease' }}>

      {showNavbar && (
        <Navbar onLogout={logout} />
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Landing page — shown to unauthenticated users */}
          <Route
            path="/"
            element={user ? <Navigate to="/home" replace /> : <Landing />}
          />

          {/* Auth pages */}
          <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />

          {/* Protected pages */}
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/course/:courseId" element={<RequireAuth><CourseDetails /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/learning/:courseId" element={<RequireAuth><Learning /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
