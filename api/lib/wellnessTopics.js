// api/lib/wellnessTopics.js
// Taxonomía maestra de temas de bienestar — PureLife Wellness Club / Dr. Smoothie AI
//
// Fuente única de verdad, usada en 2 capas:
// 1. Guardrail del chat (api/chat.js) — define qué puede responder Dr. Smoothie
// 2. Clasificador de contenido (api/cron/fetch-news.js, generate-team-posts.js)
//    — restringe la categoría que se guarda en Supabase a estos 4 valores,
//    en vez de texto libre o categorías que no coinciden con lo que la UI filtra.
//
// NOTA: generate-recipes.js usa su propia taxonomía (detox, energy, muscle,
// etc.) — es un propósito distinto (para qué sirve la receta, no de qué
// habla el contenido editorial) y se deja intacta a propósito.

export const WELLNESS_TOPICS = [
  {
    key: 'nutricion',
    labels: { en: 'Nutrition', es: 'Nutrición', fr: 'Nutrition', pt: 'Nutrição', it: 'Nutrizione' },
    describes: 'frutas, vegetales, ingredientes naturales, mitos y datos nutricionales',
  },
  {
    key: 'habitos_saludables',
    labels: { en: 'Healthy Habits', es: 'Hábitos Saludables', fr: 'Habitudes Saines', pt: 'Hábitos Saudáveis', it: 'Abitudini Sane' },
    describes: 'hidratación, sueño, rutinas diarias, motivación, tendencias de bienestar',
  },
  {
    key: 'estudios',
    labels: { en: 'Science & Studies', es: 'Estudios Científicos', fr: 'Études Scientifiques', pt: 'Estudos Científicos', it: 'Studi Scientifici' },
    describes: 'estudios y publicaciones científicas sobre nutrición o wellness preventivo',
  },
  {
    key: 'salud_preventiva',
    labels: { en: 'Preventive Health', es: 'Salud Preventiva', fr: 'Santé Préventive', pt: 'Saúde Preventiva', it: 'Salute Preventiva' },
    describes: 'prevención relacionada a alimentación, hidratación o nutrición funcional',
  },
];

export const WELLNESS_TOPIC_KEYS = WELLNESS_TOPICS.map(t => t.key);

// Texto listo para insertar en cualquier system prompt (chat guardrail o
// prompts de clasificación de los crons), en español.
export const WELLNESS_TOPICS_PROMPT_ES = WELLNESS_TOPICS
  .map(t => `- ${t.key}: ${t.describes}`)
  .join('\n');

// Valida que un valor sea un topic real de la taxonomía; si no, devuelve
// un fallback seguro en vez de dejar pasar categorías inventadas por el modelo.
export function normalizeTopic(value, fallback = 'nutricion') {
  return WELLNESS_TOPIC_KEYS.includes(value) ? value : fallback;
}
