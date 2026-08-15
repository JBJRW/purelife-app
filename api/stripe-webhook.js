// api/stripe-webhook.js
// PureLife Wellness Club — Stripe Webhook Handler (HTTP nativo, sin SDK)
// Activa/renueva/cancela membresías en Supabase cuando Stripe confirma pagos

import crypto from 'crypto';

const SB_URL  = process.env.VITE_SUPABASE_URL  || 'https://slcvymfgcpoafjufaplx.supabase.co';
const SB_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org',
  'https://www.purelifewellnessclub.org',
];

// Mapa Price IDs → tiers de PureLife
// FIX (ago 2026): antes las claves de este objeto eran
// process.env.STRIPE_PRICE_SEED_MONTHLY etc., pero esas variables nunca
// se configuraron en Vercel. Una clave computada con valor undefined se
// convierte en la clave literal "undefined" en JS, así que las 4 entradas
// colapsaban en una sola y cualquier pago exitoso caía siempre en el
// tier por defecto (Seed), sin importar lo que se hubiera pagado.
// Ahora se usan directamente los price IDs reales creados en Stripe.
const PRICE_TO_TIER = {
  'price_1U4YMb2d05WpkcPecWbOfHH1': { tier: 'seed',   chatLimit: 5,   label: 'Seed 🌱'   },
  'price_1U4YMc2d05WpkcPeqtKpCBQG': { tier: 'bloom',  chatLimit: 50,  label: 'Bloom 🌸'  },
  'price_1U4YMc2d05WpkcPeybHCxVaJ': { tier: 'canopy', chatLimit: 999, label: 'Canopy 🌿' },
  'price_1TVbUd2d05WpkcPe9HUVy3eK': { tier: 'canopy', chatLimit: 999, label: 'Annual 🏆' },
};

// ── Supabase helper ──────────────────────────────────────────────────────────
async function sbUpsert(table, row, conflict = 'user_id') {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?on_conflict=${conflict}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
  });
  return res.ok;
}

async function sbUpdate(table, filter, row) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(row),
  });
  return res.ok;
}

// ── Stripe API helper ────────────────────────────────────────────────────────
async function getSubscription(subId) {
  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  });
  return res.ok ? res.json() : null;
}

// ── Verificar firma Stripe (HMAC-SHA256) ─────────────────────────────────────
function verifyStripeSignature(rawBody, signature, secret) {
  try {
    const parts = signature.split(',').reduce((acc, part) => {
      const [k, v] = part.split('=');
      acc[k] = v;
      return acc;
    }, {});
    const payload = `${parts.t}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1 || ''));
  } catch {
    return false;
  }
}

// ── Handler principal ────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !SB_KEY) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  // Leer raw body
  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const signature = req.headers['stripe-signature'] || '';
  if (!verifyStripeSignature(rawBody, signature, webhookSecret)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return res.status(400).json({ error: 'Invalid JSON' }); }

  console.log(`[stripe-webhook] ${event.type}`);

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId  = session.metadata?.userId || session.client_reference_id;
        if (!userId) break;

        const sub     = await getSubscription(session.subscription);
        if (!sub) break;

        const priceId   = sub.items?.data?.[0]?.price?.id;
        const tierInfo  = PRICE_TO_TIER[priceId] || { tier: 'seed', chatLimit: 5, label: 'Seed 🌱' };
        const expiresAt = new Date(sub.current_period_end * 1000).toISOString();

        await sbUpsert('memberships', {
          user_id: userId,
          tier: tierInfo.tier,
          tier_label: tierInfo.label,
          chat_limit: tierInfo.chatLimit,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          stripe_price_id: priceId,
          status: 'active',
          activated_at: new Date().toISOString(),
          expires_at: expiresAt,
        });
        await sbUpdate('profiles', `id=eq.${userId}`, {
          membership_tier: tierInfo.tier,
          updated_at: new Date().toISOString(),
        });
        console.log(`[stripe-webhook] ✅ Activado: ${userId} → ${tierInfo.tier}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if (!invoice.subscription) break;
        const sub = await getSubscription(invoice.subscription);
        if (!sub) break;
        const priceId = sub.items?.data?.[0]?.price?.id;
        if (!PRICE_TO_TIER[priceId]) break;

        await sbUpdate('memberships', `stripe_subscription_id=eq.${invoice.subscription}`, {
          status: 'active',
          expires_at: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        });
        console.log(`[stripe-webhook] ✅ Renovado: ${invoice.subscription}`);
        break;
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj   = event.data.object;
        const subId = obj.subscription || obj.id;
        if (!subId) break;

        await sbUpdate('memberships', `stripe_subscription_id=eq.${subId}`, {
          tier: 'free', tier_label: 'Free 🌿', chat_limit: 3,
          status: event.type === 'invoice.payment_failed' ? 'past_due' : 'cancelled',
          updated_at: new Date().toISOString(),
        });
        console.log(`[stripe-webhook] ⚠️ Degradado: ${subId}`);
        break;
      }

      default:
        console.log(`[stripe-webhook] Ignorado: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('[stripe-webhook] Error:', err.message);
    return res.status(500).json({ error: 'Processing error' });
  }
}
