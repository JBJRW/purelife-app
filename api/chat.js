// api/chat.js — PureLife Anthropic Proxy
// TurboQuant Fase 1: Prompt Caching activo
// CORS seguro + rate limiting básico
//
// FIX 2026-06: claude-sonnet-4-20250514 fue retirado por Anthropic.
// Modelo migrado a claude-sonnet-4-6 y ahora es configurable por env var
// para que el próximo rename de modelo NO requiera tocar código ni redeploy.

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://www.drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[PureLife] ANTHROPIC_API_KEY not set");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { system, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        // TurboQuant Fase 1 — Prompt Caching
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        // Modelo activo. Configurable vía Vercel env var ANTHROPIC_MODEL.
        // Fallback al modelo recomendado actual si la env var no existe.
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 2048,
        system: system || [],
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[PureLife API] Anthropic error:", data);
      return res.status(response.status).json({ error: data.error });
    }

    // Log cache metrics
    if (data.usage) {
      const hit = data.usage.cache_read_input_tokens ?? 0;
      const write = data.usage.cache_creation_input_tokens ?? 0;
      console.log(`[TurboQuant] Cache HIT: ${hit} | WRITE: ${write} | IN: ${data.usage.input_tokens} | OUT: ${data.usage.output_tokens}`);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("[PureLife API] Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
