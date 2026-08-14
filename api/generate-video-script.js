// ============================================================
// PureLife Wellness Club — AI Video Script Writer
// api/generate-video-script.js · JRMB Food Network LLC
//
// Dr. Smoothie AI writes a complete, ready-to-shoot video script
// (scenes, camera direction, voiceover, on-screen text) using
// Gemini's free-tier text model. No video is rendered — this is
// a real production blueprint for Jorge (or anyone) to film or
// feed into an actual video-generation pipeline later.
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

function buildPrompt(topic, langName) {
  return `You are Dr. Smoothie AI, the warm and knowledgeable wellness coach and video director for PureLife Wellness Club. Write a complete, ready-to-shoot short-form video script (30-60 seconds, vertical/social format) about: "${topic}".

Write everything in ${langName}. Keep the tone warm, encouraging, and practical — like a friendly expert, never clinical or salesy.

Respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "title": "short catchy video title",
  "hook": "the first spoken line, must grab attention in the first 2 seconds",
  "scenes": [
    {
      "id": 1,
      "duration_seconds": 5,
      "visual_direction": "what the camera/shot shows, written as simple filming instructions",
      "voiceover_line": "exact words to say in this scene",
      "on_screen_text": "short text overlay for this scene, or empty string if none"
    }
  ],
  "call_to_action": "closing line inviting the viewer to try/follow/download",
  "music_mood": "short description of the music vibe that fits",
  "full_script": "the complete voiceover script as one readable paragraph, scenes combined"
}

Include 3 to 5 scenes. Scene durations should add up to roughly 30-60 seconds total. Keep voiceover lines short and natural to say out loud.`;
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
  if (!GEMINI_KEY) return res.status(500).json({ error: 'Script writer not configured' });

  const { topic = '', lang = 'en' } = req.body || {};
  if (!topic || !topic.trim()) return res.status(400).json({ error: 'Missing topic' });
  if (topic.length > 300) return res.status(400).json({ error: 'Topic too long' });

  const langName = LANG_NAMES[lang] || LANG_NAMES.en;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(topic.trim(), langName) }] }],
        generationConfig: { temperature: 0.8 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[generate-video-script] Gemini error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return res.status(429).json({ error: 'rate_limited', detail: 'Free tier quota reached, try again shortly.' });
      }
      return res.status(502).json({ error: 'Script generation failed', detail: errText.slice(0, 300) });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[generate-video-script] Failed to parse JSON:', cleaned.slice(0, 500));
      return res.status(502).json({ error: 'Could not parse script result' });
    }

    if (!parsed.scenes || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
      return res.status(502).json({ error: 'Incomplete script generated, try again' });
    }

    return res.status(200).json({ success: true, ...parsed });
  } catch (e) {
    console.error('[generate-video-script] Unexpected error:', e);
    return res.status(500).json({ error: 'Unexpected error generating script' });
  }
}
