import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════
   TOKENS
═══════════════════════════════════ */
const C = {
  bg0:"#02060a", bg2:"#0a1410", bg3:"#0e1c16",
  green:"#2dff8c", teal:"#00e5c8", gold:"#d4a843",
  red:"#ff5757", purple:"#a78bfa",
  white:"#f0ede6", muted:"#3d5449",
  glass:"rgba(13,26,19,0.88)",
};

/* ═══════════════════════════════════
   CSS INJECTION
═══════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800;900&family=Satoshi:wght@300;400;500;700;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:${C.bg0};color:${C.white};font-family:'Satoshi',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(45,255,140,0.3);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(45,255,140,0.5)}70%{box-shadow:0 0 0 10px rgba(45,255,140,0)}100%{box-shadow:0 0 0 0 rgba(45,255,140,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scan{0%{top:-3%}100%{top:103%}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
@keyframes progress{from{width:0}to{width:100%}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

.btn-p{padding:11px 24px;border-radius:10px;border:none;background:${C.green};color:#020a06;font-size:12px;font-weight:800;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif;box-shadow:0 0 24px rgba(45,255,140,0.3);letter-spacing:.01em;white-space:nowrap}
.btn-p:hover{background:#4fffa8;box-shadow:0 0 40px rgba(45,255,140,0.5);transform:translateY(-1px)}
.btn-p:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-g{padding:10px 20px;border-radius:10px;border:1px solid rgba(45,255,140,0.25);background:transparent;color:${C.green};font-size:12px;font-weight:600;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif;white-space:nowrap}
.btn-g:hover{background:rgba(45,255,140,0.07);border-color:rgba(45,255,140,0.45)}
.btn-ghost{padding:8px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(240,237,230,0.5);font-size:11px;cursor:pointer;transition:all .2s;font-family:'Satoshi',sans-serif}
.btn-ghost:hover{border-color:rgba(255,255,255,0.18);color:${C.white}}
.btn-ghost.act{border-color:rgba(45,255,140,0.35);background:rgba(45,255,140,0.07);color:${C.green}}

.card{background:${C.glass};border:1px solid rgba(45,255,140,0.1);border-radius:20px;padding:22px 24px;backdrop-filter:blur(20px)}
.card-sm{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px 16px;transition:all .3s;cursor:pointer}
.card-sm:hover{border-color:rgba(45,255,140,0.25);background:rgba(45,255,140,0.04);transform:translateY(-2px)}
.card-sm.active-card{border-color:rgba(45,255,140,0.4);background:rgba(45,255,140,0.06)}

.tag{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.tag-green{background:rgba(45,255,140,0.1);border:1px solid rgba(45,255,140,0.2);color:${C.green}}
.tag-gold{background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.2);color:${C.gold}}
.tag-teal{background:rgba(0,229,200,0.1);border:1px solid rgba(0,229,200,0.2);color:${C.teal}}
.tag-purple{background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);color:${C.purple}}
.tag-red{background:rgba(255,87,87,0.1);border:1px solid rgba(255,87,87,0.2);color:${C.red}}

.inp{width:100%;padding:12px 16px;border-radius:11px;border:1px solid rgba(45,255,140,0.15);background:rgba(255,255,255,0.03);color:${C.white};font-size:13px;outline:none;font-family:'Satoshi',sans-serif;transition:border-color .25s}
.inp:focus{border-color:rgba(45,255,140,0.4);background:rgba(45,255,140,0.02)}
select.inp option{background:#0a1410}

.progress-bar{height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,${C.green},${C.teal});transition:width .4s ease;box-shadow:0 0 6px ${C.green}}

.vid-thumb{position:relative;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#030a06,#071510);cursor:pointer;transition:all .3s}
.vid-thumb:hover{transform:scale(1.02);box-shadow:0 20px 50px rgba(0,0,0,0.6)}
.vid-thumb .play-btn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(2,6,10,0);transition:background .25s}
.vid-thumb:hover .play-btn{background:rgba(2,6,10,0.3)}
.vid-thumb .play-ic{width:44px;height:44px;border-radius:50%;background:rgba(45,255,140,0.15);border:1.5px solid rgba(45,255,140,0.5);display:flex;align-items:center;justify-content:center;font-size:16px;color:${C.green};box-shadow:0 0 30px rgba(45,255,140,0.3);transition:all .25s}
.vid-thumb:hover .play-ic{transform:scale(1.1);box-shadow:0 0 50px rgba(45,255,140,0.5)}

.series-badge{position:absolute;top:10px;left:10px;background:rgba(2,6,10,0.88);backdrop-filter:blur(10px);border-radius:8px;padding:4px 10px;display:flex;align-items:center;gap:5px}
.dur-badge{position:absolute;bottom:10px;right:10px;background:rgba(2,6,10,0.85);backdrop-filter:blur(10px);border-radius:7px;padding:4px 8px;font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(240,237,230,0.6)}
.week-badge{position:absolute;bottom:10px;left:10px;background:rgba(45,255,140,0.15);border:1px solid rgba(45,255,140,0.3);border-radius:7px;padding:4px 10px;font-family:'JetBrains Mono',monospace;font-size:9px;color:${C.green}}

textarea.inp{resize:vertical;line-height:1.6}
`;

/* ═══════════════════════════════════
   CLAUDE API
═══════════════════════════════════ */
async function askClaude(system, user, tokens = 1000) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:tokens, system, messages:[{role:"user",content:user}] }),
  });
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

