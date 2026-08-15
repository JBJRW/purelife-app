// api/stripe-checkout.js — PureLife Stripe Checkout
// JRMB Food Network LLC — purelifewellnessclub.org
//
// El programa "primeros 100 Founding Members gratis" quedó
// descontinuado (decisión de negocio, agosto 2026). Además, esa rama
// dependía de una tabla `subscribers` que nunca existió en Supabase,
// lo cual causaba que TODAS las peticiones cayeran en la rama "gratis"
// (currentCount siempre 0 por error) y el checkout de pago real nunca
// se ejecutaba — es decir, nadie podía pagar por esta vía desde que
// se desplegó. Este endpoint ahora siempre crea una sesión de pago real.
//
// Acepta un `priceId` opcional (Seed/Bloom/Canopy, planes mensuales
// reales creados en Stripe en agosto 2026) para cobrar el plan que el
// usuario eligió en PlansScreen. Si no llega priceId (ej. el flujo de
// /join en la landing, que no elige plan), cae al plan anual histórico
// como default.

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const ANNUAL_PRICE_ID = process.env.STRIPE_PRICE_ID_ANNUAL || "price_1TVbUd2d05WpkcPe9HUVy3eK";

// Planes mensuales reales (creados en Stripe agosto 2026). Whitelist —
// nunca se acepta un priceId arbitrario del cliente sin validar.
const TIER_PRICES = {
  seed:   "price_1U4YMb2d05WpkcPecWbOfHH1",
  bloom:  "price_1U4YMc2d05WpkcPeqtKpCBQG",
  canopy: "price_1U4YMc2d05WpkcPeybHCxVaJ",
};

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
    const { email, name, tier, userId } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email requerido" });

    // Solo aceptamos un priceId si viene de nuestra whitelist por tier;
    // nunca confiamos en un priceId arbitrario enviado por el cliente.
    const resolvedTier = TIER_PRICES[tier] ? tier : null;
    const priceId = resolvedTier ? TIER_PRICES[resolvedTier] : ANNUAL_PRICE_ID;

    const baseUrl = origin || "https://purelifewellnessclub.org";

    const params = new URLSearchParams({
      "mode": "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${baseUrl}/join`,
      "allow_promotion_codes": "true",
      "billing_address_collection": "auto",
    });

    params.append("customer_email", email);
    if (name) params.append("custom_text[submit][message]", `Bienvenido ${name} a PureLife Wellness Club`);
    if (userId) {
      params.append("client_reference_id", userId);
      params.append("metadata[userId]", userId);
    }

    params.append("metadata[plan]", resolvedTier || "annual_182");
    params.append("metadata[platform]", "purelifewellnessclub.org");

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
    return res.status(200).json({ url: session.url, sessionId: session.id });

  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
