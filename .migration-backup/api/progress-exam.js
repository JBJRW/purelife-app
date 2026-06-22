// api/progress-exam.js
// PureLife Wellness Club — Guardar examen de progreso semanal
// JRMB Food Network LLC · 2026

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org',
  'https://www.purelifewellnessclub.org',
  'http://localhost:5173',
  'http://localhost:3000',
];

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ANON_KEY    = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  // ── GET — obtener historial de exámenes ───────────────────────────
  if (req.method === 'GET') {
    const { userId, accessToken } = req.query || {};
    if (!userId || !accessToken) {
      return res.status(400).json({ error: 'userId and accessToken required' });
    }
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/progress_exams?user_id=eq.${userId}&order=exam_date.desc&limit=10`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${accessToken}` } }
    );
    const data = await r.json();
    return res.status(r.status).json(data);
  }

  // ── POST — guardar nuevo examen ───────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = {};
    const raw = await new Promise((resolve, reject) => {
      let d = ''; req.on('data', c => d += c); req.on('end', () => resolve(d)); req.on('error', reject);
    });
    try { body = JSON.parse(raw); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }

    const { userId, accessToken, answers = {}, weekNumber, examDate } = body;
    if (!userId || !accessToken) return res.status(400).json({ error: 'userId and accessToken required' });

    // Calcular score (promedio de métricas numéricas 1-10, normalizado a 0-100)
    const metrics = ['energy_level', 'sleep_quality', 'digestion', 'mood'];
    const vals = metrics.map(k => answers[k]).filter(v => typeof v === 'number' && v >= 1 && v <= 10);
    const score = vals.length > 0 ? Math.round((vals.reduce((a,b) => a+b, 0) / (vals.length * 10)) * 100) : 0;

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/progress_exams`, {
      method: 'POST',
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id:       userId,
        exam_date:     examDate || new Date().toISOString().split('T')[0],
        week_number:   weekNumber || null,
        energy_level:  answers.energy_level || null,
        sleep_quality: answers.sleep_quality || null,
        digestion:     answers.digestion || null,
        mood:          answers.mood || null,
        weight_kg:     answers.weight_kg || null,
        smoothies_week: answers.smoothies_week || 0,
        goals_met:     answers.goals_met || [],
        notes:         answers.notes || null,
        ai_feedback:   answers.ai_feedback || null,
        score,
      }),
    });

    const insertData = await insertRes.json();

    if (!Array.isArray(insertData)) {
      return res.status(400).json({ error: 'Failed to save exam', detail: insertData });
    }

    return res.status(200).json({
      success: true,
      examId: insertData[0]?.id,
      score,
      message: `Examen guardado. Score: ${score}/100`,
    });

  } catch (err) {
    console.error('[progress-exam]', err.message);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
