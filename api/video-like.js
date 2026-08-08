import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId, accessToken } = req.body || {};
  if (!videoId || !accessToken) {
    return res.status(400).json({ error: 'videoId y accessToken son requeridos' });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  const { data: video, error: fetchError } = await supabase
    .from('video_feed')
    .select('likes_count')
    .eq('id', videoId)
    .single();

  if (fetchError || !video) {
    return res.status(404).json({ error: 'Video no encontrado' });
  }

  const { data: updated, error: updateError } = await supabase
    .from('video_feed')
    .update({ likes_count: (video.likes_count || 0) + 1 })
    .eq('id', videoId)
    .select('likes_count')
    .single();

  if (updateError) {
    return res.status(500).json({ error: 'No se pudo registrar el like' });
  }

  return res.status(200).json({ success: true, likes_count: updated.likes_count });
}
