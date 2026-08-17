// TEMPORAL — solo para diagnosticar el problema de CRON_SECRET.
// No expone el valor completo, solo longitud + primeros/últimos
// caracteres, para poder compararlo sin revelarlo. Se borra apenas
// se resuelva el problema.
export default function handler(req, res) {
  const secret = process.env.CRON_SECRET || '';
  const supaUrl = process.env.SUPABASE_URL || '';
  const supaKeyLen = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').length;

  res.status(200).json({
    cron_secret_length: secret.length,
    cron_secret_first4: secret.slice(0, 4),
    cron_secret_last4: secret.slice(-4),
    cron_secret_has_whitespace: /\s/.test(secret),
    supabase_url: supaUrl,
    supabase_service_key_length: supaKeyLen,
  });
}
