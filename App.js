import React, { useState, useEffect, useRef } from 'react';

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #050A05;
    --green-deep: #0D2B0D;
    --green-mid: #1A4A1A;
    --green-bright: #2ECC71;
    --green-glow: #39FF14;
    --gold: #C9A84C;
    --gold-light: #E8C96A;
    --white: #F0F7F0;
    --gray: #8A9E8A;
    --red: #E74C3C;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  .app {
    height: 100dvh;
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: var(--black);
    position: relative;
    overflow: hidden;
  }

  .screen {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .screen::-webkit-scrollbar { display: none; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 10px var(--green-glow); }
    50% { box-shadow: 0 0 25px var(--green-glow), 0 0 50px var(--green-bright); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .btn-primary {
    width: 100%;
    padding: 16px;
    background: var(--green-bright);
    color: var(--black);
    border: none;
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
  }
  .btn-primary:hover { background: var(--green-glow); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    width: 100%;
    padding: 16px;
    background: transparent;
    color: var(--white);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--green-bright); color: var(--green-bright); }

  .btn-gold {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    color: var(--black);
    border: none;
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .card {
    background: var(--green-deep);
    border: 1px solid rgba(46,204,113,0.15);
    border-radius: 16px;
    padding: 20px;
  }

  .tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  input, textarea {
    width: 100%;
    background: var(--green-deep);
    border: 1px solid rgba(46,204,113,0.2);
    border-radius: 10px;
    color: var(--white);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 14px 16px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus { border-color: var(--green-bright); }
  input::placeholder, textarea::placeholder { color: var(--gray); }

  .bottom-nav {
    display: flex;
    background: var(--green-deep);
    border-top: 1px solid rgba(46,204,113,0.15);
    padding: 8px 0 env(safe-area-inset-bottom, 8px);
    flex-shrink: 0;
  }
  .nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
    background: none;
    border: none;
    color: var(--gray);
    font-size: 10px;
    font-family: var(--font-body);
    cursor: pointer;
    transition: color 0.2s;
  }
  .nav-btn.active { color: var(--green-bright); }
  .nav-btn svg { width: 22px; height: 22px; }
`;

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = globalCSS;
  document.head.appendChild(style);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ai: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>,
  qr: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  leaf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75C9 15 12 11 12 7a10 10 0 0110-5c0 6-4 10-8 13.25"/><path d="M2 22L8 16"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17L19 6V12C19 14.761 16.761 17 14 17H10C7.239 17 5 14.761 5 12V6L7 4Z"/><path d="M5 8H3V10C3 11.657 4.343 13 6 13"/><path d="M19 8H21V10C21 11.657 19.657 13 18 13"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'seed', name: 'Seed', price: 29, color: '#2ECC71', emoji: '🌱',
    perks: ['4 smoothies / mes', 'Acceso IA básico', 'Recetas exclusivas', 'Descuento 10%']
  },
  {
    id: 'bloom', name: 'Bloom', price: 59, color: '#C9A84C', emoji: '🌿',
    perks: ['10 smoothies / mes', 'IA ilimitada', 'Plan nutricional', 'Descuento 20%', 'Prioridad en tienda']
  },
  {
    id: 'canopy', name: 'Canopy', price: 99, color: '#E8C96A', emoji: '🌳',
    perks: ['Smoothies ilimitados', 'IA premium 24/7', 'Coach personal', 'Descuento 30%', 'Eventos VIP', 'Entrega a domicilio']
  }
];

const SAMPLE_SMOOTHIES = [
  { id: 1, name: 'Green Phoenix', ingredients: ['Espinaca', 'Manzana', 'Jengibre', 'Limón'], benefit: 'Detox · Energía', color: '#2ECC71', pts: 50 },
  { id: 2, name: 'Golden Hour', ingredients: ['Mango', 'Cúrcuma', 'Naranja', 'Jengibre'], benefit: 'Anti-inflamatorio', color: '#C9A84C', pts: 60 },
  { id: 3, name: 'Berry Shield', ingredients: ['Arándanos', 'Açaí', 'Plátano', 'Chía'], benefit: 'Antioxidante · Inmunidad', color: '#8B5CF6', pts: 55 },
  { id: 4, name: 'Calm Waters', ingredients: ['Pepino', 'Menta', 'Aloe', 'Limón'], benefit: 'Hidratación · Calma', color: '#06B6D4', pts: 45 },
];

const AI_SUGGESTIONS = [
  '¿Qué smoothie me ayuda con energía?',
  '¿Cuál es bueno para bajar de peso?',
  'Tengo inflamación, ¿qué me recomiendas?',
  'Plan para mejorar digestión',
];

// ─── SCREEN: SPLASH ───────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  useEffect(() => {
    const t = setTimeout(onNext, 2800);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0D2B0D 0%, #050A05 70%)',
      animation: 'fadeUp 0.8s ease'
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle, #2ECC71, #0D2B0D)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 48, marginBottom: 28,
        animation: 'glow 2s infinite',
        boxShadow: '0 0 30px rgba(46,204,113,0.4)'
      }}>🌿</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 32,
        fontStyle: 'italic', color: 'var(--white)', marginBottom: 8
      }}>dr.smoothie.ai</h1>
      <p style={{ color: 'var(--gray)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase' }}>
        × PureLife Wellness Club
      </p>
      <div style={{ marginTop: 60, display: 'flex', gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i === 0 ? 'var(--green-bright)' : 'var(--green-deep)',
            animation: `pulse 1.4s ease ${i * 0.2}s infinite`
          }}/>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: ONBOARDING ───────────────────────────────────────────────────────
function OnboardingScreen({ onNext }) {
  const [step, setStep] = useState(0);
  const slides = [
    {
      emoji: '🤖', title: 'Tu nutricionista IA',
      desc: 'Recibe recomendaciones personalizadas basadas en tus objetivos de salud, síntomas y preferencias.'
    },
    {
      emoji: '🥤', title: 'Smoothies que sanan',
      desc: 'Cada ingrediente tiene un propósito. Nuestras recetas están basadas en evidencia científica.'
    },
    {
      emoji: '🏆', title: 'PureLife Membership',
      desc: 'Acumula puntos, sube de nivel y desbloquea beneficios exclusivos en cada visita.'
    }
  ];
  const s = slides[step];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 28px 40px', animation: 'fadeUp 0.5s ease' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 32 }}>{s.emoji}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 16, lineHeight: 1.3 }}>{s.title}</h2>
        <p style={{ color: 'var(--gray)', fontSize: 16, lineHeight: 1.6, maxWidth: 320 }}>{s.desc}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i === step ? 'var(--green-bright)' : 'var(--green-deep)',
            transition: 'all 0.3s'
          }}/>
        ))}
      </div>
      <button className="btn-primary" onClick={() => step < slides.length - 1 ? setStep(step + 1) : onNext()}>
        {step < slides.length - 1 ? 'Siguiente' : 'Comenzar →'}
      </button>
    </div>
  );
}

// ─── SCREEN: LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ email, name: email.split('@')[0], plan: 'bloom', points: 340 }); }, 1500);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '60px 28px 40px', animation: 'fadeUp 0.5s ease' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontStyle: 'italic', marginBottom: 8 }}>Bienvenido</h1>
        <p style={{ color: 'var(--gray)', fontSize: 15 }}>Accede a tu plan de bienestar personalizado</p>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Email</label>
          <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Contraseña</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--green-bright)', fontSize: 13, cursor: 'pointer' }}>¿Olvidaste tu contraseña?</span>
        </div>
        <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, border: '2px solid var(--black)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}/>
            Entrando...
          </span> : 'Ingresar'}
        </button>
        <div style={{ textAlign: 'center', color: 'var(--gray)', fontSize: 13 }}>o</div>
        <button className="btn-secondary" onClick={() => handleLogin()}>Continuar con Google</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24, color: 'var(--gray)', fontSize: 13 }}>
        ¿No tienes cuenta?{' '}
        <span style={{ color: 'var(--green-bright)', cursor: 'pointer' }} onClick={handleLogin}>Únete gratis</span>
      </div>
    </div>
  );
}

// ─── SCREEN: HOME DASHBOARD ───────────────────────────────────────────────────
function HomeScreen({ user, onNavigate }) {
  const today = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
  const progress = 3;
  const total = 10;

  return (
    <div className="screen" style={{ padding: '24px 20px 20px', animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ color: 'var(--gray)', fontSize: 12, textTransform: 'capitalize', marginBottom: 4 }}>{today}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontStyle: 'italic' }}>
            Hola, {user.name.charAt(0).toUpperCase() + user.name.slice(1)} 🌿
          </h1>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
          border: '2px solid var(--green-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--green-bright)', fontSize: 18, cursor: 'pointer'
        }} onClick={() => onNavigate('profile')}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Plan card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
        border: '1px solid rgba(46,204,113,0.3)', borderRadius: 20, padding: 20, marginBottom: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase' }}>Membresía</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)', marginTop: 2 }}>🌿 Bloom</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 300, color: 'var(--green-bright)' }}>{user.points}</div>
            <div style={{ fontSize: 11, color: 'var(--gray)' }}>PurePoints</div>
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, height: 8, marginBottom: 8 }}>
          <div style={{ height: '100%', borderRadius: 8, background: 'var(--green-bright)', width: `${(progress/total)*100}%`, transition: 'width 1s ease' }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray)' }}>
          <span>{progress} smoothies este mes</span>
          <span>{total - progress} restantes</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '🤖', label: 'Preguntar a IA', action: 'ai', bg: 'var(--green-deep)' },
          { icon: '📱', label: 'Mi QR', action: 'qr', bg: 'var(--green-deep)' },
          { icon: '🏆', label: 'Recompensas', action: 'rewards', bg: 'var(--green-deep)' },
          { icon: '🥤', label: 'Menú', action: 'menu', bg: 'var(--green-deep)' },
        ].map(a => (
          <button key={a.action} onClick={() => onNavigate(a.action)} style={{
            background: a.bg, border: '1px solid rgba(46,204,113,0.15)',
            borderRadius: 14, padding: '16px 12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--white)',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>

      {/* Recommended */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Para ti hoy</h3>
        {SAMPLE_SMOOTHIES.slice(0, 2).map(s => (
          <div key={s.id} className="card" style={{ marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🥤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.benefit}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--green-bright)', fontWeight: 500 }}>+{s.pts} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: AI CHAT ──────────────────────────────────────────────────────────
function AIScreen() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hola 🌿 Soy tu nutricionista IA. ¿Cómo puedo ayudarte hoy? Cuéntame tus objetivos de salud o síntomas.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const RESPONSES = {
    energía: 'Para energía sostenida te recomiendo el **Green Phoenix** 🌿 — espinaca + manzana + jengibre. La combinación de clorofila y vitamina C activa el metabolismo celular. Consúmelo antes de las 10am para maximizar el efecto.',
    peso: 'Para gestión de peso, el secreto está en ingredientes que regulan la insulina. Te recomiendo el **Calm Waters** con pepino y aloe — fibra soluble que prolonga la saciedad. Combinado con proteína en la mañana.',
    inflamación: 'La inflamación crónica responde muy bien a la cúrcuma + jengibre. Nuestro **Golden Hour** es perfecto para ti. La curcumina bloquea las vías NF-kB de inflamación. Agrega pimienta negra para aumentar biodisponibilidad 2000%.',
    digestión: 'Para digestión te recomiendo un protocolo de 21 días: aloe vera + jengibre + menta. El **Calm Waters** diario en ayunas repara la mucosa intestinal. Evita gluten y lácteos las primeras 2 semanas.',
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', text: userMsg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const key = Object.keys(RESPONSES).find(k => userMsg.toLowerCase().includes(k));
    const reply = key ? RESPONSES[key] : `Entiendo tu consulta sobre "${userMsg}". Basándome en principios de nutrición funcional, te recomiendo comenzar con una evaluación de tus hábitos actuales. ¿Cuántas horas duermes? ¿Tu digestión es regular? Con esa información puedo darte un protocolo más preciso. 🌿`;
    setMessages(p => [...p, { role: 'ai', text: reply }]);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(46,204,113,0.1)', flexShrink: 0 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic' }}>dr.smoothie.ai</h2>
        <p style={{ fontSize: 12, color: 'var(--green-bright)', marginTop: 2 }}>● Nutricionista IA activa</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'ai' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-deep)', border: '1px solid var(--green-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginRight: 8, flexShrink: 0 }}>🌿</div>
            )}
            <div style={{
              maxWidth: '78%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'var(--green-bright)' : 'var(--green-deep)',
              color: m.role === 'user' ? 'var(--black)' : 'var(--white)',
              fontSize: 14, lineHeight: 1.5,
              border: m.role === 'ai' ? '1px solid rgba(46,204,113,0.15)' : 'none'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-deep)', border: '1px solid var(--green-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
            <div style={{ background: 'var(--green-deep)', borderRadius: 18, padding: '12px 16px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-bright)', animation: `pulse 1s ease ${i*0.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      <div style={{ padding: '12px', borderTop: '1px solid rgba(46,204,113,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {AI_SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInput(s); }} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 20,
              background: 'var(--green-deep)', border: '1px solid rgba(46,204,113,0.2)',
              color: 'var(--gray)', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-body)'
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Pregunta a tu nutricionista IA..." value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} style={{ flex: 1 }}/>
          <button onClick={send} style={{
            width: 46, height: 46, borderRadius: 12, background: 'var(--green-bright)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--black)', flexShrink: 0
          }}>{Icon.send}</button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN: QR CODE ──────────────────────────────────────────────────────────
function QRScreen({ user }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="screen" style={{ padding: '24px 20px', animation: 'fadeUp 0.4s ease', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', marginBottom: 6 }}>Tu Pase Digital</h2>
      <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 32 }}>Muestra este código en caja</p>

      <div style={{
        background: 'white', borderRadius: 20, padding: 24, margin: '0 auto', width: 240,
        display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24
      }}>
        <div style={{ width: 180, height: 180 }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* QR pattern simulation */}
            {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
              const inCorner = (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
              const fill = inCorner ? '#050A05' : Math.random() > 0.5 ? '#050A05' : 'transparent';
              return <rect key={`${r}-${c}`} x={r*14+1} y={c*14+1} width={12} height={12} fill="#050A05" opacity={Math.random() > 0.4 ? 1 : 0}/>;
            }))}
            <rect x="1" y="1" width="40" height="40" fill="none" stroke="#050A05" strokeWidth="3"/>
            <rect x="59" y="1" width="40" height="40" fill="none" stroke="#050A05" strokeWidth="3"/>
            <rect x="1" y="59" width="40" height="40" fill="none" stroke="#050A05" strokeWidth="3"/>
            <rect x="8" y="8" width="26" height="26" fill="#050A05"/>
            <rect x="66" y="8" width="26" height="26" fill="#050A05"/>
            <rect x="8" y="66" width="26" height="26" fill="#050A05"/>
          </svg>
        </div>
        <div style={{ color: '#050A05', fontSize: 11, letterSpacing: 2, marginTop: 8, fontWeight: 500 }}>
          PURELIFE-{user.email?.slice(0,6).toUpperCase() || 'MEMBER'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 300, color: 'var(--green-bright)' }}>{user.points}</div>
          <div style={{ fontSize: 11, color: 'var(--gray)' }}>PurePoints</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 300, color: 'var(--gold)' }}>🌿</div>
          <div style={{ fontSize: 11, color: 'var(--gray)' }}>Bloom</div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 300, color: 'var(--white)' }}>3</div>
          <div style={{ fontSize: 11, color: 'var(--gray)' }}>Este mes</div>
        </div>
      </div>

      {!checked ? (
        <button className="btn-primary" onClick={() => setChecked(true)} style={{ maxWidth: 280, margin: '0 auto' }}>
          Simular Check-in
        </button>
      ) : (
        <div style={{
          background: 'rgba(46,204,113,0.1)', border: '1px solid var(--green-bright)',
          borderRadius: 14, padding: '16px', maxWidth: 280, margin: '0 auto',
          animation: 'fadeUp 0.4s ease'
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
          <div style={{ fontWeight: 500, color: 'var(--green-bright)', marginBottom: 4 }}>¡Check-in exitoso!</div>
          <div style={{ fontSize: 13, color: 'var(--gray)' }}>+50 PurePoints acumulados</div>
        </div>
      )}
    </div>
  );
}

