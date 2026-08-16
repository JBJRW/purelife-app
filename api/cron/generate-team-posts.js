// /api/cron/generate-team-posts.js
// Vercel Cron job — se ejecuta 2x por semana (ver vercel.json).
// Genera tips/posts editoriales cortos con Claude para la pestaña Club,
// en los 5 idiomas. SIEMPRE se guardan en team_posts (NUNCA en
// `testimonials`, que es exclusivamente para reseñas reales de
// usuarios) y quedan marcados author_name='PureLife Team' — nunca se
// hacen pasar por un usuario real.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const LANGS = ['en', 'es', 'fr', 'pt', 'it'];

const TOPICS = [
  'a quick, practical hydration tip',
  'the benefit of one specific fruit or vegetable',
  'a short motivational message about building healthy daily habits',
  'a simple tip for better sleep that supports overall wellness',
  'a quick myth-busting fact about nutrition (correcting a common misconception)',
];

const SYSTEM_PROMPT = `You are writing short, warm, editorial posts for the "PureLife Team" — official content for the Club community feed of a wellness app. You are NOT impersonating a user.

STRICT RULES:
1. Respond with a single valid JSON object only, no extra text.
2. 2-3 sentences per post, warm and encouraging tone, never clinical.
3. NEVER make medical claims (no "cures", "treats", "prevents disease", no dosages).
4. NEVER invent statistics, studies, or specific numbers you cannot verify.
5. Same post idea translated into all 5 languages — not different content per language.

Return exactly this JSON shape:
{
  "en": "string",
  "es": "string",
  "fr": "string",
  "pt": "string",
  "it": "string"
}`;

async function generatePost(topic) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Write ${topic}.` }]
    })
  });

  if (!response.ok) {
    console.error('Error API team-posts:', await response.text());
    return null;
  }

  const data = await response.json();
  const textBlocks = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');

  try {
    const objMatch = textBlocks.match(/\{[\s\S]*\}/);
    const jsonStr = objMatch ? objMatch[0] : textBlocks.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    for (const lang of LANGS) {
      if (!parsed[lang] || typeof parsed[lang] !== 'string' || !parsed[lang].trim()) {
        console.error(`Post incompleto (falta ${lang})`);
        return null;
      }
    }
    return parsed;
  } catch (err) {
    console.error('No se pudo parsear JSON de team-posts:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // Un solo tema por corrida, rotando según el día del año — evita
  // repetir siempre el mismo tema en cada ejecución.
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const topic = TOPICS[dayOfYear % TOPICS.length];

  const results = { rowsInserted: 0, errors: 0 };

  try {
    const post = await generatePost(topic);
    if (!post) {
      results.errors++;
    } else {
      for (const lang of LANGS) {
        const { error } = await supabase.from('team_posts').insert({
          author_name: 'PureLife Team',
          author_type: 'ai_generated',
          content: post[lang],
          topic,
          language: lang,
        });
        if (error) { console.error(`Error insertando team_post (${lang}):`, error); results.errors++; }
        else { results.rowsInserted++; }
      }
    }
  } catch (err) {
    console.error('Fallo generando team post:', err);
    results.errors++;
  }

  return res.status(200).json({ success: true, topic, results });
}
