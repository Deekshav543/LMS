import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function RequireAuth({ children, redirectTo = '/' }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to={redirectTo} replace />
  return children ? children : <Outlet />
}

