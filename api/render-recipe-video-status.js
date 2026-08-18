// /api/render-recipe-video-status.js
// Consulta el progreso de un render iniciado por /api/render-recipe-video.
// GET /api/render-recipe-video-status?renderId=xxx&bucketName=yyy

import { getRenderProgress } from '@remotion/lambda/client';

const REMOTION_FUNCTION_NAME = 'remotion-render-4-0-512-mem3008mb-disk10240mb-290sec';
const REMOTION_REGION = 'us-east-1';

export default async function handler(req, res) {
  const { renderId, bucketName } = req.query;
  if (!renderId || !bucketName) {
    return res.status(400).json({ error: 'renderId y bucketName son requeridos' });
  }

  try {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName: REMOTION_FUNCTION_NAME,
      region: REMOTION_REGION,
    });

    if (progress.fatalErrorEncountered) {
      return res.status(500).json({
        done: true,
        error: progress.errors?.[0]?.message || 'Error desconocido durante el render',
      });
    }

    if (progress.done) {
      return res.status(200).json({ done: true, output_url: progress.outputFile });
    }

    return res.status(200).json({ done: false, overallProgress: progress.overallProgress });
  } catch (err) {
    console.error('[render-recipe-video-status] error:', err);
    return res.status(500).json({ error: err.message || 'Error al consultar el progreso' });
  }
}
