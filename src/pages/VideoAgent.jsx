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

const PIPELINE_META = [
  { id: 'flux',    label: 'Flux Pro',   emoji: '🖼️',  tier: 'seed'   },
  { id: 'recraft', label: 'Recraft V3', emoji: '🎨',  tier: 'seed'   },
  { id: 'kling',   label: 'Kling v2.6', emoji: '✨',  tier: 'bloom'  },
  { id: 'veo3',    label: 'Veo3 Fast',  emoji: '🎬',  tier: 'canopy' },
];
const CATEGORY_META = [
  { id: 'smoothie',   emoji: '🥤' },
  { id: 'meditation', emoji: '🧘' },
  { id: 'fitness',    emoji: '💪' },
  { id: 'nutrition',  emoji: '🥗' },
  { id: 'sleep',      emoji: '😴' },
  { id: 'hydration',  emoji: '🌿' },
  { id: 'herbs',      emoji: '🧠' },
  { id: 'community',  emoji: '📖' },
];

const VA = {
  en: {
    pipelineDesc: { flux: 'High-fidelity images', recraft: 'Ultra-HD illustration', kling: 'Wellness animations', veo3: 'Cinematic video' },
    categoryLabel: { smoothie: 'Smoothies', meditation: 'Meditation', fitness: 'Fitness', nutrition: 'Nutrition', sleep: 'Sleep', hydration: 'Detox', herbs: 'Herbs', community: 'Recipes' },
    title: '🎬 Video AI', subtitle: 'Generate · Upscale 4K · Animate with AI', remaining: (n) => `${n} remaining`, limitReached: '⚠️ Limit reached',
    engine: 'Engine', category: 'Category', prompt: 'Prompt', promptPlaceholder: 'Describe the wellness content you want to create...',
    generating: '⏳ Generating...', generate: '🚀 Generate Content', needsPlan: (tier,label) => `You need the ${tier} plan to use ${label}`,
    monthlyLimit: (limit,tier) => `Monthly limit reached (${limit} on ${tier} plan).`, genericGenError: 'Error generating content',
    animateNeedsBloom: '🌸 Animate requires Bloom+', upscaleNeedsSeed: '🌱 4K Upscale requires Seed+', enhanceFailed: 'Enhancement failed', enhanceError: 'Processing error',
    animated: '🎬 Animated', scaling: '⏳ Scaling...', upscale4k: '⬆️ Upscale 4K', animating: '⏳ Animating...', animate: '🎬 Animate',
    generated: 'Generated', threeDEffect: '↔ 3D effect',
  },
  es: {
    pipelineDesc: { flux: 'Imágenes alta fidelidad', recraft: 'Ilustración ultra-HD', kling: 'Animaciones wellness', veo3: 'Video cinematográfico' },
    categoryLabel: { smoothie: 'Smoothies', meditation: 'Meditación', fitness: 'Fitness', nutrition: 'Nutrición', sleep: 'Sueño', hydration: 'Detox', herbs: 'Herbs', community: 'Recetas' },
    title: '🎬 Video AI', subtitle: 'Genera · Upscale 4K · Anima con IA', remaining: (n) => `${n} restantes`, limitReached: '⚠️ Límite alcanzado',
    engine: 'Motor', category: 'Categoría', prompt: 'Prompt', promptPlaceholder: 'Describe el contenido wellness que quieres crear...',
    generating: '⏳ Generando...', generate: '🚀 Generar Contenido', needsPlan: (tier,label) => `Necesitas el plan ${tier} para usar ${label}`,
    monthlyLimit: (limit,tier) => `Límite mensual alcanzado (${limit} en plan ${tier}).`, genericGenError: 'Error generando contenido',
    animateNeedsBloom: '🌸 Animar requiere Bloom+', upscaleNeedsSeed: '🌱 Upscale 4K requiere Seed+', enhanceFailed: 'Enhancement failed', enhanceError: 'Error al procesar',
    animated: '🎬 Animado', scaling: '⏳ Escalando...', upscale4k: '⬆️ Upscale 4K', animating: '⏳ Animando...', animate: '🎬 Animar',
    generated: 'Generado', threeDEffect: '↔ efecto 3D',
  },
  fr: {
    pipelineDesc: { flux: 'Images haute fidélité', recraft: 'Illustration ultra-HD', kling: 'Animations bien-être', veo3: 'Vidéo cinématographique' },
    categoryLabel: { smoothie: 'Smoothies', meditation: 'Méditation', fitness: 'Fitness', nutrition: 'Nutrition', sleep: 'Sommeil', hydration: 'Détox', herbs: 'Herbes', community: 'Recettes' },
    title: '🎬 Vidéo IA', subtitle: 'Générez · Upscale 4K · Animez avec l\'IA', remaining: (n) => `${n} restants`, limitReached: '⚠️ Limite atteinte',
    engine: 'Moteur', category: 'Catégorie', prompt: 'Prompt', promptPlaceholder: 'Décrivez le contenu bien-être que vous voulez créer...',
    generating: '⏳ Génération...', generate: '🚀 Générer le contenu', needsPlan: (tier,label) => `Vous avez besoin du plan ${tier} pour utiliser ${label}`,
    monthlyLimit: (limit,tier) => `Limite mensuelle atteinte (${limit} sur le plan ${tier}).`, genericGenError: 'Erreur lors de la génération du contenu',
    animateNeedsBloom: '🌸 Animer nécessite Bloom+', upscaleNeedsSeed: '🌱 Upscale 4K nécessite Seed+', enhanceFailed: "Échec de l'amélioration", enhanceError: 'Erreur de traitement',
    animated: '🎬 Animé', scaling: '⏳ Mise à l\'échelle...', upscale4k: '⬆️ Upscale 4K', animating: '⏳ Animation...', animate: '🎬 Animer',
    generated: 'Généré', threeDEffect: '↔ effet 3D',
  },
  pt: {
    pipelineDesc: { flux: 'Imagens de alta fidelidade', recraft: 'Ilustração ultra-HD', kling: 'Animações wellness', veo3: 'Vídeo cinematográfico' },
    categoryLabel: { smoothie: 'Smoothies', meditation: 'Meditação', fitness: 'Fitness', nutrition: 'Nutrição', sleep: 'Sono', hydration: 'Detox', herbs: 'Ervas', community: 'Receitas' },
    title: '🎬 Vídeo IA', subtitle: 'Gere · Upscale 4K · Anime com IA', remaining: (n) => `${n} restantes`, limitReached: '⚠️ Limite atingido',
    engine: 'Motor', category: 'Categoria', prompt: 'Prompt', promptPlaceholder: 'Descreva o conteúdo wellness que você quer criar...',
    generating: '⏳ Gerando...', generate: '🚀 Gerar Conteúdo', needsPlan: (tier,label) => `Você precisa do plano ${tier} para usar ${label}`,
    monthlyLimit: (limit,tier) => `Limite mensal atingido (${limit} no plano ${tier}).`, genericGenError: 'Erro ao gerar conteúdo',
    animateNeedsBloom: '🌸 Animar requer Bloom+', upscaleNeedsSeed: '🌱 Upscale 4K requer Seed+', enhanceFailed: 'Falha no aprimoramento', enhanceError: 'Erro ao processar',
    animated: '🎬 Animado', scaling: '⏳ Ampliando...', upscale4k: '⬆️ Upscale 4K', animating: '⏳ Animando...', animate: '🎬 Animar',
    generated: 'Gerado', threeDEffect: '↔ efeito 3D',
  },
  it: {
    pipelineDesc: { flux: 'Immagini alta fedeltà', recraft: 'Illustrazione ultra-HD', kling: 'Animazioni benessere', veo3: 'Video cinematografico' },
    categoryLabel: { smoothie: 'Smoothie', meditation: 'Meditazione', fitness: 'Fitness', nutrition: 'Nutrizione', sleep: 'Sonno', hydration: 'Detox', herbs: 'Erbe', community: 'Ricette' },
    title: '🎬 Video IA', subtitle: 'Genera · Upscale 4K · Anima con IA', remaining: (n) => `${n} rimanenti`, limitReached: '⚠️ Limite raggiunto',
    engine: 'Motore', category: 'Categoria', prompt: 'Prompt', promptPlaceholder: 'Descrivi il contenuto wellness che vuoi creare...',
    generating: '⏳ Generazione...', generate: '🚀 Genera Contenuto', needsPlan: (tier,label) => `Hai bisogno del piano ${tier} per usare ${label}`,
    monthlyLimit: (limit,tier) => `Limite mensile raggiunto (${limit} nel piano ${tier}).`, genericGenError: 'Errore nella generazione del contenuto',
    animateNeedsBloom: '🌸 Animare richiede Bloom+', upscaleNeedsSeed: '🌱 Upscale 4K richiede Seed+', enhanceFailed: 'Miglioramento fallito', enhanceError: 'Errore di elaborazione',
    animated: '🎬 Animato', scaling: '⏳ Scalando...', upscale4k: '⬆️ Upscale 4K', animating: '⏳ Animando...', animate: '🎬 Anima',
    generated: 'Generato', threeDEffect: '↔ effetto 3D',
  },
};
const va = (lang) => VA[lang] || VA.en;
const getPipelines = (lang='en') => PIPELINE_META.map(p => ({ ...p, desc: va(lang).pipelineDesc[p.id] }));
const getCategories = (lang='en') => CATEGORY_META.map(c => ({ ...c, label: va(lang).categoryLabel[c.id] }));

