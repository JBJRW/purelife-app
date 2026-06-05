// api/chat.js — PureLife Dr. Smoothie AI Proxy
// Modelo: claude-sonnet-4-6 | Prompt Caching activo
// JRMB Food Network LLC — purelifewellnessclub.org

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://drsmoothieai.com",
  "https://www.drsmoothieai.com",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = ;

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
    const { message, history = [] } = req.body;
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
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || "Anthropic error" });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "No pude generar una respuesta.";

    return res.status(200).json({
      reply,
      model: MODEL,
      usage: data.usage
    });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
