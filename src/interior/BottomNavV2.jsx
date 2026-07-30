import { motion } from 'framer-motion';
import { IT, IT_FONT_BODY } from './tokens';

const TABS = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'videos', label: 'Videos', icon: '▶' },
  { id: 'progreso', label: 'Progreso', icon: '◈' },
  { id: 'club', label: 'Club', icon: '✦' },
  { id: 'perfil', label: 'Perfil', icon: '◐' },
];

export default function BottomNavV2({ active, onNavigate }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: IT.navBarBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${IT.navBarBorder}`,
      }} />
      <div style={{
        position: 'relative',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 max(10px, env(safe-area-inset-bottom))',
      }}>
        {TABS.map(t => {
          const isActive = active === t.id;
          return (
            <motion.button
              key={t.id}
              onClick={() => onNavigate(t.id)}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className={isActive ? 'it-tap-glow' : ''}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '6px 12px', fontFamily: IT_FONT_BODY,
              }}
            >
              <span style={{
                fontSize: 18,
                color: isActive ? IT.navActive : IT.navInactive,
                transition: 'color 180ms ease',
              }}>{t.icon}</span>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.04em',
                color: isActive ? IT.navActive : IT.navInactive,
                transition: 'color 180ms ease',
              }}>{t.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
