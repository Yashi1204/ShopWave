import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"/>
    </div>
  )

  console.log('AdminRoute check — user:', user, 'role:', user?.role)

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}