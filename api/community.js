export default async function handler(req, res) {
  const ALLOWED = ["https://purelifewellnessclub.org","https://purelife-app-umber.vercel.app","http://localhost:5173"];
  const origin = req.headers.origin || "";
  res.setHeader("Access-Control-Allow-Origin", ALLOWED.includes(origin) ? origin : ALLOWED[0]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  
  const action = req.query?.action;
  const SUPA = "https://efatctcxlcotsgxhmgjg.supabase.co";
  const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  const sb = (path) => fetch(`${SUPA}${path}`, {headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,"Content-Type":"application/json"}}).then(r=>r.json());
  if (action === "get-groups") {
    const data = await sb("/rest/v1/community_groups?select=*&order=member_count.desc&limit=20").catch(()=>[]);
    return res.status(200).json({ groups: Array.isArray(data) ? data : [] });
  }
  return res.status(200).json({ ok: true, action });
}
