// api/chat.js — PureLife Dr. Smoothie AI v2
// Con registro de uso en Supabase para HERMES
// Modelo: claude-sonnet-4-6 | JRMB Food Network LLC

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

const SYSTEM_PROMPT = "Eres Dr. Smoothie AI, el asesor de bienestar nutricional de PureLife Wellness Club. Tu mision es motivar, educar e inspirar a las personas a mejorar su salud usando ingredientes naturales. IMPORTANTE: No das diagnosticos medicos ni recetas medicas. Eres una plataforma de motivacion nutricional, no un servicio medico. Siempre recomiendas consultar a un medico para condiciones de salud. Hablas en el idioma del usuario. Eres calido, motivador y basas tus recomendaciones en propiedades nutricionales de ingredientes naturales. Cuando das protocolos siempre incluyes: Recuerda: estas recomendaciones son educativas y motivacionales. Consulta a tu medico antes de cambios importantes en tu alimentacion.";

// Registrar uso en Supabase (fire-and-forget, no bloquea la respuesta)
async function logUsage(userId, accessToken, metadata = {}) {
  if (!userId || !accessToken) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/usage_logs`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        user_id: userId,
        action: 'chat',
        metadata,
      }),
    });
  } catch (_) {
    // No interrumpir el flujo si falla el log
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const { message, history = [], userId, accessToken } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const messages = [
      ...history.slice(-10),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || "Anthropic error" });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "No pude generar una respuesta.";

    // Registrar uso para HERMES (async, no bloquea)
    logUsage(userId, accessToken, { messageLength: message.length });

    return res.status(200).json({ reply, model: MODEL });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
