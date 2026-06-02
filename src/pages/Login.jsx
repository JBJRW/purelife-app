import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/app'
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#040A06',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Instrument Sans',sans-serif"}}>
      <div style={{background:'#0D1F12',border:'1px solid #1AE05A22',borderRadius:16,padding:40,width:380,maxWidth:'90vw'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:40}}>🌿</div>
          <h1 style={{color:'#1AE05A',fontFamily:"'Fraunces',serif",fontSize:28,margin:'8px 0 4px'}}>PureLife</h1>
          <p style={{color:'#8A9E8F',fontSize:14}}>Tu clínica de longevidad</p>
        </div>

        <div style={{marginBottom:16}}>
          <label style={{color:'#8A9E8F',fontSize:12,display:'block',marginBottom:6}}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{width:'100%',background:'#0A1A0E',border:'1px solid #1AE05A33',borderRadius:8,padding:'12px 16px',color:'#F2EDE4',fontSize:15,boxSizing:'border-box',outline:'none'}}
          />
        </div>

        <div style={{marginBottom:24}}>
          <label style={{color:'#8A9E8F',fontSize:12,display:'block',marginBottom:6}}>CONTRASEÑA</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"
            style={{width:'100%',background:'#0A1A0E',border:'1px solid #1AE05A33',borderRadius:8,padding:'12px 16px',color:'#F2EDE4',fontSize:15,boxSizing:'border-box',outline:'none'}}
          />
        </div>

        {error && <p style={{color:'#ff6b6b',fontSize:13,marginBottom:16,textAlign:'center'}}>{error}</p>}

        <button onClick={handleLogin} disabled={loading}
          style={{width:'100%',background:'#1AE05A',color:'#040A06',border:'none',borderRadius:8,padding:'14px',fontSize:16,fontWeight:700,cursor:'pointer',marginBottom:16}}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{textAlign:'center',color:'#8A9E8F',fontSize:14}}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{color:'#1AE05A',textDecoration:'none'}}>Únete gratis</a>
        </p>
      </div>
    </div>
  )
}
