// ============================================================
// PureLife — Video Usage API
// api/video-usage.js · JRMB Food Network LLC
// GET/POST contador de generaciones de video por usuario/mes
// ============================================================

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';

function sbHeaders(accessToken, key) {
  return {
    apikey: key,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ['https://purelifewellnessclub.org','https://www.purelifewellnessclub.org','http://localhost:5173','http://localhost:3000'];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
  const { userId, accessToken, action = 'get' } = req.body;

  if (!userId || !accessToken) {
    return res.status(400).json({ error: 'userId and accessToken required' });
  }

  try {
    const firstDay = new Date();
    firstDay.setDate(1); firstDay.setHours(0,0,0,0);

    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/video_usage?user_id=eq.${userId}&created_at=gte.${firstDay.toISOString()}&select=id,pipeline,category,created_at`,
      { headers: sbHeaders(accessToken, SUPABASE_KEY) }
    );

    const rows = await countRes.json();

    // FIX: si rows es un error de Supabase (JWT inválido, etc.) retornar count 0 sin exponer error interno
    if (!Array.isArray(rows)) {
      return res.status(200).json({ success: true, count: 0, rows: [] });
    }

    const count = rows.length;
    return res.status(200).json({ success: true, count, rows });
  } catch (err) {
    console.error('[video-usage]', err.message);
    return res.status(500).json({ error: 'Could not fetch usage', count: 0 });
  }
}
