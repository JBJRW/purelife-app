import React, { useState } from 'react';

const C = {
  dark: '#0F1F17', green: '#1A3C2E', mint: '#4ADE80',
  cream: '#F5F0E8', light: '#C8D5C0', muted: '#7A9070',
  gold: '#E8B84B', card: 'rgba(255,255,255,0.05)',
};

const PIPELINES = [
  { id: 'veo3', label: 'Veo3 Fast', emoji: '🎬', desc: 'Videos cinematográficos HD', tier: 'bloom' },
  { id: 'flux', label: 'Flux Pro', emoji: '🖼️', desc: 'Imágenes de alta fidelidad', tier: 'seed' },
  { id: 'kling', label: 'Kling v2.6', emoji: '✨', desc: 'Animaciones wellness', tier: 'canopy' },
];

const CATEGORIES = [
  { id: 'smoothies', label: 'Smoothies', emoji: '🥤' },
  { id: 'meditation', label: 'Meditación', emoji: '🧘' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'nutrition', label: 'Nutrición', emoji: '🥗' },
  { id: 'sleep', label: 'Sueño', emoji: '😴' },
  { id: 'detox', label: 'Detox', emoji: '🌿' },
  { id: 'mindset', label: 'Mindset', emoji: '🧠' },
  { id: 'recipes', label: 'Recetas', emoji: '📖' },
];

const TIER_ORDER = { free: 0, seed: 1, bloom: 2, canopy: 3 };

export default function VideoAgent({ userTier = 'free' }) {
  const [pipeline, setPipeline] = useState('flux');
  const [category, setCategory] = useState('smoothies');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const canUsePipeline = (p) => {
    const required = TIER_ORDER[p.tier] || 0;
    const user = TIER_ORDER[userTier] || 0;
    return user >= required;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const sel = PIPELINES.find(p => p.id === pipeline);
    if (!canUsePipeline(sel)) {
      setError(`Necesitas el plan ${sel.tier} para usar ${sel.label}`);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline, category, prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Error generando contenido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontFamily: '"Fraunces", serif', color: C.cream, fontSize: 26, margin: '0 0 6px' }}>
        🎬 Video AI
      </h2>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>
        Crea contenido wellness con IA generativa
      </p>

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
                opacity: unlocked ? 1 : 0.5,
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
              color: C.cream, fontSize: 11, textAlign: 'center',
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
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        style={{
          width: '100%', marginTop: 16, padding: '14px',
          background: loading ? C.muted : `linear-gradient(135deg, ${C.mint}, #22c55e)`,
          border: 'none', borderRadius: 14, color: C.dark,
          fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ Generando...' : '🚀 Generar Contenido'}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: 24, padding: 16, background: C.card, borderRadius: 16,
          border: `1px solid ${C.mint}44` }}>
          <p style={{ color: C.mint, fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>
            ✅ Contenido generado
          </p>
          {result.url && result.url.match(/\.(mp4|webm)$/i) ? (
            <video src={result.url} controls style={{ width: '100%', borderRadius: 10 }} />
          ) : result.url ? (
            <img src={result.url} alt="Generated" style={{ width: '100%', borderRadius: 10 }} />
          ) : (
            <p style={{ color: C.light, fontSize: 13 }}>{JSON.stringify(result)}</p>
          )}
        </div>
      )}
    </div>
  );
}
