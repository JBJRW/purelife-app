import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { IT, IT_FONT_BODY } from './tokens';
import BottomNavV2 from './BottomNavV2';
import ChatTab from './ChatTab';
import VideosTab from './VideosTab';
import ProgresoTab from './ProgresoTab';
import ClubTab from './ClubTab';
import PerfilTab from './PerfilTab';

const INTERIOR_CSS = `
  .it-divider { border: none; border-top: 1px solid ${IT.divider}; margin: 0; }
  .it-scrim-text { text-shadow: ${IT.textShadow}; }
  .it-scroll-hide { scrollbar-width: none; -ms-overflow-style: none; }
  .it-scroll-hide::-webkit-scrollbar { display: none; }
  .it-snap-y { scroll-snap-type: y mandatory; }
  .it-snap-item { scroll-snap-align: start; scroll-snap-stop: always; }

  /* Fondos de figura (Progreso, Club): cover + bordes desvanecidos (resplandor, no marco) */
  .it-bg-figure {
    position: fixed; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    background: ${IT.obsidian};
    -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
    mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
    -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
    z-index: 0;
  }

  /* Resplandor ambiental detrás de la figura */
  .it-glow {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    display: flex; align-items: center; justify-content: center;
  }
  .it-glow::before {
    content: '';
    width: min(70vw, 420px); height: min(70vw, 420px);
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.18;
    animation: itGlowPulse 5s ease-in-out infinite;
  }
  .it-glow-progreso::before { background: ${IT.gold}; }
  .it-glow-club::before { background: radial-gradient(circle, ${IT.emerald} 0%, ${IT.gold} 75%); }
  @keyframes itGlowPulse {
    0%, 100% { transform: scale(1); opacity: 0.15; }
    50%      { transform: scale(1.03); opacity: 0.25; }
  }

  /* Partículas doradas flotantes (consistencia con el chat de Dr. Smoothie) */
  .it-particle {
    position: fixed; z-index: 0; pointer-events: none;
    width: 4px; height: 4px; border-radius: 50%;
    background: ${IT.goldLight};
    box-shadow: 0 0 8px 2px rgba(232,201,106,0.7);
    opacity: 0.5;
    animation: itParticleFloat 6s ease-in-out infinite;
  }
  @keyframes itParticleFloat {
    0%, 100% { transform: translateY(0); opacity: 0.35; }
    50%      { transform: translateY(-14px); opacity: 0.7; }
  }

  /* Feedback táctil sutil para elementos interactivos del interior */
  .it-tap {
    -webkit-tap-highlight-color: transparent;
    transition: transform 120ms ease;
  }
  .it-tap:active { transform: scale(0.96); }
  .it-tap-glow:active > span { text-shadow: 0 0 10px rgba(232,201,106,0.85); }

  @media (prefers-reduced-motion: reduce) {
    .it-anim, .it-anim * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
    .it-tap { transition: none !important; }
    .it-tap:active { transform: none !important; }
    .it-tap-glow:active > span { text-shadow: none !important; }
    .it-glow::before { animation: none !important; opacity: 0.18; }
    .it-particle { animation: none !important; opacity: 0.45; }
  }
`;

function useInteriorStyles() {
  useEffect(() => {
    const id = 'it-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = INTERIOR_CSS;
      document.head.appendChild(el);
    }
    // iOS Safari solo dispara :active si hay un listener touchstart en el documento
    document.addEventListener('touchstart', () => {}, { passive: true });
  }, []);
}

export default function InteriorApp({ user, hermes, goals, lang, onLangChange, onSignOut }) {
  useInteriorStyles();
  const [tab, setTab] = useState('chat');

  const tabs = {
    chat: <ChatTab user={user} hermes={hermes} lang={lang} onNavigate={setTab} />,
    videos: <VideosTab user={user} hermes={hermes} />,
    progreso: <ProgresoTab user={user} hermes={hermes} />,
    club: <ClubTab user={user} hermes={hermes} />,
    perfil: <PerfilTab user={user} hermes={hermes} goals={goals} lang={lang} onLangChange={onLangChange} onSignOut={onSignOut} />,
  };

  return (
    // reducedMotion="user": a diferencia del MotionConfig global (App.jsx, "never"),
    // el interior sí respeta la preferencia "Reducir movimiento" del sistema.
    <MotionConfig reducedMotion="user">
      <div style={{
        background: IT.obsidian,
        minHeight: '100vh',
        fontFamily: IT_FONT_BODY,
        color: IT.cream,
        paddingBottom: 84,
      }}>
        {tabs[tab] || tabs.chat}
        <BottomNavV2 active={tab} onNavigate={setTab} />
      </div>
    </MotionConfig>
  );
}
