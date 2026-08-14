// ============================================================
// PureLife Wellness Club — Content Creator Agent
// api/generate-content.js · JRMB Food Network LLC
//
// Agente 1 of 3 planned automation agents. Generates topic-based
// content adapted for Instagram, TikTok, X/Twitter and LinkedIn in
// one call, via Gemini's free-tier text model — same pattern as
// analyze-label.js and generate-video-script.js.
// ============================================================

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const LANG_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
  it: 'Italian',
};

const PLATFORM_LIMITS = {
  instagram: 2200,
  tiktok: 2200,
  twitter: 280,
  linkedin: 3000,
};

function buildPrompt(topic, contentType, tone, langName) {
  return `You are the Content Creator Agent for PureLife Wellness Club, a wellness/nutrition brand fronted by an AI coach persona called Dr. Smoothie. Write social media copy about: "${topic}".

Content type: ${contentType} (promotional, educational, or motivational — infer style accordingly).
Tone: ${tone}.
Write everything in ${langName}.

Produce ready-to-post copy for 4 platforms, each respecting that platform's conventions:
- Instagram: warm, uses emojis naturally, can include a short bullet list of benefits, ends with a soft call to action.
- TikTok: punchy hook in the first line, casual, energetic, short sentences.
- Twitter/X: concise, under 280 characters total including hashtags, one clear idea.
- LinkedIn: more professional register, focuses on the wellness-business angle (e.g. workplace wellness, habit-building), no excessive emojis.

Respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "variants": {
    "instagram": "full post text",
    "tiktok": "full post text / video caption",
    "twitter": "full post text, must fit in 280 characters including hashtags",
    "linkedin": "full post text"
  }
}

Hashtags: 5 relevant hashtags, no # symbol included (add it yourself when displaying), lowercase, no spaces.`;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://purelifewellnessclub.org', 'https://www.purelifewellnessclub.org', 'http://localhost:5173', 'http://localhost:3000'];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Content agent not configured' });

  const { topic = '', contentType = 'promocional', tone = 'profesional', lang = 'en' } = req.body || {};
  if (!topic || !topic.trim()) return res.status(400).json({ error: 'Missing topic' });
  if (topic.length > 300) return res.status(400).json({ error: 'Topic too long' });

  const langName = LANG_NAMES[lang] || LANG_NAMES.en;

  async function callGemini() {
    return fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(topic.trim(), contentType, tone, langName) }] }],
        generationConfig: { temperature: 0.85 },
      }),
    });
  }

  try {
    // Gemini a veces devuelve 503 "high demand" de forma intermitente
    // (problema conocido y documentado del lado de Google, no nuestro).
    // Reintentamos una vez con una pequeña espera antes de rendirnos.
    let geminiRes = await callGemini();
    if (geminiRes.status === 503) {
      await new Promise((r) => setTimeout(r, 1500));
      geminiRes = await callGemini();
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[generate-content] Gemini error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'rate_limited', detail: 'Free tier quota reached, try again shortly.' });
      }
      if (geminiRes.status === 503) {
        return res.status(503).json({ error: 'high_demand', detail: 'Gemini is at high demand right now, try again in a moment.' });
      }
      return res.status(502).json({ error: 'Content generation failed', detail: errText.slice(0, 300) });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[generate-content] Failed to parse JSON:', cleaned.slice(0, 500));
      return res.status(502).json({ error: 'Could not parse content result' });
    }

    if (!parsed.variants || Object.keys(parsed.variants).length === 0) {
      return res.status(502).json({ error: 'Incomplete content generated, try again' });
    }

    // Recorte defensivo por si el modelo se pasa del límite de algún canal
    for (const platform of Object.keys(parsed.variants)) {
      const limit = PLATFORM_LIMITS[platform];
      if (limit && parsed.variants[platform]?.length > limit) {
        parsed.variants[platform] = parsed.variants[platform].slice(0, limit);
      }
    }

    return res.status(200).json({ success: true, ...parsed });
  } catch (e) {
    console.error('[generate-content] Unexpected error:', e);
    return res.status(500).json({ error: 'Unexpected error generating content' });
  }
}