// ─── SCREEN: MENU ─────────────────────────────────────────────────────────────
function MenuScreen() {
  const [selected, setSelected] = useState(null);
  const cats = ['Todos', 'Detox', 'Energía', 'Inmunidad', 'Calma'];
  const [cat, setCat] = useState('Todos');

  return (
    <div className="screen" style={{ padding: '24px 20px', animation: 'fadeUp 0.4s ease' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', marginBottom: 20 }}>Nuestro Menú</h2>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)} style={{
            flexShrink: 0, padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
            background: cat === c ? 'var(--green-bright)' : 'var(--green-deep)',
            color: cat === c ? 'var(--black)' : 'var(--gray)',
            border: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500
          }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SAMPLE_SMOOTHIES.map(s => (
          <div key={s.id} onClick={() => setSelected(selected === s.id ? null : s.id)} style={{
            background: 'var(--green-deep)', border: `1px solid ${selected === s.id ? s.color : 'rgba(46,204,113,0.15)'}`,
            borderRadius: 16, padding: '16px', cursor: 'pointer', transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🥤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>{s.benefit}</div>
              </div>
              <div style={{ color: 'var(--green-bright)', fontWeight: 500 }}>+{s.pts}pts</div>
            </div>
            {selected === s.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(46,204,113,0.1)', animation: 'fadeUp 0.3s ease' }}>
                <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Ingredientes</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {s.ingredients.map(ing => (
                    <span key={ing} style={{ padding: '4px 10px', borderRadius: 20, background: `${s.color}22`, color: s.color, fontSize: 12, border: `1px solid ${s.color}44` }}>{ing}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: REWARDS ──────────────────────────────────────────────────────────
function RewardsScreen({ user }) {
  const rewards = [
    { pts: 100, label: 'Descuento 10%', emoji: '🎫', claimed: true },
    { pts: 250, label: 'Smoothie gratis', emoji: '🥤', claimed: true },
    { pts: 500, label: 'Sesión nutrición', emoji: '🌿', claimed: false },
    { pts: 1000, label: 'Upgrade a Canopy', emoji: '🌳', claimed: false },
  ];
  return (
    <div className="screen" style={{ padding: '24px 20px', animation: 'fadeUp 0.4s ease' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontStyle: 'italic', marginBottom: 6 }}>Recompensas</h2>
      <p style={{ color: 'var(--gray)', fontSize: 13, marginBottom: 24 }}>Canjea tus PurePoints</p>

      <div style={{
        background: 'linear-gradient(135deg, #1a3a1a, #0D2B0D)', border: '1px solid rgba(46,204,113,0.3)',
        borderRadius: 20, padding: '20px', textAlign: 'center', marginBottom: 24
      }}>
        <div style={{ fontSize: 48, fontWeight: 200, color: 'var(--green-bright)' }}>{user.points}</div>
        <div style={{ color: 'var(--gray)', fontSize: 14 }}>PurePoints disponibles</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rewards.map((r, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: user.points >= r.pts ? 1 : 0.5 }}>
            <span style={{ fontSize: 28 }}>{r.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>{r.label}</div>
              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{r.pts} PurePoints</div>
            </div>
            {r.claimed ? (
              <span style={{ fontSize: 20, color: 'var(--green-bright)' }}>✓</span>
            ) : (
              <button style={{
                padding: '8px 16px', borderRadius: 20, background: user.points >= r.pts ? 'var(--green-bright)' : 'var(--green-deep)',
                color: user.points >= r.pts ? 'var(--black)' : 'var(--gray)', border: 'none',
                fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)'
              }}>Canjear</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: PROFILE ──────────────────────────────────────────────────────────
function ProfileScreen({ user, onLogout, onNavigate }) {
  return (
    <div className="screen" style={{ padding: '24px 20px', animation: 'fadeUp 0.4s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
          border: '2px solid var(--green-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, margin: '0 auto 12px'
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>{user.name}</h2>
        <p style={{ color: 'var(--gray)', fontSize: 13 }}>{user.email}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '6px 14px', borderRadius: 20, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <span>🌿</span>
          <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500 }}>Bloom Member</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[
          { icon: '💳', label: 'Mi membresía', sub: 'Bloom · $59/mes' },
          { icon: '📊', label: 'Mi progreso', sub: '3 smoothies este mes' },
          { icon: '🔔', label: 'Notificaciones', sub: 'Activas' },
          { icon: '❓', label: 'Ayuda & Soporte', sub: '' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</div>
              {item.sub && <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>{item.sub}</div>}
            </div>
            <span style={{ color: 'var(--gray)' }}>›</span>
          </div>
        ))}
      </div>

      <button className="btn-secondary" onClick={onLogout} style={{ borderColor: 'rgba(231,76,60,0.4)', color: '#E74C3C' }}>
        Cerrar sesión
      </button>

      <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray)', fontSize: 11 }}>
        dr.smoothie.ai × PureLife v1.0 · drsmoothieai.com
      </div>
    </div>
  );
}

// ─── SCREEN: PLANS ────────────────────────────────────────────────────────────
function PlansScreen({ onBack }) {
  const [selected, setSelected] = useState('bloom');
  return (
    <div className="screen" style={{ padding: '24px 20px', animation: 'fadeUp 0.4s ease' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--green-bright)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 20, fontFamily: 'var(--font-body)', fontSize: 14 }}>
        {Icon.back} Regresar
      </button>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontStyle: 'italic', marginBottom: 6 }}>Elige tu plan</h2>
      <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 24 }}>Invierte en tu bienestar</p>

      {PLANS.map(p => (
        <div key={p.id} onClick={() => setSelected(p.id)} style={{
          border: `2px solid ${selected === p.id ? p.color : 'rgba(46,204,113,0.1)'}`,
          borderRadius: 20, padding: '20px', marginBottom: 14, cursor: 'pointer',
          background: selected === p.id ? `${p.color}0D` : 'var(--green-deep)',
          transition: 'all 0.3s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 20, marginRight: 8 }}>{p.emoji}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: p.color }}>{p.name}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 26, fontWeight: 300, color: p.color }}>${p.price}</span>
              <span style={{ color: 'var(--gray)', fontSize: 12 }}>/mes</span>
            </div>
          </div>
          {p.perks.map(perk => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: p.color, fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13, color: 'var(--gray)' }}>{perk}</span>
            </div>
          ))}
        </div>
      ))}

      <button className="btn-gold" style={{ marginTop: 8 }}>
        Comenzar con {PLANS.find(p => p.id === selected)?.name} — ${PLANS.find(p => p.id === selected)?.price}/mes
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('splash'); // splash | onboarding | login | app
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('home');

  useEffect(() => { injectStyles(); }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPhase('app');
    setTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    setPhase('login');
  };

  const renderApp = () => {
    if (tab === 'plans') return <PlansScreen onBack={() => setTab('home')} />;
    switch(tab) {
      case 'home': return <HomeScreen user={user} onNavigate={setTab} />;
      case 'ai': return <AIScreen />;
      case 'qr': return <QRScreen user={user} />;
      case 'menu': return <MenuScreen />;
      case 'rewards': return <RewardsScreen user={user} />;
      case 'profile': return <ProfileScreen user={user} onLogout={handleLogout} onNavigate={setTab} />;
      default: return <HomeScreen user={user} onNavigate={setTab} />;
    }
  };

  const navTabs = [
    { id: 'home', label: 'Inicio', icon: Icon.home },
    { id: 'ai', label: 'IA', icon: Icon.ai },
    { id: 'qr', label: 'QR', icon: Icon.qr },
    { id: 'menu', label: 'Menú', icon: Icon.leaf },
    { id: 'profile', label: 'Perfil', icon: Icon.user },
  ];

  return (
    <div className="app">
      {phase === 'splash' && <SplashScreen onNext={() => setPhase('onboarding')} />}
      {phase === 'onboarding' && <OnboardingScreen onNext={() => setPhase('login')} />}
      {phase === 'login' && <LoginScreen onLogin={handleLogin} />}
      {phase === 'app' && (
        <>
          <div className="screen" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {renderApp()}
          </div>
          <nav className="bottom-nav">
            {navTabs.map(t => (
              <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
