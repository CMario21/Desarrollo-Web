import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../modules/auth/Login'
import Register from '../modules/auth/Register'
import Dashboard from '../modules/home/Dashboard'
import { useAuth } from '../context/AuthContext'
import AdminPanel from '../modules/admin/AdminPanel'
import VoterHome from '../modules/voter/VoterHome'

function Private({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/admin/*" element={<Private><AdminPanel /></Private>} />
      <Route path="/" element={<VoterHome />} />
    </Routes>
  )
}
