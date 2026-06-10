// ================================================================
// PureLife — api/reminders.js
// CRUD de recordatorios + envío de push notifications
// JRMB Food Network LLC · 2026
// ================================================================

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org','https://www.purelifewellnessclub.org',
  'http://localhost:5173','http://localhost:3000',
];

function sbHeaders(token, key) {
  return { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
  const { action, userId, accessToken, reminder, reminderId, active } = req.body;

  if (!userId || !accessToken) return res.status(400).json({ error: 'userId and accessToken required' });

  const headers = sbHeaders(accessToken, SUPABASE_KEY);

  try {
    if (action === 'get') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/reminders?user_id=eq.${userId}&order=created_at.desc`, { headers });
      const data = await r.json();
      return res.status(200).json({ reminders: Array.isArray(data) ? data : [] });
    }

    if (action === 'create') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/reminders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: userId,
          type: reminder.type,
          time: reminder.time,
          days: reminder.days,
          active: true,
          created_at: new Date().toISOString(),
        }),
      });
      const data = await r.json();
      if (!Array.isArray(data)) return res.status(400).json({ error: 'Failed to create reminder', detail: data });
      return res.status(200).json({ success: true, reminder: data[0] });
    }

    if (action === 'toggle') {
      await fetch(`${SUPABASE_URL}/rest/v1/reminders?id=eq.${reminderId}&user_id=eq.${userId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ active }),
      });
      return res.status(200).json({ success: true });
    }

    if (action === 'delete') {
      await fetch(`${SUPABASE_URL}/rest/v1/reminders?id=eq.${reminderId}&user_id=eq.${userId}`, {
        method: 'DELETE',
        headers,
      });
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('[reminders]', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
}
