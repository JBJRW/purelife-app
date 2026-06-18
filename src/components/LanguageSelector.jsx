// src/components/LanguageSelector.jsx
// Globe icon + banderas + dropdown multilenguaje
import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../i18n';

const C = {
  dark: '#0F1F17', green: '#1A5C3A', mint: '#2D8653',
  gold: '#C9973A', cream: '#F5F0E8', glass: 'rgba(255,255,255,0.07)',
  glassBorder: 'rgba(255,255,255,0.15)',
};

export default function LanguageSelector({ lang, onChange, style = {} }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {/* Trigger: globo + bandera + label */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Change language"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.glass,
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 20, padding: '5px 12px',
          cursor: 'pointer', color: C.cream,
          fontSize: 13, transition: 'all 0.2s',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Globo */}
        <span style={{ fontSize: 15, lineHeight: 1 }}>🌐</span>
        {/* Bandera del idioma actual */}
        <span style={{ fontSize: 15, lineHeight: 1 }}>{current.flag}</span>
        {/* Label corto */}
        <span style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em' }}>
          {current.label}
        </span>
        {/* Chevron */}
        <span style={{
          fontSize: 9, opacity: 0.5, marginLeft: 2,
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#0D1F15',
          border: `1px solid ${C.glassBorder}`,
          borderRadius: 12, padding: '6px',
          zIndex: 1000, minWidth: 190,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          maxHeight: 340, overflowY: 'auto',
        }}>
          {/* Header del dropdown */}
          <div style={{
            padding: '6px 12px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 4,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🌐</span>
            <span style={{
              fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.gold,
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
            }}>Language</span>
          </div>

          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '8px 12px',
                background: l.code === lang ? `${C.mint}22` : 'transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                color: l.code === lang ? C.mint : C.cream,
                fontSize: 13, textAlign: 'left',
                transition: 'background 0.15s',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => {
                if (l.code !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                if (l.code !== lang) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 18, minWidth: 24 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {l.code === lang && (
                <span style={{ fontSize: 10, color: C.mint }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
