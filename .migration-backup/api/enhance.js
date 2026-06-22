// ============================================================
// PureLife — Enhance API v1.0
// api/enhance.js · JRMB Food Network LLC
// Upscaling 4K (ESRGAN) + Animación (Stable Video Diffusion)
// ============================================================

const FAL_API      = 'https://fal.run';
const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';

const CORS_ORIGINS = [
  'https://purelifewellnessclub.org',
  'https://www.purelifewellnessclub.org',
  'http://localhost:5173',
  'http://localhost:3000',
];

const ENHANCE_TIERS = {
  upscale: ['seed', 'bloom', 'canopy'],
  animate: ['bloom', 'canopy'],
};

async function getTier(userId, accessToken, key) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=membership_tier`,
      { headers: { apikey: key, Authorization: `Bearer ${accessToken}` } }
    );
    const d = await r.json();
    return d?.[0]?.membership_tier || 'free';
  } catch { return 'free'; }
}

export default async function handler(req, res) {
  const origin     = req.headers.origin || '';
  const corsOrigin = CORS_ORIGINS.includes(origin) ? origin : CORS_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const FAL_KEY      = process.env.FAL_KEY;
  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
  if (!FAL_KEY) return res.status(500).json({ error: 'Service not configured' });

  const { action, image_url, userId, accessToken } = req.body || {};

  if (!image_url) return res.status(400).json({ error: 'image_url required' });
  if (!['upscale', 'animate'].includes(action))
    return res.status(400).json({ error: 'action must be upscale or animate' });

  const tier = (userId && accessToken)
    ? await getTier(userId, accessToken, SUPABASE_KEY)
    : 'free';

  if (!ENHANCE_TIERS[action]?.includes(tier)) {
    return res.status(403).json({
      error: 'upgrade_required',
      action,
      required_tier: action === 'animate' ? 'bloom' : 'seed',
      current_tier: tier,
    });
  }

  let endpoint, payload;
  if (action === 'upscale') {
    endpoint = `${FAL_API}/fal-ai/esrgan`;
    payload  = { image_url, scale: 4, face_enhance: false };
  } else {
    endpoint = `${FAL_API}/fal-ai/stable-video-diffusion`;
    payload  = { image_url, fps: 7, motion_bucket_id: 127, cond_aug: 0.02, frames: 25, decode_chunk_size: 8 };
  }

  try {
    const falRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      console.error(`[enhance/${action}] fal.ai error:`, err);
      return res.status(502).json({ error: 'Enhancement failed', detail: err.slice(0, 200) });
    }

    const data = await falRes.json();

    if (action === 'upscale') {
      const output_url = data?.image?.url || data?.output?.url || data?.output || null;
      return res.status(200).json({ success: true, action: 'upscale', output_url, output_type: 'image', scale: '4K', cost_estimate: '~$0.02' });
    } else {
      const output_url = data?.video?.url || data?.output?.url || data?.output || null;
      return res.status(200).json({ success: true, action: 'animate', output_url, output_type: 'video', cost_estimate: '~$0.10' });
    }
  } catch (err) {
    console.error('[enhance] Error:', err.message);
    return res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
