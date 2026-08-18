import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { tui } from '../i18n';

function TeamPostRow({ post, lang }) {
  const [videoState, setVideoState] = useState('idle'); // idle | rendering | done | error
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoError, setVideoError] = useState('');

  const generateVideo = async () => {
    setVideoState('rendering'); setVideoError('');
    try {
      const startRes = await fetch('/api/render-tip-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: post.content, topic: post.topic }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || 'No se pudo iniciar el video');

      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 2500));
        const pollRes = await fetch(`/api/render-recipe-video-status?renderId=${startData.renderId}&bucketName=${startData.bucketName}`);
        const pollData = await pollRes.json();
        if (pollData.error) throw new Error(pollData.error);
        if (pollData.done) {
          setVideoUrl(pollData.output_url);
          setVideoState('done');
          return;
        }
      }
      throw new Error('El video tardó demasiado, intentá de nuevo');
    } catch (e) {
      setVideoError(e.message || 'Error generando el video');
      setVideoState('error');
    }
  };

  return (
    <div style={{ padding: '14px 0', borderTop: `1px solid ${IT.divider}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>🌿</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: IT.goldLight, textTransform: 'uppercase' }}>
          {tui(lang, 'itClubTeamBadge')}
        </span>
      </div>
      <p style={{ fontSize: 13, color: IT.cream, opacity: 0.85, lineHeight: 1.6, margin: '0 0 8px' }}>{post.content}</p>

      {videoState === 'done' && videoUrl && (
        <video src={videoUrl} controls playsInline style={{ width: '100%', maxWidth: 220, borderRadius: 12, marginBottom: 8, display: 'block' }} />
      )}
      {videoState === 'error' && (
        <p style={{ color: '#FF6B6B', fontSize: 11, margin: '0 0 8px' }}>❌ {videoError}</p>
      )}
      {videoState !== 'done' && (
        <button onClick={generateVideo} disabled={videoState === 'rendering'} style={{
          padding: '6px 14px', borderRadius: 16, border: 'none',
          background: videoState === 'rendering' ? IT.divider : 'linear-gradient(135deg,#C9A84C,#B8935A)',
          color: '#000', fontSize: 11, fontWeight: 700,
          cursor: videoState === 'rendering' ? 'default' : 'pointer',
        }}>{videoState === 'rendering' ? '⏳ Generando…' : '🎬 Generar video'}</button>
      )}
    </div>
  );
}

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

function ShareForm({ user, onDone, lang }) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('testimonials').insert({
      user_id: user.id,
      display_name: user.name || 'PureLife Member',
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
        placeholder={tui(lang, 'itClubSharePlaceholder')}
        rows={3}
        style={{
          width: '100%', background: 'transparent', border: `1px solid ${IT.divider}`, borderRadius: 8,
          color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, padding: 10, outline: 'none', resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: 4, margin: '10px 0' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} className="it-tap" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: n <= rating ? IT.gold : IT.textSecondary }}>★</button>
        ))}
      </div>
      <button
        onClick={submit}
        disabled={saving || !content.trim()}
        className="it-tap"
        style={{
          padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${IT.gold}, ${IT.goldLight})`,
          color: IT.obsidian, fontWeight: 700, fontSize: 13, fontFamily: IT_FONT_BODY,
        }}
      >
        {saving ? tui(lang, 'itClubSharing') : tui(lang, 'itClubShare')}
      </button>
    </div>
  );
}

export default function ClubTab({ user, lang = 'en' }) {
  const [testimonials, setTestimonials] = useState(undefined);
  const [teamPosts, setTeamPosts] = useState(undefined);
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
    supabase
      .from('team_posts')
      .select('*')
      .eq('is_published', true)
      .eq('language', lang)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setTeamPosts(data || []));
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
  }, [user?.id, lang]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {!reducedData && (
        <>
          <div className="it-glow it-glow-club" />
          <img
            src="/backgrounds/bg-club.webp"
            alt=""
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            className="it-bg-figure"
          />
        </>
      )}
      <div style={{ position: 'fixed', inset: 0, background: IT.obsidian, opacity: 0.75, zIndex: 0 }} />
      {!reducedData && (
        <>
          <span className="it-particle" style={{ top: '22%', right: '22%', animationDelay: '0.5s' }} />
          <span className="it-particle" style={{ top: '38%', left: '16%', animationDelay: '2.1s' }} />
          <span className="it-particle" style={{ top: '55%', right: '14%', animationDelay: '3.8s' }} />
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }} className="it-scrim-text">
        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 30, fontStyle: 'italic', marginBottom: 4 }}>
          {tui(lang, 'itClubTitle')}
        </div>

        {founder && (
          <div style={{
            display: 'inline-block', marginTop: 8, marginBottom: 12,
            padding: '5px 14px', borderRadius: 20, border: `1px solid ${IT.goldLight}`,
            fontSize: 11, letterSpacing: '0.05em', color: IT.goldLight,
          }}>
            ✦ {tui(lang, 'itClubFounderBadge')}{founder}
          </div>
        )}

        <div className="it-divider" style={{ margin: '16px 0' }} />

        {!showShareForm && !shared && (
          <button
            onClick={() => setShowShareForm(true)}
            className="it-tap"
            style={{
              width: '100%', padding: '13px', marginBottom: 6, borderRadius: 10,
              border: `1px solid ${IT.goldLight}`, background: 'transparent',
              color: IT.goldLight, fontSize: 13, fontFamily: IT_FONT_BODY, cursor: 'pointer',
            }}
          >
            {tui(lang, 'itClubShareProgress')}
          </button>
        )}
        {showShareForm && (
          <ShareForm user={user} lang={lang} onDone={() => { setShowShareForm(false); setShared(true); }} />
        )}
        {shared && (
          <div style={{ fontSize: 12, color: IT.emerald, padding: '10px 0' }}>
            {tui(lang, 'itClubShared')}
          </div>
        )}

        {teamPosts !== undefined && teamPosts.length > 0 && (
          <>
            <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic', margin: '20px 0 4px' }}>
              {tui(lang, 'itClubTeamTips')}
            </div>
            {teamPosts.map(p => <TeamPostRow key={p.id} post={p} lang={lang} />)}
          </>
        )}

        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic', margin: '20px 0 4px' }}>
          {tui(lang, 'itClubCommunity')}
        </div>
        {testimonials === undefined ? (
          <div style={{ color: IT.textSecondary, fontSize: 13, padding: '10px 0' }}>{tui(lang, 'itClubLoading')}</div>
        ) : testimonials.length === 0 ? (
          <div style={{ color: IT.textSecondary, fontSize: 13, padding: '10px 0' }}>
            {tui(lang, 'itClubNoStories')}
          </div>
        ) : (
          testimonials.map(t => <TestimonialRow key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
}
