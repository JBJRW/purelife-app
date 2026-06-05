// api/stripe-checkout.js — PureLife Stripe Checkout Session
// JRMB Food Network LLC — purelifewellnessclub.org

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_ID = process.env.STRIPE_PRICE_ID || "price_placeholder";

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
    const { email, name, successUrl, cancelUrl } = req.body;

    const baseUrl = origin || "https://purelife-app-umber.vercel.app";
    const success = successUrl || `${baseUrl}/?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancel  = cancelUrl  || `${baseUrl}/?canceled=true`;

    // Create Stripe Checkout Session via API
    const params = new URLSearchParams({
      "mode": "subscription",
      "line_items[0][price]": PRICE_ID,
      "line_items[0][quantity]": "1",
      "success_url": success,
      "cancel_url": cancel,
      "allow_promotion_codes": "true",
      "billing_address_collection": "auto",
    });

    if (email) params.append("customer_email", email);
    if (name)  params.append("custom_text[submit][message]", `Bienvenido ${name} a PureLife Wellness Club`);

    // Metadata
    params.append("metadata[product_id]", "prod_UUafixHlc51vo8");
    params.append("metadata[plan]", "annual_182");
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
