// ============================================================
// PureLife Wellness Club — Video Agent API
// api/video.js · JRMB Food Network LLC
// ============================================================

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const FAL_API = 'https://fal.run';

const PIPELINES = {
  veo3:  { id: 'fal-ai/veo3/fast',                           name: 'Veo3 Fast',  cost: '~$2',    quality: 'premium',   duration: 8 },
  flux:  { id: 'fal-ai/flux-pro/v1.1',                       name: 'Flux Pro',   cost: '~$0.30', quality: 'standard',  duration: 4 },
  kling: { id: 'fal-ai/kling-video/v2.6/pro/image-to-video', name: 'Kling v2.6', cost: '~$0.50', quality: 'cinematic', duration: 5 },
};

const CATEGORIES = {
  smoothie:   { en: 'Fresh colorful smoothie being blended, tropical fruits, vibrant colors, wellness lifestyle',        es: 'Batido colorido siendo mezclado, frutas tropicales, colores vibrantes, estilo de vida saludable' },
  meditation: { en: 'Person meditating in nature, golden hour light, peaceful, serene, wellness and balance',            es: 'Persona meditando en la naturaleza, luz dorada, paz, serenidad, bienestar' },
  nutrition:  { en: 'Colorful healthy meal preparation, fresh vegetables, superfoods, clean eating aesthetic',           es: 'Preparación de comida saludable colorida, verduras frescas, superalimentos' },
  fitness:    { en: 'Person doing yoga outdoors, morning light, energetic, healthy lifestyle',                            es: 'Persona haciendo yoga al aire libre, luz matutina, energético, vida saludable' },
  sleep:      { en: 'Peaceful sleep environment, soft moonlight, lavender, calm atmosphere, recovery',                   es: 'Ambiente de sueño tranquilo, luz de luna suave, lavanda, recuperación' },
  hydration:  { en: 'Crystal clear water with cucumber and lemon, detox drink, refreshing, clean wellness',              es: 'Agua cristalina con pepino y limón, bebida detox, refrescante' },
  herbs:      { en: 'Colorful superfoods and medicinal herbs, spirulina, turmeric, ginger, natural wellness',            es: 'Superalimentos y hierbas medicinales, espirulina, cúrcuma, jengibre' },
  community:  { en: 'Group of healthy happy people sharing a wellness meal, positive energy, community',                 es: 'Grupo de personas saludables compartiendo comida wellness, energía positiva' },
};

const TIER_ACCESS = {
  free:   [],
  seed:   ['flux'],
  bloom:  ['flux', 'kling'],
  canopy: ['flux', 'kling', 'veo3'],
};

const TIER_LIMITS = {
  free: 0, seed: 3, bloom: 15, canopy: 999,
};

// ── Helpers Supabase ──────────────────────────────────────────
function sbHeaders(accessToken, key) {
  return {
    apikey: key,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

async function getTierFromSupabase(userId, accessToken, key) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=membership_tier`,
      { headers: sbHeaders(accessToken, key) }
    );
    const data = await res.json();
    return data?.[0]?.membership_tier || 'free';
  } catch { return 'free'; }
}

async function getMonthlyUsage(userId, accessToken, key) {
  try {
    const firstDay = new Date();
    firstDay.setDate(1); firstDay.setHours(0,0,0,0);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/video_usage?user_id=eq.${userId}&created_at=gte.${firstDay.toISOString()}&select=id`,
      { headers: sbHeaders(accessToken, key) }
    );
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch { return 0; }
}

async function recordUsage(userId, pipeline, category, accessToken, key) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/video_usage`, {
      method: 'POST',
      headers: sbHeaders(accessToken, key),
      body: JSON.stringify({
        user_id: userId,
        pipeline,
        category,
        created_at: new Date().toISOString(),
      }),
    });
  } catch { /* non-blocking */ }
}

// ── Handler principal ─────────────────────────────────────────
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://purelifewellnessclub.org','https://www.purelifewellnessclub.org','http://localhost:5173','http://localhost:3000'];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const FAL_KEY      = process.env.FAL_KEY;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

  if (!FAL_KEY) return res.status(500).json({ error: 'Video service not configured' });

  const {
    category = 'smoothie',
    pipeline = 'flux',
    lang = 'en',
    custom_prompt = null,
    userId = null,
    accessToken = null,
  } = req.body;

  // ── 1. Obtener tier REAL desde Supabase ───────────────────
  let membership_tier = 'free';
  if (userId && accessToken) {
    membership_tier = await getTierFromSupabase(userId, accessToken, SUPABASE_KEY);
  }

  // ── 2. Validar acceso al pipeline ─────────────────────────
  const allowed_pipelines = TIER_ACCESS[membership_tier] || [];
  if (!allowed_pipelines.includes(pipeline)) {
    return res.status(403).json({
      error: 'upgrade_required',
      upgrade_to: pipeline === 'veo3' ? 'canopy' : 'bloom',
      current_tier: membership_tier,
    });
  }

  // ── 3. Validar límite mensual ──────────────────────────────
  if (userId && accessToken) {
    const monthlyCount = await getMonthlyUsage(userId, accessToken, SUPABASE_KEY);
    const limit = TIER_LIMITS[membership_tier] || 0;
    if (monthlyCount >= limit) {
      return res.status(429).json({
        error: 'monthly_limit_reached',
        count: monthlyCount,
        limit,
        tier: membership_tier,
      });
    }
  }

  // ── 4. Construir prompt y payload ─────────────────────────
  const cat    = CATEGORIES[category] || CATEGORIES.smoothie;
  const prompt = custom_prompt || (lang === 'es' ? cat.es : cat.en);
  const pipe   = PIPELINES[pipeline];

  let payload = {};
  if (pipeline === 'veo3')  payload = { prompt, duration: pipe.duration, aspect_ratio: '16:9' };
  if (pipeline === 'flux')  payload = { prompt, num_inference_steps: 28, guidance_scale: 3.5, num_images: 1 };
  if (pipeline === 'kling') payload = { prompt, duration: pipe.duration, aspect_ratio: '16:9', cfg_scale: 0.5 };

  // ── 5. Llamar a fal.ai ────────────────────────────────────
  const falRes = await fetch(`${FAL_API}/${pipe.id}`, {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!falRes.ok) {
    const falErr = await falRes.text();
    console.error('[video] fal.ai error:', falErr);
    return res.status(502).json({ error: 'Generation failed', detail: falErr.slice(0, 200) });
  }

  const data = await falRes.json();
  const output_url  = data?.video?.url || data?.images?.[0]?.url || data?.url || null;
  const output_type = (pipeline === 'flux') ? 'image' : 'video';

  // ── 6. Registrar uso en Supabase (non-blocking) ───────────
  if (userId && accessToken) {
    recordUsage(userId, pipeline, category, accessToken, SUPABASE_KEY);
  }

  return res.status(200).json({
    success: true,
    output_url,
    output_type,
    pipeline: pipe.name,
    category,
    cost_estimate: pipe.cost,
    membership_tier,
  });
}
