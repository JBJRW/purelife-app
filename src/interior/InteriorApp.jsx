import { useEffect, useState } from 'react';
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
  @media (prefers-reduced-motion: reduce) {
    .it-anim, .it-anim * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
  }
`;

function useInteriorStyles() {
  useEffect(() => {
    const id = 'it-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = INTERIOR_CSS;
    document.head.appendChild(el);
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
  );
}
