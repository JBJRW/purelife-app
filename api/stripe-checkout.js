// api/stripe-checkout.js — PureLife Stripe Checkout + 100 Founding Members
// JRMB Food Network LLC — purelifewellnessclub.org

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_ID = process.env.STRIPE_PRICE_ID_ANNUAL || "price_1TVbUd2d05WpkcPe9HUVy3eK";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://efatctcxlcotsgxhmgjg.supabase.co";
const SUPABASE_SRK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FOUNDING_LIMIT = 100;

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "Stripe not configured" });

  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    // Contar founding members actuales
    const supabase = createClient(SUPABASE_URL, SUPABASE_SRK);
    const { count, error: countError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (countError) {
      console.error('Supabase count error:', countError);
    }

    const currentCount = count || 0;
    const isFree = currentCount < FOUNDING_LIMIT;

    // --- FOUNDING MEMBER GRATIS ---
    if (isFree) {
      const position = currentCount + 1;

      const { error: insertError } = await supabase
        .from('subscribers')
        .upsert({
          email,
          status: 'active',
          tier: 'founding_member',
          is_free: true,
          position,
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (insertError && insertError.code !== '23505') {
        console.error('Insert error:', insertError);
      }

      return res.status(200).json({
        free: true,
        position,
        remaining: FOUNDING_LIMIT - position,
        message: `Eres el Founding Member #${position} de PureLife.`
      });
    }

    // --- PAGO DESDE MIEMBRO #101 ---
    const baseUrl = origin || "https://purelifewellnessclub.org";

    const params = new URLSearchParams({
      "mode": "subscription",
      "line_items[0][price]": PRICE_ID,
      "line_items[0][quantity]": "1",
      "success_url": `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${baseUrl}/join`,
      "allow_promotion_codes": "true",
      "billing_address_collection": "auto",
    });

    if (email) params.append("customer_email", email);
    if (name) params.append("custom_text[submit][message]", `Bienvenido ${name} a PureLife Wellness Club`);

    params.append("metadata[plan]", "annual_182");
    params.append("metadata[platform]", "purelifewellnessclub.org");
    params.append("metadata[position]", String(currentCount + 1));

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString()
    });

    if (!stripeRes.ok) {
      const err = await stripeRes.json();
      console.error("Stripe error:", err);
      return res.status(stripeRes.status).json({ error: err.error?.message || "Stripe error" });
    }

    const session = await stripeRes.json();
    return res.status(200).json({ url: session.url, sessionId: session.id, free: false });

  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
