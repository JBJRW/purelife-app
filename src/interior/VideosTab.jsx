import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';

function VideoItem({ video, user, onLiked }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleLike = async () => {
    if (liked || !user?.token) return;
    setLiked(true);
    onLiked(video.id);
    try {
      await fetch('/api/video-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id, accessToken: user.token }),
      });
    } catch {
      // el contador visual ya subió; si falla la red, se corrige en el próximo fetch del feed
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <section
      ref={ref}
      className="it-snap-item"
      style={{
        position: 'relative', height: 'calc(100vh - 84px)', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: IT.obsidian, overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.thumbnail_url || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        controls
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: IT.scrim, pointerEvents: 'none' }} />

      {/* Caption + autor */}
      <div style={{ position: 'absolute', left: 16, right: 76, bottom: 20 }} className="it-scrim-text">
        {video.title && (
          <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 19, fontStyle: 'italic', marginBottom: 4 }}>
            {video.title}
          </div>
        )}
        {video.description && (
          <div style={{ fontSize: 13, color: IT.cream, lineHeight: 1.5, marginBottom: 6 }}>{video.description}</div>
        )}
        {video.author_name && (
          <div style={{ fontSize: 11, color: IT.textSecondary }}>@{video.author_name}</div>
        )}
      </div>

      {/* Acciones laterales */}
      <div style={{
        position: 'absolute', right: 12, bottom: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <button onClick={handleLike} style={actionBtnStyle}>
          <span style={{ fontSize: 22, color: liked ? IT.emerald : IT.cream }}>{liked ? '♥' : '♡'}</span>
          <span style={actionLabelStyle}>{(video.likes_count || 0) + (liked ? 1 : 0)}</span>
        </button>
        <button onClick={() => showToast('Comentarios — próximamente')} style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>💬</span>
          <span style={actionLabelStyle}>Comentar</span>
        </button>
        <button onClick={() => showToast('Guardado — próximamente')} style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>⬇</span>
          <span style={actionLabelStyle}>Guardar</span>
        </button>
      </div>

      {toast && (
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(11,15,13,.9)', border: `1px solid ${IT.divider}`,
          borderRadius: 20, padding: '8px 16px', fontSize: 12, color: IT.cream,
          fontFamily: IT_FONT_BODY,
        }}>
          {toast}
        </div>
      )}
    </section>
  );
}

const actionBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
};
const actionLabelStyle = { fontSize: 10, color: IT.textSecondary, fontFamily: IT_FONT_BODY };

export default function VideosTab({ user }) {
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('video_feed')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) { setError(true); setVideos([]); return; }
        setVideos(data || []);
      });
    return () => { cancelled = true; };
  }, []);

  const bumpLikes = (id) => {
    setVideos(vs => vs.map(v => v.id === id ? { ...v, likes_count: (v.likes_count || 0) + 1 } : v));
  };

  if (videos === null) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: IT.textSecondary }}>
        Cargando videos…
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20, textAlign: 'center' }}>
        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 24, fontStyle: 'italic' }}>Aún no hay videos</div>
        <div style={{ color: IT.textSecondary, fontSize: 13 }}>Vuelve pronto — el feed se actualiza seguido.</div>
      </div>
    );
  }

  return (
    <div className="it-snap-y it-scroll-hide" style={{ height: 'calc(100vh - 84px)', overflowY: 'auto' }}>
      {videos.map(v => (
        <VideoItem key={v.id} video={v} user={user} onLiked={bumpLikes} />
      ))}
    </div>
  );
}
