// ============================================================
// PureLife Wellness Club — Health Diagnosis API
// api/health-diagnosis.js · JRMB Food Network LLC
//
// Proxies HealthProfileModule.jsx's askClaude() calls (wellness
// diagnosis + 90s video script, with optional vision content) to
// Anthropic, keeping ANTHROPIC_API_KEY server-side. Previously the
// component called api.anthropic.com directly from the browser
// with no key at all, so every diagnosis attempt failed silently.
// Same request/response shape as the Anthropic Messages API, so
// the existing frontend parsing (d.content?.[0]?.text) is untouched.
// ============================================================

const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org',
  'https://www.purelifewellnessclub.org',
  'https://purelife-app-umber.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const API_KEY = process.env.ANTHROPIC_API_KEY;

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { system, content, tokens = 1500 } = req.body || {};
    if (!content) return res.status(400).json({ error: 'content is required' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: tokens,
        system,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[health-diagnosis] Anthropic error:', response.status, err);
      return res.status(response.status).json({ error: err.error?.message || 'Anthropic error' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('[health-diagnosis] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
