// ═══════════════════════════════════════════════════════════════
// HERMES v2 — Agente Orquestador Central de PureLife
// api/hermes.js
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

const TIER_CONFIG = {
  free:   { label: 'Free 🌿',    chatLimit: 3,   videoAccess: false, communityCreate: false },
  seed:   { label: 'Seed 🌱',   chatLimit: 5,   videoAccess: false, communityCreate: false },
  bloom:  { label: 'Bloom 🌸',  chatLimit: 50,  videoAccess: true,  communityCreate: false },
  canopy: { label: 'Canopy 🌿', chatLimit: 999, videoAccess: true,  communityCreate: true  },
};

function buildWelcomeMessage(name, tier) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const msgs = {
    free:   `${greeting}, ${name}! 🌿 Tienes 3 consultas gratuitas. ¡Comienza tu journey!`,
    seed:   `${greeting}, ${name}! 🌱 Plan Seed activo — Dr. Smoothie está listo para ti.`,
    bloom:  `${greeting}, ${name}! 🌸 Plan Bloom activo. Video Agent y 50 consultas disponibles.`,
    canopy: `${greeting}, ${name}! 🌿 Acceso Canopy total — todo desbloqueado, sin límites.`,
  };
  return msgs[tier] || msgs.free;
}

function buildUpsell(tier, chatCount, triedVideo) {
  if ((tier === 'free' || tier === 'seed') && chatCount >= 3) {
    return { show: true, message: '🔥 Estás enganchado! Bloom te da 50 consultas/mes por $12.99.', targetPlan: 'bloom', urgency: 'high' };
  }
  if ((tier === 'free' || tier === 'seed') && triedVideo) {
    return { show: true, message: '🎥 Desbloquea el Video Agent con Bloom — $12.99/mes.', targetPlan: 'bloom', urgency: 'high' };
  }
  if (tier === 'bloom') {
    return { show: true, message: '🌿 Canopy: consultas ilimitadas + grupos Community.', targetPlan: 'canopy', urgency: 'low' };
  }
  return { show: false };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || ''; const allowed = ['https://purelifewellnessclub.org','https://www.purelifewellnessclub.org','http://localhost:5173','http://localhost:3000']; const corsOrigin = allowed.includes(origin) ? origin : allowed[0]; res.setHeader('Access-Control-Allow-Origin', corsOrigin); res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, accessToken } = req.body;
    if (!userId || !accessToken) {
      return res.status(400).json({ error: 'userId and accessToken required' });
    }

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // 1. Leer perfil real
    let profile = null;
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, { headers });
      if (r.ok) {
        const rows = await r.json();
        profile = rows[0] || null;
      }
    } catch (_) {}

    // 2. Leer usage_logs
    let chatCount = 0, triedVideo = false, triedCommunityCreate = false, daysActive = 0;
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/usage_logs?user_id=eq.${userId}&select=action,created_at&order=created_at.desc&limit=200`,
        { headers }
      );
      if (r.ok) {
        const logs = await r.json();
        if (Array.isArray(logs)) {
          chatCount = logs.filter(l => l.action === 'chat').length;
          triedVideo = logs.some(l => l.action === 'video');
          triedCommunityCreate = logs.some(l => l.action === 'community_create');
          daysActive = new Set(logs.map(l => l.created_at?.split('T')[0])).size;
        }
      }
    } catch (_) {}

    // 3. Determinar tier y nombre
    const tier = profile?.tier || 'free';
    const name = profile?.full_name || profile?.name || profile?.username || 'Wellness Member';
    const config = TIER_CONFIG[tier] || TIER_CONFIG.free;

    // 4. Construir contexto HERMES
    const hermes = {
      userId,
      name,
      tier,
      tierLabel: config.label,
      permissions: {
        chatLimit: config.chatLimit,
        chatUsed: chatCount,
        chatRemaining: Math.max(0, config.chatLimit - chatCount),
        videoAccess: config.videoAccess,
        communityCreate: config.communityCreate,
      },
      welcomeMessage: buildWelcomeMessage(name, tier),
      upsell: buildUpsell(tier, chatCount, triedVideo),
      stats: { chatCount, daysActive },
      suggestedAction: chatCount === 0
        ? { type: 'chat', message: '¡Hazle tu primera pregunta a Dr. Smoothie!', tab: 'chat' }
        : config.videoAccess
        ? { type: 'video', message: 'Genera tu video wellness del día', tab: 'video' }
        : { type: 'chat', message: 'Continúa con Dr. Smoothie', tab: 'chat' },
    };

    return res.status(200).json({ success: true, hermes });

  } catch (error) {
    console.error('[HERMES] Error:', error);
    return res.status(500).json({ error: 'HERMES error', details: error.message });
  }
}
