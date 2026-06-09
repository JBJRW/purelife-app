// ═══════════════════════════════════════════════════════════════
// HERMES — Agente Orquestador Central de PureLife Wellness Club
// api/hermes.js — Vercel Serverless Function
// Misión: BRIDGE + GUARD + GUIDE
// ═══════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://efatctcxlcotsgxhmgjg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Tier permissions map
const TIER_CONFIG = {
  seed:   { label: 'Seed 🌱',   chatLimit: 5,   videoAccess: false, communityCreate: false },
  bloom:  { label: 'Bloom 🌸',  chatLimit: 50,  videoAccess: true,  communityCreate: false },
  canopy: { label: 'Canopy 🌿', chatLimit: 999, videoAccess: true,  communityCreate: true  },
  free:   { label: 'Free',      chatLimit: 3,   videoAccess: false, communityCreate: false },
};

// HERMES — mensaje de bienvenida personalizado por tier
function buildWelcomeMessage(name, tier, stats) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const config = TIER_CONFIG[tier] || TIER_CONFIG.free;

  const messages = {
    seed: `${greeting}, ${name}! 🌱 Con tu plan Seed tienes ${config.chatLimit} consultas/mes. Úsalas sabiamente — Dr. Smoothie está listo para ti.`,
    bloom: `${greeting}, ${name}! 🌸 Plan Bloom activo. Tienes acceso completo al Video Agent y ${config.chatLimit} consultas este mes.`,
    canopy: `${greeting}, ${name}! 🌿 Acceso Canopy total. Todo desbloqueado — consultas ilimitadas, Video Agent, y creación de grupos en Community.`,
    free: `${greeting}, ${name}! 🌿 Bienvenido a PureLife. Tienes ${config.chatLimit} consultas gratuitas. ¡Upgradea para desbloquear todo!`,
  };

  return messages[tier] || messages.free;
}

// HERMES — detecta si el usuario debe ver un upsell
function buildUpsellSignal(tier, stats) {
  if (tier === 'seed' && stats.chatCount >= 3) {
    return {
      show: true,
      message: '¡Estás usando mucho Dr. Smoothie! 🔥 Bloom te da 50 consultas/mes por $12.99.',
      targetPlan: 'bloom',
      urgency: 'medium',
    };
  }
  if (tier === 'seed' && stats.triedVideoAgent) {
    return {
      show: true,
      message: '🎥 El Video Agent es increíble — desbloquéalo con Bloom.',
      targetPlan: 'bloom',
      urgency: 'high',
    };
  }
  if (tier === 'bloom' && stats.triedCommunityCreate) {
    return {
      show: true,
      message: '🌿 Crea tus propios grupos en Community con Canopy.',
      targetPlan: 'canopy',
      urgency: 'low',
    };
  }
  return { show: false };
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://purelifewellnessclub.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userId, accessToken } = req.body;

    if (!userId || !accessToken) {
      return res.status(400).json({ error: 'userId and accessToken required' });
    }

    // 1. Leer perfil del usuario desde Supabase
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let profile = null;
    if (profileRes.ok) {
      const profiles = await profileRes.json();
      profile = profiles[0] || null;
    }

    // 2. Leer stats de uso (tabla usage_logs si existe, si no defaults)
    let stats = { chatCount: 0, triedVideoAgent: false, triedCommunityCreate: false, daysActive: 0 };
    
    try {
      const statsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/usage_logs?user_id=eq.${userId}&select=*&order=created_at.desc&limit=100`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (statsRes.ok) {
        const logs = await statsRes.json();
        if (Array.isArray(logs)) {
          stats.chatCount = logs.filter(l => l.action === 'chat').length;
          stats.triedVideoAgent = logs.some(l => l.action === 'video');
          stats.triedCommunityCreate = logs.some(l => l.action === 'community_create');
          const days = new Set(logs.map(l => l.created_at?.split('T')[0]));
          stats.daysActive = days.size;
        }
      }
    } catch (_) {
      // usage_logs puede no existir aún — usamos defaults
    }

    // 3. Determinar tier real
    const tier = profile?.tier || profile?.subscription_tier || profile?.plan || 'free';
    const name = profile?.full_name || profile?.name || profile?.username || 'Wellness Member';
    const config = TIER_CONFIG[tier] || TIER_CONFIG.free;

    // 4. Construir respuesta HERMES
    const hermesContext = {
      // Identidad
      userId,
      name,
      tier,
      tierLabel: config.label,

      // Permisos
      permissions: {
        chatLimit: config.chatLimit,
        chatUsed: stats.chatCount,
        chatRemaining: Math.max(0, config.chatLimit - stats.chatCount),
        videoAccess: config.videoAccess,
        communityCreate: config.communityCreate,
      },

      // Personalización
      welcomeMessage: buildWelcomeMessage(name, tier, stats),
      upsell: buildUpsellSignal(tier, stats),

      // Stats reales
      stats: {
        chatCount: stats.chatCount,
        daysActive: stats.daysActive,
      },

      // Recomendación de primer paso
      suggestedAction: stats.chatCount === 0
        ? { type: 'chat', message: '¡Hazle tu primera pregunta a Dr. Smoothie!', tab: 'chat' }
        : config.videoAccess
        ? { type: 'video', message: 'Genera tu video wellness del día', tab: 'video' }
        : { type: 'chat', message: 'Continúa tu consulta con Dr. Smoothie', tab: 'chat' },
    };

    return res.status(200).json({ success: true, hermes: hermesContext });

  } catch (error) {
    console.error('[HERMES] Error:', error);
    return res.status(500).json({ error: 'HERMES internal error', details: error.message });
  }
}
