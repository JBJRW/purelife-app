// ============================================================
// PureLife Wellness Club — TTS Proxy
// api/tts-proxy.js · JRMB Food Network LLC
//
// Proxea texto→audio hacia el endpoint no oficial de Google
// Translate TTS. Ese servicio devuelve MP3 real y gratis, pero
// no tiene CORS habilitado, así que no se puede llamar directo
// desde el navegador. Esta función solo reenvía bytes de audio
// (texto corto → mp3 corto) — es una operación liviana, muy
// distinta a procesar o codificar video, y corre sin problema
// dentro de los límites normales de una función serverless.
//
// Usado por el ensamblador de Video AI en el navegador (Canvas +
// Web Audio API + MediaRecorder) para obtener audio narrado real
// que sí puede mezclarse en el video final.
// ============================================================

const MAX_CHARS = 200; // Google TTS trunca textos largos; se debe llamar por oración/escena corta

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = [
    'https://purelifewellnessclub.org',
    'https://www.purelifewellnessclub.org',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const corsOrigin = allowed.includes(origin) ? origin : allowed[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { text = '', lang = 'es' } = req.query || {};
  const trimmed = text.trim();

  if (!trimmed) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }
  if (trimmed.length > MAX_CHARS) {
    return res.status(400).json({
      error: 'text_too_long',
      detail: `El texto supera ${MAX_CHARS} caracteres. Divide la narración en frases más cortas por escena.`,
    });
  }

  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    trimmed
  )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const ttsRes = await fetch(ttsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (PureLifeWellnessClub TTS proxy)' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!ttsRes.ok) {
      console.error('[tts-proxy] upstream error:', ttsRes.status);
      return res.status(502).json({ error: 'tts_unavailable', detail: `Upstream respondió ${ttsRes.status}` });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // mismo texto = mismo audio, cacheable
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err) {
    console.error('[tts-proxy] error:', err.message);
    return res.status(502).json({ error: 'tts_unavailable', detail: 'No se pudo generar el audio. Intenta de nuevo.' });
  }
}
