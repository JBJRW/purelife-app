// /api/cron/generate-recipes.js
// Vercel Cron job — se ejecuta 1x por semana (ver vercel.json).
// Genera smoothies nuevos con Claude, en los 5 idiomas del producto,
// y los inserta en smoothie_catalog. Estrategia "todo o nada": una
// receta solo se inserta si se generaron sus 5 idiomas correctamente
// (mismo criterio ya usado para noticias — evita mezclar idiomas).

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // NUNCA exponer esta key en frontend
);

const LANGS = ['en', 'es', 'fr', 'pt', 'it'];

const CATEGORIES = [
  { key: 'detox', brief: 'a cleansing/detox smoothie focused on liver and digestive support' },
  { key: 'weight_loss', brief: 'a metabolism-boosting smoothie for healthy weight management' },
  { key: 'energy', brief: 'an energizing smoothie with natural, non-sugar-spike energy sources' },
  { key: 'muscle', brief: 'a high-protein smoothie for muscle recovery and workout support' },
  { key: 'heart', brief: 'a heart-healthy smoothie rich in omega-3s and antioxidants' },
  { key: 'immunity', brief: 'an immune-boosting smoothie rich in vitamin C and antioxidants' },
  { key: 'diabetic', brief: 'a low-glycemic smoothie safe for blood sugar control' },
  { key: 'hypertension', brief: 'a smoothie rich in potassium/magnesium to support healthy blood pressure' },
];

const SYSTEM_PROMPT = `You are the recipe development lead for PureLife Wellness Club, a premium AI-powered wellness app.

STRICT RULES:
1. Respond with a single valid JSON object only. No explanatory text before or after.
2. Every recipe must be original — do not copy a recipe verbatim from any known source. Real, sensible smoothie ingredients only.
3. All ingredient amounts must be realistic and safe (no medical claims, no extreme doses).
4. "benefits" must describe general wellness value only, never a medical/diagnostic claim (no "cures", "treats", "prevents disease").
5. Provide the SAME recipe (same ingredients/concept) translated into all 5 languages — do not invent different recipes per language.
6. Ingredient names inside "ingredients" must be translated naturally into each language too.

Return exactly this JSON shape:
{
  "en": {"name": "string with 1 relevant emoji", "description": "1 sentence, appealing", "benefits": "1 sentence, general wellness only", "ingredients": ["Ingredient (amount)", "..."]},
  "es": { ...same shape... },
  "fr": { ...same shape... },
  "pt": { ...same shape... },
  "it": { ...same shape... }
}`;

async function generateRecipe(category) {
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
      messages: [{ role: 'user', content: `Create ${category.brief}. Category key: ${category.key}.` }]
    })
  });

  if (!response.ok) {
    console.error(`Error API para categoría ${category.key}:`, await response.text());
    return null;
  }

  const data = await response.json();
  const textBlocks = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');

  try {
    const objMatch = textBlocks.match(/\{[\s\S]*\}/);
    const jsonStr = objMatch ? objMatch[0] : textBlocks.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    // Todo o nada: deben estar los 5 idiomas con name+ingredients
    for (const lang of LANGS) {
      if (!parsed[lang]?.name || !Array.isArray(parsed[lang]?.ingredients) || parsed[lang].ingredients.length === 0) {
        console.error(`Receta incompleta (falta ${lang}) para categoría ${category.key}`);
        return null;
      }
    }
    return parsed;
  } catch (err) {
    console.error(`No se pudo parsear JSON para ${category.key}:`, err.message);
    return null;
  }
}

export default async function handler(req, res) {
  // Protección: solo Vercel Cron puede llamar esto
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const results = { recipesGenerated: 0, rowsInserted: 0, errors: 0, byCategory: {} };

  for (const category of CATEGORIES) {
    try {
      const recipe = await generateRecipe(category);
      if (!recipe) { results.errors++; results.byCategory[category.key] = 'failed'; continue; }

      let insertedForThisRecipe = 0;
      for (const lang of LANGS) {
        const r = recipe[lang];
        const { error } = await supabase.from('smoothie_catalog').insert({
          name: r.name,
          description: r.description,
          benefits: r.benefits,
          ingredients: r.ingredients,
          category: category.key,
          language: lang,
          source_type: 'ai_generated',
        });
        if (error) {
          console.error(`Error insertando receta (${category.key}/${lang}):`, error);
          results.errors++;
        } else {
          insertedForThisRecipe++;
        }
      }
      results.recipesGenerated++;
      results.rowsInserted += insertedForThisRecipe;
      results.byCategory[category.key] = `${insertedForThisRecipe}/5 idiomas`;
    } catch (err) {
      console.error(`Fallo en categoría ${category.key}:`, err);
      results.errors++;
    }
  }

  return res.status(200).json({ success: true, results });
}
