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

  /* Fondos de figura completa (Progreso, Club): sin recorte ni estiramiento */
  .it-bg-figure {
    position: fixed; top: 0; left: 0; right: 0; width: 100%; height: 100%;
    object-fit: contain; object-position: center;
    background: ${IT.obsidian};
    z-index: 0;
  }
  @media (max-width: 430px) {
    /* Pantallas angostas: banda superior de 65vh en vez de 100vh para que la figura no se vea diminuta */
    .it-bg-figure { height: 65vh; }
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
