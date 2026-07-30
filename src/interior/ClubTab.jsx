import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';

function TestimonialRow({ t }) {
  return (
    <div style={{ padding: '14px 0', borderTop: `1px solid ${IT.divider}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: IT.cream }}>{t.display_name}</span>
        {t.rating && (
          <span style={{ fontSize: 11, color: IT.gold }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
        )}
      </div>
      <p style={{ fontSize: 13, color: IT.cream, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>{t.content}</p>
    </div>
  );
}

function ShareForm({ user, onDone }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('testimonials').insert({
      user_id: user.id,
      display_name: user.name || 'Miembro PureLife',
      content: content.trim(),
      rating,
    });
    setSaving(false);
    if (!error) onDone();
  };

  return (
    <div style={{ padding: '14px 0', borderTop: `1px solid ${IT.divider}` }}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Cuenta tu avance…"
        rows={3}
        style={{
          width: '100%', background: 'transparent', border: `1px solid ${IT.divider}`, borderRadius: 8,
          color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, padding: 10, outline: 'none', resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: 4, margin: '10px 0' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: n <= rating ? IT.gold : IT.textSecondary }}>★</button>
        ))}
      </div>
      <button
        onClick={submit}
        disabled={saving || !content.trim()}
        style={{
          padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${IT.gold}, ${IT.goldLight})`,
          color: IT.obsidian, fontWeight: 700, fontSize: 13, fontFamily: IT_FONT_BODY,
        }}
      >
        {saving ? 'Enviando…' : 'Compartir'}
      </button>
    </div>
  );
}

export default function ClubTab({ user }) {
  const [testimonials, setTestimonials] = useState(undefined);
  const [founder, setFounder] = useState(null);
  const [showShareForm, setShowShareForm] = useState(false);
  const [shared, setShared] = useState(false);
  const [reducedData, setReducedData] = useState(false);

  useEffect(() => {
    setReducedData(!!navigator.connection?.saveData);
  }, []);

  const loadFeed = () => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setTestimonials(data || []));
  };

  useEffect(() => {
    loadFeed();
    if (user?.token) {
      fetch('/api/founder-rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: user.token }),
      })
        .then(r => r.json())
        .then(data => { if (data.isFoundingMember) setFounder(data.rank); })
        .catch(() => {});
    }
  }, [user?.id]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {!reducedData && (
        <img
          src="/backgrounds/bg-club.webp"
          alt=""
          loading="lazy"
          style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
      )}
      <div style={{ position: 'fixed', inset: 0, background: IT.obsidian, opacity: 0.75, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }} className="it-scrim-text">
        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 30, fontStyle: 'italic', marginBottom: 4 }}>
          Club PureLife
        </div>

        {founder && (
          <div style={{
            display: 'inline-block', marginTop: 8, marginBottom: 12,
            padding: '5px 14px', borderRadius: 20, border: `1px solid ${IT.goldLight}`,
            fontSize: 11, letterSpacing: '0.05em', color: IT.goldLight,
          }}>
            ✦ Fundador #{founder}
          </div>
        )}

        <div className="it-divider" style={{ margin: '16px 0' }} />

        {!showShareForm && !shared && (
          <button
            onClick={() => setShowShareForm(true)}
            style={{
              width: '100%', padding: '13px', marginBottom: 6, borderRadius: 10,
              border: `1px solid ${IT.goldLight}`, background: 'transparent',
              color: IT.goldLight, fontSize: 13, fontFamily: IT_FONT_BODY, cursor: 'pointer',
            }}
          >
            Compartir mi avance
          </button>
        )}
        {showShareForm && (
          <ShareForm user={user} onDone={() => { setShowShareForm(false); setShared(true); }} />
        )}
        {shared && (
          <div style={{ fontSize: 12, color: IT.emerald, padding: '10px 0' }}>
            ✓ Publicado — en revisión antes de aparecer en el feed público.
          </div>
        )}

        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic', margin: '20px 0 4px' }}>
          Comunidad
        </div>
        {testimonials === undefined ? (
          <div style={{ color: IT.textSecondary, fontSize: 13, padding: '10px 0' }}>Cargando…</div>
        ) : testimonials.length === 0 ? (
          <div style={{ color: IT.textSecondary, fontSize: 13, padding: '10px 0' }}>
            Todavía no hay historias publicadas. ¡Sé el primero en compartir tu avance!
          </div>
        ) : (
          testimonials.map(t => <TestimonialRow key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
}
