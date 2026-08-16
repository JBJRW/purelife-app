import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { tui } from '../i18n';
import UploadVideoModal from './UploadVideoModal';
import ModerationPanel from './ModerationPanel';

function FullscreenPlayer({ video, lang, onClose, liked, onLike, reporterId }) {
  const videoRef = useRef(null);
  const [toast, setToast] = useState('');
  const [needsTapForSound, setNeedsTapForSound] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => {
    // Bloquea el scroll de fondo mientras el reproductor esta abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    setNeedsTapForSound(false);
    el.muted = false;
    const p = el.play();
    if (p?.catch) {
      p.catch(() => {
        // El navegador bloqueó el autoplay con sonido (política estándar sin
        // gesto directo del usuario en este mismo tick). Reproducimos mudo
        // y mostramos un botón para activar el audio con un toque real.
        el.muted = true;
        el.play().catch(() => {});
        setNeedsTapForSound(true);
      });
    }
  }, [video?.id]);

  const unmute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play().catch(() => {});
    setNeedsTapForSound(false);
  };

  if (!video) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        width: '100vw', height: '100dvh',
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={video.video_url}
        poster={video.thumbnail_url || undefined}
        controls
        playsInline
        loop
        onClick={needsTapForSound ? unmute : undefined}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: IT.scrim, pointerEvents: 'none' }} />

      {needsTapForSound && (
        <button
          onClick={unmute}
          className="it-tap"
          style={{
            position: 'absolute', top: 'max(18px, env(safe-area-inset-top))', left: 16, zIndex: 5,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 20,
            background: 'rgba(11,15,13,.75)', backdropFilter: 'blur(6px)',
            border: `1px solid ${IT.divider}`, color: IT.cream, fontSize: 13,
            cursor: 'pointer',
          }}
        >
          🔇 {tui(lang, 'tapForSound') || 'Tap for sound'}
        </button>
      )}

      <button
        onClick={onClose}
        className="it-tap"
        aria-label="Cerrar"
        style={{
          position: 'absolute', top: 'max(18px, env(safe-area-inset-top))', right: 16, zIndex: 5,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(11,15,13,.7)', backdropFilter: 'blur(6px)',
          border: `1px solid ${IT.divider}`, color: IT.cream, fontSize: 18,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <div style={{ position: 'absolute', left: 16, right: 76, bottom: 'max(20px, env(safe-area-inset-bottom))' }} className="it-scrim-text">
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

      <div style={{
        position: 'absolute', right: 12, bottom: 'max(24px, env(safe-area-inset-bottom))',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <button onClick={onLike} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 22, color: liked ? IT.emerald : IT.cream }}>{liked ? '♥' : '♡'}</span>
          <span style={actionLabelStyle}>{(video.likes_count || 0) + (liked ? 1 : 0)}</span>
        </button>
        <button onClick={() => downloadVideo(video, () => showToast(tui(lang, 'downloadStarted')), () => showToast(tui(lang, 'uploadError')))} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>⬇</span>
          <span style={actionLabelStyle}>{tui(lang, 'itVideosSave')}</span>
        </button>
        <button onClick={() => {
          if (!reporterId) return;
          if (!window.confirm(tui(lang, 'reportConfirm'))) return;
          reportVideo(
            video.id, reporterId,
            () => showToast(tui(lang, 'reportSent')),
            () => showToast(tui(lang, 'reportAlready')),
            () => showToast(tui(lang, 'uploadError')),
          );
        }} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>🚩</span>
          <span style={actionLabelStyle}>{tui(lang, 'itVideosReport')}</span>
        </button>
      </div>

      {toast && (
        <div style={{
          position: 'absolute', top: 'max(20px, env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(11,15,13,.9)', border: `1px solid ${IT.divider}`,
          borderRadius: 20, padding: '8px 16px', fontSize: 12, color: IT.cream,
          fontFamily: IT_FONT_BODY, zIndex: 10,
        }}>
          {toast}
        </div>
      )}
    </div>,
    document.body
  );
}

function VideoItem({ video, user, onLiked, lang, onExpand }) {
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
      onClick={() => onExpand(video.id)}
      style={{
        position: 'relative', height: 'calc(100vh - 84px)', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: IT.obsidian, overflow: 'hidden', cursor: 'pointer',
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
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: IT.scrim, pointerEvents: 'none' }} />

      {/* Boton expandir a pantalla completa (con audio) */}
      <button
        onClick={(e) => { e.stopPropagation(); onExpand(video.id); }}
        className="it-tap"
        aria-label="Ver en pantalla completa"
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 5,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(11,15,13,.6)', backdropFilter: 'blur(6px)',
          border: `1px solid ${IT.divider}`, color: IT.cream, fontSize: 16,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⛶
      </button>

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
        <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 22, color: liked ? IT.emerald : IT.cream }}>{liked ? '♥' : '♡'}</span>
          <span style={actionLabelStyle}>{(video.likes_count || 0) + (liked ? 1 : 0)}</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); showToast(tui(lang, 'itVideosCommentToast')); }} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>💬</span>
          <span style={actionLabelStyle}>{tui(lang, 'itVideosComment')}</span>
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          downloadVideo(video, () => showToast(tui(lang, 'downloadStarted')), () => showToast(tui(lang, 'uploadError')));
        }} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>⬇</span>
          <span style={actionLabelStyle}>{tui(lang, 'itVideosSave')}</span>
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          if (!user?.id) return;
          if (!window.confirm(tui(lang, 'reportConfirm'))) return;
          reportVideo(
            video.id, user.id,
            () => showToast(tui(lang, 'reportSent')),
            () => showToast(tui(lang, 'reportAlready')),
            () => showToast(tui(lang, 'uploadError')),
          );
        }} className="it-tap" style={actionBtnStyle}>
          <span style={{ fontSize: 20, color: IT.cream }}>🚩</span>
          <span style={actionLabelStyle}>{tui(lang, 'itVideosReport')}</span>
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

