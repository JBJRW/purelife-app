// /api/render-recipe-video.js
// Genera un video de receta (vertical, 8seg) con Remotion Lambda.
// A diferencia de Kai (fal.ai, IA generativa desde un prompt), esto
// arma un video de PLANTILLA con los datos reales de la receta —
// mucho más barato (centavos vs dólares) y no depende de saldo en
// fal.ai. Ver smoothie_catalog / SMOOTHIE_DB para el origen de los datos.

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

const REMOTION_FUNCTION_NAME = 'remotion-render-4-0-512-mem2048mb-disk2048mb-120sec';
const REMOTION_SERVE_URL = 'https://remotionlambda-useast1-ghvynwguij.s3.us-east-1.amazonaws.com/sites/purelife-videos/index.html';
const REMOTION_REGION = 'us-east-1';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, ingredients, benefits, category } = req.body || {};
  if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: 'Faltan datos: name e ingredients son requeridos' });
  }

  try {
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: REMOTION_REGION,
      functionName: REMOTION_FUNCTION_NAME,
      serveUrl: REMOTION_SERVE_URL,
      composition: 'RecipeVideo',
      inputProps: {
        name: String(name).slice(0, 80),
        ingredients: ingredients.slice(0, 8).map(i => String(i).slice(0, 60)),
        benefits: String(benefits || '').slice(0, 140),
        category: String(category || '').slice(0, 30),
      },
      codec: 'h264',
      framesPerLambda: 240, // fuerza 1 lambda — evita el límite de concurrencia de cuentas nuevas de AWS
      privacy: 'public',
    });

    return res.status(200).json({ success: true, renderId, bucketName, region: REMOTION_REGION });
  } catch (err) {
    console.error('[render-recipe-video] error:', err);
    return res.status(500).json({ error: err.message || 'Error al iniciar el render' });
  }
}
