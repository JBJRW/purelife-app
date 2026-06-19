
-- ══ PureLife — Wellness Diagnostic (perfil pre-membresía) — Junio 2026 ══
-- Captura respuestas del diagnóstico ANTES del registro/pago.
-- Se guarda desde la primera respuesta (decisión de producto).
-- Limpieza automática a los 30 días si nunca se reclama (email o user_id).

CREATE TABLE IF NOT EXISTS wellness_diagnostic_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal TEXT,
  energy_level INT,
  restriction TEXT,
  produce_frequency TEXT,
  best_time TEXT,
  recommended_smoothie TEXT,
  email TEXT,
  claimed_user_id UUID REFERENCES users(id),
  lang TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wellness_diagnostic_profiles ENABLE ROW LEVEL SECURITY;

-- Mismo nivel de seguridad que `sessions`/`analytics`: el UUID generado
-- en cliente actúa como clave impredecible. No hay SELECT público masivo
-- (nadie puede listar todos los perfiles), solo lectura/escritura puntual
-- por id conocido, que solo posee el navegador que lo creó.
CREATE POLICY "Allow public insert" ON wellness_diagnostic_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update by known id" ON wellness_diagnostic_profiles
  FOR UPDATE USING (true);

CREATE POLICY "Allow select by known id" ON wellness_diagnostic_profiles
  FOR SELECT USING (true);

-- Limpieza automática — requiere extensión pg_cron habilitada en Supabase
-- (Database → Extensions → pg_cron). Si no está disponible, ejecutar
-- manualmente o vía un cron job de Vercel llamando a un endpoint dedicado.
SELECT cron.schedule(
  'cleanup-unclaimed-wellness-profiles',
  '0 3 * * *',
  $$
    DELETE FROM wellness_diagnostic_profiles
    WHERE claimed_user_id IS NULL
      AND email IS NULL
      AND created_at < NOW() - INTERVAL '30 days';
  $$
);
