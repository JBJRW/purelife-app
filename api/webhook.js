import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false, // Required for Stripe signature verification
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, plan } = session.metadata;

        if (!userId) break;

        // Update user tier to founding_member
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            membership_tier: 'founding_member',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            membership_start: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        // Increment founding member counter
        const { error: counterError } = await supabase.rpc(
          'increment_founding_members'
        );

        if (counterError) {
          console.error('Counter increment error:', counterError);
        }

        console.log(`✅ Founding member activated: ${userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await supabase
          .from('profiles')
          .update({
            membership_tier: 'seed',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        console.log(`⚠️ Subscription cancelled for: ${userId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.error(`❌ Payment failed for customer: ${invoice.customer}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
