import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// RLS en `profiles` solo permite leer la fila propia, así que el ranking de
// fundadores (que requiere comparar contra otros usuarios) necesita service role.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken } = req.body || {};
  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken es requerido' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_founding_member, created_at')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.is_founding_member) {
    return res.status(200).json({ isFoundingMember: false, rank: null });
  }

  const { count, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_founding_member', true)
    .lte('created_at', profile.created_at);

  if (countError) {
    return res.status(500).json({ error: 'No se pudo calcular el ranking' });
  }

  return res.status(200).json({ isFoundingMember: true, rank: count });
}
