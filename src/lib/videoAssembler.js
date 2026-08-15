// ============================================================
// PureLife Wellness Club — Video Assembler
// src/lib/videoAssembler.js · JRMB Food Network LLC
//
// Convierte un guion de generate-video-script.js en un archivo
// de video real (WebM con audio), enteramente en el navegador:
//
//   1. Cada escena se dibuja en un <canvas> oculto (texto + fondo
//      de marca).
//   2. La narración de cada escena se pide a /api/tts-proxy
//      (nuestro proxy server-side hacia un TTS gratuito) y se
//      decodifica con la Web Audio API.
//   3. La pista de audio decodificada se mezcla con la pista de
//      video del canvas en un solo MediaStream.
//   4. MediaRecorder graba ese stream combinado → un Blob WebM
//      con audio real embebido.
//
// Por qué así y no con FFmpeg: las funciones serverless de Vercel
// tienen un límite de 250MB de paquete descomprimido y no corren
// binarios nativos como ffmpeg de forma viable — se validó esto
// con pruebas reales antes de construir este módulo. Este enfoque
// evita el servidor por completo para el trabajo pesado (dibujar
// y codificar el video), así que es gratis y no choca con esos
// límites.
// ============================================================

const CANVAS_W = 1080;
const CANVAS_H = 1920;

const PALETTE = {
  darkTop: '#0F1F17',
  darkBottom: '#1A5C3A',
  circle: 'rgba(45,134,83,0.25)',
  gold: '#E8C96A',
  cream: '#F4EFE6',
  footer: 'rgba(244,239,230,0.6)',
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
  return lines.length;
}

function drawScene(ctx, scene, index, total, brandName) {
  const w = CANVAS_W, h = CANVAS_H;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.darkTop);
  grad.addColorStop(1, PALETTE.darkBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = PALETTE.circle;
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.25, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.gold;
  ctx.font = '600 34px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${index + 1}/${total}`, 60, 120);

  ctx.fillStyle = PALETTE.cream;
  ctx.font = '700 62px Georgia';
  ctx.textAlign = 'center';
  const text = scene.on_screen_text || scene.visual_direction || '';
  wrapText(ctx, text, w / 2, h / 2, w - 160, 74);

  ctx.fillStyle = PALETTE.footer;
  ctx.font = '500 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(brandName, w / 2, h - 100);
}

async function fetchSceneAudio(text, lang, apiBase) {
  const url = `${apiBase}/api/tts-proxy?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;
  const res = await fetch(url);
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body.detail || body.error || '';
    } catch { /* ignore */ }
    throw new Error(detail || `tts_proxy_${res.status}`);
  }
  return res.arrayBuffer();
}

/**
 * Ensambla un video a partir de un guion generado por generate-video-script.js.
 *
 * @param {object} script - resultado de /api/generate-video-script (title, scenes[], ...)
 * @param {object} options
 * @param {string} options.lang - código de idioma para la narración (en/es/fr/pt/it)
 * @param {string} options.brandName - texto al pie de cada escena
 * @param {function} [options.onProgress] - callback(stepLabel, sceneIndex, totalScenes)
 * @returns {Promise<{ blob: Blob, mimeType: string }>}
 */
export async function assembleVideo(script, { lang = 'en', brandName = 'PureLife Wellness Club', onProgress } = {}) {
  if (!window.MediaRecorder) throw new Error('media_recorder_unsupported');
  if (!(window.AudioContext || window.webkitAudioContext)) throw new Error('web_audio_unsupported');

  const scenes = Array.isArray(script?.scenes) ? script.scenes : [];
  if (scenes.length === 0) throw new Error('no_scenes');

  const apiBase = window.location.origin;

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioCtx();
  const destination = audioCtx.createMediaStreamDestination();

  // Descarga y decodifica el audio de cada escena antes de grabar,
  // para que la grabación no se detenga a mitad de una escena
  // esperando la red.
  const decodedBuffers = [];
  for (let i = 0; i < scenes.length; i++) {
    onProgress?.('fetching_audio', i, scenes.length);
    const text = (scenes[i].voiceover_line || scenes[i].on_screen_text || '').slice(0, 200);
    const raw = await fetchSceneAudio(text || brandName, lang, apiBase);
    const buf = await audioCtx.decodeAudioData(raw);
    decodedBuffers.push(buf);
  }

  const canvasStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...destination.stream.getAudioTracks(),
  ]);

  let mimeType = 'video/webm;codecs=vp9,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

  const chunks = [];
  const recorder = new MediaRecorder(combinedStream, { mimeType });
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  const recordingDone = new Promise((resolve) => { recorder.onstop = resolve; });

  recorder.start();

  for (let i = 0; i < scenes.length; i++) {
    onProgress?.('rendering', i, scenes.length);
    drawScene(ctx, scenes[i], i, scenes.length, brandName);

    const buf = decodedBuffers[i];
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    source.connect(destination);
    source.start();

    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, buf.duration * 1000 + 150));
  }

  recorder.stop();
  await recordingDone;
  audioCtx.close();

  const blob = new Blob(chunks, { type: mimeType });
  return { blob, mimeType };
}
