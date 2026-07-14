import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 20px' }}>
      <div style={{ fontSize:72, marginBottom:20, opacity:0.3 }}>404</div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:900, color:'#f0ede6', marginBottom:12 }}>
        Página no encontrada
      </h1>
      <p style={{ color:'#3d5449', marginBottom:28 }}>Esta ruta no existe en dr.smoothie.ai</p>
      <Link to="/" style={{ background:'#2dff8c', color:'#020a06', padding:'12px 28px', borderRadius:10, fontWeight:800, textDecoration:'none', fontSize:13 }}>
        ← Ir al inicio
      </Link>
    </div>
  )
}
