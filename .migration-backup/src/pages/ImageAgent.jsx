import React, { useState, useRef, useEffect } from 'react';

// ── PALETA PURELIFE ──────────────────────────────────────────
const C = {
  dark:    '#0F1F17',
  green:   '#1A5C3A',
  mint:    '#2D8653',
  light:   '#5CB87A',
  cream:   '#F5F0E8',
  gold:    '#C9973A',
  goldL:   '#E8B84B',
  muted:   '#7A9080',
  glass:   'rgba(255,255,255,0.06)',
  border:  'rgba(255,255,255,0.10)',
  accent:  '#7B5CF0',
  accentL: '#A78BFA',
};
const FONT_HEAD = "'Georgia', serif";
const FONT_BODY = "'Helvetica Neue', Arial, sans-serif";
const FONT_MONO = "'Courier New', monospace";

// ── TIER CONFIG ───────────────────────────────────────────────
const TIER_LIMITS = { free: 0, seed: 5, bloom: 20, canopy: 999 };
const TIER_COLORS = {
  free:   '#6B6B8A',
  seed:   C.green,
  bloom:  C.gold,
  canopy: C.accentL,
};

// ── WELLNESS CATEGORIES ───────────────────────────────────────
const CATEGORIES = [
  { id: 'smoothie',   label: 'Smoothies',    emoji: '🥤', prompt: 'vibrant tropical smoothie bowl with fresh fruits, açaí, granola, overhead shot, bright natural lighting, food photography' },
  { id: 'juice',      label: 'Jugos Detox',  emoji: '🌿', prompt: 'fresh cold-pressed green detox juice with cucumber mint lime, glass bottle, white marble background, editorial food photography' },
  { id: 'wellness',   label: 'Wellness',     emoji: '🧘', prompt: 'serene wellness spa scene, soft morning light, botanical elements, zen atmosphere, lifestyle photography' },
  { id: 'nutrition',  label: 'Nutrición',    emoji: '🥗', prompt: 'beautiful colorful healthy bowl with quinoa vegetables avocado, flat lay, natural light, clean aesthetic' },
  { id: 'herbs',      label: 'Plantas',      emoji: '🌱', prompt: 'medicinal herbs and superfoods arranged artistically, mortar and pestle, warm golden light, botanical photography' },
  { id: 'fitness',    label: 'Fitness',      emoji: '💪', prompt: 'athlete in nature, dynamic movement, golden hour light, motivational wellness lifestyle photography' },
  { id: 'sleep',      label: 'Descanso',     emoji: '😴', prompt: 'peaceful sleep wellness scene, lavender chamomile tea, moonlight, soft blue tones, relaxing atmosphere' },
  { id: 'community',  label: 'Comunidad',    emoji: '🤝', prompt: 'diverse group of healthy people sharing wellness food, bright joyful atmosphere, lifestyle photography' },
];

// ── ENHANCEMENT STYLES ───────────────────────────────────────
const STYLES = [
  { id: '',           label: '— Auto',       suffix: '' },
  { id: 'photo',      label: '📷 Foto Real', suffix: ', photorealistic, 8k ultra-detailed, professional photography, natural lighting' },
  { id: 'editorial',  label: '✦ Editorial',  suffix: ', editorial food photography, magazine quality, sophisticated styling, soft shadows' },
  { id: 'cinematic',  label: '🎬 Cinemático', suffix: ', cinematic color grading, golden hour, film grain, dramatic lighting, 35mm lens' },
  { id: 'minimal',    label: '◼ Minimal',    suffix: ', minimalist aesthetic, clean white background, simple composition, scandinavian style' },
  { id: 'vibrant',    label: '🎨 Vibrante',  suffix: ', vivid saturated colors, high contrast, pop art influence, bold composition' },
  { id: 'botanical',  label: '🌿 Botánico',  suffix: ', lush botanical illustration style, watercolor texture, soft organic forms' },
];

// ── ASPECT RATIOS ─────────────────────────────────────────────
const RATIOS = [
  { id: '1:1',  label: '1:1',  w: 1024, h: 1024 },
  { id: '16:9', label: '16:9', w: 1344, h: 768  },
  { id: '9:16', label: '9:16', w: 768,  h: 1344 },
  { id: '4:3',  label: '4:3',  w: 1152, h: 896  },
  { id: '3:2',  label: '3:2',  w: 1216, h: 832  },
];