// Descarga real del archivo de video (antes esto era un toast falso
// de "próximamente"). Usamos fetch + blob en vez de un <a download>
// directo porque video_url apunta a Supabase Storage en otro origen,
// y un <a download> simple hacia un origen externo abre el video en
// una pestaña nueva en vez de descargarlo en varios navegadores.
async function downloadVideo(video, onStart, onError) {
  try {
    const res = await fetch(video.video_url);
    if (!res.ok) throw new Error(`download_failed_${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (video.title || 'purelife-video').replace(/[^a-z0-9\-_]+/gi, '-').slice(0, 60);
    a.download = `${safeTitle}.mp4`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    onStart?.();
  } catch (e) {
    console.error('[VideosTab] download failed:', e);
    onError?.();
  }
}

// Reporta un video (una sola vez por usuario, por la restricción
// UNIQUE en video_reports). No borra ni oculta nada automáticamente
// — solo registra el reporte para que un admin lo revise en el
// panel de moderación.
async function reportVideo(videoId, userId, onSent, onAlready, onError) {
  if (!userId) return;
  try {
    const { error: reportError } = await supabase
      .from('video_reports')
      .insert({ video_id: videoId, reporter_id: userId });
    if (reportError) {
      if (reportError.code === '23505') { onAlready?.(); return; } // unique violation = ya reportado
      throw reportError;
    }
    onSent?.();
  } catch (e) {
    console.error('[VideosTab] report failed:', e);
    onError?.();
  }
}

export default function VideosTab({ user, lang = 'en' }) {
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedLiked, setExpandedLiked] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModeration, setShowModeration] = useState(false);

  useEffect(() => {
    if (!user?.id) { setIsAdmin(false); return; }
    let cancelled = false;
    supabase.from('profiles').select('is_admin').eq('id', user.id).single()
      .then(({ data }) => { if (!cancelled) setIsAdmin(!!data?.is_admin); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user?.id]);

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

  const expandedVideo = videos?.find(v => v.id === expandedId) || null;

  const handleExpandedLike = async () => {
    if (expandedLiked || !user?.token || !expandedVideo) return;
    setExpandedLiked(true);
    bumpLikes(expandedVideo.id);
    try {
      await fetch('/api/video-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: expandedVideo.id, accessToken: user.token }),
      });
    } catch {}
  };

  if (videos === null) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: IT.textSecondary }}>
        {tui(lang, 'itVideosLoading')}
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20, textAlign: 'center' }}>
        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 24, fontStyle: 'italic' }}>{tui(lang, 'itVideosEmptyTitle')}</div>
        <div style={{ color: IT.textSecondary, fontSize: 13 }}>{tui(lang, 'itVideosEmptySub')}</div>
        {user?.id && (
          <button onClick={() => setShowUpload(true)} className="it-tap" style={{
            marginTop: 16, padding: '12px 24px', borderRadius: 20, cursor: 'pointer',
            border: `1.5px solid ${IT.emerald}`, background: `${IT.emerald}18`,
            color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
          }}>
            {tui(lang, 'itVideosUpload')}
          </button>
        )}
        {showUpload && (
          <UploadVideoModal
            user={user}
            lang={lang}
            onClose={() => setShowUpload(false)}
            onUploaded={(newVideo) => setVideos((vs) => [newVideo, ...(vs || [])])}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="it-snap-y it-scroll-hide" style={{ height: 'calc(100vh - 84px)', overflowY: 'auto' }}>
        {videos.map(v => (
          <VideoItem
            key={v.id}
            video={v}
            user={user}
            onLiked={bumpLikes}
            lang={lang}
            onExpand={(id) => { setExpandedId(id); setExpandedLiked(false); }}
          />
        ))}
      </div>

      {user?.id && (
        <button
          onClick={() => setShowUpload(true)}
          className="it-tap"
          aria-label={tui(lang, 'itVideosUpload')}
          style={{
            position: 'fixed', right: 16, bottom: 'calc(100px + env(safe-area-inset-bottom))', zIndex: 15,
            width: 52, height: 52, borderRadius: '50%',
            background: `linear-gradient(135deg, ${IT.emerald}, #1A5C3A)`,
            border: 'none', color: '#fff', fontSize: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          ➕
        </button>
      )}

      {isAdmin && (
        <button
          onClick={() => setShowModeration(true)}
          className="it-tap"
          aria-label={tui(lang, 'modPanelTitle')}
          style={{
            position: 'fixed', right: 16, bottom: 'calc(164px + env(safe-area-inset-bottom))', zIndex: 15,
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(11,15,13,.85)', backdropFilter: 'blur(6px)',
            border: `1.5px solid ${IT.gold}`, color: IT.gold, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          🛡️
        </button>
      )}

      {showUpload && (
        <UploadVideoModal
          user={user}
          lang={lang}
          onClose={() => setShowUpload(false)}
          onUploaded={(newVideo) => setVideos((vs) => [newVideo, ...(vs || [])])}
        />
      )}

      {showModeration && (
        <ModerationPanel lang={lang} onClose={() => setShowModeration(false)} />
      )}

      {expandedVideo && (
        <FullscreenPlayer
          video={expandedVideo}
          lang={lang}
          liked={expandedLiked}
          onLike={handleExpandedLike}
          onClose={() => setExpandedId(null)}
          reporterId={user?.id}
        />
      )}
    </>
  );
}
