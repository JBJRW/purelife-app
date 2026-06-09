// src/components/LanguageSelector.jsx
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
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: C.glass, border: `1px solid ${C.glassBorder}`,
          borderRadius: 20, padding: '5px 12px', cursor: 'pointer',
          color: C.cream, fontSize: 13, transition: 'all 0.2s',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span style={{ fontSize: 16 }}>{current.flag}</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em' }}>
          {current.label}
        </span>
        <span style={{
          fontSize: 9, opacity: 0.5, marginLeft: 2,
          transform: open ? 'rotate(180deg)' : 'none',
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
          zIndex: 1000, minWidth: 180,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          maxHeight: 340, overflowY: 'auto',
        }}>
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
              }}
              onMouseEnter={e => { if (l.code !== lang) e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (l.code !== lang) e.target.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 18, minWidth: 22 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {l.code === lang && <span style={{ fontSize: 10, color: C.mint }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