// ── MAIN COMPONENT ────────────────────────────────────────────
export default function ImageAgent({ user, lang = 'en' }) {
  const tier = user?.membership || 'free';
  const limit = TIER_LIMITS[tier] || 0;

  const [prompt, setPrompt]       = useState('');
  const [negPrompt, setNegPrompt] = useState('blurry, low quality, watermark, text, logo, oversaturated, ugly');
  const [style, setStyle]         = useState('');
  const [ratio, setRatio]         = useState('1:1');
  const [seed, setSeed]           = useState('');
  const [category, setCategory]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [currentImg, setCurrentImg] = useState(null);
  const [history, setHistory]     = useState([]);
  const [usageCount, setUsageCount] = useState(0);
  const [error, setError]         = useState('');
  const [genTime, setGenTime]     = useState(null);
  const imgRef = useRef(null);

  const styleObj = STYLES.find(s => s.id === style) || STYLES[0];
  const ratioObj = RATIOS.find(r => r.id === ratio) || RATIOS[0];
  const canGenerate = tier !== 'free' && usageCount < limit;

  // ── CATEGORY QUICK-FILL ───────────────────────────────────
  const applyCategory = (cat) => {
    setCategory(cat.id);
    setPrompt(cat.prompt);
  };

  // ── ENHANCE PROMPT VIA CLAUDE API ─────────────────────────
  const enhancePrompt = async () => {
    if (!prompt.trim()) { setError('Escribe un prompt primero.'); return; }
    setEnhancing(true);
    setError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 350,
          system: `You are an expert prompt engineer for FLUX.1 image generation, specialized in wellness, nutrition, smoothies, and health lifestyle photography.
Improve the user's prompt by adding: specific lighting details, color palette, composition, camera angle, texture, mood atmosphere.
Context: PureLife Wellness Club — premium health and wellness brand. Style: clean, vibrant, aspirational, authentic.
Output: ONLY the improved prompt text, max 120 words, no preamble, no explanation.`,
          messages: [{ role: 'user', content: `Improve: "${prompt}"` }]
        })
      });
      const data = await res.json();
      if (data.content?.[0]?.text) setPrompt(data.content[0].text.trim());
      else throw new Error('No response');
    } catch {
      setError('Error al mejorar prompt. Inténtalo de nuevo.');
    } finally {
      setEnhancing(false);
    }
  };

  // ── GENERATE IMAGE ─────────────────────────────────────────
  const generate = async () => {
    if (!prompt.trim()) { setError('Escribe qué quieres imaginar.'); return; }
    if (tier === 'free') { setError('Necesitas ser miembro Seed o superior para generar imágenes.'); return; }
    if (usageCount >= limit) { setError(`Alcanzaste tu límite mensual de ${limit} imágenes. Upgrade para más.`); return; }

    setLoading(true);
    setError('');
    const t0 = Date.now();
    const effectiveSeed = seed.trim() ? parseInt(seed) : Math.floor(Math.random() * 999999);
    const fullPrompt = `${prompt}${styleObj.suffix}`;

    try {
      const params = new URLSearchParams({
        width: ratioObj.w,
        height: ratioObj.h,
        seed: effectiveSeed,
        model: 'flux',
        nologo: 'true',
        enhance: 'false',
      });
      if (negPrompt.trim()) params.set('negative_prompt', negPrompt);

      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params}`;

      await new Promise((resolve, reject) => {
        const img = new Image();
        const timeout = setTimeout(() => reject(new Error('Timeout')), 90000);
        img.onload  = () => { clearTimeout(timeout); resolve(); };
        img.onerror = () => { clearTimeout(timeout); reject(new Error('Load failed')); };
        img.src = imageUrl;
      });

      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      setGenTime(elapsed);
      setCurrentImg({ url: imageUrl, prompt, fullPrompt, ratio, style, seed: effectiveSeed });
      setHistory(prev => [{ url: imageUrl, prompt, ratio, style, seed: effectiveSeed, ts: Date.now() }, ...prev.slice(0, 11)]);
      setUsageCount(c => c + 1);
    } catch {
      setError('No se pudo generar la imagen. Verifica tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // ── DOWNLOAD ──────────────────────────────────────────────
  const downloadImage = async () => {
    if (!currentImg?.url) return;
    try {
      const res = await fetch(currentImg.url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `purelife-${Date.now()}.png`;
      a.click();
    } catch {
      window.open(currentImg.url, '_blank');
    }
  };

  // ── KEYBOARD SHORTCUT ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prompt, style, ratio, seed, tier, usageCount]);

  // ── STYLES ────────────────────────────────────────────────
  const s = {
    page: {
      background: `radial-gradient(ellipse at top left, ${C.green}18 0%, transparent 40%),
                   radial-gradient(ellipse at bottom right, ${C.accent}12 0%, transparent 50%),
                   ${C.dark}`,
      minHeight: '100vh',
      fontFamily: FONT_BODY,
      paddingBottom: 32,
    },
    header: {
      padding: '20px 20px 12px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    badge: {
      width: 38, height: 38,
      background: `linear-gradient(135deg, ${C.accent}, ${C.accentL})`,
      borderRadius: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18,
      boxShadow: `0 0 16px ${C.accent}44`,
      flexShrink: 0,
    },
    title: { fontSize: 17, fontWeight: 700, color: C.cream, fontFamily: FONT_HEAD, lineHeight: 1 },
    subtitle: { fontSize: 11, color: C.muted, marginTop: 2, fontFamily: FONT_MONO },
    tierPill: {
      marginLeft: 'auto',
      background: `${TIER_COLORS[tier]}22`,
      border: `1px solid ${TIER_COLORS[tier]}55`,
      color: TIER_COLORS[tier],
      fontSize: 10,
      padding: '4px 10px',
      borderRadius: 20,
      fontFamily: FONT_MONO,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    section: { padding: '16px 20px 0' },
    label: { fontSize: 11, color: C.muted, marginBottom: 7, letterSpacing: .8, textTransform: 'uppercase', fontFamily: FONT_MONO },
    textarea: {
      width: '100%', background: C.glass, border: `1px solid ${C.border}`,
      borderRadius: 10, color: C.cream, fontFamily: FONT_BODY, fontSize: 13,
      padding: '10px 12px', outline: 'none', resize: 'none', minHeight: 90,
      lineHeight: 1.5, boxSizing: 'border-box',
    },
    input: {
      width: '100%', background: C.glass, border: `1px solid ${C.border}`,
      borderRadius: 10, color: C.cream, fontFamily: FONT_BODY, fontSize: 13,
      padding: '9px 12px', outline: 'none', boxSizing: 'border-box',
    },
    catGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
    catBtn: (active) => ({
      background: active ? `${C.green}33` : C.glass,
      border: `1px solid ${active ? C.mint : C.border}`,
      borderRadius: 10, padding: '8px 4px',
      color: active ? C.light : C.muted,
      fontSize: 10, textAlign: 'center', cursor: 'pointer',
      transition: 'all .15s', fontFamily: FONT_BODY,
    }),
    styleGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 },
    styleBtn: (active) => ({
      background: active ? `${C.accent}22` : C.glass,
      border: `1px solid ${active ? C.accentL : C.border}`,
      borderRadius: 8, padding: '7px 5px',
      color: active ? C.accentL : C.muted,
      fontSize: 10, textAlign: 'center', cursor: 'pointer',
      transition: 'all .15s', fontFamily: FONT_BODY, lineHeight: 1.3,
    }),
    ratioRow: { display: 'flex', gap: 7, flexWrap: 'wrap' },
    ratioBtn: (active) => ({
      background: active ? `${C.gold}22` : C.glass,
      border: `1px solid ${active ? C.gold : C.border}`,
      borderRadius: 7, padding: '6px 12px',
      color: active ? C.goldL : C.muted,
      fontSize: 11, cursor: 'pointer', fontFamily: FONT_MONO,
      transition: 'all .15s',
    }),
    enhRow: { display: 'flex', gap: 8, alignItems: 'flex-start' },
    enhBtn: {
      flexShrink: 0, padding: '10px 12px',
      background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
      borderRadius: 9, color: C.goldL, fontSize: 11,
      cursor: enhancing ? 'not-allowed' : 'pointer',
      opacity: enhancing ? .5 : 1,
      fontFamily: FONT_BODY, whiteSpace: 'nowrap',
    },
    genBtn: {
      width: '100%', padding: 15,
      background: canGenerate
        ? `linear-gradient(135deg, ${C.accent}, #9B7BFF)`
        : '#2A2A3E',
      border: 'none', borderRadius: 12,
      color: canGenerate ? '#fff' : C.muted,
      fontSize: 15, fontWeight: 700, cursor: canGenerate ? 'pointer' : 'not-allowed',
      fontFamily: FONT_BODY, letterSpacing: .3,
      boxShadow: canGenerate ? `0 6px 20px ${C.accent}44` : 'none',
      transition: 'all .2s',
    },
    imageWrap: {
      margin: '20px 20px 0',
      borderRadius: 14,
      overflow: 'hidden',
      background: C.glass,
      border: `1px solid ${C.border}`,
      position: 'relative',
      minHeight: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    loadOverlay: {
      position: 'absolute', inset: 0,
      background: 'rgba(10,20,15,.85)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14,
    },
    spinner: {
      width: 48, height: 48,
      border: `3px solid ${C.accent}33`,
      borderTopColor: C.accentL,
      borderRadius: '50%',
      animation: 'spin .8s linear infinite',
    },
    imgActions: {
      display: 'flex', gap: 8, padding: '10px 20px 0',
    },
    actionBtn: (variant) => ({
      flex: 1, padding: '9px 12px',
      background: variant === 'dl' ? `${C.gold}18` : C.glass,
      border: `1px solid ${variant === 'dl' ? `${C.gold}55` : C.border}`,
      borderRadius: 9, color: variant === 'dl' ? C.goldL : C.muted,
      fontSize: 12, cursor: 'pointer', fontFamily: FONT_BODY,
      textAlign: 'center',
    }),
    galleryRow: {
      display: 'flex', gap: 8, overflowX: 'auto',
      padding: '12px 20px 0',
      scrollbarWidth: 'none',
    },
    galleryThumb: (active) => ({
      width: 52, height: 52, flexShrink: 0,
      borderRadius: 8, overflow: 'hidden',
      border: `2px solid ${active ? C.accentL : C.border}`,
      cursor: 'pointer', transition: 'border-color .15s',
    }),
    emptyCanvas: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 10, padding: 32, textAlign: 'center',
    },
    errorBox: {
      margin: '12px 20px 0',
      background: 'rgba(192,57,43,.12)',
      border: '1px solid rgba(192,57,43,.35)',
      borderRadius: 9, padding: '10px 14px',
      color: '#FCA5A5', fontSize: 12, fontFamily: FONT_MONO,
    },
    usageBar: {
      margin: '0 20px',
      display: 'flex', alignItems: 'center', gap: 8,
    },
    usageTrack: {
      flex: 1, height: 4, background: C.glass, borderRadius: 2,
      overflow: 'hidden',
    },
    usageFill: {
      height: '100%',
      width: `${limit > 0 ? Math.min(100, (usageCount / limit) * 100) : 0}%`,
      background: usageCount >= limit ? '#EF4444' : `linear-gradient(90deg, ${C.mint}, ${C.accentL})`,
      borderRadius: 2, transition: 'width .5s ease',
    },
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.badge}>🖼️</div>
        <div>
          <div style={s.title}>Image Creator</div>
          <div style={s.subtitle}>FLUX.1 Dev · powered by Dr. Smoothie AI</div>
        </div>
        <div style={s.tierPill}>{tier} · {usageCount}/{limit === 999 ? '∞' : limit}</div>
      </div>

      {/* USAGE BAR */}
      {limit < 999 && (
        <div style={{ ...s.usageBar, marginTop: 10 }}>
          <div style={s.usageTrack}><div style={s.usageFill} /></div>
          <span style={{ fontSize: 10, color: C.muted, fontFamily: FONT_MONO, whiteSpace: 'nowrap' }}>
            {usageCount}/{limit} imágenes
          </span>
        </div>
      )}

      {/* CATEGORIES */}
      <div style={s.section}>
        <div style={s.label}>Categoría Wellness</div>
        <div style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} style={s.catBtn(category === cat.id)} onClick={() => applyCategory(cat)}>
              <div style={{ fontSize: 18 }}>{cat.emoji}</div>
              <div style={{ marginTop: 3 }}>{cat.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* PROMPT */}
      <div style={s.section}>
        <div style={s.label}>Describe tu imagen</div>
        <div style={s.enhRow}>
          <textarea
            style={s.textarea}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ej: vibrant green smoothie with spirulina, fresh mint, tropical fruits, editorial photography..."
          />
          <button style={s.enhBtn} onClick={enhancePrompt} disabled={enhancing}>
            {enhancing ? '...' : '✦\nMejorar'}
          </button>
        </div>
      </div>

      {/* STYLE */}
      <div style={s.section}>
        <div style={s.label}>Estilo Visual</div>
        <div style={s.styleGrid}>
          {STYLES.map(st => (
            <button key={st.id} style={s.styleBtn(style === st.id)} onClick={() => setStyle(st.id)}>
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* RATIO */}
      <div style={s.section}>
        <div style={s.label}>Proporción</div>
        <div style={s.ratioRow}>
          {RATIOS.map(r => (
            <button key={r.id} style={s.ratioBtn(ratio === r.id)} onClick={() => setRatio(r.id)}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* NEGATIVE + SEED */}
      <div style={{ ...s.section, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={s.label}>Negative Prompt</div>
          <input style={s.input} value={negPrompt} onChange={e => setNegPrompt(e.target.value)} placeholder="blurry, watermark..." />
        </div>
        <div>
          <div style={s.label}>Seed (opcional)</div>
          <input style={s.input} value={seed} onChange={e => setSeed(e.target.value)} placeholder="ej: 42069" />
        </div>
      </div>

      {/* ERROR */}
      {error && <div style={s.errorBox}>⚠ {error}</div>}

      {/* FREE TIER LOCK */}
      {tier === 'free' && (
        <div style={{ margin: '14px 20px 0', background: `${C.gold}12`, border: `1px solid ${C.gold}33`, borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ color: C.goldL, fontSize: 12, fontWeight: 600 }}>🌱 Únete como miembro Seed</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
            Genera hasta 5 imágenes/mes con FLUX.1 Dev desde $29/mo. Bloom (20/mes) y Canopy (ilimitado) disponibles.
          </div>
        </div>
      )}

      {/* GENERATE BUTTON */}
      <div style={{ padding: '14px 20px 0' }}>
        <button style={s.genBtn} onClick={generate} disabled={!canGenerate || loading}>
          {loading ? '⏳ Generando imagen...' : canGenerate ? '⚡ Generar Imagen (⌘+↵)' : tier === 'free' ? '🔒 Requiere Membresía' : `✓ Límite alcanzado (${usageCount}/${limit})`}
        </button>
      </div>

      {/* IMAGE OUTPUT */}
      <div style={s.imageWrap}>
        {!currentImg && !loading && (
          <div style={s.emptyCanvas}>
            <div style={{ fontSize: 48, opacity: .3 }}>🖼️</div>
            <div style={{ color: '#2A3A30', fontSize: 14, fontFamily: FONT_BODY }}>Tu imagen aparecerá aquí</div>
            <div style={{ color: '#1A2A20', fontSize: 12 }}>Elige una categoría y genera</div>
          </div>
        )}

        {currentImg && !loading && (
          <img
            ref={imgRef}
            src={currentImg.url}
            alt="Generated"
            style={{ width: '100%', display: 'block', borderRadius: 12 }}
          />
        )}

        {loading && (
          <div style={s.loadOverlay}>
            <div style={s.spinner} />
            <div style={{ color: C.accentL, fontSize: 12, fontFamily: FONT_MONO, textAlign: 'center' }}>
              Generando con FLUX.1 Dev…<br />
              <span style={{ color: C.muted, fontSize: 10 }}>Puede tomar 20-40 segundos</span>
            </div>
          </div>
        )}
      </div>

      {/* IMAGE ACTIONS */}
      {currentImg && !loading && (
        <>
          <div style={s.imgActions}>
            <button style={s.actionBtn('dl')} onClick={downloadImage}>↓ Descargar PNG</button>
            <button style={s.actionBtn('copy')} onClick={() => { navigator.clipboard?.writeText(currentImg.url); }}>⎘ Copiar URL</button>
            <button style={s.actionBtn('new')} onClick={() => { setCurrentImg(null); setPrompt(''); setCategory(null); }}>✕ Nueva</button>
          </div>
          {genTime && (
            <div style={{ padding: '6px 20px 0', fontSize: 10, color: C.muted, fontFamily: FONT_MONO }}>
              ✓ Generada en {genTime}s · seed: {currentImg.seed} · {currentImg.ratio}
            </div>
          )}
        </>
      )}

      {/* GALLERY */}
      {history.length > 0 && (
        <div>
          <div style={{ ...s.label, padding: '14px 20px 6px 20px' }}>Historial</div>
          <div style={s.galleryRow}>
            {history.map((item, i) => (
              <div key={item.ts} style={s.galleryThumb(currentImg?.url === item.url)} onClick={() => setCurrentImg(item)}>
                <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
