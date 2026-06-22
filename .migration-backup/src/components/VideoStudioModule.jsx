import { Link } from 'react-router-dom'

export default function VideoStudioModule() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 20px' }}>
      <div style={{ fontSize:64, marginBottom:20 }}>🎬</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, color:'#f0ede6', marginBottom:12 }}>
        Video Studio <span style={{ color:'#2dff8c' }}>4K</span>
      </h1>
      <p style={{ color:'#3d5449', maxWidth:400, lineHeight:1.7, marginBottom:28 }}>
        Conectando fal.ai backend. Disponible en la próxima actualización. 
        El generador de videos 4K estará listo muy pronto.
      </p>
      <div style={{ display:'flex', gap:10 }}>
        <Link to="/" style={{ background:'#2dff8c', color:'#020a06', padding:'11px 24px', borderRadius:10, fontWeight:800, textDecoration:'none', fontSize:13 }}>← Inicio</Link>
        <Link to="/app/profile" style={{ border:'1px solid rgba(45,255,140,0.3)', color:'#2dff8c', padding:'11px 24px', borderRadius:10, fontWeight:600, textDecoration:'none', fontSize:13 }}>Mi Perfil</Link>
      </div>
    </div>
  )
}
