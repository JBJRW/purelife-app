
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './component/auth/AuthModal';
import DrSmoothieAI from './component/DrSmoothieAI';
import CommunityHub from './component/community/CommunityHub';
import CreatorSpace from './component/community/CreatorSpace';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  if (!user) return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <div style={{minHeight:'100vh',background:'#040A06',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:20}}>
        <div style={{fontSize:48}}>🌿</div>
        <h2 style={{color:'#F2EDE4',fontFamily:"'Fraunces',serif",fontSize:28}}>Área exclusiva</h2>
        <p style={{color:'#8A9E8F'}}>Necesitas cuenta para acceder</p>
        <button onClick={() => setShowAuth(true)}
          style={{background:'#1AE05A',color:'#040A06',border:'none',borderRadius:12,padding:'14px 32px',fontWeight:700,fontSize:16,cursor:'pointer'}}>
          Entrar / Registrarse
        </button>
      </div>
    </>
  );
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DrSmoothieAI />} />
      <Route path="/chat" element={<DrSmoothieAI />} />
      <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
      <Route path="/creators" element={<ProtectedRoute><CreatorSpace /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
