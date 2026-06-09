import React, { useState, useEffect } from 'react';

const C = {
  dark: '#0F1F17', green: '#1A3C2E', mint: '#4ADE80',
  cream: '#F5F0E8', light: '#C8D5C0', muted: '#7A9070',
  gold: '#E8B84B', card: 'rgba(255,255,255,0.05)',
};

const PIPELINES = [
  { id: 'veo3',  label: 'Veo3 Fast',  emoji: '🎬', desc: 'Videos cinematográficos HD', tier: 'canopy' },
  { id: 'flux',  label: 'Flux Pro',   emoji: '🖼️', desc: 'Imágenes de alta fidelidad', tier: 'seed'   },
  { id: 'kling', label: 'Kling v2.6', emoji: '✨', desc: 'Animaciones wellness',        tier: 'bloom'  },
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

const TIER_ORDER = { free: 0, seed: 1, bloom: 2, canopy: 3 };

// Límites de uso por tier por mes
const TIER_LIMITS = { free: 0, seed: 3, bloom: 15, canopy: 999 };

export default function VideoAgent({ user, hermes }) {
  // ── userTier REAL desde hermes (Supabase) ──────────────────
  const userTier = hermes?.tier || 'free';

  const [pipeline, setPipeline]   = useState('flux');
  const [category, setCategory]   = useState('smoothie');
  const [prompt, setPrompt]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState('');
  const [usageCount, setUsageCount] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const canUsePipeline = (p) => {
    const required = TIER_ORDER[p.tier] || 0;
    const current  = TIER_ORDER[userTier] || 0;
    return current >= required;
  };

  // ── Cargar uso actual del mes ──────────────────────────────
  useEffect(() => {
    if (!user?.id || !user?.token) return;
    setLoadingUsage(true);
    fetch('/api/video-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, accessToken: user.token, action: 'get' }),
    })
      .then(r => r.json())
      .then(d => { if (d.count !== undefined) setUsageCount(d.count); })
      .catch(() => {})
      .finally(() => setLoadingUsage(false));
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const sel = PIPELINES.find(p => p.id === pipeline);
    if (!canUsePipeline(sel)) {
      setError(`Necesitas el plan ${sel.tier} para usar ${sel.label}`);
      return;
    }
    const limit = TIER_LIMITS[userTier] || 0;
    if (usageCount !== null && usageCount >= limit) {
      setError(`Límite mensual alcanzado (${limit} generaciones en tu plan ${userTier}). Upgrade para continuar.`);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pipeline,
          category,
          custom_prompt: prompt,
          membership_tier: userTier,       // ← tier REAL desde Supabase
          userId: user?.id,
          accessToken: user?.token,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      // Actualizar contador local
      if (usageCount !== null) setUsageCount(c => c + 1);
    } catch (e) {
      setError(e.message || 'Error generando contenido');
    } finally {
      setLoading(false);
    }
  };

  const limit = TIER_LIMITS[userTier] || 0;
  const remaining = limit - (usageCount || 0);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: '"Fraunces", serif', color: C.cream, fontSize: 26, margin: '0 0 4px' }}>
            🎬 Video AI
          </h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
            Crea contenido wellness con IA generativa
          </p>
        </div>
        {/* Badge tier + uso */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: `${C.gold}22`, border: `1px solid ${C.gold}44`,
            borderRadius: 8, padding: '4px 10px', fontSize: 11,
            color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {userTier}
          </div>
          {!loadingUsage && usageCount !== null && (
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              {remaining > 0 ? `${remaining} restantes` : '⚠️ Límite alcanzado'}
            </div>
          )}
        </div>
      </div>

      {/* Pipeline selector */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Motor</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PIPELINES.map(p => {
          const unlocked = canUsePipeline(p);
          return (
            <button
              key={p.id}
              onClick={() => unlocked && setPipeline(p.id)}
              style={{
                padding: '10px 14px', borderRadius: 12, cursor: unlocked ? 'pointer' : 'not-allowed',
                border: `1.5px solid ${pipeline === p.id ? C.mint : 'rgba(255,255,255,0.1)'}`,
                background: pipeline === p.id ? `${C.mint}18` : C.card,
                color: unlocked ? C.cream : C.muted, fontSize: 13,
                opacity: unlocked ? 1 : 0.5, transition: 'all 0.15s',
              }}
            >
              {p.emoji} {p.label}
              {!unlocked && <span style={{ fontSize: 10, marginLeft: 4 }}>🔒 {p.tier}</span>}
            </button>
          );
        })}
      </div>

      {/* Category selector */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Categoría</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
              border: `1.5px solid ${category === cat.id ? C.gold : 'rgba(255,255,255,0.1)'}`,
              background: category === cat.id ? `${C.gold}18` : C.card,
              color: C.cream, fontSize: 11, textAlign: 'center', transition: 'all 0.15s',
            }}
          >
            <div>{cat.emoji}</div>
            <div style={{ marginTop: 4 }}>{cat.label}</div>
          </button>
        ))}
      </div>

      {/* Prompt */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Prompt</h3>
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Describe el contenido wellness que quieres crear..."
        rows={3}
        style={{
          width: '100%', borderRadius: 12, padding: '12px 14px',
          background: C.card, border: '1px solid rgba(255,255,255,0.12)',
          color: C.cream, fontSize: 14, resize: 'none', outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit',
        }}
      />

      {error && (
        <div style={{ color: '#F87171', fontSize: 13, marginTop: 8, padding: '8px 12px',
          background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
          {error}
          {error.includes('Límite') && (
            <span style={{ color: C.gold, marginLeft: 8, cursor: 'pointer', fontSize: 12 }}>
              → Ver planes
            </span>
          )}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim() || remaining <= 0}
        style={{
          width: '100%', marginTop: 16, padding: '14px',
          background: (loading || remaining <= 0) ? C.muted : `linear-gradient(135deg, ${C.mint}, #22c55e)`,
          border: 'none', borderRadius: 14, color: C.dark,
          fontSize: 15, fontWeight: 700, cursor: (loading || remaining <= 0) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loading ? '⏳ Generando...' : '🚀 Generar Contenido'}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: 24, padding: 16, background: C.card, borderRadius: 16,
          border: `1px solid ${C.mint}44` }}>
          <p style={{ color: C.mint, fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>
            ✅ Contenido generado · {result.pipeline} · {result.cost_estimate}
          </p>
          {result.output_url && result.output_type === 'video' ? (
            <video src={result.output_url} controls style={{ width: '100%', borderRadius: 10 }} />
          ) : result.output_url ? (
            <img src={result.output_url} alt="Generated" style={{ width: '100%', borderRadius: 10 }} />
          ) : (
            <p style={{ color: C.light, fontSize: 13 }}>Contenido listo en fal.ai</p>
          )}
        </div>
      )}
    </div>
  );
}
