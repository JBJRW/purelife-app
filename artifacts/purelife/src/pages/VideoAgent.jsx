// ============================================================
// PureLife — VideoAgent v2.0
// src/pages/VideoAgent.jsx · JRMB Food Network LLC
// + Recraft V3 · Upscale 4K · Animate SVD · 3D Parallax viewer
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';

const C = {
  dark: '#0F1F17', green: '#1A3C2E', mint: '#4ADE80',
  cream: '#F5F0E8', light: '#C8D5C0', muted: '#7A9070',
  gold: '#E8B84B', card: 'rgba(255,255,255,0.05)',
  blue: '#60A5FA', purple: '#A78BFA',
};

const PIPELINES = [
  { id: 'flux',    label: 'Flux Pro',   emoji: '🖼️',  desc: 'Imágenes alta fidelidad', tier: 'seed'   },
  { id: 'recraft', label: 'Recraft V3', emoji: '🎨',  desc: 'Ilustración ultra-HD',    tier: 'seed'   },
  { id: 'kling',   label: 'Kling v2.6', emoji: '✨',  desc: 'Animaciones wellness',    tier: 'bloom'  },
  { id: 'veo3',    label: 'Veo3 Fast',  emoji: '🎬',  desc: 'Video cinematográfico',   tier: 'canopy' },
];

const CATEGORIES = [
  { id: 'smoothie',   label: 'Smoothies',  emoji: '🥤' },
  { id: 'meditation', label: 'Meditación', emoji: '🧘' },
  { id: 'fitness',    label: 'Fitness',    emoji: '💪' },
  { id: 'nutrition',  label: 'Nutrición',  emoji: '🥗' },
  { id: 'sleep',      label: 'Sueño',      emoji: '😴' },
  { id: 'hydration',  label: 'Detox',      emoji: '🌿' },
  { id: 'herbs',      label: 'Herbs',      emoji: '🧠' },
  { id: 'community',  label: 'Recetas',    emoji: '📖' },
];

const TIER_ORDER    = { free: 0, seed: 1, bloom: 2, canopy: 3 };
const TIER_LIMITS   = { free: 0, seed: 3, bloom: 15, canopy: 999 };
const ENHANCE_TIERS = { upscale: ['seed','bloom','canopy'], animate: ['bloom','canopy'] };

