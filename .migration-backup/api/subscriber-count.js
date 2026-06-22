// api/subscriber-count.js — Contador de Founding Members PureLife

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const SUPABASE_URL = process.env.SUPABASE_URL || "https://efatctcxlcotsgxhmgjg.supabase.co";
const SUPABASE_SRK = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FOUNDING_LIMIT = 100;

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SRK);

    const { count, error } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) throw error;

    const total = count || 0;
    const remaining = Math.max(0, FOUNDING_LIMIT - total);
    const isFull = total >= FOUNDING_LIMIT;

    return res.status(200).json({
      total,
      remaining,
      isFull,
      limit: FOUNDING_LIMIT,
      percentFull: Math.min(100, Math.round((total / FOUNDING_LIMIT) * 100))
    });

  } catch (err) {
    console.error("Subscriber count error:", err);
    return res.status(500).json({ error: "Error al obtener contador" });
  }
}
