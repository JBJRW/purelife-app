import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const s = {
    overlay: { position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(8px)' },
    modal: { background:'#0A1A0F',border:'1px solid #1AE05A33',borderRadius:24,padding:40,width:'100%',maxWidth:420,position:'relative' },
    close: { position:'absolute',top:16,right:20,background:'none',border:'none',color:'#8A9E8F',fontSize:24,cursor:'pointer' },
    logo: { textAlign:'center',marginBottom:32 },
    title: { fontFamily:"'Fraunces',serif",fontSize:28,color:'#F2EDE4',margin:0 },
    sub: { color:'#8A9E8F',fontSize:14,marginTop:6 },
    tabs: { display:'flex',gap:8,marginBottom:28,background:'#040A06',borderRadius:12,padding:4 },
    tab: (active) => ({ flex:1,padding:'10px',borderRadius:9,border:'none',cursor:'pointer',fontWeight:600,fontSize:14,transition:'all .2s', background: active ? '#1AE05A' : 'transparent', color: active ? '#040A06' : '#8A9E8F' }),
    label: { display:'block',color:'#8A9E8F',fontSize:12,marginBottom:6,textTransform:'uppercase',letterSpacing:.8 },
    input: { width:'100%',background:'#040A06',border:'1px solid #1AE05A22',borderRadius:12,padding:'14px 16px',color:'#F2EDE4',fontSize:16,outline:'none',boxSizing:'border-box',marginBottom:16 },
    btn: { width:'100%',background:'#1AE05A',color:'#040A06',border:'none',borderRadius:12,padding:'16px',fontWeight:700,fontSize:16,cursor:'pointer',marginTop:8 },
    error: { background:'#FF444422',border:'1px solid #FF4444',borderRadius:8,padding:'10px 14px',color:'#FF8888',fontSize:14,marginBottom:16 },
    success: { background:'#1AE05A22',border:'1px solid #1AE05A',borderRadius:8,padding:'10px 14px',color:'#1AE05A',fontSize:14,marginBottom:16 },
  };

  async function handleSubmit() {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
        else onClose();
      } else {
        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setSuccess('¡Revisa tu email para confirmar tu cuenta! 🌿');
      }
    } finally { setLoading(false); }
  }

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <button style={s.close} onClick={onClose}>×</button>
        <div style={s.logo}>
          <div style={{fontSize:36,marginBottom:8}}>🌿</div>
          <h2 style={s.title}>PureLife</h2>
          <p style={s.sub}>Tu clínica de longevidad en el bolsillo</p>
        </div>

        <div style={s.tabs}>
          <button style={s.tab(mode==='login')} onClick={() => setMode('login')}>Entrar</button>
          <button style={s.tab(mode==='register')} onClick={() => setMode('register')}>Registrarse</button>
        </div>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="tu@email.com"
          value={email} onChange={e => setEmail(e.target.value)} />

        <label style={s.label}>Contraseña</label>
        <input style={s.input} type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? '...' : mode === 'login' ? 'Entrar a PureLife' : 'Crear cuenta gratis'}
        </button>
      </div>
    </div>
  );
}
