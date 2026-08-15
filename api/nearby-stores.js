// ============================================================
// PureLife Wellness Club — Nearby Stores
// api/nearby-stores.js · JRMB Food Network LLC
//
// Proxea la búsqueda de tiendas saludables reales en Overpass API
// (OpenStreetMap) desde el servidor, en vez de llamarla directo
// desde el navegador. Esto evita los fallos intermitentes (CORS/
// timeout) que antes hacían que MapScreen.jsx cayera en silencio
// a datos de ejemplo (mock) sin avisar al usuario.
// ============================================================

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const MAX_RETRIES = 2;
const BACKOFF_MS = [1500, 3000];
const FETCH_TIMEOUT_MS = 12000;

function buildQuery(lat, lng, radius) {
  return `
    [out:json][timeout:15];
    (
      node["shop"="organic"](around:${radius},${lat},${lng});
      node["amenity"="juice_bar"](around:${radius},${lat},${lng});
      node["shop"="health_food"](around:${radius},${lat},${lng});
      node["amenity"="marketplace"](around:${radius},${lat},${lng});
      node["shop"="farm"](around:${radius},${lat},${lng});
      node["shop"="greengrocer"](around:${radius},${lat},${lng});
    );
    out body;
  `;
}

function mapElement(el, i, lat, lng) {
  return {
    id: el.id || i,
    name: el.tags?.name || el.tags?.['name:es'] || null,
    type: el.tags?.shop || el.tags?.amenity || 'organic',
    lat: el.lat,
    lng: el.lon,
    address: el.tags?.['addr:street']
      ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`.trim()
      : null,
    hours: el.tags?.opening_hours || null,
    distance:
      (Math.sqrt(Math.pow(el.lat - lat, 2) + Math.pow(el.lon - lng, 2)) * 111).toFixed(1) +
      ' km',
    emoji:
      el.tags?.amenity === 'juice_bar'
        ? '🥤'
        : el.tags?.shop === 'organic'
        ? '🌿'
        : el.tags?.shop === 'farm'
        ? '🚜'
        : '🏪',
  };
}

async function callOverpass(query) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

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

  const { lat, lng, radius = '1500' } = req.query || {};
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = Math.min(Math.max(parseInt(radius, 10) || 1500, 250), 5000);

  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return res.status(400).json({ error: 'Missing or invalid lat/lng parameters' });
  }

  const query = buildQuery(latNum, lngNum, radiusNum);
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callOverpass(query);

      if (!response.ok) {
        throw new Error(`Overpass respondió con status ${response.status}`);
      }

      const data = await response.json();
      const elements = data.elements || [];
      const stores = elements.slice(0, 20).map((el, i) => mapElement(el, i, latNum, lngNum));

      return res.status(200).json({ stores, source: 'osm' });
    } catch (err) {
      lastError = err;
      console.error(`[nearby-stores] intento ${attempt + 1} falló:`, err.message);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt]));
      }
    }
  }

  console.error('[nearby-stores] Overpass falló tras todos los reintentos:', lastError?.message);
  return res.status(502).json({
    error: 'stores_unavailable',
    detail: 'No pudimos cargar tiendas cercanas en este momento. Intenta de nuevo.',
  });
}
