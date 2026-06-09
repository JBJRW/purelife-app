import { useState, useEffect } from 'react'
import { LANGUAGES, loadLang, saveLang, t } from '../i18n'
import LanguageSelector from './components/LanguageSelector'

export default function ComingSoonPage({ onEnterApp }) {
  const [lang, setLang] = useState(() => loadLang())
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoY, setLogoY] = useState(0)

  const handleLangChange = (code) => { saveLang(code); setLang(code); }

  // Logo flotante suave
  useEffect(() => {
    let frame
    let t = 0
    const animate = () => {
      t += 0.012
      setLogoY(Math.sin(t) * 10)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060D08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=DM+Sans:wght@300;400&display=swap');

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity: .4; transform: translate(-50%,-50%) scale(1); }
          50%     { opacity: .8; transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cs-ring1 { animation: spin-slow 18s linear infinite; }
        .cs-ring2 { animation: spin-rev  12s linear infinite; }

        .cs-glow1 {
          position: absolute; width: 520px; height: 520px; border-radius: 50%;
          background: radial-gradient(circle, rgba(26,92,58,0.18) 0%, transparent 70%);
          top: 50%; left: 50%;
          animation: pulse-glow 6s ease-in-out infinite;
          pointer-events: none;
        }
        .cs-glow2 {
          position: absolute; width: 750px; height: 750px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,151,58,0.07) 0%, transparent 65%);
          top: 50%; left: 50%;
          animation: pulse-glow 9s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .cs-particles {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.08) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.06) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,0.05) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.07) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.04) 0%, transparent 100%);
        }
        .cs-btn-primary {
          background: linear-gradient(135deg, #1A5C3A, #2D8653);
          color: #fff; border: none;
          padding: 0.85rem 1.2rem; border-radius: 8px;
          font-family: 'DM Sans'; font-size: 0.78rem;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(26,92,58,0.35);
        }
        .cs-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(26,92,58,0.5);
        }
        .cs-btn-secondary {
          background: transparent;
          color: rgba(255,255,255,0.35);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.7rem 1.4rem; border-radius: 8px;
          font-family: 'DM Sans'; font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s; margin-top: 0.5rem;
        }
        .cs-btn-secondary:hover {
          border-color: rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.6);
        }
        .cs-input:focus { border-color: rgba(26,92,58,0.6) !important; outline: none; }
        .cs-anim { animation: fade-in-up 0.7s ease both; }
      `}</style>

      {/* Selector de idioma — top right */}
      <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', zIndex: 10 }}>
        <LanguageSelector lang={lang} onChange={handleLangChange} />
      </div>

      {/* Fondo partículas */}
      <div className="cs-particles" />
      <div className="cs-glow1" />
      <div className="cs-glow2" />

      {/* ── LOGO FLOTANTE ─────────────────────────── */}
      <div style={{
        position: 'relative',
        width: 110, height: 110,
        marginBottom: '2rem',
        transform: `translateY(${logoY}px)`,
        transition: 'transform 0.05s linear',
      }}>
        {/* Anillo exterior */}
        <div className="cs-ring1" style={{
          position: 'absolute', inset: -14, borderRadius: '50%',
          border: '1px solid rgba(26,92,58,0.35)',
        }}>
          {/* Punto verde en el anillo */}
          <div style={{
            position: 'absolute', top: -4, left: '50%',
            transform: 'translateX(-50%)',
            width: 7, height: 7,
            background: '#2D8653', borderRadius: '50%',
            boxShadow: '0 0 8px #2D8653',
          }}/>
        </div>
        {/* Anillo interior */}
        <div className="cs-ring2" style={{
          position: 'absolute', inset: -6, borderRadius: '50%',
          border: '1px dashed rgba(201,151,58,0.2)',
        }}>
          <div style={{
            position: 'absolute', bottom: -3, left: '50%',
            transform: 'translateX(-50%)',
            width: 5, height: 5,
            background: '#C9973A', borderRadius: '50%',
            boxShadow: '0 0 6px #C9973A',
          }}/>
        </div>
        {/* Logo */}
        <img
          src="/purelife-logo.png"
          alt="PureLife"
          style={{
            width: 110, height: 110,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(26,92,58,0.4)',
            boxShadow: '0 0 30px rgba(26,92,58,0.25)',
            display: 'block',
          }}
          onError={e => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* Brand */}
      <p className="cs-anim" style={{
        fontFamily: 'DM Sans', fontSize: '0.65rem',
        letterSpacing: '0.5em', color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase', margin: '0 0 0.8rem',
        animationDelay: '0.1s',
      }}>
        {t(lang, 'brand')}
      </p>

      {/* Headline */}
      <h1 className="cs-anim" style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 'clamp(3.2rem, 11vw, 7rem)',
        fontWeight: 300, color: '#fff',
        lineHeight: 0.88, letterSpacing: '-0.02em',
        textAlign: 'center', margin: '0 0 0.15em',
        animationDelay: '0.2s',
      }}>
        {t(lang, 'comingSoon').split('\\n').map((line,i)=><span key={i}>{line}{i===0&&<br/>}</span>)}
      </h1>

      {/* Year gold */}
      <p className="cs-anim" style={{
        fontFamily: "'Fraunces', serif",
        fontStyle: 'italic',
        fontSize: 'clamp(1.5rem, 4.5vw, 2.8rem)',
        fontWeight: 300, color: '#C9973A',
        letterSpacing: '0.22em',
        margin: '0 0 2rem', textAlign: 'center',
        animationDelay: '0.3s',
      }}>
        {t(lang, 'year')}
      </p>

      {/* Divider */}
      <div className="cs-anim" style={{
        width: 40, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(201,151,58,0.5), transparent)',
        marginBottom: '1.6rem',
        animationDelay: '0.35s',
      }}/>

      {/* Tagline */}
      <p className="cs-anim" style={{
        fontSize: '0.82rem', fontWeight: 300,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center', maxWidth: 270,
        lineHeight: 1.9, marginBottom: '2.2rem',
        animationDelay: '0.4s',
      }}>
        {t(lang, 'tagline')}<br/>{t(lang, 'powered')}
      </p>

      {/* Email form */}
      <div className="cs-anim" style={{
        width: '100%', maxWidth: 320,
        animationDelay: '0.5s',
      }}>
        {!sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <input
              className="cs-input"
              type="email"
              placeholder={t(lang, 'emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '0.85rem 1.2rem',
                borderRadius: 8, fontFamily: 'DM Sans',
                fontSize: '0.875rem', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              className="cs-btn-primary"
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? t(lang, 'reserving') : t(lang, 'earlyAccess')}
            </button>
          </div>
        ) : (
          <p style={{
            color: '#2D8653', fontSize: '0.875rem',
            letterSpacing: '0.05em', textAlign: 'center',
          }}>
            {t(lang, 'onList')}
          </p>
        )}
      </div>

      {/* Botón entrar a la app */}
      {onEnterApp && (
        <button
          className="cs-btn-secondary cs-anim"
          onClick={onEnterApp}
          style={{ animationDelay: '0.6s' }}
        >
          {t(lang, 'alreadyMember')}
        </button>
      )}

      {/* Pills */}
      <div className="cs-anim" style={{
        display: 'flex', gap: '0.5rem',
        marginTop: '2.2rem', flexWrap: 'wrap',
        justifyContent: 'center',
        animationDelay: '0.65s',
      }}>
        {t(lang, 'pills').map(p => (
          <span key={p} style={{
            fontSize: '0.58rem', letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '0.25rem 0.75rem', borderRadius: 20,
          }}>{p}</span>
        ))}
      </div>

      {/* Footer */}
      <p style={{
        position: 'absolute', bottom: '1.4rem',
        fontSize: '0.6rem', color: 'rgba(255,255,255,0.1)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        © 2026 JRMB Food Network LLC
      </p>
    </div>
  )
}
