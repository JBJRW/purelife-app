import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import DrSmoothieAI from './DrSmoothieAI'
import CommunityHub from './components/community/CommunityHub'
import CreatorSpace from './components/community/CreatorSpace'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{minHeight:'100vh',background:'#040A06',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{color:'#1AE05A',fontSize:32}}>🌿</div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DrSmoothieAI />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<ProtectedRoute><DrSmoothieAI /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
      <Route path="/creators" element={<ProtectedRoute><CreatorSpace /></ProtectedRoute>} />
      <Route path="*" element={<DrSmoothieAI />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