// ── 3D Parallax Viewer ──────────────────────────────────────
function ParallaxViewer({ src, type }) {
  const [tilt, setTilt]     = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const containerRef        = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
    setTilt({ x, y });
  }, []);

  const reset = useCallback(() => { setActive(false); setTilt({ x: 0, y: 0 }); }, []);

  const transform = active
    ? `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale3d(1.02,1.02,1)`
    : 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
      style={{ borderRadius: 14, overflow: 'hidden', background: '#000', cursor: 'crosshair', position: 'relative' }}
    >
      {type === 'video' ? (
        <video src={src} controls loop
          style={{ width: '100%', display: 'block', borderRadius: 14, transform, transition: active ? 'transform 0.1s ease-out' : 'transform 0.5s ease' }}
        />
      ) : (
        <img src={src} alt="Generado"
          style={{ width: '100%', display: 'block', borderRadius: 14, transform, transition: active ? 'transform 0.1s ease-out' : 'transform 0.5s ease' }}
        />
      )}
      {!active && (
        <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 10, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
          ↔ efecto 3D
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function VideoAgent({ user, hermes }) {
  const userTier = hermes?.tier || user?.membership_tier || user?.tier || 'free';

  const [pipeline, setPipeline]         = useState('flux');
  const [category, setCategory]         = useState('smoothie');
  const [prompt, setPrompt]             = useState('');
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [usageCount, setUsageCount]     = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [enhancing, setEnhancing]           = useState(null);
  const [enhancedResult, setEnhancedResult] = useState(null);
  const [enhanceError, setEnhanceError]     = useState('');

  const canUsePipeline = (p) => (TIER_ORDER[userTier] || 0) >= (TIER_ORDER[p.tier] || 0);
  const canEnhance     = (a) => ENHANCE_TIERS[a]?.includes(userTier);

  useEffect(() => {
    if (!user?.id || !user?.token) return;
    setLoadingUsage(true);
    fetch('/api/video-usage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, accessToken: user.token, action: 'get' }),
    })
      .then(r => r.json())
      .then(d => { if (d.count !== undefined) setUsageCount(d.count); })
      .catch(() => {})
      .finally(() => setLoadingUsage(false));
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const sel   = PIPELINES.find(p => p.id === pipeline);
    const limit = TIER_LIMITS[userTier] || 0;
    if (!canUsePipeline(sel)) { setError(`Necesitas el plan ${sel.tier} para usar ${sel.label}`); return; }
    if (usageCount !== null && usageCount >= limit) { setError(`Límite mensual alcanzado (${limit} en plan ${userTier}).`); return; }
    setLoading(true); setError(''); setResult(null); setEnhancedResult(null); setEnhanceError('');
    try {
      const res  = await fetch('/api/video', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline, category, custom_prompt: prompt, membership_tier: userTier, userId: user?.id, accessToken: user?.token }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      if (usageCount !== null) setUsageCount(c => c + 1);
    } catch (e) { setError(e.message || 'Error generando contenido'); }
    finally { setLoading(false); }
  };

  const handleEnhance = async (action) => {
    const srcUrl = result?.output_url;
    if (!srcUrl || !user?.id || !user?.token) return;
    if (!canEnhance(action)) {
      setEnhanceError(action === 'animate' ? '🌸 Animar requiere Bloom+' : '🌱 Upscale 4K requiere Seed+');
      return;
    }
    setEnhancing(action); setEnhanceError(''); setEnhancedResult(null);
    try {
      const res  = await fetch('/api/enhance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, image_url: srcUrl, userId: user.id, accessToken: user.token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Enhancement failed');
      setEnhancedResult(data);
    } catch (e) { setEnhanceError(e.message || 'Error al procesar'); }
    finally { setEnhancing(null); }
  };

  const limit        = TIER_LIMITS[userTier] || 0;
  const remaining    = limit - (usageCount || 0);
  const activeResult = enhancedResult || result;

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: '"Fraunces", serif', color: C.cream, fontSize: 26, margin: '0 0 4px' }}>🎬 Video AI</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Genera · Upscale 4K · Anima con IA</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: 8, padding: '4px 10px', fontSize: 11, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {userTier}
          </div>
          {!loadingUsage && usageCount !== null && (
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              {remaining > 0 ? `${remaining} restantes` : '⚠️ Límite alcanzado'}
            </div>
          )}
        </div>
      </div>

      {/* Pipelines */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Motor</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PIPELINES.map(p => {
          const unlocked = canUsePipeline(p);
          return (
            <button key={p.id} onClick={() => unlocked && setPipeline(p.id)}
              style={{ padding: '10px 14px', borderRadius: 12, cursor: unlocked ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${pipeline === p.id ? C.mint : 'rgba(255,255,255,0.1)'}`,
                background: pipeline === p.id ? `${C.mint}18` : C.card,
                color: unlocked ? C.cream : C.muted, fontSize: 13, opacity: unlocked ? 1 : 0.5, transition: 'all 0.15s' }}>
              {p.emoji} {p.label}
              {!unlocked && <span style={{ fontSize: 10, marginLeft: 4 }}>🔒 {p.tier}</span>}
            </button>
          );
        })}
      </div>

      {/* Categories */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Categoría</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            style={{ padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
              border: `1.5px solid ${category === cat.id ? C.gold : 'rgba(255,255,255,0.1)'}`,
              background: category === cat.id ? `${C.gold}18` : C.card,
              color: C.cream, fontSize: 11, textAlign: 'center', transition: 'all 0.15s' }}>
            <div>{cat.emoji}</div>
            <div style={{ marginTop: 4 }}>{cat.label}</div>
          </button>
        ))}
      </div>

      {/* Prompt */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Prompt</h3>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="Describe el contenido wellness que quieres crear..." rows={3}
        style={{ width: '100%', borderRadius: 12, padding: '12px 14px', background: C.card,
          border: '1px solid rgba(255,255,255,0.12)', color: C.cream, fontSize: 14,
          resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      {error && (
        <div style={{ color: '#F87171', fontSize: 13, marginTop: 8, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
          {error}
        </div>
      )}

      <button onClick={handleGenerate} disabled={loading || !prompt.trim() || remaining <= 0}
        style={{ width: '100%', marginTop: 16, padding: '14px',
          background: (loading || remaining <= 0) ? C.muted : `linear-gradient(135deg, ${C.mint}, #22c55e)`,
          border: 'none', borderRadius: 14, color: C.dark, fontSize: 15, fontWeight: 700,
          cursor: (loading || remaining <= 0) ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
        {loading ? '⏳ Generando...' : '🚀 Generar Contenido'}
      </button>

      {/* Resultado */}
      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ color: C.mint, fontSize: 13, fontWeight: 700 }}>✅ {result.pipeline} · {result.cost_estimate}</span>
            {enhancedResult?.action === 'upscale' && (
              <span style={{ background: `${C.blue}22`, color: C.blue, fontSize: 11, padding: '2px 8px', borderRadius: 6, border: `1px solid ${C.blue}44` }}>⬆️ 4K</span>
            )}
            {enhancedResult?.action === 'animate' && (
              <span style={{ background: `${C.purple}22`, color: C.purple, fontSize: 11, padding: '2px 8px', borderRadius: 6, border: `1px solid ${C.purple}44` }}>🎬 Animado</span>
            )}
          </div>

          {activeResult?.output_url && (
            <ParallaxViewer src={activeResult.output_url} type={activeResult.output_type} />
          )}

          {result.output_type === 'image' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => handleEnhance('upscale')} disabled={!!enhancing}
                style={{ flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: canEnhance('upscale') ? `${C.blue}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${canEnhance('upscale') ? `${C.blue}55` : 'rgba(255,255,255,0.08)'}`,
                  color: canEnhance('upscale') ? C.blue : C.muted, fontSize: 13, fontWeight: 600,
                  cursor: enhancing ? 'not-allowed' : 'pointer', opacity: enhancing === 'upscale' ? 0.65 : 1 }}>
                {enhancing === 'upscale' ? '⏳ Escalando...' : '⬆️ Upscale 4K'}
                {!canEnhance('upscale') && <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>🔒 Seed</div>}
              </button>
              <button onClick={() => handleEnhance('animate')} disabled={!!enhancing}
                style={{ flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: canEnhance('animate') ? `${C.purple}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${canEnhance('animate') ? `${C.purple}55` : 'rgba(255,255,255,0.08)'}`,
                  color: canEnhance('animate') ? C.purple : C.muted, fontSize: 13, fontWeight: 600,
                  cursor: enhancing ? 'not-allowed' : 'pointer', opacity: enhancing === 'animate' ? 0.65 : 1 }}>
                {enhancing === 'animate' ? '⏳ Animando...' : '🎬 Animar'}
                {!canEnhance('animate') && <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>🔒 Bloom</div>}
              </button>
            </div>
          )}

          {enhanceError && (
            <div style={{ color: '#F87171', fontSize: 12, marginTop: 8, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
              {enhanceError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
