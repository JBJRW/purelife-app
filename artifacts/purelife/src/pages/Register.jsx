import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const TIERS = [
  { id:'seed', name:'Seed', price:'$29/mes', emoji:'🌱', desc:'Recomendaciones AI + Chat Dr. Smoothie' },
  { id:'bloom', name:'Bloom', price:'$49/mes', emoji:'🌸', desc:'Todo Seed + Comunidad + Video Series' },
  { id:'canopy', name:'Canopy', price:'$79/mes', emoji:'🌳', desc:'Todo Bloom + Creator Space + Coaching 1:1' },
]

export default function Register() {
  const { signUp } = useAuth()
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [tier, setTier] = useState('seed')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    const { error } = await signUp(form.email, form.password, form.name)
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  if (success) return (
    <div style={{minHeight:'100vh',background:'#040A06',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Instrument Sans',sans-serif"}}>
      <div style={{textAlign:'center',color:'#F2EDE4'}}>
        <div style={{fontSize:64,marginBottom:16}}>🌿</div>
        <h2 style={{color:'#1AE05A',fontFamily:"'Fraunces',serif",fontSize:32}}>¡Bienvenido a PureLife!</h2>
        <p style={{color:'#8A9E8F'}}>Revisa tu email para confirmar tu cuenta.</p>
        <a href="/login" style={{color:'#1AE05A',marginTop:24,display:'block'}}>Ir al login →</a>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#040A06',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Instrument Sans',sans-serif",padding:20}}>
      <div style={{background:'#0D1F12',border:'1px solid #1AE05A22',borderRadius:16,padding:40,width:440,maxWidth:'100%'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:36}}>🌿</div>
          <h1 style={{color:'#1AE05A',fontFamily:"'Fraunces',serif",fontSize:26,margin:'8px 0 4px'}}>Crear cuenta</h1>
          <p style={{color:'#8A9E8F',fontSize:13}}>Elige tu plan y empieza hoy</p>
        </div>

        {['name','email','password'].map(field => (
          <div key={field} style={{marginBottom:14}}>
            <label style={{color:'#8A9E8F',fontSize:11,display:'block',marginBottom:5,textTransform:'uppercase'}}>{field==='name'?'Nombre':field==='email'?'Email':'Contraseña'}</label>
            <input type={field==='password'?'password':field==='email'?'email':'text'}
              value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}
              style={{width:'100%',background:'#0A1A0E',border:'1px solid #1AE05A33',borderRadius:8,padding:'11px 14px',color:'#F2EDE4',fontSize:14,boxSizing:'border-box',outline:'none'}}
            />
          </div>
        ))}

        <div style={{marginBottom:20,marginTop:20}}>
          <label style={{color:'#8A9E8F',fontSize:11,display:'block',marginBottom:10,textTransform:'uppercase'}}>Elige tu plan</label>
          {TIERS.map(t => (
            <div key={t.id} onClick={()=>setTier(t.id)}
              style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:10,border:`1px solid ${tier===t.id?'#1AE05A':'#1AE05A22'}`,marginBottom:8,cursor:'pointer',background:tier===t.id?'#1AE05A11':'transparent'}}>
              <span style={{fontSize:22}}>{t.emoji}</span>
              <div style={{flex:1}}>
                <div style={{color:tier===t.id?'#1AE05A':'#F2EDE4',fontWeight:700,fontSize:14}}>{t.name} — {t.price}</div>
                <div style={{color:'#8A9E8F',fontSize:12}}>{t.desc}</div>
              </div>
              {tier===t.id && <span style={{color:'#1AE05A',fontSize:18}}>✓</span>}
            </div>
          ))}
        </div>

        {error && <p style={{color:'#ff6b6b',fontSize:13,marginBottom:12,textAlign:'center'}}>{error}</p>}

        <button onClick={handleRegister} disabled={loading}
          style={{width:'100%',background:'#1AE05A',color:'#040A06',border:'none',borderRadius:8,padding:'14px',fontSize:16,fontWeight:700,cursor:'pointer',marginBottom:14}}>
          {loading ? 'Creando cuenta...' : 'Comenzar mi viaje 🌿'}
        </button>

        <p style={{textAlign:'center',color:'#8A9E8F',fontSize:13}}>
          ¿Ya tienes cuenta? <a href="/login" style={{color:'#1AE05A',textDecoration:'none'}}>Entrar</a>
        </p>
      </div>
    </div>
  )
}
