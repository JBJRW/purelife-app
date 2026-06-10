// api/stripe-webhook.js
// PureLife Wellness Club — Stripe Webhook Handler
// Activa membresías en Supabase cuando Stripe confirma un pago

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapa de price IDs → tiers de PureLife
// IMPORTANTE: reemplazar con los Price IDs reales de tu Stripe dashboard
const PRICE_TO_TIER = {
  // Seed $29/mes
  [process.env.STRIPE_PRICE_SEED_MONTHLY]:   { tier: 'seed',   label: 'Seed 🌱',   chatLimit: 5  },
  // Bloom $49/mes
  [process.env.STRIPE_PRICE_BLOOM_MONTHLY]:  { tier: 'bloom',  label: 'Bloom 🌸',  chatLimit: 50 },
  // Canopy $79/mes
  [process.env.STRIPE_PRICE_CANOPY_MONTHLY]: { tier: 'canopy', label: 'Canopy 🌿', chatLimit: 999 },
  // Annual $182/año
  [process.env.STRIPE_PRICE_ANNUAL]:         { tier: 'canopy', label: 'Canopy Annual 🏆', chatLimit: 999 },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET no configurado');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    // Verificar firma de Stripe con el body raw
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Firma inválida:', err.message);
    return res.status(400).json({ error: `Webhook signature invalid: ${err.message}` });
  }

  console.log(`[stripe-webhook] Evento recibido: ${event.type}`);

  try {
    switch (event.type) {

      // ── Suscripción nueva o reactivada ────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) {
          console.warn('[stripe-webhook] checkout.session.completed sin userId en metadata');
          break;
        }

        // Obtener detalles de la suscripción para saber el price
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        const tierInfo = PRICE_TO_TIER[priceId] || { tier: 'seed', label: 'Seed 🌱', chatLimit: 5 };

        // Activar membresía en Supabase
        const { error } = await supabase
          .from('memberships')
          .upsert({
            user_id: userId,
            tier: tierInfo.tier,
            tier_label: tierInfo.label,
            chat_limit: tierInfo.chatLimit,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            status: 'active',
            activated_at: new Date().toISOString(),
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          }, { onConflict: 'user_id' });

        if (error) {
          console.error('[stripe-webhook] Error activando membresía:', error);
          return res.status(500).json({ error: 'DB error activating membership' });
        }

        // Actualizar perfil del usuario con tier
        await supabase
          .from('profiles')
          .update({ tier: tierInfo.tier, updated_at: new Date().toISOString() })
          .eq('id', userId);

        console.log(`[stripe-webhook] ✅ Membresía activada: user=${userId} tier=${tierInfo.tier}`);
        break;
      }

      // ── Pago recurrente exitoso ───────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        const customerId = invoice.customer;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        const tierInfo = PRICE_TO_TIER[priceId];

        if (!tierInfo) break;

        // Renovar membresía — extender fecha de expiración
        const { error } = await supabase
          .from('memberships')
          .update({
            status: 'active',
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) console.error('[stripe-webhook] Error renovando membresía:', error);
        else console.log(`[stripe-webhook] ✅ Membresía renovada: sub=${subscriptionId}`);
        break;
      }

      // ── Suscripción cancelada o expirada ─────────────────────────
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object;
        const subscriptionId = obj.subscription || obj.id;

        if (!subscriptionId) break;

        // Degradar a free
        const { error } = await supabase
          .from('memberships')
          .update({
            tier: 'free',
            tier_label: 'Free 🌿',
            chat_limit: 3,
            status: event.type === 'invoice.payment_failed' ? 'past_due' : 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        if (error) console.error('[stripe-webhook] Error cancelando membresía:', error);
        else console.log(`[stripe-webhook] ⚠️ Membresía degradada: sub=${subscriptionId} (${event.type})`);
        break;
      }

      // ── Suscripción pausada ───────────────────────────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status; // active | past_due | canceled | paused

        if (status === 'active') {
          const priceId = subscription.items.data[0]?.price?.id;
          const tierInfo = PRICE_TO_TIER[priceId];
          if (!tierInfo) break;

          await supabase
            .from('memberships')
            .update({
              tier: tierInfo.tier,
              tier_label: tierInfo.label,
              chat_limit: tierInfo.chatLimit,
              status: 'active',
              expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      default:
        console.log(`[stripe-webhook] Evento ignorado: ${event.type}`);
    }

    return res.status(200).json({ received: true, type: event.type });

  } catch (err) {
    console.error('[stripe-webhook] Error procesando evento:', err);
    return res.status(500).json({ error: 'Internal error processing webhook' });
  }
}

// Helper: leer body raw para verificación de firma Stripe
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
