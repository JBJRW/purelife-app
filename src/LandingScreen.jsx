import React, { useEffect, useState } from 'react';

export default function LandingScreen({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Estilos + Fuentes + Keyframes ───────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300;1,600&family=Instrument+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px #1AE05A33, 0 0 40px #1AE05A11; }
          50%       { box-shadow: 0 0 32px #1AE05A66, 0 0 64px #1AE05A22; }
        }
        @keyframes badge-slide {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 1; }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.08); }
          66%       { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-40px, 30px) scale(1.12); }
        }
        @keyframes grain {
          0%   { transform: translate(0, 0); }
          10%  { transform: translate(-2%, -3%); }
          20%  { transform: translate(3%, 1%); }
          30%  { transform: translate(-1%, 4%); }
          40%  { transform: translate(4%, -2%); }
          50%  { transform: translate(-3%, 3%); }
          60%  { transform: translate(2%, -4%); }
          70%  { transform: translate(-4%, 1%); }
          80%  { transform: translate(1%, 3%); }
          90%  { transform: translate(3%, -1%); }
          100% { transform: translate(0, 0); }
        }
        .pl-nav-link {
          color: #7aad82;
          font-size: 13px;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
          cursor: pointer;
        }
        .pl-nav-link:hover { color: #F5F0E8; }
        .pl-btn-primary {
          background: #1AE05A;
          color: #0a1a0d;
          border: none;
          border-radius: 50px;
          padding: 15px 32px;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.22s;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .pl-btn-primary:hover {
          background: #22f565;
          transform: scale(1.04);
        }
        .pl-btn-secondary {
          background: transparent;
          color: #F5F0E8;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          padding: 15px 28px;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.22s;
        }
        .pl-btn-secondary:hover {
          border-color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.05);
        }
        .pl-stat {
          text-align: center;
          padding: 0 16px;
        }
        .pl-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1AE05A;
          line-height: 1;
        }
        .pl-stat-label {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 11px;
          color: #5a8060;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }
      `}</style>

      {/* ── Contenedor principal ───────────────────────────── */}
      <div style={{
        minHeight: '100vh',
        background: '#0a1a0d',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Instrument Sans', sans-serif",
      }}>

        {/* Orbs de fondo */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-15%',
          width: 420, height: 420,
          background: 'radial-gradient(circle, #1AE05A18 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orb1 18s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-10%',
          width: 320, height: 320,
          background: 'radial-gradient(circle, #1A5C3A22 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orb2 22s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '20%',
          width: 200, height: 200,
          background: 'radial-gradient(circle, #C9973A0a 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Grain film */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          opacity: 0.6,
          animation: 'grain 0.4s steps(1) infinite',
          pointerEvents: 'none',
        }} />

        {/* ── NAV ───────────────────────────────────────────── */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeIn 0.6s ease forwards' : 'none',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28,
              background: 'linear-gradient(135deg, #1AE05A, #2D8653)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>🌿</div>
            <span style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 18,
              color: '#F5F0E8',
              letterSpacing: '-0.02em',
            }}>PureLife</span>
          </div>

          {/* Links — ocultos en pantallas muy pequeñas */}
          <div style={{ display: 'flex', gap: 20 }}>
            {['IA', 'Ingredientes', 'Planes'].map(l => (
              <span key={l} className="pl-nav-link">{l}</span>
            ))}
          </div>

          {/* CTA nav */}
          <button className="pl-btn-primary" onClick={onStart}
            style={{ padding: '9px 20px', fontSize: 13, animation: 'none' }}>
            Comenzar →
          </button>
        </nav>

        {/* ── HERO ──────────────────────────────────────────── */}
        <main style={{
          position: 'relative', zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 28px 40px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 140px)',
        }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(26,224,90,0.08)',
            border: '1px solid rgba(26,224,90,0.2)',
            borderRadius: 50,
            padding: '6px 16px',
            marginBottom: 36,
            opacity: visible ? 1 : 0,
            animation: visible ? 'badge-slide 0.7s ease 0.1s forwards' : 'none',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#1AE05A',
              boxShadow: '0 0 8px #1AE05A',
            }} />
            <span style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 11,
              color: '#1AE05A',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              DR.SMOOTHIE.AI · WELLNESS CLUB · EST. 2026
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(38px, 9vw, 62px)',
            fontWeight: 300,
            color: '#F5F0E8',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: '0 0 24px',
            maxWidth: 540,
            opacity: visible ? 1 : 0,
            animation: visible ? 'fadeUp 0.8s ease 0.2s forwards' : 'none',
          }}>
            Tu bienestar,{' '}
            <em style={{
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#1AE05A',
              display: 'inline-block',
              animation: 'float 5s ease-in-out infinite',
            }}>
              redefinido
            </em>
            {' '}por la IA.
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 16,
            color: '#5a8060',
            lineHeight: 1.7,
            maxWidth: 360,
            margin: '0 0 44px',
            opacity: visible ? 1 : 0,
            animation: visible ? 'fadeUp 0.8s ease 0.35s forwards' : 'none',
          }}>
            Ingredientes reales. Inteligencia real.<br />Resultados reales.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
            opacity: visible ? 1 : 0,
            animation: visible ? 'fadeUp 0.8s ease 0.5s forwards' : 'none',
          }}>
            <button className="pl-btn-primary" onClick={onStart}>
              Empezar ahora →
            </button>
            <button className="pl-btn-secondary"
              onClick={() => document.getElementById('pl-features')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver cómo funciona
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 0, marginTop: 56,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 32,
            opacity: visible ? 1 : 0,
            animation: visible ? 'fadeUp 0.8s ease 0.65s forwards' : 'none',
          }}>
            {[
              { num: 'AI', label: 'Powered by Claude' },
              { num: '3', label: 'Planes de membresía' },
              { num: '∞', label: 'Recetas personalizadas' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <div style={{
                    width: 1, background: 'rgba(255,255,255,0.07)', margin: '0 24px',
                  }} />
                )}
                <div className="pl-stat">
                  <div className="pl-stat-num">{s.num}</div>
                  <div className="pl-stat-label">{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>

        {/* ── FEATURES ──────────────────────────────────────── */}
        <section id="pl-features" style={{
          position: 'relative', zIndex: 5,
          padding: '40px 24px 80px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            maxWidth: 700,
            margin: '0 auto',
          }}>
            {[
              { icon: '🤖', title: 'Dr. Smoothie AI', desc: 'Tu asesor de bienestar disponible 24/7' },
              { icon: '🥤', title: 'Recetas personalizadas', desc: 'Smoothies y jugos adaptados a tus objetivos' },
              { icon: '📊', title: 'Progreso real', desc: 'Seguimiento de tu evolución con datos' },
              { icon: '🎥', title: 'Video Agent', desc: 'Guías en video generadas por IA' },
            ].map((f) => (
              <div key={f.title} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '20px 18px',
                transition: 'all 0.22s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(26,224,90,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(26,224,90,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#F5F0E8',
                  marginBottom: 6,
                }}>{f.title}</div>
                <div style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 12,
                  color: '#5a8060',
                  lineHeight: 1.5,
                }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="pl-btn-primary"
              onClick={onStart}
              style={{ fontSize: 16, padding: '17px 40px' }}>
              Comenzar gratis →
            </button>
            <p style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 12,
              color: '#3a5a3e',
              marginTop: 14,
            }}>
              Sin tarjeta de crédito · Cancela cuando quieras
            </p>
          </div>
        </section>

        {/* Scroll indicator */}
        <div style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          animation: 'scroll-bounce 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 1, height: 32,
            background: 'linear-gradient(to bottom, transparent, #1AE05A88)',
          }} />
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#1AE05A',
          }} />
        </div>
      </div>
    </>
  );
}
