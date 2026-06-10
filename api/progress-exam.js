// ================================================================
// PureLife — api/progress-exam.js
// Guardar examen de progreso + upload lab file a Supabase Storage
// JRMB Food Network LLC · 2026
// ================================================================

const SUPABASE_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const ALLOWED_ORIGINS = [
  'https://purelifewellnessclub.org','https://www.purelifewellnessclub.org',
  'http://localhost:5173','http://localhost:3000',
];

export const config = { api: { bodyParser: false } };

import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  try {
    // Parse multipart form
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const userId = fields.userId?.[0];
    const accessToken = fields.accessToken?.[0];
    const answers = JSON.parse(fields.answers?.[0] || '{}');
    const examDate = fields.examDate?.[0] || new Date().toISOString();

    if (!userId || !accessToken) return res.status(400).json({ error: 'userId and accessToken required' });

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    // Calcular score
    const scaleAnswers = Object.values(answers).filter(v => typeof v === 'number');
    const score = scaleAnswers.length > 0
      ? Math.round((scaleAnswers.reduce((a,b) => a+b, 0) / (scaleAnswers.length * 5)) * 100)
      : 0;

    // Subir lab file si existe
    let labFileUrl = null;
    const labFile = files.labFile?.[0];
    if (labFile && SERVICE_KEY) {
      const fileContent = fs.readFileSync(labFile.filepath);
      const ext = labFile.originalFilename?.split('.').pop() || 'pdf';
      const fileName = `labs/${userId}/${Date.now()}.${ext}`;
      const uploadRes = await fetch(
        `${SUPABASE_URL}/storage/v1/object/lab-files/${fileName}`,
        {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': labFile.mimetype || 'application/octet-stream',
          },
          body: fileContent,
        }
      );
      if (uploadRes.ok) {
        labFileUrl = `${SUPABASE_URL}/storage/v1/object/public/lab-files/${fileName}`;
      }
    }

    // Insertar en progress_exams
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/progress_exams`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id: userId,
        answers,
        score,
        lab_file_url: labFileUrl,
        share_permission: answers.share_permission || false,
        exam_date: examDate,
        created_at: new Date().toISOString(),
      }),
    });

    const insertData = await insertRes.json();
    if (!Array.isArray(insertData)) return res.status(400).json({ error: 'Failed to save exam', detail: insertData });

    return res.status(200).json({
      success: true,
      examId: insertData[0]?.id,
      score,
      sharePermission: answers.share_permission,
      labFileUrl,
    });
  } catch (err) {
    console.error('[progress-exam]', err.message);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
