// redeploy2: confirmar anon key en Production
// /api/cron/fetch-news.js
// Vercel Cron job — se ejecuta 1x al día (configurar en vercel.json)
// Busca noticias de wellness vía Claude + web_search, filtra calidad, inserta en Supabase.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // NUNCA exponer esta key en frontend
);

const CATEGORIES = [
  {
    key: 'frutas',
    query: 'Busca 2-3 noticias o estudios recientes (últimos 30 días) sobre propiedades nutricionales, beneficios o usos de frutas específicas (ej: mango, arándanos, piña, papaya, etc). Prioriza fuentes científicas o de salud reconocidas.'
  },
  {
    key: 'vegetales',
    query: 'Busca 2-3 noticias o estudios recientes (últimos 30 días) sobre propiedades nutricionales, beneficios o usos de vegetales específicos (ej: espinaca, kale, remolacha, apio, etc). Prioriza fuentes científicas o de salud reconocidas.'
  },
  {
    key: 'estudios',
    query: 'Busca 2-3 estudios científicos recientes (últimos 30 días) sobre nutrición, smoothies, jugos naturales o wellness preventivo, publicados por universidades, revistas científicas o instituciones de salud.'
  },
  {
    key: 'tendencias',
    query: 'Busca 2-3 noticias recientes (últimos 30 días) sobre tendencias globales en smoothies, jugos naturales, batidos funcionales o wellness food.'
  },
  {
    key: 'salud_preventiva',
    query: 'Busca 2-3 noticias recientes (últimos 30 días) sobre salud preventiva relacionada a alimentación, hidratación o nutrición funcional.'
  }
];

const SYSTEM_PROMPT = `Eres un curador editorial para una plataforma global de wellness (PureLife Wellness Club / Dr. Smoothie).

REGLAS ESTRICTAS:
1. Responde con un array JSON válido. Evita texto explicativo extenso antes del JSON; si necesitas razonar, hazlo brevemente y termina siempre con el array JSON completo y válido.
2. Cada noticia debe tener fuente verificable real (no inventes URLs ni fuentes).
3. El "summary" debe estar 100% en tus propias palabras — JAMÁS copies frases textuales del artículo original (derechos de autor). Máximo 4 líneas, en español.
4. Descarta cualquier resultado que sea clickbait, publicidad encubierta, o que haga afirmaciones médicas no respaldadas.
5. "relevance_score" de 0 a 1: qué tan sólida/útil es la fuente y la información (1 = estudio científico o medio de salud reconocido, 0.3 = blog genérico).
6. Si no encuentras nada de calidad real en la búsqueda, devuelve un array vacío [].
7. NUNCA marques contenido como "estudio" si no citas la institución o publicación real.

Formato exacto de cada elemento:
{
  "title": "string en español, claro y directo",
  "summary": "string, 3-4 líneas, palabras propias",
  "source_name": "nombre real del medio o institución",
  "source_url": "URL real y verificable",
  "published_date": "YYYY-MM-DD o null si no se sabe",
  "relevance_score": 0.0
}`;

async function fetchCategoryNews(category) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: category.query }],
      tools: [{ type: 'web_search_20250305', name: 'web_search' }]
    })
  });

  if (!response.ok) {
    console.error(`Error API para categoría ${category.key}:`, await response.text());
    return [];
  }

  const data = await response.json();

  // Extraer solo los bloques de texto (la respuesta final del modelo)
  const textBlocks = data.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  try {
    // El modelo a veces antepone razonamiento editorial antes del JSON.
    // Extraemos el primer array [...] que aparezca en el texto, sin asumir
    // que la respuesta completa es JSON puro.
    const arrayMatch = textBlocks.match(/\[[\s\S]*\]/);
    const jsonStr = arrayMatch ? arrayMatch[0] : textBlocks.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed)
      ? parsed.map(item => ({ ...item, category: category.key }))
      : [];
  } catch (err) {
    console.error(`No se pudo parsear JSON para ${category.key}`);
    return [];
  }
}

export default async function handler(req, res) {
  // Protección: solo Vercel Cron puede llamar esto
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const results = { inserted: 0, skipped: 0, errors: 0, byCategory: {} };

  for (const category of CATEGORIES) {
    try {
      const articles = await fetchCategoryNews(category);
      results.byCategory[category.key] = articles.length;

      for (const article of articles) {
        if (!article.source_url || !article.title || !article.summary) continue;
        if (article.relevance_score !== undefined && article.relevance_score < 0.4) continue;

        const { error } = await supabase
          .from('news_articles')
          .insert({
            title: article.title,
            summary: article.summary,
            category: article.category,
            source_name: article.source_name,
            source_url: article.source_url,
            published_date: article.published_date || null,
            relevance_score: article.relevance_score ?? 0.5
          });

        if (error) {
          // Si es duplicado (source_url único), lo ignoramos silenciosamente
          if (error.code === '23505') {
            results.skipped++;
          } else {
            console.error('Error insertando artículo:', error);
            results.errors++;
          }
        } else {
          results.inserted++;
        }
      }
    } catch (err) {
      console.error(`Fallo en categoría ${category.key}:`, err);
      results.errors++;
    }
  }

  return res.status(200).json({ success: true, results });
}