/* ═══════════════════════════════════
   DATA: VIDEO LIBRARY
═══════════════════════════════════ */
const CATEGORIES = [
  { id:"all",    label:"Todos",          icon:"✦" },
  { id:"immune", label:"Inmunidad",      icon:"🛡️" },
  { id:"energy", label:"Energía",        icon:"⚡" },
  { id:"digest", label:"Digestión",      icon:"🌿" },
  { id:"mental", label:"Bienestar mental",icon:"🧘" },
  { id:"weight", label:"Peso saludable", icon:"⚖️" },
  { id:"prevent",label:"Prevención",     icon:"🧬" },
];

const VIDEOS = [
  {
    id:1, week:"Semana 1", title:"Por qué la cúrcuma es el antiinflamatorio natural más poderoso",
    cat:"immune", duration:"1:56", views:2840, likes:312,
    tier:"seed", new:true, featured:true,
    desc:"Descubre los compuestos activos de la cúrcuma y cómo potenciarla combinándola con pimienta negra y grasas saludables. Incluye receta del Golden Smoothie.",
    tags:["Antiinflamatorio","Curcumina","Pimienta negra"],
    color:C.gold, emoji:"🧡",
    thumb_emoji:"🌿",
  },
  {
    id:2, week:"Semana 2", title:"El intestino: tu segundo cerebro y cómo alimentarlo",
    cat:"digest", duration:"2:10", views:1940, likes:198,
    tier:"seed", new:true,
    desc:"La conexión intestino-cerebro explicada sin tecnicismos. Los 5 ingredientes que transforman tu microbioma en 30 días.",
    tags:["Microbioma","Probióticos","Kéfir"],
    color:C.green, emoji:"🌿",
    thumb_emoji:"🦠",
  },
  {
    id:3, week:"Semana 3", title:"Cortisol y estrés: los smoothies adaptogénicos que te salvan",
    cat:"mental", duration:"1:48", views:3120, likes:445,
    tier:"bloom",
    desc:"Ashwagandha, maca y schisandra — cómo los adaptógenos regulan el eje HPA y reducen el cortisol sin medicamentos.",
    tags:["Adaptógenos","Cortisol","Ashwagandha"],
    color:C.purple, emoji:"🧘",
    thumb_emoji:"🌸",
  },
  {
    id:4, week:"Semana 4", title:"Glucosa estable = energía constante: el protocolo verde",
    cat:"energy", duration:"2:05", views:2210, likes:287,
    tier:"bloom",
    desc:"La glicemia y su impacto en la fatiga. El Protocolo Verde de 7 días para nivelar tu energía sin picos ni caídas.",
    tags:["Glucosa","Energía","Metabolismo"],
    color:C.teal, emoji:"⚡",
    thumb_emoji:"🍏",
  },
  {
    id:5, week:"Semana 5", title:"Detox real: lo que la ciencia dice (y lo que no)",
    cat:"digest", duration:"1:35", views:1780, likes:156,
    tier:"seed",
    desc:"Mitos y verdades del detox. Qué hace realmente el hígado, cómo apoyarlo con alimentos reales sin ayunos extremos.",
    tags:["Detox","Hígado","Mitos"],
    color:C.green, emoji:"🍃",
    thumb_emoji:"🫀",
  },
  {
    id:6, week:"Semana 6", title:"Historial familiar: cómo prevenir lo que heredaste",
    cat:"prevent", duration:"2:20", views:4100, likes:512,
    tier:"canopy", new:true,
    desc:"Epigenética aplicada al bienestar: cómo tus hábitos pueden apagar genes de riesgo. Plan específico para diabetes, hipertensión y cardiopatías familiares.",
    tags:["Epigenética","Prevención","Genética"],
    color:C.red, emoji:"🧬",
    thumb_emoji:"🔬",
  },
];

