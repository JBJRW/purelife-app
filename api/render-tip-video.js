// /api/render-tip-video.js
// Genera un video (vertical, 7seg, estética cinematográfica) para un
// post de PureLife Team, con Remotion Lambda. Reutiliza el mismo
// endpoint de status que render-recipe-video (api/render-recipe-video-status.js),
// ya que ambos solo necesitan renderId + bucketName.

import { renderMediaOnLambda } from '@remotion/lambda/client';

const REMOTION_FUNCTION_NAME = 'remotion-render-4-0-512-mem3008mb-disk10240mb-290sec';
const REMOTION_SERVE_URL = 'https://remotionlambda-useast1-ghvynwguij.s3.us-east-1.amazonaws.com/sites/purelife-videos/index.html';
const REMOTION_REGION = 'us-east-1';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, topic } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'Falta content' });
  }

  try {
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: REMOTION_REGION,
      functionName: REMOTION_FUNCTION_NAME,
      serveUrl: REMOTION_SERVE_URL,
      composition: 'TipVideo',
      inputProps: {
        content: String(content).slice(0, 400),
        topic: String(topic || 'Wellness').slice(0, 30),
      },
      codec: 'h264',
      framesPerLambda: 210, // fuerza 1 lambda
      privacy: 'public',
    });

    return res.status(200).json({ success: true, renderId, bucketName, region: REMOTION_REGION });
  } catch (err) {
    console.error('[render-tip-video] error:', err);
    return res.status(500).json({ error: err.message || 'Error al iniciar el render' });
  }
}