const TIER_ORDER    = { free: 0, seed: 1, bloom: 2, canopy: 3 };
const TIER_LIMITS   = { free: 0, seed: 3, bloom: 15, canopy: 999 };
const ENHANCE_TIERS = { upscale: ['seed','bloom','canopy'], animate: ['bloom','canopy'] };

// ── 3D Parallax Viewer ──────────────────────────────────────
function ParallaxViewer({ src, type, label3d = '↔ 3D effect', altText = 'Generated' }) {
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
        <img src={src} alt={altText}
          style={{ width: '100%', display: 'block', borderRadius: 14, transform, transition: active ? 'transform 0.1s ease-out' : 'transform 0.5s ease' }}
        />
      )}
      {!active && (
        <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 10, color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }}>
          {label3d}
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function VideoAgent({ user, hermes, lang = 'en' }) {
  const t = va(lang);
  const PIPELINES = getPipelines(lang);
  const CATEGORIES = getCategories(lang);
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
    if (!canUsePipeline(sel)) { setError(t.needsPlan(sel.tier, sel.label)); return; }
    if (usageCount !== null && usageCount >= limit) { setError(t.monthlyLimit(limit, userTier)); return; }
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
    } catch (e) { setError(e.message || t.genericGenError); }
    finally { setLoading(false); }
  };

  const handleEnhance = async (action) => {
    const srcUrl = result?.output_url;
    if (!srcUrl || !user?.id || !user?.token) return;
    if (!canEnhance(action)) {
      setEnhanceError(action === 'animate' ? t.animateNeedsBloom : t.upscaleNeedsSeed);
      return;
    }
    setEnhancing(action); setEnhanceError(''); setEnhancedResult(null);
    try {
      const res  = await fetch('/api/enhance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, image_url: srcUrl, userId: user.id, accessToken: user.token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || t.enhanceFailed);
      setEnhancedResult(data);
    } catch (e) { setEnhanceError(e.message || t.enhanceError); }
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
          <h2 style={{ fontFamily: '"Fraunces", serif', color: C.cream, fontSize: 26, margin: '0 0 4px' }}>{t.title}</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{t.subtitle}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: 8, padding: '4px 10px', fontSize: 11, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {userTier}
          </div>
          {!loadingUsage && usageCount !== null && (
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              {remaining > 0 ? t.remaining(remaining) : t.limitReached}
            </div>
          )}
        </div>
      </div>

      {/* Pipelines */}
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{t.engine}</h3>
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
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{t.category}</h3>
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
      <h3 style={{ color: C.cream, fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t.prompt}</h3>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder={t.promptPlaceholder} rows={3}
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
        {loading ? t.generating : t.generate}
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
              <span style={{ background: `${C.purple}22`, color: C.purple, fontSize: 11, padding: '2px 8px', borderRadius: 6, border: `1px solid ${C.purple}44` }}>{t.animated}</span>
            )}
          </div>

          {activeResult?.output_url && (
            <ParallaxViewer src={activeResult.output_url} type={activeResult.output_type} label3d={t.threeDEffect} altText={t.generated} />
          )}

          {result.output_type === 'image' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => handleEnhance('upscale')} disabled={!!enhancing}
                style={{ flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: canEnhance('upscale') ? `${C.blue}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${canEnhance('upscale') ? `${C.blue}55` : 'rgba(255,255,255,0.08)'}`,
                  color: canEnhance('upscale') ? C.blue : C.muted, fontSize: 13, fontWeight: 600,
                  cursor: enhancing ? 'not-allowed' : 'pointer', opacity: enhancing === 'upscale' ? 0.65 : 1 }}>
                {enhancing === 'upscale' ? t.scaling : t.upscale4k}
                {!canEnhance('upscale') && <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>🔒 Seed</div>}
              </button>
              <button onClick={() => handleEnhance('animate')} disabled={!!enhancing}
                style={{ flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: canEnhance('animate') ? `${C.purple}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${canEnhance('animate') ? `${C.purple}55` : 'rgba(255,255,255,0.08)'}`,
                  color: canEnhance('animate') ? C.purple : C.muted, fontSize: 13, fontWeight: 600,
                  cursor: enhancing ? 'not-allowed' : 'pointer', opacity: enhancing === 'animate' ? 0.65 : 1 }}>
                {enhancing === 'animate' ? t.animating : t.animate}
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
