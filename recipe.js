// ================================================================
// PureLife Wellness Club — Recipe Generator API
// api/recipe.js · JRMB Food Network LLC
//
// Motor: GPT-4o (OpenAI) — genera recetas estructuradas en JSON
// Claude ya maneja el chat en api/chat.js
// Cada uno hace lo que mejor sabe: Claude conversa, GPT-4o estructura
// ================================================================

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const LANG_NAMES = {
  en: "English", es: "Spanish", fr: "French",
  pt: "Portuguese", it: "Italian", de: "German",
};

const SYSTEM_PROMPT = `You are a precision nutritional recipe engine for Dr. Smoothie AI (PureLife Wellness Club).
Your ONLY job is to output valid JSON — no prose, no markdown, no explanation.

Generate a smoothie or functional juice recipe in this EXACT format:
{
  "name": "Recipe Name with Emoji",
  "tagline": "Short benefit (max 8 words)",
  "ingredients": [
    {"name": "Ingredient", "amount": "1 cup (240ml)", "emoji": "🥬", "benefit": "Short benefit"}
  ],
  "instructions": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "macros": {
    "calories": 180,
    "protein": 4,
    "carbs": 32,
    "fat": 3,
    "fiber": 6
  },
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "bestTime": "Morning on empty stomach",
  "servings": 1,
  "prepTime": "5 minutes",
  "difficulty": "Easy"
}

Rules:
- ONLY valid JSON, nothing else
- 5-8 ingredients minimum
- macros are real nutritional estimates (not percentages)
- Benefits must be specific and evidence-based
- Emoji must be the actual food emoji for each ingredient
- Respond in the language specified`;

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────
  const origin = req.headers.origin || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "Recipe engine not configured" });

  try {
    const {
      goal = "",
      ingredients = [],
      restrictions = [],
      lang = "en",
    } = req.body || {};

    if (!goal.trim()) {
      return res.status(400).json({ error: "goal is required" });
    }

    // Construir prompt
    const langName = LANG_NAMES[lang] || "English";
    const parts = [`Health goal: ${goal}`];
    if (ingredients.length > 0) parts.push(`Available ingredients: ${ingredients.join(", ")}`);
    if (restrictions.length > 0) parts.push(`Dietary restrictions: ${restrictions.join(", ")}`);
    parts.push(`Respond in: ${langName}`);
    const userPrompt = parts.join("\n");

    // Llamada a GPT-4o
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      console.error("[recipe] OpenAI error:", openaiRes.status, err);
      return res.status(openaiRes.status).json({
        error: err.error?.message || "OpenAI error",
      });
    }

    const data = await openaiRes.json();
    const raw = data.choices?.[0]?.message?.content || "";

    let recipe;
    try {
      recipe = JSON.parse(raw);
    } catch {
      console.error("[recipe] JSON parse failed:", raw.slice(0, 300));
      return res.status(502).json({ error: "Could not parse recipe result" });
    }

    return res.status(200).json({
      recipe,
      engine: "gpt-4o",
      tokens_used: data.usage?.total_tokens || 0,
    });

  } catch (err) {
    console.error("[recipe] Unexpected error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
