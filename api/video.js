// ============================================================
// PureLife Wellness Club — Video Agent
// api/video.js · JRMB Food Network LLC
// ============================================================

const FAL_API = 'https://fal.run';

const PIPELINES = {
  veo3:  { id: 'fal-ai/veo3/fast',                           name: 'Veo3 Fast',    cost: '~$2',    quality: 'premium',    duration: 8 },
  flux:  { id: 'fal-ai/flux-pro/v1.1',                       name: 'Flux Pro',     cost: '~$0.30', quality: 'standard',   duration: 4 },
  kling: { id: 'fal-ai/kling-video/v2.6/pro/image-to-video', name: 'Kling v2.6',   cost: '~$0.50', quality: 'cinematic',  duration: 5 },
};

const CATEGORIES = {
  smoothie:   { en: 'Fresh colorful smoothie being blended, tropical fruits, vibrant colors, wellness lifestyle',          es: 'Batido colorido siendo mezclado, frutas tropicales, colores vibrantes, estilo de vida saludable' },
  meditation: { en: 'Person meditating in nature, golden hour light, peaceful, serene, wellness and balance',              es: 'Persona meditando en la naturaleza, luz dorada, paz, serenidad, bienestar' },
  nutrition:  { en: 'Colorful healthy meal preparation, fresh vegetables, superfoods, clean eating aesthetic',             es: 'Preparación de comida saludable colorida, verduras frescas, superalimentos' },
  fitness:    { en: 'Person doing yoga outdoors, morning light, energetic, healthy lifestyle',                              es: 'Persona haciendo yoga al aire libre, luz matutina, energético, vida saludable' },
  sleep:      { en: 'Peaceful sleep environment, soft moonlight, lavender, calm atmosphere, recovery',                     es: 'Ambiente de sueño tranquilo, luz de luna suave, lavanda, recuperación' },
  hydration:  { en: 'Crystal clear water with cucumber and lemon, detox drink, refreshing, clean wellness',                es: 'Agua cristalina con pepino y limón, bebida detox, refrescante' },
  herbs:      { en: 'Colorful superfoods and medicinal herbs, spirulina, turmeric, ginger, natural wellness',              es: 'Superalimentos y hierbas medicinales, espirulina, cúrcuma, jengibre' },
  community:  { en: 'Group of healthy happy people sharing a wellness meal, positive energy, community',                   es: 'Grupo de personas saludables compartiendo comida wellness, energía positiva' },
};

const TIER_ACCESS = {
  seed:   ['flux'],
  bloom:  ['flux', 'kling'],
  canopy: ['flux', 'kling', 'veo3'],
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://purelifewellnessclub.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: 'Video service not configured' });

  const { category = 'smoothie', pipeline = 'flux', lang = 'en', membership_tier = 'seed', custom_prompt = null } = req.body;

  const allowed = TIER_ACCESS[membership_tier] || ['flux'];
  if (!allowed.includes(pipeline)) {
    return res.status(403).json({ error: 'upgrade_required', upgrade_to: pipeline === 'veo3' ? 'canopy' : 'bloom' });
  }

  const cat = CATEGORIES[category] || CATEGORIES.smoothie;
  const prompt = custom_prompt || (lang === 'es' ? cat.es : cat.en);
  const pipe = PIPELINES[pipeline];

  let payload = {};
  if (pipeline === 'veo3')  payload = { prompt, duration: pipe.duration, aspect_ratio: '16:9' };
  if (pipeline === 'flux')  payload = { prompt, num_inference_steps: 28, guidance_scale: 3.5, num_images: 1 };
  if (pipeline === 'kling') payload = { prompt, duration: pipe.duration, aspect_ratio: '16:9', cfg_scale: 0.5 };

  const falRes = await fetch(`${FAL_API}/${pipe.id}`, {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!falRes.ok) return res.status(502).json({ error: 'Generation failed' });

  const data = await falRes.json();
  const output_url = data?.video?.url || data?.images?.[0]?.url || data?.url || null;
  const output_type = (pipeline === 'flux') ? 'image' : 'video';

  return res.status(200).json({ success: true, output_url, output_type, pipeline: pipe.name, category, cost_estimate: pipe.cost, membership_tier });
}
