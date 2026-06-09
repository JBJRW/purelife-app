import { useState } from 'react'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

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
      background: '#060606',
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
        @keyframes breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: .5; }
          50% { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cs-ring { animation: spin 12s linear infinite; }
        .cs-glow {
          position: absolute; width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          animation: breathe 5s ease-in-out infinite;
          pointer-events: none;
        }
        .cs-glow2 {
          position: absolute; width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 65%);
          top: 50%; left: 50%;
          animation: breathe 7s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .cs-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .cs-input:focus { border-color: rgba(34,197,94,0.5) !important; outline: none; }
      `}</style>

      <div className="cs-glow" />
      <div className="cs-glow2" />

      {/* Logo circular */}
      <div style={{ position: 'relative', width: 90, height: 90, marginBottom: '2rem' }}>
        <div className="cs-ring" style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          border: '1px solid rgba(34,197,94,0.3)'
        }}>
          <div style={{
            position: 'absolute', top: -3, left: '50%',
            transform: 'translateX(-50%)',
            width: 6, height: 6,
            background: '#22c55e', borderRadius: '50%'
          }}/>
        </div>
        <img
          src="/purelife-logo.png"
          alt="PureLife"
          style={{
            width: 90, height: 90, borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(34,197,94,0.25)'
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Brand name */}
      <p style={{
        fontFamily: 'DM Sans', fontSize: '0.7rem',
        letterSpacing: '0.45em', color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase', marginBottom: '0.75rem', margin: '0 0 0.75rem'
      }}>
        PureLife Wellness Club
      </p>

      {/* Headline */}
      <h1 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 'clamp(3rem, 10vw, 6.5rem)',
        fontWeight: 300, color: '#fff',
        lineHeight: 0.9, letterSpacing: '-0.02em',
        textAlign: 'center', margin: '0 0 0.2em'
      }}>
        Coming<br/>Soon
      </h1>

      {/* Year */}
      <p style={{
        fontFamily: "'Fraunces', serif",
        fontStyle: 'italic',
        fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
        fontWeight: 300, color: '#D4AF37',
        letterSpacing: '0.2em',
        margin: '0 0 2.5rem', textAlign: 'center'
      }}>
        — 2026 —
      </p>

      {/* Divider */}
      <div style={{
        width: 36, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)',
        marginBottom: '2rem'
      }}/>

      {/* Tagline */}
      <p style={{
        fontSize: '0.85rem', fontWeight: 300,
        color: 'rgba(255,255,255,0.35)',
        textAlign: 'center', maxWidth: 280,
        lineHeight: 1.8, marginBottom: '2.5rem'
      }}>
        A new era of wellness.<br/>Powered by Dr. Smoothie AI.
      </p>

      {/* Email early access */}
      {!sent ? (
        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: '0.65rem', width: '100%', maxWidth: 320
        }}>
          <input
            className="cs-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: '0.8rem 1.2rem',
              borderRadius: 6, fontFamily: 'DM Sans',
              fontSize: '0.875rem', boxSizing: 'border-box'
            }}
          />
          <button
            className="cs-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff', border: 'none',
              padding: '0.8rem', borderRadius: 6,
              fontFamily: 'DM Sans', fontSize: '0.8rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}>
            {loading ? 'Reserving...' : 'Get Early Access'}
          </button>
        </div>
      ) : (
        <p style={{ color: '#22c55e', fontSize: '0.875rem', letterSpacing: '0.05em' }}>
          ✦ You're on the list. See you in 2026.
        </p>
      )}

      {/* Pills */}
      <div style={{
        display: 'flex', gap: '0.6rem',
        marginTop: '2.5rem', flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {['AI Wellness', 'Smoothie Science', 'Longevity', 'Community'].map(p => (
          <span key={p} style={{
            fontSize: '0.6rem', letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '0.25rem 0.7rem', borderRadius: 20
          }}>{p}</span>
        ))}
      </div>

      {/* Footer */}
      <p style={{
        position: 'absolute', bottom: '1.5rem',
        fontSize: '0.65rem', color: 'rgba(255,255,255,0.12)',
        letterSpacing: '0.15em', textTransform: 'uppercase'
      }}>
        © 2026 JRMB Food Network LLC
      </p>
    </div>
  )
}
