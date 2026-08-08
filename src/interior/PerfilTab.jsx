import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import RecipesScreen from '../pages/RecipesScreen';
import MapScreen from '../pages/MapScreen';
import NewsSection from '../components/NewsSection';
import VideoAgent from '../pages/VideoAgent';
import { PlansScreen } from '../App';

const TIER_LABELS = { seed: 'Seed 🌱', bloom: 'Bloom 🌸', canopy: 'Canopy 🌿' };

const MORE_ITEMS = [
  { id: 'recipes', label: 'Recetas' },
  { id: 'map', label: 'Cerca de mí' },
  { id: 'video', label: 'Video AI' },
  { id: 'news', label: 'Noticias' },
  { id: 'plans', label: 'Planes y membresía' },
];

function SubView({ id, user, hermes, lang, onBack }) {
  const content = {
    recipes: <RecipesScreen user={user} />,
    map: <MapScreen user={user} />,
    video: <VideoAgent user={user} hermes={hermes} lang={lang} />,
    news: <NewsSection />,
    plans: <PlansScreen hermes={hermes} user={user} lang={lang} />,
  }[id];

  return (
    <div style={{ position: 'fixed', inset: 0, background: IT.obsidian, zIndex: 200, overflowY: 'auto' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 1, background: IT.obsidian,
        borderBottom: `1px solid ${IT.divider}`, padding: '16px 20px',
      }}>
        <button
          onClick={onBack}
          className="it-tap"
          style={{ background: 'none', border: 'none', color: IT.goldLight, fontSize: 14, fontFamily: IT_FONT_BODY, cursor: 'pointer' }}
        >
          ← Volver a Perfil
        </button>
      </div>
      {content}
    </div>
  );
}

export default function PerfilTab({ user, hermes, lang, onLangChange, onSignOut }) {
  const [profile, setProfile] = useState(undefined);
  const [subView, setSubView] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('profiles')
      .select('full_name, avatar_url, membership_tier, language, is_founding_member')
      .eq('id', user.id)
      .single()
      .then(({ data }) => { setProfile(data || null); setNameInput(data?.full_name || ''); });
  }, [user?.id]);

  const saveName = async () => {
    await supabase.from('profiles').update({ full_name: nameInput }).eq('id', user.id);
    setProfile(p => ({ ...p, full_name: nameInput }));
    setEditingName(false);
  };

  if (subView) {
    return <SubView id={subView} user={user} hermes={hermes} lang={lang} onBack={() => setSubView(null)} />;
  }

  return (
    <div style={{ padding: '24px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <img
          src={profile?.avatar_url || '/purelife-logo.png'}
          alt=""
          style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${IT.gold}` }}
        />
        <div>
          {editingName ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={{
                  background: 'transparent', border: 'none', borderBottom: `1px solid ${IT.divider}`,
                  color: IT.cream, fontSize: 16, fontFamily: IT_FONT_BODY, outline: 'none', width: 160,
                }}
              />
              <button onClick={saveName} className="it-tap" style={{ background: 'none', border: 'none', color: IT.emerald, cursor: 'pointer' }}>✓</button>
            </div>
          ) : (
            <div
              onClick={() => setEditingName(true)}
              className="it-tap"
              style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 20, cursor: 'pointer' }}
            >
              {profile?.full_name || user?.name || 'Tu nombre'}
            </div>
          )}
          <div style={{ fontSize: 12, color: IT.textSecondary }}>{user?.email}</div>
        </div>
      </div>

      <div style={{
        display: 'inline-block', marginTop: 10, marginBottom: 20,
        padding: '5px 14px', borderRadius: 20, border: `1px solid ${IT.divider}`,
        fontSize: 12, color: IT.goldLight,
      }}>
        {TIER_LABELS[profile?.membership_tier || hermes?.tier] || 'Seed 🌱'}
        {profile?.is_founding_member ? ' · Fundador' : ''}
      </div>

      <div className="it-divider" style={{ margin: '4px 0 14px' }} />

      <div style={{ fontSize: 11, color: IT.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Más
      </div>
      {MORE_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => setSubView(item.id)}
          className="it-tap"
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
            padding: '13px 0', borderTop: `1px solid ${IT.divider}`, background: 'none',
            borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
            color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, cursor: 'pointer', textAlign: 'left',
          }}
        >
          {item.label} <span style={{ color: IT.textSecondary }}>→</span>
        </button>
      ))}

      <div className="it-divider" style={{ margin: '20px 0 14px' }} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['es', 'en', 'pt'].map(code => (
          <button
            key={code}
            onClick={() => onLangChange?.(code)}
            className="it-tap"
            style={{
              padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
              border: `1px solid ${lang === code ? IT.goldLight : IT.divider}`,
              background: 'transparent', color: lang === code ? IT.goldLight : IT.textSecondary,
              fontSize: 12, fontFamily: IT_FONT_BODY,
            }}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        onClick={onSignOut}
        className="it-tap"
        style={{
          width: '100%', padding: '13px', borderRadius: 10, cursor: 'pointer',
          border: `1px solid rgba(224,90,90,0.4)`, background: 'transparent',
          color: '#E05A5A', fontSize: 13, fontFamily: IT_FONT_BODY,
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