const TIER_COLOR = { seed:C.gold, bloom:C.green, canopy:C.teal };
const TIER_LABEL = { seed:"🌱 Seed+", bloom:"🌿 Bloom+", canopy:"🌳 Canopy" };

/* ═══════════════════════════════════
   VIDEO THUMBNAIL
═══════════════════════════════════ */
function VideoThumb({ v, onClick, size="normal" }) {
  const h = size === "featured" ? 260 : size === "small" ? 140 : 180;
  return (
    <div className="vid-thumb" style={{ height:h }} onClick={() => onClick(v)}>
      {/* Background gradient */}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${C.bg0},${v.color}18,${C.bg0})` }} />
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 50%,rgba(45,255,140,0.06) 0%,transparent 70%)" }} />
      {/* Scan line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${v.color}60,transparent)`, animation:"scan 4s linear infinite" }} />
      {/* Center emoji */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size==="small"?40:56, opacity:0.18 }}>{v.thumb_emoji}</div>
      {/* Play */}
      <div className="play-btn"><div className="play-ic">▶</div></div>
      {/* Top badges */}
      <div className="series-badge">
        <span className={`tag tag-${v.tier==="seed"?"gold":v.tier==="bloom"?"green":"teal"}`}>{TIER_LABEL[v.tier]}</span>
        {v.new && <span className="tag tag-red">NEW</span>}
      </div>
      {/* Bottom */}
      <div className="week-badge">{v.week}</div>
      <div className="dur-badge">⏱ {v.duration}</div>
    </div>
  );
}

