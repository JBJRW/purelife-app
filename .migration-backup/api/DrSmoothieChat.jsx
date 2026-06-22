import { useState, useRef, useEffect, useCallback } from "react";

const WELLNESS_SYSTEM_PROMPT = `You are Dr. Smoothie AI, the intelligent wellness advisor for PureLife Wellness Club — a premium global digital health platform. You provide personalized nutritional guidance through smoothie and juice combinations based on ingredient science. This is NOT medical advice.

INGREDIENT DATABASE:
- Spinach: Iron 2.7mg, Folate 194mcg, Vitamin K. Pairs: banana, mango, ginger
- Kale: Vitamin C 120mg, lutein, zeaxanthin. Pairs: pineapple, lemon, apple
- Mango: beta-carotene, digestive enzymes. Pairs: turmeric, coconut, lime
- Pineapple: Bromelain anti-inflammatory. Pairs: ginger, turmeric, mint
- Banana: Potassium 358mg, B6. Pairs: almond milk, cocoa, berries
- Blueberry: Anthocyanins, Vitamin C. Pairs: acai, spinach, almond milk
- Turmeric: Curcumin anti-inflammatory, needs black pepper. Pairs: mango, ginger
- Ginger: thermogenic, anti-nausea. Pairs: lemon, turmeric, carrot
- Matcha: L-theanine + caffeine, EGCG. Pairs: almond milk, banana
- Spirulina: 60% protein, B12. Pairs: banana, mango, pineapple

HEALTH PROTOCOLS:
- Energy: Matcha + banana + spinach + almond milk (pre-workout)
- Immunity: Orange + ginger + turmeric + carrot + lemon (morning)
- Anti-inflammatory: Tart cherry + beet + ginger + turmeric (post-workout)
- Gut health: Papaya + pineapple + ginger + coconut water (morning)
- Skin glow: Cucumber + watermelon + mint + lime (midday)
- Focus: Matcha + lion's mane + almond milk + banana (morning)
- Weight: Green apple + celery + cucumber + ginger + lemon (morning)

MEMBERSHIP: Seed $29 | Bloom $49 | Canopy $79/mo
STYLE: Warm, science-backed, 150-300 words, end with call-to-action.`;

