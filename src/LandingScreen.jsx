import React, { useEffect, useState } from 'react';

export default function LandingScreen({ onStart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ── Fuentes + Keyframes ───────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        :root {
          --obsidian: #080B0A;
          --deep:     #0D1210;
          --surface:  #111815;
          --surface2: #162019;
          --surface3: #1C2920;
          --gold:     #C9A84C;
          --gold2:    #E8C96A;
          --gold3:    #F5E09A;
          --cream:    #F4EFE6;
          --cream2:   #E8E0D0;
          --sage:     #4A7C59;
          --sage2:    #2E5E3A;
          --emerald:  #00C97B;
          --muted:    #6B7E74;
          --border:   rgba(201,168,76,0.15);
          --border2:  rgba(201,168,76,0.08);
        }

        @keyframes pl-fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pl-fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes pl-drift {
          0%   { transform:translate(0,0) scale(1); }
          100% { transform:translate(30px,-40px) scale(1.1); }
        }
        @keyframes pl-grain {
          0%   { transform:translate(0,0); }
          20%  { transform:translate(-2%,-3%); }
          40%  { transform:translate(3%,1%); }
          60%  { transform:translate(-1%,4%); }
          80%  { transform:translate(4%,-2%); }
          100% { transform:translate(0,0); }
        }
        @keyframes pl-spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes pl-pulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.3; }
        }
        @keyframes pl-glow {
          0%,100% { box-shadow:0 4px 16px rgba(201,168,76,0.25); }
          50%     { box-shadow:0 4px 24px rgba(201,168,76,0.5); }
        }
        @keyframes pl-scroll {
          0%,100% { transform:translateX(-50%) translateY(0); opacity:0.6; }
          50%     { transform:translateX(-50%) translateY(6px); opacity:1; }
        }

        .pl-btn-primary {
          background: linear-gradient(135deg, var(--gold), var(--gold2));
          color: var(--obsidian);
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 8px 32px rgba(201,168,76,0.3);
          transition: all 0.3s ease;
        }
        .pl-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(201,168,76,0.45);
        }
        .pl-btn-ghost {
          background: transparent;
          color: var(--cream);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 14px 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pl-btn-ghost:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .pl-nav-link {
          color: var(--muted);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: color 0.2s;
          cursor: pointer;
        }
        .pl-nav-link:hover { color: var(--cream); }

        .pl-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          color: var(--gold2);
          line-height: 1;
        }
        .pl-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        .pl-feature-card {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: 20px;
          padding: 20px 18px;
          transition: all 0.3s ease;
        }
        .pl-feature-card:hover {
          border-color: var(--border);
          background: var(--surface2);
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── Contenedor principal ───────────────────────────────────── */}
      <div style={{
        minHeight: '100vh',
        background: 'var(--obsidian)',
        color: 'var(--cream)',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflowX: 'hidden',
      }}>

        {/* Grain overlay */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          animation: 'pl-grain 0.5s steps(1) infinite',
        }} />

        {/* Orbs de fondo */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-200px',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,124,89,0.25), transparent 70%)',
          filter: 'blur(120px)', pointerEvents: 'none',
          animation: 'pl-drift 12s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-150px',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)',
          filter: 'blur(120px)', pointerEvents: 'none',
          animation: 'pl-drift 12s ease-in-out infinite alternate',
          animationDelay: '-5s',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '60%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,123,0.1), transparent 70%)',
          filter: 'blur(120px)', pointerEvents: 'none',
          animation: 'pl-drift 12s ease-in-out infinite alternate',
          animationDelay: '-9s',
        }} />

        {/* Grid hex background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        }} />

        {/* ── NAV ───────────────────────────────────────────────────── */}
        <nav style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(13,18,16,0.85)',
          backdropFilter: 'blur(20px)',
          opacity: visible ? 1 : 0,
          animation: visible ? 'pl-fadeIn 0.6s ease forwards' : 'none',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: 'var(--gold2)',
            }}>✦ PureLife</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 20 }}>
            {['Dr. Smoothie', 'Planes', 'TV'].map(l => (
              <span key={l} className="pl-nav-link">{l}</span>
            ))}
          </div>

          {/* CTA nav */}
          <button className="pl-btn-primary" onClick={onStart}
            style={{ padding: '9px 20px', fontSize: 13 }}>
            Comenzar →
          </button>
        </nav>

        {/* ── HERO SPLASH ───────────────────────────────────────────── */}
        <main style={{
          position: 'relative', zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px 28px 40px',
          textAlign: 'center',
          minHeight: 'calc(100vh - 65px)',
        }}>

          {/* Eyebrow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 28,
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 0.8s ease both' : 'none',
          }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <span style={{
              fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500,
            }}>La clínica de longevidad en tu bolsillo</span>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>

          {/* Logo display */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #F5E09A 0%, #C9A84C 40%, #4A7C59 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 8,
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 0.9s 0.1s ease both' : 'none',
          }}>PureLife</h1>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem', color: 'var(--muted)',
            fontStyle: 'italic', letterSpacing: '0.05em',
            marginBottom: 24,
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 0.9s 0.2s ease both' : 'none',
          }}>Wellness Club</div>

          <p style={{
            fontSize: '0.8rem', color: 'var(--cream2)',
            opacity: visible ? 0.7 : 0,
            letterSpacing: '0.05em', maxWidth: 320,
            margin: '0 auto 40px', lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif",
            animation: visible ? 'pl-fadeUp 0.9s 0.3s ease both' : 'none',
          }}>
            Inteligencia artificial + ciencia nutricional para transformar<br />
            tu energía vital, un smoothie a la vez.
          </p>

          {/* Vitality Ring */}
          <div style={{
            width: 180, height: 180,
            margin: '0 auto 40px',
            position: 'relative',
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 1s 0.4s ease both' : 'none',
          }}>
            <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="plRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#00C97B" />
                </linearGradient>
              </defs>
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="6" />
              <circle cx="80" cy="80" r="70" fill="none"
                stroke="url(#plRingGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="440" strokeDashoffset="112"
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '3rem', animation: 'pl-spin 20s linear infinite' }}>🥤</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold2)', marginTop: 4 }}>74%</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Vitalidad</div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 1s 0.5s ease both' : 'none',
          }}>
            <button className="pl-btn-primary" onClick={onStart}>Comenzar gratis</button>
            <button className="pl-btn-ghost"
              onClick={() => document.getElementById('pl-features')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver planes
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 0, marginTop: 56,
            borderTop: '1px solid var(--border2)',
            paddingTop: 32,
            opacity: visible ? 1 : 0,
            animation: visible ? 'pl-fadeUp 0.8s 0.65s ease both' : 'none',
          }}>
            {[
              { num: 'AI', label: 'Powered by Claude' },
              { num: '3', label: 'Planes membresía' },
              { num: '∞', label: 'Recetas personalizadas' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ width: 1, background: 'var(--border2)', margin: '0 24px' }} />}
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div className="pl-stat-num">{s.num}</div>
                  <div className="pl-stat-label">{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>

        {/* ── FEATURES ──────────────────────────────────────────────── */}
        <section id="pl-features" style={{
          position: 'relative', zIndex: 5,
          padding: '60px 24px 80px',
          maxWidth: 800, margin: '0 auto',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{
              fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--gold)',
              display: 'block', marginBottom: 12,
            }}>App PureLife 2.0</span>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 400, color: 'var(--cream)', lineHeight: 1.1,
            }}>Tu <em style={{ color: 'var(--gold2)', fontStyle: 'italic' }}>clínica personal</em> siempre contigo</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { icon: '🧬', title: 'Dr. Smoothie AI', desc: 'Protocolo de longevidad personalizado con Claude Sonnet 4.6' },
              { icon: '🥤', title: 'Recetas IA', desc: 'Smoothies y jugos adaptados a tus objetivos y síntomas' },
              { icon: '🎬', title: 'PureLife TV', desc: 'Videos 4K generados por fal.ai + HeyGen avatar instructor' },
              { icon: '🏆', title: 'Rewards', desc: 'Gamificación: hábitos → puntos → acceso premium' },
            ].map((f) => (
              <div key={f.title} className="pl-feature-card">
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 17, fontWeight: 500, color: 'var(--cream)', marginBottom: 6,
                }}>{f.title}</div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: 'var(--muted)', lineHeight: 1.6,
                }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="pl-btn-primary" onClick={onStart}
              style={{ fontSize: 16, padding: '17px 44px' }}>
              Empezar ahora →
            </button>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: 'var(--muted)', marginTop: 14,
            }}>Sin tarjeta de crédito · Cancela cuando quieras</p>
          </div>
        </section>

        {/* Scroll indicator */}
        <div style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6,
          animation: 'pl-scroll 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: 1, height: 32,
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.6))',
          }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)' }} />
        </div>
      </div>
    </>
  );
}
