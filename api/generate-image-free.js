// ============================================================
// PureLife Wellness Club — Free Image Generation (Pollinations.ai)
// api/generate-image-free.js · JRMB Food Network LLC
//
// Sustituto GRATUITO de fal.ai/Flux mientras la cuenta de fal.ai
// no tenga saldo. Pollinations.ai ofrece Flux gratis, sin clave,
// sin límite formal — pero es una plataforma comunitaria de código
// abierto sin las garantías de moderación de un proveedor como
// fal.ai/Google. Por eso aplicamos un filtro de palabras clave
// sobre el prompt ANTES de construir la URL de imagen, como capa
// extra de seguridad (no es infalible, pero reduce el riesgo).
//
// Esta función no descarga ni reenvía bytes de imagen — solo
// valida el prompt y devuelve la URL de Pollinations, que el
// navegador carga directo (CORS abierto de su lado). Así evitamos
// cualquier problema de tamaño de función o procesamiento pesado.
// ============================================================

const CATEGORIES = {
  smoothie:   { en: 'Fresh colorful smoothie being blended, tropical fruits, vibrant colors, wellness lifestyle, photorealistic',        es: 'Batido colorido siendo mezclado, frutas tropicales, colores vibrantes, estilo de vida saludable, fotorrealista' },
  meditation: { en: 'Person meditating in nature, golden hour light, peaceful, serene, wellness and balance, photorealistic',             es: 'Persona meditando en la naturaleza, luz dorada, paz, serenidad, bienestar, fotorrealista' },
  nutrition:  { en: 'Colorful healthy meal preparation, fresh vegetables, superfoods, clean eating aesthetic, photorealistic',            es: 'Preparación de comida saludable colorida, verduras frescas, superalimentos, fotorrealista' },
  fitness:    { en: 'Person doing yoga outdoors, morning light, energetic, healthy lifestyle, fully clothed athletic wear, photorealistic', es: 'Persona haciendo yoga al aire libre, luz matutina, energético, vida saludable, ropa deportiva, fotorrealista' },
  sleep:      { en: 'Peaceful sleep environment, soft moonlight, lavender, calm atmosphere, recovery, photorealistic',                    es: 'Ambiente de sueño tranquilo, luz de luna suave, lavanda, recuperación, fotorrealista' },
  hydration:  { en: 'Crystal clear water with cucumber and lemon, detox drink, refreshing, clean wellness, photorealistic',               es: 'Agua cristalina con pepino y limón, bebida detox, refrescante, fotorrealista' },
  herbs:      { en: 'Colorful superfoods and medicinal herbs, spirulina, turmeric, ginger, natural wellness, photorealistic',             es: 'Superalimentos y hierbas medicinales, espirulina, cúrcuma, jengibre, fotorrealista' },
  community:  { en: 'Group of healthy happy people fully clothed sharing a wellness meal, positive energy, community, photorealistic',    es: 'Grupo de personas saludables vestidas compartiendo comida wellness, energía positiva, fotorrealista' },
};

// Filtro básico de palabras clave — capa extra sobre el prompt del
// usuario, no un clasificador de contenido completo. Cubre términos
// explícitos/sexuales comunes en inglés y español. No es exhaustivo.
const BLOCKED_TERMS = [
  'nude', 'naked', 'nsfw', 'porn', 'sex', 'sexual', 'explicit', 'xxx',
  'desnud', 'desnuda', 'desnudo', 'sexo', 'sexual', 'erotic', 'erótic',
  'fetish', 'bikini nud', 'topless', 'lingerie explicit',
];

function containsBlockedTerm(text) {
  const lower = text.toLowerCase();
  return BLOCKED_TERMS.some((term) => lower.includes(term));
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { category = 'smoothie', lang = 'en', custom_prompt = null } = req.body || {};

  const cat = CATEGORIES[category] || CATEGORIES.smoothie;
  const basePrompt = custom_prompt?.trim() || (lang === 'es' ? cat.es : cat.en);

  if (containsBlockedTerm(basePrompt)) {
    return res.status(400).json({
      error: 'prompt_blocked',
      detail: lang === 'es'
        ? 'Ese prompt no está permitido. Intenta describir contenido de bienestar (comida, ejercicio, meditación, etc).'
        : 'That prompt is not allowed. Try describing wellness content (food, exercise, meditation, etc).',
    });
  }

  // Reforzamos el registro fotorrealista/wellness incluso en prompts
  // personalizados, para orientar el modelo hacia el tono de la marca.
  const finalPrompt = `${basePrompt}, wellness lifestyle photography, tasteful, family-friendly, fully clothed`;
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

  return res.status(200).json({
    success: true,
    output_url: imageUrl,
    output_type: 'image',
    pipeline: 'Flux (Pollinations · gratis)',
    category,
    cost_estimate: '$0',
    free_tier_notice: true,
  });
}
