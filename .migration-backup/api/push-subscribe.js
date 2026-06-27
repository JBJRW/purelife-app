// ================================================================
// PureLife — api/push-subscribe.js
// Guardar push subscription en Supabase
// JRMB Food Network LLC · 2026
// ================================================================

const SUPABASE_URL = 'https://slcvymfgcpoafjufaplx.supabase.co';
const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org','https://www.purelifewellnessclub.org',
  'http://localhost:5173','http://localhost:3000',
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const KEY = process.env.SUPABASE_ANON_KEY || '';
  const { userId, accessToken, subscription } = req.body;
  if (!userId || !subscription) return res.status(400).json({ error: 'Missing fields' });

  try {
    const headers = {
      apikey: KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    };

    await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: userId,
        subscription: JSON.stringify(subscription),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
