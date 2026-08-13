// ============================================================
// PureLife Wellness Club — Nutrition Label Scanner API
// api/analyze-label.js · JRMB Food Network LLC
//
// Uses Gemini's free-tier vision model (no billing required) to
// read a photo of a nutrition facts label and extract structured
// data in the user's selected language.
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

function buildPrompt(langName) {
  return `You are a nutrition label reader for a wellness app. Look at the attached photo of a food product's nutrition facts label and/or ingredients list. Extract the information and respond in ${langName}.

Respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "product_name": "string or null if not visible",
  "serving_size": "string or null",
  "calories": "string (e.g. '150 kcal') or null",
  "protein": "string (e.g. '5g') or null",
  "carbs": "string or null",
  "fat": "string or null",
  "fiber": "string or null",
  "sugar": "string or null",
  "sodium": "string or null",
  "ingredients": ["ingredient 1", "ingredient 2"] or [],
  "allergens": ["allergen 1"] or [],
  "health_score": 1-10 integer (1=very unhealthy/ultra-processed, 10=whole/minimally processed food),
  "recommendation": "one short warm sentence in ${langName}, in the voice of a friendly wellness coach called Dr. Smoothie, giving practical advice about this product"
}

If the image is not readable as a nutrition label at all, set "product_name" to null and "recommendation" to a short message (in ${langName}) explaining the photo couldn't be read clearly and to try again with better lighting.`;
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
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Label scanner not configured' });

  const { image_base64 = null, mime_type = 'image/jpeg', lang = 'en' } = req.body || {};
  if (!image_base64) return res.status(400).json({ error: 'Missing image_base64' });

  const langName = LANG_NAMES[lang] || LANG_NAMES.en;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: buildPrompt(langName) },
            { inline_data: { mime_type, data: image_base64 } },
          ],
        }],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[analyze-label] Gemini error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'rate_limited', detail: 'Free tier quota reached, try again shortly.' });
      }
      return res.status(502).json({ error: 'Analysis failed', detail: errText.slice(0, 300) });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[analyze-label] Failed to parse JSON:', cleaned.slice(0, 500));
      return res.status(502).json({ error: 'Could not parse analysis result' });
    }

    return res.status(200).json({ success: true, ...parsed });
  } catch (e) {
    console.error('[analyze-label] Unexpected error:', e);
    return res.status(500).json({ error: 'Unexpected error analyzing label' });
  }
}