/* ═══════════════════════════════════
   VIDEO PLAYER MODAL
═══════════════════════════════════ */
function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(2,6,10,0.92)", backdropFilter:"blur(20px)" }} />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480, animation:"fadeUp 0.4s ease" }} onClick={e=>e.stopPropagation()}>
        {/* Video player (portrait 9:16) */}
        <div style={{ background:`linear-gradient(135deg,${C.bg0},${video.color}15,${C.bg0})`, borderRadius:20, border:`1px solid ${video.color}30`, overflow:"hidden", position:"relative", aspectRatio:"9/16", maxHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(45,255,140,0.01) 0px,rgba(45,255,140,0.01) 1px,transparent 1px,transparent 4px)" }} />
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${video.color}80,transparent)`, animation:"scan 3s linear infinite" }} />
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, zIndex:1, padding:32, textAlign:"center" }}>
            <div style={{ fontSize:72, animation:"floatY 3s ease-in-out infinite" }}>{video.thumb_emoji}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:video.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>Reproduciendo</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, lineHeight:1.4 }}>{video.title}</div>
            {/* Fake progress */}
            <div style={{ width:"100%", marginTop:8 }}>
              <div className="progress-bar" style={{ marginBottom:6 }}>
                <div className="progress-fill" style={{ width:"35%", animation:"progress 116s linear" }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted }}>
                <span>0:41</span><span>{video.duration}</span>
              </div>
            </div>
            {/* Note about real video */}
            <div style={{ background:"rgba(45,255,140,0.06)", border:"1px solid rgba(45,255,140,0.15)", borderRadius:10, padding:"10px 14px", fontSize:10, color:C.muted, lineHeight:1.6, marginTop:4 }}>
              🎬 Video real generado con HeyGen Avatar<br/>
              <span style={{ color:video.color }}>Conecta tu API key para reproducción en producción</span>
            </div>
          </div>
          {/* Avatar overlay bottom */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(0deg,rgba(2,6,10,0.9),transparent)", padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${C.bg2},${C.bg3})`, border:`1.5px solid ${video.color}60`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🧑‍⚕️</div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.white }}>Dr. Smoothie</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:video.color, textTransform:"uppercase", letterSpacing:"0.06em" }}>{video.week} · Serie Semanal</div>
              </div>
            </div>
          </div>
        </div>
        {/* Info */}
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <button className="btn-p" style={{ flex:1 }}>⬇️ Descargar</button>
          <button className="btn-g" style={{ flex:1 }}>📲 Compartir</button>
          <button className="btn-ghost" onClick={onClose} style={{ flexShrink:0 }}>✕ Cerrar</button>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {video.tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   GENERATOR PANEL
═══════════════════════════════════ */
function GeneratorPanel() {
  const [topic,   setTopic]   = useState("");
  const [cat,     setCat]     = useState("immune");
  const [tier,    setTier]    = useState("seed");
  const [dur,     setDur]     = useState("2");
  const [phase,   setPhase]   = useState("idle"); // idle|script|video|done|error
  const [script,  setScript]  = useState("");
  const [pct,     setPct]     = useState(0);
  const [log,     setLog]     = useState("💡 Describe el tema y el AI generará el guión + video");
  const timer = useRef(null);

  const catOptions = CATEGORIES.filter(c => c.id !== "all");

  const generate = async () => {
    if (!topic.trim()) return;
    setPhase("script"); setScript(""); setPct(0);
    setLog("🤖 Claude generando guión educativo…");
    try {
      const s = await askClaude(
        `Eres el Dr. Smoothie, el educador de bienestar de dr.smoothie.ai (JRMB Food Network LLC).
        Genera un guión educativo para video vertical (9:16) de ${dur} minutos para la Serie Semanal de Salud.
        El tono es: cálido, educativo, científico pero accesible. Sin jerga médica excesiva.
        ESTRUCTURA:
        [0:00-0:10] Hook impactante — pregunta o dato sorprendente
        [0:10-0:35] El problema o concepto clave — por qué importa
        [0:35-1:20] La ciencia detrás — explicada con analogías simples
        [1:20-1:45] La solución práctica — smoothie o jugo específico con ingredientes
        [1:45-${dur}:00] Call to action — seguir el plan y qué esperar en 30 días
        CIERRE OBLIGATORIO: "Recuerda: esto es orientación nutricional de bienestar alternativo. Consulta siempre a tu médico."
        Responde SOLO el guión de voz, sin acotaciones, sin formato especial. Máximo ${parseInt(dur)*130} palabras.`,
        `Tema: ${topic}. Categoría: ${cat}. Nivel de membresía: ${tier}. Audiencia: personas buscando bienestar alternativo a través de smoothies y jugos naturales.`,
        900
      );
      setScript(s.trim());
      setLog("✅ Guión listo — generando video con HeyGen…");
      setPhase("video");
      let p = 0;
      timer.current = setInterval(() => {
        p += Math.random() * 4 + 2;
        if (p >= 98) { p = 98; clearInterval(timer.current); }
        setPct(Math.round(Math.min(p, 98)));
      }, 600);
      await new Promise(r => setTimeout(r, 9000));
      clearInterval(timer.current); setPct(100);
      setPhase("done");
      setLog("🎬 Video listo · 9:16 · " + (tier === "canopy" ? "4K" : "1080p") + " · Disponible en la biblioteca");
    } catch {
      setPhase("error");
      setLog("❌ Error de conexión — verifica e intenta de nuevo");
    }
  };

  const reset = () => { clearInterval(timer.current); setPhase("idle"); setScript(""); setPct(0); setLog("💡 Describe el tema y el AI generará el guión + video"); setTopic(""); };

  const busy = phase === "script" || phase === "video";

  return (
    <div className="card" style={{ animation:"fadeUp 0.5s ease" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>⚡ Generador de Serie Semanal</div>
          <div style={{ fontSize:16, fontWeight:700, color:C.white }}>Crear nuevo episodio educativo</div>
        </div>
        <span className="tag tag-teal">Claude + HeyGen</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Categoría</div>
          <select className="inp" value={cat} onChange={e=>setCat(e.target.value)} disabled={busy}>
            {catOptions.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Para tier</div>
          <select className="inp" value={tier} onChange={e=>setTier(e.target.value)} disabled={busy}>
            <option value="seed">🌱 Seed (todos)</option>
            <option value="bloom">🌿 Bloom+</option>
            <option value="canopy">🌳 Canopy exclusivo</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom:12 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>📝 Tema del episodio</div>
        <textarea className="inp" rows={2} placeholder="Ej: El poder del jengibre para reducir la inflamación crónica y mejorar la digestión…" value={topic} onChange={e=>setTopic(e.target.value)} disabled={busy} />
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Duración</div>
        <div style={{ display:"flex", gap:8 }}>
          {["1","2","3"].map(d => (
            <div key={d} onClick={() => !busy && setDur(d)} style={{ flex:1, padding:"9px", borderRadius:10, border:`1px solid ${dur===d?"rgba(45,255,140,0.4)":"rgba(255,255,255,0.07)"}`, background:dur===d?"rgba(45,255,140,0.08)":"rgba(255,255,255,0.02)", cursor:busy?"not-allowed":"pointer", textAlign:"center", fontSize:12, fontWeight:700, color:dur===d?C.green:"rgba(240,237,230,0.5)", transition:"all .2s" }}>
              {d} min
            </div>
          ))}
        </div>
      </div>

      {/* Log */}
      <div style={{ background:"#020806", border:"1px solid rgba(45,255,140,0.1)", borderLeft:"3px solid rgba(45,255,140,0.4)", borderRadius:11, padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(45,255,140,0.75)", marginBottom:12, lineHeight:1.6 }}>{log}</div>

      {/* Progress */}
      {(phase === "video" || phase === "done") && (
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>
            <span style={{ color:C.muted }}>HeyGen rendering · 9:16 · {tier==="canopy"?"4K":"1080p"}</span>
            <span style={{ color:C.green, fontWeight:700 }}>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width:`${pct}%` }} />
          </div>
        </div>
      )}

      {/* Script preview */}
      {script && (
        <div style={{ background:"rgba(45,255,140,0.03)", border:"1px solid rgba(45,255,140,0.1)", borderRadius:12, padding:"13px 16px", marginBottom:12, maxHeight:120, overflowY:"auto" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>📝 Guión generado · Claude Sonnet-4</div>
          <p style={{ fontSize:11, color:"rgba(240,237,230,0.55)", lineHeight:1.7, fontStyle:"italic" }}>"{script.substring(0,300)}…"</p>
        </div>
      )}

      {/* Actions */}
      {phase === "idle"   && <button className="btn-p" style={{ width:"100%", padding:13 }} onClick={generate} disabled={!topic.trim()}>🤖 Generar episodio con AI</button>}
      {phase === "script" && <button className="btn-p" style={{ width:"100%" }} disabled><span style={{ animation:"spin 1s linear infinite", display:"inline-block", marginRight:8 }}>⟳</span>Claude generando guión…</button>}
      {phase === "video"  && <button className="btn-p" style={{ width:"100%" }} disabled><span style={{ animation:"spin 1s linear infinite", display:"inline-block", marginRight:8 }}>⟳</span>HeyGen renderizando video…</button>}
      {phase === "done"   && (
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-p" style={{ flex:1 }}>✅ Publicar en biblioteca</button>
          <button className="btn-g" style={{ flex:1 }}>⬇️ Descargar MP4</button>
          <button className="btn-ghost" onClick={reset}>↺</button>
        </div>
      )}
      {phase === "error"  && <button className="btn-ghost" style={{ width:"100%" }} onClick={reset}>↺ Intentar de nuevo</button>}
    </div>
  );
}

/* ═══════════════════════════════════
   STATS ROW
═══════════════════════════════════ */
function StatsRow() {
  const stats = [
    { val:"6", unit:"episodios", label:"Publicados esta temporada", c:C.green },
    { val:"15K", unit:"vistas", label:"Total acumulado este mes", c:C.teal },
    { val:"94%", unit:"retención", label:"Promedio de visualización", c:C.gold },
    { val:"Sem 7", unit:"próximo", label:"En producción · Lunes 12", c:C.purple },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:"14px 16px", borderTop:`2px solid ${s.c}` }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, color:s.c, lineHeight:1, marginBottom:3 }}>{s.val}<span style={{ fontSize:14, color:C.muted, fontFamily:"'Satoshi',sans-serif", fontWeight:400 }}> {s.unit}</span></div>
          <div style={{ fontSize:10, color:C.muted, lineHeight:1.4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function WeeklySeriesModule() {
  const [activeTab,  setActiveTab]  = useState("library");
  const [activeCat,  setActiveCat]  = useState("all");
  const [playingVid, setPlayingVid] = useState(null);
  const [notify,     setNotify]     = useState(true);

  useEffect(() => {
    if (!document.getElementById("ws-css")) {
      const s = document.createElement("style"); s.id = "ws-css"; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  const filtered = activeCat === "all" ? VIDEOS : VIDEOS.filter(v => v.cat === activeCat);
  const featured = VIDEOS.find(v => v.featured);

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"24px 20px 60px" }}>

      {/* ── HEADER ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, border:"1px solid rgba(45,255,140,0.2)", background:"rgba(45,255,140,0.05)", borderRadius:100, padding:"4px 13px 4px 8px", marginBottom:12 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.green, letterSpacing:"0.1em", textTransform:"uppercase" }}>Serie Semanal · dr.smoothie.ai</span>
          </div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:900, letterSpacing:"-0.04em", color:C.white, lineHeight:1, marginBottom:8 }}>
            Educación en<br/><span style={{ color:C.green }}>salud semanal</span>
          </h1>
          <p style={{ fontSize:13, color:C.muted, maxWidth:420, lineHeight:1.7 }}>
            Cada semana, el Dr. Smoothie publica un video educativo exclusivo para los miembros. Ciencia real, explicada de forma accesible, con una recomendación práctica de smoothie o jugo.
          </p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end" }}>
          <div style={{ display:"flex", gap:8 }}>
            <button className={`btn-ghost${notify?" act":""}`} onClick={() => setNotify(!notify)}>
              {notify ? "🔔 Notificaciones ON" : "🔕 Activar notificaciones"}
            </button>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, textAlign:"right", lineHeight:1.8 }}>
            Nuevo episodio · cada lunes<br/>
            <span style={{ color:C.green }}>Próximo: Semana 7 · Lun 12</span>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <StatsRow />

      {/* ── TABS ── */}
      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:16 }}>
        {[["library","📚 Biblioteca"],["generator","⚡ Crear episodio"],["schedule","📅 Calendario"]].map(([id,l]) => (
          <button key={id} className={`btn-ghost${activeTab===id?" act":""}`} onClick={() => setActiveTab(id)} style={{ fontSize:12 }}>{l}</button>
        ))}
      </div>

      {/* ══════════ LIBRARY TAB ══════════ */}
      {activeTab === "library" && (
        <div style={{ animation:"fadeIn 0.4s ease" }}>

          {/* Featured */}
          {featured && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>⭐ Destacado esta semana</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:16, background:C.glass, border:"1px solid rgba(45,255,140,0.15)", borderRadius:22, padding:18, backdropFilter:"blur(20px)" }}>
                <VideoThumb v={featured} onClick={setPlayingVid} size="featured" />
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"4px 0" }}>
                  <div>
                    <div style={{ display:"flex", gap:7, marginBottom:12, flexWrap:"wrap" }}>
                      <span className="tag tag-green">{featured.week}</span>
                      <span className="tag tag-gold">DESTACADO</span>
                    </div>
                    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-0.03em", color:C.white, marginBottom:10, lineHeight:1.25 }}>{featured.title}</h2>
                    <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:16 }}>{featured.desc}</p>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                      {featured.tags.map(t => <span key={t} className="tag tag-teal">{t}</span>)}
                    </div>
                    <div style={{ display:"flex", gap:16, fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted }}>
                      <span>👁 {featured.views.toLocaleString()}</span>
                      <span>❤️ {featured.likes}</span>
                      <span>⏱ {featured.duration}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, marginTop:16 }}>
                    <button className="btn-p" onClick={() => setPlayingVid(featured)}>▶ Ver episodio</button>
                    <button className="btn-g">📲 Compartir</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category filter */}
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c.id} className={`btn-ghost${activeCat===c.id?" act":""}`} style={{ fontSize:11 }} onClick={() => setActiveCat(c.id)}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Video grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {filtered.map(v => (
              <div key={v.id} style={{ animation:"fadeUp 0.4s ease" }}>
                <VideoThumb v={v} onClick={setPlayingVid} />
                <div style={{ padding:"10px 4px" }}>
                  <div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}>
                    <span className={`tag tag-${v.tier==="seed"?"gold":v.tier==="bloom"?"green":"teal"}`}>{TIER_LABEL[v.tier]}</span>
                    {v.new && <span className="tag tag-red">NEW</span>}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.white, lineHeight:1.35, marginBottom:6, cursor:"pointer" }} onClick={() => setPlayingVid(v)}>{v.title}</div>
                  <div style={{ display:"flex", gap:12, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted }}>
                    <span>👁 {v.views.toLocaleString()}</span>
                    <span>❤️ {v.likes}</span>
                    <span>⏱ {v.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ GENERATOR TAB ══════════ */}
      {activeTab === "generator" && (
        <div style={{ animation:"fadeIn 0.4s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:20 }}>
            <GeneratorPanel />
            {/* Tips panel */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div className="card">
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>💡 Ideas para próximos episodios</div>
                {[
                  { icon:"🫀", idea:"El omega-3 y la salud cardiovascular: más allá del pescado" },
                  { icon:"🧠", idea:"Neuroinflammación: cómo tu smoothie afecta tu foco mental" },
                  { icon:"🌙", idea:"Melatonina natural: ingredientes que mejoran tu sueño" },
                  { icon:"💪", idea:"Proteína vegetal completa: combinaciones perfectas" },
                  { icon:"🩸", idea:"Hierro y anemia: absorción con vitamina C en jugos" },
                  { icon:"🌡️", idea:"Sistema inmune: el protocolo de invierno con 5 ingredientes" },
                ].map(t => (
                  <div key={t.idea} className="card-sm" style={{ marginBottom:8, padding:"9px 12px" }}>
                    <div style={{ fontSize:12, display:"flex", gap:8, alignItems:"flex-start" }}>
                      <span style={{ flexShrink:0 }}>{t.icon}</span>
                      <span style={{ color:"rgba(240,237,230,0.65)", lineHeight:1.4 }}>{t.idea}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background:"rgba(212,168,67,0.04)", borderColor:"rgba(212,168,67,0.15)" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.gold, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>📐 Especificaciones de producción</div>
                {[["Formato","9:16 vertical (576×1024)"],["Audio","Español · voz HeyGen avatar"],["Duración","1-3 minutos por episodio"],["Calidad","1080p Seed/Bloom · 4K Canopy"],["Frecuencia","1 episodio por semana · lunes"],["Distribución","App + TikTok + Reels + WA"],].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:11 }}>
                    <span style={{ color:C.muted }}>{k}</span>
                    <span style={{ color:C.white, fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SCHEDULE TAB ══════════ */}
      {activeTab === "schedule" && (
        <div style={{ animation:"fadeIn 0.4s ease" }}>
          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:18 }}>📅 Calendario de publicación · Temporada 1</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[...VIDEOS, { id:7, week:"Semana 7", title:"Próximo episodio en producción…", cat:"immune", duration:"~2:00", tier:"seed", scheduled:true }, { id:8, week:"Semana 8", title:"Planeado · Tema por confirmar", cat:"energy", duration:"~2:00", tier:"bloom", planned:true }].map(v => (
                <div key={v.id} style={{ display:"flex", gap:14, alignItems:"center", padding:"12px 16px", background:v.scheduled?"rgba(45,255,140,0.04)":v.planned?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.03)", border:`1px solid ${v.scheduled?"rgba(45,255,140,0.2)":v.planned?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.07)"}`, borderRadius:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`rgba(${v.scheduled?"45,255,140":v.planned?"255,255,255":"212,168,67"},0.08)`, border:`1px solid rgba(${v.scheduled?"45,255,140":v.planned?"255,255,255":"212,168,67"},0.2)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                    {v.scheduled ? "⚙️" : v.planned ? "📋" : "✅"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:v.scheduled||v.planned?"rgba(240,237,230,0.4)":C.white, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.title}</div>
                    <div style={{ display:"flex", gap:8, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted }}>
                      <span>{v.week}</span>
                      {v.duration && <span>⏱ {v.duration}</span>}
                      {v.cat && <span style={{ textTransform:"uppercase" }}>{CATEGORIES.find(c=>c.id===v.cat)?.icon} {v.cat}</span>}
                    </div>
                  </div>
                  <span className={`tag tag-${v.scheduled?"teal":v.planned?"purple":v.tier==="seed"?"gold":v.tier==="bloom"?"green":"teal"}`}>
                    {v.scheduled ? "EN PRODUCCIÓN" : v.planned ? "PLANEADO" : "PUBLICADO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Impact section */}
          <div className="card" style={{ background:"linear-gradient(135deg,rgba(45,255,140,0.04),rgba(0,229,200,0.04))", borderColor:"rgba(45,255,140,0.15)" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>🎯 Por qué la Serie Semanal es el activo más valioso</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { icon:"🔁", title:"Retención 3x mayor", desc:"Miembros que consumen la serie tienen 3x más probabilidad de renovar su membresía" },
                { icon:"📲", title:"Marketing viral gratuito", desc:"Cada video compartido en TikTok/Reels adquiere nuevos miembros sin costo publicitario" },
                { icon:"🧠", title:"Crea conciencia real", desc:"La educación semanal transforma hábitos — el miembro ve resultados y los atribuye a la plataforma" },
                { icon:"💎", title:"Justifica Canopy $79", desc:"Acceso exclusivo a episodios 4K + sin anuncios es por sí solo razón para subir de tier" },
              ].map(s => (
                <div key={s.title} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 14px" }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.white, marginBottom:5 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:C.muted, lineHeight:1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL ── */}
      {playingVid && <VideoModal video={playingVid} onClose={() => setPlayingVid(null)} />}

    </div>
  );
}
