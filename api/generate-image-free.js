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
  smoothie:   { en: 'Professional food photography of a smoothie in a clear glass cup with a metal straw, visible layered pink and green fruit smoothie, garnished with fresh mint leaf and berries, on a light marble countertop, soft natural window light, shallow depth of field, shot on 85mm lens, studio quality, high detail, photorealistic',
                es: 'Fotografía profesional de comida de un batido en un vaso de vidrio transparente con sorbete metálico, batido de frutas en capas rosa y verde visible, decorado con hoja de menta fresca y frutos rojos, sobre una mesada de mármol claro, luz natural suave, poca profundidad de campo, calidad de estudio, fotorrealista' },
  meditation: { en: 'Professional lifestyle photography of a person meditating cross-legged in nature, golden hour backlight, peaceful expression, soft bokeh forest background, wellness magazine editorial style, high detail, photorealistic',
                es: 'Fotografía de estilo de vida profesional de una persona meditando en la naturaleza, luz dorada de fondo, expresión serena, fondo de bosque desenfocado, estilo editorial de revista wellness, fotorrealista' },
  nutrition:  { en: 'Professional overhead food photography of a colorful healthy meal bowl, fresh vegetables and superfoods arranged artfully, on a rustic wood table, soft natural light, editorial food styling, high detail, photorealistic',
                es: 'Fotografía profesional cenital de un bowl de comida saludable colorido, verduras frescas y superalimentos ordenados artísticamente, sobre mesa de madera rústica, luz natural suave, estilo editorial, fotorrealista' },
  fitness:    { en: 'Professional lifestyle photography of a person doing yoga outdoors at sunrise, fully clothed in athletic wear, calm confident pose, soft warm light, wellness magazine editorial style, high detail, photorealistic',
                es: 'Fotografía de estilo de vida profesional de una persona haciendo yoga al aire libre al amanecer, con ropa deportiva completa, pose serena, luz cálida suave, estilo editorial, fotorrealista' },
  sleep:      { en: 'Professional interior photography of a cozy peaceful bedroom, soft moonlight through sheer curtains, lavender on nightstand, calm blue and lavender tones, editorial home magazine style, high detail, photorealistic',
                es: 'Fotografía profesional de interior de un dormitorio acogedor y tranquilo, luz de luna suave, lavanda en la mesa de noche, tonos azules y lavanda, estilo editorial, fotorrealista' },
  hydration:  { en: 'Professional food photography of a clear glass pitcher of infused water with cucumber and lemon slices, condensation droplets, on a light marble surface, soft natural light, editorial style, high detail, photorealistic',
                es: 'Fotografía profesional de comida de una jarra de vidrio transparente con agua saborizada con pepino y limón, gotas de condensación, sobre superficie de mármol claro, luz natural suave, fotorrealista' },
  herbs:      { en: 'Professional overhead food photography of colorful superfoods and medicinal herbs arranged in small bowls, turmeric, ginger, spirulina powder, on a dark wood surface, soft natural light, editorial style, high detail, photorealistic',
                es: 'Fotografía profesional cenital de superalimentos y hierbas medicinales en pequeños cuencos, cúrcuma, jengibre, espirulina, sobre madera oscura, luz natural suave, fotorrealista' },
  community:  { en: 'Professional lifestyle photography of a diverse group of happy people fully clothed sharing a healthy meal outdoors, warm natural light, genuine smiles, wellness magazine editorial style, high detail, photorealistic',
                es: 'Fotografía de estilo de vida profesional de un grupo diverso de personas felices y vestidas compartiendo una comida saludable al aire libre, luz natural cálida, sonrisas genuinas, estilo editorial, fotorrealista' },
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
  // personalizados, para orientar el modelo hacia el tono de la marca,
  // y evitar composiciones raras (sin dirección de cámara/luz, Flux
  // tiende a generar formas extrañas).
  const finalPrompt = `${basePrompt}, professional commercial photography, sharp focus, well-composed, wellness lifestyle photography, tasteful, family-friendly, fully clothed, no text, no watermark`;
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux&enhance=true`;

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
