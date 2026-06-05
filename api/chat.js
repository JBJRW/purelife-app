// api/chat.js — PureLife Anthropic Proxy v2
// Acepta system como string o array. Timeout 30s. CORS seguro.

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { system, messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages required" });
    }

    // Normalizar system: acepta string, array, o undefined
    let systemParam;
    if (!system) {
      systemParam = "Eres Dr. Smoothie AI, asistente de bienestar de PureLife Wellness Club. Responde siempre en el idioma del usuario. Eres experto en nutrición, smoothies y jugos. Nunca das consejos médicos.";
    } else if (typeof system === "string") {
      systemParam = system;
    } else if (Array.isArray(system)) {
      // Extraer solo el texto, ignorar cache_control para máxima compatibilidad
      systemParam = system.map(s => s.text || "").join("\n");
    } else {
      systemParam = String(system);
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemParam,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[PureLife] Anthropic error:", data);
      return res.status(response.status).json({ error: data.error || data });
    }

    console.log(`[PureLife] OK — in:${data.usage?.input_tokens} out:${data.usage?.output_tokens}`);
    return res.status(200).json(data);

  } catch (err) {
    console.error("[PureLife] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
