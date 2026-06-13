// api/community.js — PureLife Community Hub API
// Fix: SUPABASE_ANON_KEY (no NEXT_PUBLIC_) + acciones completas
// JRMB Food Network LLC

const ALLOWED = [
  "https://purelifewellnessclub.org",
  "https://www.purelifewellnessclub.org",
  "https://purelife-app-umber.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const SUPA = "https://efatctcxlcotsgxhmgjg.supabase.co";

function sbHeaders(accessToken) {
  // Usar SUPABASE_ANON_KEY (sin NEXT_PUBLIC_ ni VITE_ — esta es API serverless)
  const KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  return {
    apikey: KEY,
    Authorization: `Bearer ${accessToken || KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function sb(path, method = "GET", body = null, accessToken = null) {
  const opts = {
    method,
    headers: sbHeaders(accessToken),
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SUPA}/rest/v1/${path}`, opts);
  const text = await r.text();
  try { return JSON.parse(text); } catch { return []; }
}

export default async function handler(req, res) {
  // CORS
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", ALLOWED.includes(origin) ? origin : ALLOWED[0]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query?.action || req.body?.action;
  const token = req.headers.authorization?.replace("Bearer ", "") || null;

  try {
    // ── GET GROUPS ─────────────────────────────────────────────
    if (action === "get-groups") {
      const data = await sb(
        "community_groups?select=*&order=member_count.desc&limit=50",
        "GET", null, token
      );
      return res.status(200).json({ groups: Array.isArray(data) ? data : [] });
    }

    // ── GET MESSAGES ───────────────────────────────────────────
    if (action === "get-messages") {
      const { groupId } = req.query;
      if (!groupId) return res.status(400).json({ error: "groupId required" });
      const data = await sb(
        `community_messages?group_id=eq.${groupId}&order=created_at.asc&limit=100`,
        "GET", null, token
      );
      return res.status(200).json({ messages: Array.isArray(data) ? data : [] });
    }

    // ── SEND MESSAGE ───────────────────────────────────────────
    if (action === "send-message") {
      const { groupId, userId, content, type = "text" } = req.body || {};
      if (!groupId || !userId || !content) {
        return res.status(400).json({ error: "groupId, userId, content required" });
      }
      const data = await sb("community_messages", "POST", {
        group_id: groupId,
        user_id: userId,
        content,
        type,
      }, token);
      return res.status(200).json({ message: Array.isArray(data) ? data[0] : data });
    }

    // ── JOIN GROUP ─────────────────────────────────────────────
    if (action === "join-group") {
      const { groupId, userId } = req.body || {};
      if (!groupId || !userId) return res.status(400).json({ error: "groupId, userId required" });
      const data = await sb("community_members", "POST", {
        group_id: groupId,
        user_id: userId,
        role: "member",
      }, token);
      return res.status(200).json({ ok: true, member: Array.isArray(data) ? data[0] : data });
    }

    // ── GET MY MEMBERSHIPS ─────────────────────────────────────
    if (action === "my-groups") {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId required" });
      const data = await sb(
        `community_members?user_id=eq.${userId}&select=group_id,role`,
        "GET", null, token
      );
      return res.status(200).json({ memberships: Array.isArray(data) ? data : [] });
    }

    // ── CREATE GROUP ───────────────────────────────────────────
    if (action === "create-group") {
      const { name, description, pillar, emoji, isPrivate, minTier, createdBy } = req.body || {};
      if (!name || !pillar || !createdBy) {
        return res.status(400).json({ error: "name, pillar, createdBy required" });
      }
      const data = await sb("community_groups", "POST", {
        name, description, pillar,
        emoji: emoji || "🌿",
        is_private: isPrivate || false,
        min_tier: minTier || "seed",
        created_by: createdBy,
        is_official: false,
        member_count: 1,
      }, token);
      const group = Array.isArray(data) ? data[0] : data;
      if (group?.id) {
        // Auto-join como admin
        await sb("community_members", "POST", {
          group_id: group.id,
          user_id: createdBy,
          role: "admin",
        }, token);
      }
      return res.status(200).json({ group });
    }

    // ── FOUNDERS COUNT ─────────────────────────────────────────
    if (action === "founders-count") {
      const data = await sb(
        "founders_program?select=id&order=founder_number.asc",
        "GET", null, token
      );
      const count = Array.isArray(data) ? data.length : 0;
      return res.status(200).json({ count, remaining: 100 - count });
    }

    return res.status(200).json({ ok: true, action });

  } catch (err) {
    console.error("[community]", err.message);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
