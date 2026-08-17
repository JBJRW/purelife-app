// TEMPORAL — solo para diagnosticar el problema de CRON_SECRET.
// No expone el valor completo, solo longitud + primeros/últimos
// caracteres, para poder compararlo sin revelarlo. Se borra apenas
// se resuelva el problema.
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET || '';
  const supaUrl = process.env.SUPABASE_URL || '';
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  let liveTest = null;
  try {
    const r = await fetch(`${supaUrl}/rest/v1/news_articles?select=id&limit=1`, {
      headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
    });
    liveTest = { status: r.status, body: (await r.text()).slice(0, 300) };
  } catch (e) {
    liveTest = { fetch_error: e.message };
  }

  res.status(200).json({
    cron_secret_length: secret.length,
    cron_secret_first4: secret.slice(0, 4),
    cron_secret_last4: secret.slice(-4),
    cron_secret_has_whitespace: /\s/.test(secret),
    supabase_url: supaUrl,
    supabase_service_key_length: supaKey.length,
    supabase_service_key_first6: supaKey.slice(0, 6),
    supabase_service_key_has_whitespace: /\s/.test(supaKey),
    supabase_live_test: liveTest,
  });
}