const C = { hit: "#00C896", write: "#F5A623", idle: "#A0AEC0" };
const fmtMs = (ms) => ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(1)}s`;
const fmtN = (n) => n?.toLocaleString() ?? "—";

export default function DrSmoothieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [saved, setSaved] = useState(0);
  const [calls, setCalls] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput(""); setError(null);
    const t0 = Date.now();
    const userMsg = { role: "user", content: text, id: Date.now() };
    setMessages(p => [...p, userMsg]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: [{ type: "text", text: WELLNESS_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: [...history, { role: "user", content: text }],
        }),
      });
      const elapsed = Date.now() - t0;
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `Error ${res.status}`); }
      const data = await res.json();
      const txt = data.content?.[0]?.text ?? "Sin respuesta.";
      const u = data.usage ?? {};
      const cr = u.cache_read_input_tokens ?? 0;
      const cw = u.cache_creation_input_tokens ?? 0;
      const inp = u.input_tokens ?? 0;
      const out = u.output_tokens ?? 0;
      const std = ((inp + cr) / 1e6) * 3;
      const act = (inp/1e6)*3 + (cw/1e6)*3.75 + (cr/1e6)*0.3 + (out/1e6)*15;
      const sv = Math.max(0, std - act);
      const s = { elapsed, cr, cw, inp, out, hit: cr > 0, sv, n: calls + 1 };
      setStats(s); setSaved(p => p + sv); setCalls(p => p + 1);
      setMessages(p => [...p, { role: "assistant", content: txt, id: Date.now()+1, stats: s }]);
    } catch(e) { setError(e.message); setMessages(p => p.slice(0,-1)); }
    finally { setLoading(false); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [input, loading, messages, calls]);

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const quick = ["Smoothie para energía hoy","Fortalecer inmunidad","Receta anti-inflamatoria","Piel radiante","Concentración mental","Perder peso"];

  return (
    <div style={S.root}>
      <div style={S.bg} />
      <header style={S.hdr}>
        <div style={S.logo}>
          <span style={{fontSize:26}}>🌿</span>
          <div>
            <div style={S.ltitle}>Dr. Smoothie AI</div>
            <div style={S.lsub}>PureLife Wellness Club</div>
          </div>
        </div>
        <div style={S.hright}>
          <button style={{...S.badge, borderColor: stats ? (stats.hit ? C.hit : C.write) : C.idle}} onClick={() => setShowStats(!showStats)}>
            <span style={{...S.dot, background: stats ? (stats.hit ? C.hit : C.write) : C.idle}} />
            {stats ? (stats.hit ? "⚡ Cache HIT" : "✍️ Cache WRITE") : "TurboQuant Ready"}
          </button>
          {calls > 0 && <div style={S.sv}>💰 ${(saved*100).toFixed(4)}¢</div>}
        </div>
      </header>

      {showStats && stats && (
        <div style={S.panel}>
          <div style={S.ptitle}>📊 Métricas — Llamada #{stats.n}</div>
          <div style={S.grid}>
            {[["⚡ Cacheados",fmtN(stats.cr),C.hit],["✍️ Escritos",fmtN(stats.cw),C.write],["📥 Input",fmtN(stats.inp),"#6B9FFF"],["📤 Output",fmtN(stats.out),"#B794F4"],["⏱ Latencia",fmtMs(stats.elapsed),"#F6AD55"],["💰 Ahorro",`$${(saved*100).toFixed(4)}¢`,C.hit]].map(([l,v,c]) => (
              <div key={l} style={{...S.sc, borderColor:c+"40"}}>
                <div style={{fontSize:14,color:c}}>{l.split(" ")[0]}</div>
                <div style={{fontSize:18,fontWeight:700,color:c,lineHeight:1.2}}>{v}</div>
                <div style={{fontSize:10,color:"rgba(232,240,232,0.45)"}}>{l.split(" ").slice(1).join(" ")}</div>
              </div>
            ))}
          </div>
          <div style={S.exp}>{stats.hit ? `✅ Cache HIT — ${fmtN(stats.cr)} tokens comprimidos. 90% descuento aplicado.` : `📝 Cache WRITE — System prompt guardado. Próximas llamadas 90% más baratas.`}</div>
        </div>
      )}

      <div style={S.msgs}>
        {messages.length === 0 && (
          <div style={S.empty}>
            <div style={{fontSize:56,marginBottom:12,filter:"drop-shadow(0 0 16px rgba(0,200,120,0.4))"}}>🌱</div>
            <h2 style={S.etitle}>¿Qué necesita tu cuerpo hoy?</h2>
            <p style={S.esub}>Nutrición inteligente con IA · TurboQuant Fase 1 activo</p>
            <div style={S.qgrid}>
              {quick.map(q => (
                <button key={q} style={S.qbtn} onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}>🌿 {q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{...S.row, justifyContent: m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant" && <div style={S.av}>🌿</div>}
            <div style={{maxWidth:"72%",display:"flex",flexDirection:"column",gap:4}}>
              <div style={{...S.bubble, ...(m.role==="user"?S.buser:S.bai)}}>{m.content}</div>
              {m.role==="assistant" && m.stats && (
                <div style={{display:"flex",gap:8,paddingLeft:4,alignItems:"center"}}>
                  <span style={{fontSize:11,fontWeight:600,color:m.stats.hit?C.hit:C.write}}>{m.stats.hit?"⚡ cache hit":"✍️ cache write"}</span>
                  <span style={{fontSize:11,color:"rgba(232,240,232,0.3)"}}>{fmtMs(m.stats.elapsed)}</span>
                </div>
              )}
            </div>
            {m.role==="user" && <div style={S.avu}>J</div>}
          </div>
        ))}
        {loading && (
          <div style={{...S.row,justifyContent:"flex-start"}}>
            <div style={S.av}>🌿</div>
            <div style={S.typing}>{[0,160,320].map(d => <span key={d} style={{...S.dot2,animationDelay:`${d}ms`}} />)}</div>
          </div>
        )}
        {error && (
          <div style={S.err}>
            <span>⚠️ {error}</span>
            <button style={{background:"none",border:"none",color:"#FCA5A5",cursor:"pointer"}} onClick={() => setError(null)}>✕</button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={S.foot}>
        <div style={S.irow}>
          <textarea ref={inputRef} style={S.ta} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Ingredientes, recetas, objetivos de salud..." rows={1} />
          <button style={{...S.sbtn, opacity:!input.trim()||loading?0.4:1}} onClick={send} disabled={!input.trim()||loading}>{loading?"◌":"↑"}</button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",maxWidth:800,margin:"6px auto 0"}}>
          <span style={S.hint}>Enter enviar · Shift+Enter nueva línea</span>
          <span style={S.hint}>🔒 KV Cache activo</span>
        </div>
      </div>
    </div>
  );
}

const S = {
  root:{minHeight:"100vh",background:"#0A0F0A",display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif",color:"#E8F0E8",position:"relative",overflow:"hidden"},
  bg:{position:"fixed",inset:0,background:"radial-gradient(ellipse 80% 50% at 20% 10%,rgba(0,200,120,0.06) 0%,transparent 60%)",pointerEvents:"none",zIndex:0},
  hdr:{position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"rgba(10,15,10,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,200,120,0.12)"},
  logo:{display:"flex",alignItems:"center",gap:10},
  ltitle:{fontSize:17,fontWeight:700,color:"#00C896",letterSpacing:"-0.5px",lineHeight:1.1},
  lsub:{fontSize:10,color:"rgba(232,240,232,0.5)",letterSpacing:"0.08em",textTransform:"uppercase"},
  hright:{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"},
  badge:{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:20,border:"1px solid",background:"rgba(255,255,255,0.04)",cursor:"pointer",fontSize:12,fontWeight:600,color:"#E8F0E8"},
  dot:{width:7,height:7,borderRadius:"50%",display:"inline-block"},
  sv:{fontSize:12,color:"#00C896",fontWeight:600,padding:"4px 10px",background:"rgba(0,200,150,0.1)",borderRadius:12,border:"1px solid rgba(0,200,150,0.2)"},
  panel:{zIndex:90,background:"rgba(12,18,12,0.95)",borderBottom:"1px solid rgba(0,200,120,0.15)",padding:"14px 20px",backdropFilter:"blur(20px)"},
  ptitle:{fontSize:12,fontWeight:700,color:"#00C896",marginBottom:10,letterSpacing:"0.05em",textTransform:"uppercase"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:10},
  sc:{background:"rgba(255,255,255,0.03)",border:"1px solid",borderRadius:8,padding:"8px 12px",display:"flex",flexDirection:"column",gap:2},
  exp:{fontSize:12,color:"rgba(232,240,232,0.6)",background:"rgba(0,200,120,0.06)",border:"1px solid rgba(0,200,120,0.15)",borderRadius:8,padding:"8px 12px",lineHeight:1.5},
  msgs:{flex:1,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:14,maxWidth:800,width:"100%",margin:"0 auto",zIndex:10,position:"relative"},
  empty:{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 20px 32px",textAlign:"center"},
  etitle:{fontSize:22,fontWeight:700,color:"#E8F0E8",marginBottom:8,letterSpacing:"-0.5px"},
  esub:{fontSize:13,color:"rgba(232,240,232,0.45)",marginBottom:24,lineHeight:1.6},
  qgrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,width:"100%",maxWidth:560},
  qbtn:{background:"rgba(0,200,120,0.07)",border:"1px solid rgba(0,200,120,0.2)",borderRadius:10,padding:"9px 14px",color:"#C8E8C8",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"inherit"},
  row:{display:"flex",alignItems:"flex-end",gap:8},
  av:{width:32,height:32,borderRadius:"50%",background:"rgba(0,200,120,0.15)",border:"1px solid rgba(0,200,120,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0},
  avu:{width:32,height:32,borderRadius:"50%",background:"rgba(0,200,120,0.2)",border:"1px solid rgba(0,200,120,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#00C896",flexShrink:0},
  bubble:{padding:"11px 15px",borderRadius:14,fontSize:14,lineHeight:1.65,wordBreak:"break-word",whiteSpace:"pre-wrap"},
  buser:{background:"rgba(0,200,120,0.18)",border:"1px solid rgba(0,200,120,0.25)",borderBottomRightRadius:4,color:"#E8F5E8"},
  bai:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderBottomLeftRadius:4,color:"#D8EDD8"},
  typing:{display:"flex",gap:5,padding:"12px 16px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,borderBottomLeftRadius:4,alignItems:"center"},
  dot2:{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#00C896",animation:"bounce 1s infinite"},
  err:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(240,80,80,0.1)",border:"1px solid rgba(240,80,80,0.25)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#FCA5A5"},
  foot:{zIndex:10,position:"sticky",bottom:0,background:"rgba(10,15,10,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,200,120,0.1)",padding:"12px 16px 14px"},
  irow:{display:"flex",gap:8,maxWidth:800,margin:"0 auto",alignItems:"flex-end"},
  ta:{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(0,200,120,0.2)",borderRadius:12,padding:"11px 14px",color:"#E8F0E8",fontSize:14,fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.5,minHeight:44,maxHeight:110,overflowY:"auto"},
  sbtn:{width:44,height:44,borderRadius:11,background:"linear-gradient(135deg,#00C896,#00A878)",border:"none",color:"#fff",fontSize:19,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontWeight:700,flexShrink:0},
  hint:{fontSize:11,color:"rgba(232,240,232,0.3)"},
};

if (typeof document !== "undefined" && !document.getElementById("tq-styles")) {
  const el = document.createElement("style");
  el.id = "tq-styles";
  el.textContent = `@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`;
  document.head.appendChild(el);
}
