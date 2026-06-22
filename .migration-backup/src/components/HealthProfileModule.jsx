import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════
   TOKENS
═══════════════════════════════════════ */
const C = {
  bg0:"#02060a", bg2:"#0a1410", bg3:"#0e1c16",
  green:"#2dff8c", teal:"#00e5c8", gold:"#d4a843",
  red:"#ff5757", purple:"#a78bfa",
  white:"#f0ede6", muted:"#3d5449",
  glass:"rgba(13,26,19,0.88)",
};

/* ═══════════════════════════════════════
   CSS
═══════════════════════════════════════ */
const injectCSS = () => {
  if (document.getElementById("hp2-css")) return;
  const s = document.createElement("style");
  s.id = "hp2-css";
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800;900&family=Satoshi:wght@300;400;500;700;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:${C.bg0};color:${C.white};font-family:'Satoshi',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(45,255,140,0.3);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(45,255,140,0.5)}70%{box-shadow:0 0 0 10px rgba(45,255,140,0)}100%{box-shadow:0 0 0 0 rgba(45,255,140,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scan{0%{top:-3%}100%{top:103%}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
@keyframes photoGlow{0%,100%{box-shadow:0 0 0 3px #0a1410,0 0 0 5px rgba(45,255,140,0.3),0 0 30px rgba(45,255,140,0.15)}50%{box-shadow:0 0 0 3px #0a1410,0 0 0 5px rgba(45,255,140,0.5),0 0 50px rgba(45,255,140,0.3)}}
@keyframes ripple{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.5);opacity:0}}

.btn-p{padding:12px 28px;border-radius:10px;border:none;background:${C.green};color:#020a06;font-size:13px;font-weight:800;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif;box-shadow:0 0 28px rgba(45,255,140,0.3);letter-spacing:.01em}
.btn-p:hover{background:#4fffa8;box-shadow:0 0 44px rgba(45,255,140,0.55);transform:translateY(-1px)}
.btn-p:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-g{padding:11px 22px;border-radius:10px;border:1px solid rgba(45,255,140,0.25);background:transparent;color:${C.green};font-size:12px;font-weight:600;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif}
.btn-g:hover{background:rgba(45,255,140,0.07);border-color:rgba(45,255,140,0.45)}
.btn-ghost{padding:9px 18px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(240,237,230,0.5);font-size:11px;cursor:pointer;transition:all .2s;font-family:'Satoshi',sans-serif}
.btn-ghost:hover{border-color:rgba(255,255,255,0.18);color:${C.white}}
.card{background:${C.glass};border:1px solid rgba(45,255,140,0.1);border-radius:20px;padding:22px 24px;backdrop-filter:blur(20px)}

.hp-input{width:100%;padding:14px 18px;border-radius:12px;border:1px solid rgba(45,255,140,0.15);background:rgba(255,255,255,0.03);color:${C.white};font-size:15px;outline:none;font-family:'Satoshi',sans-serif;transition:border-color .25s}
.hp-input:focus{border-color:rgba(45,255,140,0.4);background:rgba(45,255,140,0.02)}
.hp-select-card{border-radius:12px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);padding:12px 16px;cursor:pointer;transition:all .2s;font-size:13px;color:rgba(240,237,230,0.65)}
.hp-select-card:hover{border-color:rgba(45,255,140,0.3);background:rgba(45,255,140,0.05);color:${C.white}}
.hp-select-card.sel{border-color:rgba(45,255,140,0.5);background:rgba(45,255,140,0.08);color:${C.green}}
.hp-checkbox{border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);padding:10px 14px;cursor:pointer;transition:all .2s;font-size:12px;color:rgba(240,237,230,0.6);display:flex;align-items:center;gap:8px}
.hp-checkbox:hover{border-color:rgba(45,255,140,0.25);color:${C.white}}
.hp-checkbox.sel{border-color:rgba(45,255,140,0.45);background:rgba(45,255,140,0.07);color:${C.green}}
.hp-scale-btn{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);cursor:pointer;font-size:13px;font-weight:700;color:rgba(240,237,230,0.5);transition:all .2s;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace}
.hp-scale-btn:hover{border-color:rgba(45,255,140,0.3);color:${C.white}}
.hp-scale-btn.sel{border-color:rgba(45,255,140,0.5);background:rgba(45,255,140,0.1);color:${C.green};box-shadow:0 0 16px rgba(45,255,140,0.2)}

/* Photo upload */
.photo-drop{border:2px dashed rgba(45,255,140,0.25);border-radius:20px;padding:32px;text-align:center;cursor:pointer;transition:all .3s;background:rgba(45,255,140,0.02);position:relative;overflow:hidden}
.photo-drop:hover{border-color:rgba(45,255,140,0.5);background:rgba(45,255,140,0.05)}
.photo-drop.drag-over{border-color:rgba(45,255,140,0.7);background:rgba(45,255,140,0.08);transform:scale(1.01)}
.photo-ring{animation:photoGlow 3s ease-in-out infinite}
.photo-ring-active{box-shadow:0 0 0 3px #0a1410,0 0 0 5px rgba(45,255,140,0.5),0 0 50px rgba(45,255,140,0.3)!important}

/* Smoothie card */
.smoothie-card{background:rgba(255,255,255,0.03);border:1px solid rgba(45,255,140,0.1);border-radius:16px;padding:16px;transition:all .3s}
.smoothie-card:hover{border-color:rgba(45,255,140,0.25);transform:translateY(-2px)}

/* Progress bar */
.prog-track{height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden}
.prog-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,${C.green},${C.teal});transition:width .4s ease;box-shadow:0 0 6px ${C.green}}

/* Vision card */
.vision-obs{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:flex-start;font-size:11px}
.vision-obs:last-child{border-bottom:none}
.vision-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:3px}

/* Social card */
.social-share-card{background:linear-gradient(135deg,#030a06,#071510,#030a06);border:1px solid rgba(45,255,140,0.15);border-radius:20px;padding:20px;position:relative;overflow:hidden}
.sc-scan{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(45,255,140,0.4),transparent);animation:scan 4s linear infinite}

/* Progress photos timeline */
.prog-photo-item{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;position:relative}
.prog-photo-circle{width:58px;height:58px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;position:relative;z-index:1}

/* Alert */
.alert-row{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:flex-start}
.alert-row:last-child{border-bottom:none}

/* Wellness ring */
.ring-glow circle:last-child{filter:drop-shadow(0 0 6px currentColor)}
`;
  document.head.appendChild(s);
};

/* ═══════════════════════════════════════
   CLAUDE API  (text + vision)
═══════════════════════════════════════ */
async function askClaude(system, content, tokens = 1500) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: tokens,
      system,
      messages: [{ role: "user", content }],
    }),
  });
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

function parseJSON(text) {
  try {
    const m = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
    return JSON.parse(m ? (m[1] || m[0]) : text);
  } catch { return null; }
}

/* ═══════════════════════════════════════
   PHOTO UTILITIES
═══════════════════════════════════════ */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cropCircle(dataUrl, size = 400) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
      ctx.clip();
      const s = Math.min(img.width, img.height);
      const ox = (img.width - s) / 2;
      const oy = (img.height - s) / 2;
      ctx.drawImage(img, ox, oy, s, s, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

/* ═══════════════════════════════════════
   QUESTIONS
═══════════════════════════════════════ */
const BLOCKS = [
  {
    id:"identity", num:"01", title:"Datos personales", color:C.green, icon:"👤",
    desc:"Tu perfil único de bienestar comienza aquí",
    questions:[
      { id:"photo",     type:"photo",    label:"Añade tu foto de perfil",                    desc:"Opcional — enriquece tu diagnóstico con análisis visual de bienestar" },
      { id:"name",      type:"text",     label:"¿Cuál es tu nombre completo?",               placeholder:"Ej: María González" },
      { id:"age",       type:"number",   label:"¿Qué edad tienes?",                           placeholder:"Ej: 34", unit:"años" },
      { id:"sex",       type:"select",   label:"Sexo biológico",                              options:["Femenino","Masculino","Prefiero no decir"] },
      { id:"weight",    type:"number",   label:"Peso aproximado",                              placeholder:"Ej: 68", unit:"kg" },
      { id:"height",    type:"number",   label:"Altura",                                       placeholder:"Ej: 165", unit:"cm" },
      { id:"allergies", type:"multi",    label:"Alergias o intolerancias",
        options:["Ninguna","Gluten","Lactosa","Frutos secos","Mariscos","Huevo","Soya","Otro"] },
    ],
  },
  {
    id:"health", num:"02", title:"Estado de salud", color:C.gold, icon:"🩺",
    desc:"Condiciones presentes que guían tus recomendaciones",
    questions:[
      { id:"conditions",  type:"multi",   label:"¿Condiciones de salud diagnosticadas?",
        options:["Ninguna","Diabetes","Hipertensión","Colesterol alto","Tiroides","Gastritis","Anemia","Otra"] },
      { id:"medications", type:"textarea",label:"¿Tomas algún medicamento actualmente?",      placeholder:"Ej: metformina 500mg… o escribe 'Ninguno'" },
      { id:"energy",      type:"scale",   label:"Nivel de energía diaria",                     scaleLabels:["Muy bajo","Bajo","Moderado","Alto","Muy alto"] },
      { id:"goal",        type:"multi",   label:"Tu objetivo principal de bienestar",
        options:["Bajar peso","Más energía","Mejorar digestión","Reforzar inmunidad","Reducir inflamación","Equilibrio hormonal","Reducir estrés"] },
    ],
  },
  {
    id:"lifestyle", num:"03", title:"Genética y estilo de vida", color:C.teal, icon:"🧬",
    desc:"Historia familiar y hábitos que moldean tu plan",
    questions:[
      { id:"family",    type:"multi",  label:"Enfermedades en familia directa",
        options:["Ninguna","Diabetes","Enfermedades cardíacas","Cáncer","Hipertensión","Alzheimer","Obesidad","Otra"] },
      { id:"substances",type:"select", label:"¿Consumes tabaco, alcohol u otras sustancias?",
        options:["No consumo ninguna","Alcohol ocasional","Alcohol frecuente","Tabaco","Tabaco + alcohol","Cannabis u otras"] },
      { id:"diet",      type:"select", label:"Tu dieta habitual",
        options:["Omnívora equilibrada","Omnívora con muchos procesados","Vegetariana","Vegana","Keto/low carb","Mediterránea","Sin orden específico"] },
      { id:"activity",  type:"select", label:"Nivel de actividad física",
        options:["Sedentario","Ligero (1-2x/semana)","Moderado (3-4x/semana)","Activo (5-6x/semana)","Atleta (diario)"] },
    ],
  },
  {
    id:"closing", num:"04", title:"Cierre del perfil", color:C.purple, icon:"✦",
    desc:"Últimos datos que afinan tu plan al máximo",
    questions:[
      { id:"water",  type:"select", label:"¿Cuánta agua bebes al día?",
        options:["Menos de 1 litro","Entre 1 y 2 litros","Más de 2 litros","Casi no tomo agua"] },
      { id:"stress", type:"scale",  label:"Nivel de estrés diario",                scaleLabels:["Muy bajo","Bajo","Moderado","Alto","Muy alto"] },
      { id:"sleep",  type:"number", label:"Horas de sueño promedio",                placeholder:"Ej: 7", unit:"horas" },
      { id:"extra",  type:"textarea",label:"¿Algo más que el AI deba saber?",       placeholder:"Cualquier cosa sobre tu salud… o escribe 'Nada más'" },
    ],
  },
];

/* ═══════════════════════════════════════
   COMPONENT: PROGRESS BAR
═══════════════════════════════════════ */
function ProgressBar({ current, total }) {
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, height:3, background:"rgba(255,255,255,0.04)" }}>
      <div style={{ height:"100%", width:`${(current/total)*100}%`, background:`linear-gradient(90deg,${C.green},${C.teal})`, transition:"width 0.5s ease", boxShadow:`0 0 8px ${C.green}` }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPONENT: PHOTO UPLOAD
═══════════════════════════════════════ */
function PhotoUpload({ value, onChange }) {
  const [drag, setDrag] = useState(false);
  const [consent, setConsent] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const b64 = await fileToBase64(file);
    const cropped = await cropCircle(b64);
    onChange({ dataUrl: cropped, base64: cropped.split(",")[1], mimeType: "image/jpeg" });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Drop zone */}
      <div
        className={`photo-drop${drag?" drag-over":""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />

        {value ? (
          /* Photo preview */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative" }}>
              <img src={value.dataUrl} alt="Perfil" style={{ width:110, height:110, borderRadius:"50%", objectFit:"cover" }} className="photo-ring photo-ring-active" />
              <div style={{ position:"absolute", bottom:2, right:2, width:28, height:28, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:"0 0 0 2px #02060a" }}>✓</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:4 }}>¡Foto perfecta!</div>
              <div style={{ fontSize:11, color:C.muted }}>Toca para cambiarla</div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <div style={{ width:80, height:80, borderRadius:"50%", border:"2px dashed rgba(45,255,140,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, background:"rgba(45,255,140,0.04)" }}>📸</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:4 }}>Sube tu foto de perfil</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>Arrastra una imagen o toca para seleccionar</div>
              <div style={{ fontSize:11, color:"rgba(45,255,140,0.5)", marginTop:6 }}>JPG, PNG · Opcional pero recomendada</div>
            </div>
          </div>
        )}
      </div>

      {/* Consent */}
      <div
        onClick={() => setConsent(!consent)}
        style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"12px 16px", borderRadius:12, border:`1px solid ${consent?"rgba(45,255,140,0.3)":"rgba(255,255,255,0.07)"}`, background:consent?"rgba(45,255,140,0.05)":"rgba(255,255,255,0.02)", cursor:"pointer", transition:"all .2s" }}
      >
        <div style={{ width:20, height:20, borderRadius:6, border:`1.5px solid ${consent?C.green:"rgba(255,255,255,0.2)"}`, background:consent?"rgba(45,255,140,0.2)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:C.green, flexShrink:0, marginTop:1, transition:"all .2s" }}>
          {consent ? "✓" : ""}
        </div>
        <div style={{ fontSize:11, color:"rgba(240,237,230,0.55)", lineHeight:1.6 }}>
          Acepto que mi foto sea analizada por IA de bienestar <strong style={{ color:"rgba(240,237,230,0.75)" }}>con fines nutricionales únicamente</strong>. Mi foto es privada y nunca será visible para otros miembros.
        </div>
      </div>

      {/* Skip option */}
      <div style={{ textAlign:"center", fontSize:11, color:C.muted }}>
        La foto es <strong style={{ color:"rgba(240,237,230,0.4)" }}>opcional</strong> — tu diagnóstico funciona perfectamente sin ella
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPONENT: QUESTION INPUT
═══════════════════════════════════════ */
function QuestionInput({ q, value, onChange }) {
  if (q.type === "photo") return <PhotoUpload value={value} onChange={onChange} />;
  if (q.type === "text" || q.type === "number") {
    return <input className="hp-input" type={q.type==="number"?"number":"text"} placeholder={q.placeholder} value={value||""} onChange={e=>onChange(e.target.value)} style={{ fontSize:16 }} />;
  }
  if (q.type === "textarea") {
    return <textarea className="hp-input" rows={3} placeholder={q.placeholder} value={value||""} onChange={e=>onChange(e.target.value)} style={{ resize:"vertical", lineHeight:1.6 }} />;
  }
  if (q.type === "select") {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {q.options.map(opt => (
          <div key={opt} className={`hp-select-card${value===opt?" sel":""}`} onClick={()=>onChange(opt)}>
            <span style={{ marginRight:8 }}>{value===opt?"●":"○"}</span>{opt}
          </div>
        ))}
      </div>
    );
  }
  if (q.type === "multi") {
    const vals = Array.isArray(value) ? value : [];
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {q.options.map(opt => (
          <div key={opt} className={`hp-checkbox${vals.includes(opt)?" sel":""}`}
            onClick={() => onChange(vals.includes(opt) ? vals.filter(v=>v!==opt) : [...vals, opt])}>
            <span style={{ fontSize:14, flexShrink:0 }}>{vals.includes(opt)?"✓":"○"}</span>{opt}
          </div>
        ))}
      </div>
    );
  }
  if (q.type === "scale") {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`hp-scale-btn${value===n?" sel":""}`} onClick={()=>onChange(n)}>{n}</div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:C.muted, fontFamily:"'JetBrains Mono',monospace" }}>
          <span>{q.scaleLabels[0]}</span><span>{q.scaleLabels[4]}</span>
        </div>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════
   COMPONENT: WELLNESS RING
═══════════════════════════════════════ */
function WellnessRing({ score, size=130 }) {
  const r=54, circ=2*Math.PI*r;
  const color = score>=70?C.green:score>=50?C.gold:C.red;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 130 130" style={{ transform:"rotate(-90deg)" }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={circ-(score/100)*circ}
          strokeLinecap="round" className="ring-glow" style={{ transition:"stroke-dashoffset 1.5s ease", filter:`drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:900, color, lineHeight:1 }}>{score}</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:2 }}>/ 100</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN: INTRO
═══════════════════════════════════════ */
function IntroScreen({ onStart }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", animation:"fadeIn 0.8s ease" }}>
      <div style={{ position:"fixed", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:"radial-gradient(ellipse,rgba(45,255,140,0.07) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ width:100, height:100, borderRadius:"50%", background:`linear-gradient(135deg,${C.bg2},${C.bg3})`, border:"2px solid rgba(45,255,140,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, marginBottom:28, boxShadow:"0 0 60px rgba(45,255,140,0.25)", animation:"floatY 4s ease-in-out infinite" }}>🧑‍⚕️</div>
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid rgba(45,255,140,0.2)", background:"rgba(45,255,140,0.05)", borderRadius:100, padding:"5px 14px 5px 8px", marginBottom:24 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }} />
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:C.green, letterSpacing:"0.1em", textTransform:"uppercase" }}>Dr. Smoothie · Diagnóstico Personalizado</span>
      </div>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:900, letterSpacing:"-0.04em", lineHeight:1, color:C.white, marginBottom:20 }}>
        Tu diagnóstico<br/><span style={{ color:C.green }}>te está esperando.</span>
      </h1>
      <p style={{ fontSize:15, color:"rgba(240,237,230,0.45)", lineHeight:1.8, maxWidth:460, marginBottom:36 }}>
        <strong style={{ color:"rgba(240,237,230,0.8)" }}>18 preguntas clave + tu foto</strong> — el AI analizará
        tu perfil completo, incluyendo indicadores de bienestar visibles,
        para diseñar un plan de <strong style={{ color:C.green }}>smoothies 100% personalizado</strong> + un video del Dr. Smoothie hablándote directamente.
      </p>
      <div style={{ display:"flex", gap:10, alignItems:"center", justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
        {["📸 Con análisis de foto","🤖 Claude Vision AI","18 preguntas","~5 minutos","Video personalizado"].map(t => (
          <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, border:"1px solid rgba(255,255,255,0.06)", borderRadius:100, padding:"4px 12px" }}>{t}</span>
        ))}
      </div>
      <button className="btn-p" style={{ fontSize:15, padding:"15px 36px" }} onClick={onStart}>
        Comenzar mi diagnóstico ⚡
      </button>
      <p style={{ fontSize:11, color:C.muted, marginTop:20, maxWidth:360, lineHeight:1.6 }}>
        🔒 Tu foto es privada y encriptada. Solo tú y el AI la ven. Análisis nutricional — no reemplaza atención médica.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN: WIZARD
═══════════════════════════════════════ */
function WizardScreen({ onComplete }) {
  const [blockIdx, setBlockIdx] = useState(0);
  const [qIdx, setQIdx]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [visible, setVisible]   = useState(true);

  const allQ   = BLOCKS.flatMap(b => b.questions.map(q=>({...q,block:b})));
  const total  = allQ.length;
  const flat   = BLOCKS.slice(0,blockIdx).reduce((a,b)=>a+b.questions.length,0)+qIdx;
  const block  = BLOCKS[blockIdx];
  const q      = block.questions[qIdx];
  const val    = answers[q.id];

  const canNext = () => {
    if (q.type === "photo") return true; // optional
    if (!val && val !== 0) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  };

  const anim = fn => { setVisible(false); setTimeout(()=>{fn();setVisible(true);},280); };

  const next = () => {
    if (!canNext()) return;
    anim(() => {
      if (qIdx < block.questions.length-1) setQIdx(qIdx+1);
      else if (blockIdx < BLOCKS.length-1) { setBlockIdx(blockIdx+1); setQIdx(0); }
      else onComplete(answers);
    });
  };

  const back = () => {
    if (flat===0) return;
    anim(() => {
      if (qIdx>0) setQIdx(qIdx-1);
      else { setBlockIdx(blockIdx-1); setQIdx(BLOCKS[blockIdx-1].questions.length-1); }
    });
  };

  const blockColor = block.color;

  return (
    <>
      <ProgressBar current={flat+1} total={total} />
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 24px 40px" }}>
        <div style={{ width:"100%", maxWidth:580 }}>
          {/* Block header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:`rgba(${blockColor===C.green?"45,255,140":blockColor===C.gold?"212,168,67":blockColor===C.teal?"0,229,200":"167,139,250"},0.08)`, border:`1px solid rgba(${blockColor===C.green?"45,255,140":blockColor===C.gold?"212,168,67":blockColor===C.teal?"0,229,200":"167,139,250"},0.25)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {block.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2 }}>Bloque {block.num} · {block.title}</div>
              <div style={{ fontSize:11, color:C.muted }}>{block.desc}</div>
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:blockColor, fontWeight:700 }}>{flat+1}<span style={{ color:C.muted }}>/{total}</span></div>
          </div>

          {/* Question card */}
          <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:24, padding:"32px 28px", backdropFilter:"blur(24px)", boxShadow:"0 40px 80px rgba(0,0,0,0.5)", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(10px)", transition:"opacity 0.28s ease,transform 0.28s ease" }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:21, fontWeight:800, letterSpacing:"-0.03em", color:C.white, marginBottom:q.desc?6:20, lineHeight:1.2 }}>{q.label}</h2>
            {q.desc && <p style={{ fontSize:12, color:C.muted, marginBottom:20, lineHeight:1.5 }}>{q.desc}</p>}
            {q.unit && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.08em" }}>en {q.unit}</div>}
            {!q.desc && !q.unit && q.type!=="photo" && <div style={{ marginBottom:4 }} />}
            <QuestionInput q={q} value={val} onChange={v=>setAnswers(prev=>({...prev,[q.id]:v}))} />
          </div>

          {/* Nav */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:18 }}>
            <button className="btn-ghost" onClick={back} disabled={flat===0} style={{ opacity:flat===0?0.3:1 }}>← Anterior</button>
            <div style={{ display:"flex", gap:3 }}>
              {allQ.map((_,i)=>(
                <div key={i} style={{ width:i===flat?18:5, height:5, borderRadius:3, background:i<flat?C.green:i===flat?C.green:"rgba(255,255,255,0.1)", transition:"all 0.3s", opacity:i===flat?1:0.6 }} />
              ))}
            </div>
            <button className="btn-p" onClick={next} disabled={!canNext()} style={{ opacity:canNext()?1:0.4 }}>
              {flat===total-1?"Analizar mi perfil 🤖":"Siguiente →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   SCREEN: ANALYZING (with vision)
═══════════════════════════════════════ */
function AnalyzingScreen({ name, hasPhoto }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Procesando tu perfil de salud…",
    hasPhoto ? "🔍 Claude Vision analizando tu foto…" : "Evaluando factores de bienestar…",
    "Detectando interacciones medicamento-ingrediente…",
    "Generando tu plan de smoothies personalizado…",
    "Calculando tu wellness score…",
    hasPhoto ? "✨ Integrando análisis visual al diagnóstico…" : "Preparando tu diagnóstico…",
  ];
  useEffect(()=>{
    const t=setInterval(()=>setStep(s=>Math.min(s+1,steps.length-1)),1200);
    return ()=>clearInterval(t);
  },[]);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
      <div style={{ position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, background:"radial-gradient(ellipse,rgba(45,255,140,0.06) 0%,transparent 70%)", pointerEvents:"none" }} />
      <div style={{ width:90, height:90, borderRadius:"50%", border:`3px solid rgba(45,255,140,0.3)`, borderTopColor:C.green, animation:"spin 1.2s linear infinite", marginBottom:32, boxShadow:`0 0 40px rgba(45,255,140,0.2)` }} />
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, letterSpacing:"-0.03em", color:C.white, marginBottom:8 }}>Analizando tu perfil{hasPhoto?" y foto":""}<span style={{ color:C.green }}>…</span></h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:32 }}>El Dr. Smoothie AI está creando tu plan personalizado{hasPhoto?" + análisis visual":""}</p>
      <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:18, padding:"22px 28px", backdropFilter:"blur(20px)", width:"100%", maxWidth:440 }}>
        {steps.map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:i<steps.length-1?"1px solid rgba(255,255,255,0.04)":"none", opacity:i<=step?1:0.2, transition:"opacity 0.5s" }}>
            <div style={{ width:20, height:20, borderRadius:"50%", border:`1.5px solid ${i<step?C.green:i===step?"rgba(45,255,140,0.5)":"rgba(255,255,255,0.1)"}`, background:i<step?"rgba(45,255,140,0.15)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:i<step?C.green:"transparent", flexShrink:0, transition:"all 0.4s" }}>
              {i<step?"✓":i===step?<span style={{animation:"blink 1s infinite"}}>●</span>:""}
            </div>
            <span style={{ fontSize:12, color:i<=step?C.white:C.muted, textAlign:"left" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN: DIAGNOSIS DASHBOARD  ← with photo
═══════════════════════════════════════ */
function DiagnosisScreen({ diagnosis:d, answers, onGenerateVideo }) {
  const photo   = answers.photo;
  const name    = answers.name || "miembro";
  const scoreColor = d.wellness_score>=70?C.green:d.wellness_score>=50?C.gold:C.red;
  const scoreLabel = d.wellness_score>=75?"Muy bueno":d.wellness_score>=60?"Moderado-bueno":d.wellness_score>=45?"Moderado":"Necesita atención";

  return (
    <div style={{ padding:"80px 24px 60px", maxWidth:820, margin:"0 auto", animation:"fadeUp 0.7s ease" }}>

      {/* ── HERO PROFILE HEADER ── */}
      <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.15)", borderRadius:28, padding:"32px", backdropFilter:"blur(24px)", marginBottom:16, boxShadow:"0 40px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ display:"flex", gap:28, alignItems:"center", flexWrap:"wrap" }}>

          {/* Photo + ring */}
          <div style={{ position:"relative", flexShrink:0 }}>
            {photo ? (
              <>
                <img src={photo.dataUrl} alt={name} style={{ width:110, height:110, borderRadius:"50%", objectFit:"cover" }} className="photo-ring" />
                {/* Score ring overlay */}
                <div style={{ position:"absolute", top:-8, left:-8, right:-8, bottom:-8 }}>
                  <svg width={126} height={126} viewBox="0 0 126 126" style={{ transform:"rotate(-90deg)" }}>
                    <circle cx={63} cy={63} r={58} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={4} />
                    <circle cx={63} cy={63} r={58} fill="none" stroke={scoreColor} strokeWidth={4}
                      strokeDasharray={2*Math.PI*58} strokeDashoffset={(2*Math.PI*58)*(1-d.wellness_score/100)}
                      strokeLinecap="round" style={{ transition:"stroke-dashoffset 1.5s ease", filter:`drop-shadow(0 0 6px ${scoreColor})` }} />
                  </svg>
                </div>
                {/* Score badge */}
                <div style={{ position:"absolute", bottom:-6, right:-6, background:scoreColor, color:"#020a06", borderRadius:"50%", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:900, boxShadow:`0 0 0 3px #02060a, 0 0 20px ${scoreColor}40` }}>
                  {d.wellness_score}
                </div>
              </>
            ) : (
              <div style={{ position:"relative" }}>
                <WellnessRing score={d.wellness_score} size={110} />
              </div>
            )}
          </div>

          {/* Name + info */}
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, background:"rgba(45,255,140,0.1)", border:"1px solid rgba(45,255,140,0.2)", borderRadius:100, padding:"3px 10px", color:C.green }}>DIAGNÓSTICO COMPLETADO</span>
              {photo && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:100, padding:"3px 10px", color:C.purple }}>📸 ANÁLISIS VISUAL INCLUIDO</span>}
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, letterSpacing:"-0.04em", color:C.white, marginBottom:6 }}>
              Hola, <span style={{ color:C.green }}>{name}</span> 👋
            </h1>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.muted, marginBottom:8 }}>
              {answers.age} años · {answers.sex} · {answers.weight}kg · {answers.height}cm
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:scoreColor, marginBottom:8 }}>{scoreLabel}</div>
            <p style={{ fontSize:13, color:"rgba(240,237,230,0.55)", lineHeight:1.65 }}>{d.summary}</p>
          </div>

          {/* Quick stats column */}
          {!photo && (
            <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
              {[{l:"Objetivo",v:Array.isArray(answers.goal)?answers.goal[0]:answers.goal},{l:"Actividad",v:answers.activity?.split("(")[0]},{l:"Dieta",v:answers.diet?.split(" ")[0]}].map(s=>(
                <div key={s.l} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"8px 14px" }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{s.l}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.white }}>{s.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── VISION OBSERVATIONS ── */}
      {d.vision_observations && d.vision_observations.length > 0 && (
        <div style={{ background:"rgba(167,139,250,0.04)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:18, padding:"20px 24px", marginBottom:16, animation:"fadeUp 0.5s 0.2s ease both" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.purple, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>
            📸 Análisis visual de bienestar · Claude Vision
          </div>
          {d.vision_observations.map((obs,i) => (
            <div key={i} className="vision-obs">
              <div className="vision-dot" style={{ background:obs.positive?C.green:C.gold }} />
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.white, marginBottom:2 }}>{obs.title}</div>
                <div style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>{obs.detail}</div>
                {obs.recommendation && <div style={{ fontSize:10, color:C.teal, marginTop:3 }}>→ {obs.recommendation}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ALERTS ── */}
      {d.alerts?.length > 0 && (
        <div style={{ background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.2)", borderRadius:18, padding:"20px 24px", marginBottom:16 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.gold, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}>⚠️ Alertas de tu perfil</div>
          {d.alerts.map((a,i) => (
            <div key={i} className="alert-row">
              <span style={{ fontSize:18, flexShrink:0 }}>{a.icon||"⚠️"}</span>
              <div><div style={{ fontSize:12, fontWeight:700, color:C.white, marginBottom:2 }}>{a.title}</div><div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{a.detail}</div></div>
            </div>
          ))}
        </div>
      )}

      {/* ── SMOOTHIE PLAN ── */}
      <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:18, padding:"22px 24px", backdropFilter:"blur(20px)", marginBottom:16 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>🍹 Tu plan de smoothies personalizado</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(d.smoothies||[]).map((s,i) => (
            <div key={i} className="smoothie-card">
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"rgba(45,255,140,0.08)", border:"1px solid rgba(45,255,140,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.emoji||"🥤"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:3 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:6, lineHeight:1.5 }}>{s.ingredients}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, background:"rgba(45,255,140,0.08)", border:"1px solid rgba(45,255,140,0.15)", borderRadius:100, padding:"2px 8px", color:C.green }}>{s.timing}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, background:"rgba(0,229,200,0.06)", border:"1px solid rgba(0,229,200,0.15)", borderRadius:100, padding:"2px 8px", color:C.teal }}>{s.benefit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AVOID + PROGRESS TIMELINE ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {/* Avoid */}
        {d.avoid?.length > 0 && (
          <div style={{ background:"rgba(255,87,87,0.04)", border:"1px solid rgba(255,87,87,0.15)", borderRadius:14, padding:"14px 18px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.red, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>🚫 Ingredientes a evitar</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {d.avoid.map(a => <span key={a} style={{ fontSize:11, background:"rgba(255,87,87,0.08)", border:"1px solid rgba(255,87,87,0.2)", borderRadius:100, padding:"4px 12px", color:C.red }}>{a}</span>)}
            </div>
          </div>
        )}
        {/* 30/60/90 */}
        <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.08)", borderRadius:14, padding:"14px 18px", backdropFilter:"blur(20px)" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>📅 Resultados esperados</div>
          <div style={{ display:"flex", gap:0, position:"relative" }}>
            <div style={{ position:"absolute", top:20, left:"10%", right:"10%", height:2, background:`linear-gradient(90deg,${C.green},${C.teal},${C.gold})` }} />
            {[{t:"30d",c:C.green,r:"Más energía"},{t:"60d",c:C.teal,r:"Digestión"},{t:"90d",c:C.gold,r:"Transformación"}].map(item=>(
              <div key={item.t} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:"50%", background:item.c, boxShadow:`0 0 10px ${item.c}`, zIndex:1 }} />
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:item.c }}>{item.t}</div>
                <div style={{ fontSize:10, color:C.muted, textAlign:"center" }}>{item.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL CARD PREVIEW ── */}
      {photo && (
        <div style={{ background:C.glass, border:"1px solid rgba(167,139,250,0.15)", borderRadius:18, padding:"20px 24px", backdropFilter:"blur(20px)", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.purple, textTransform:"uppercase", letterSpacing:"0.1em" }}>🃏 Tarjeta social — lista para compartir</div>
            <button className="btn-ghost" style={{ fontSize:10 }}>⬇️ Descargar</button>
          </div>
          <div className="social-share-card">
            <div className="sc-scan" />
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 30% 50%,rgba(45,255,140,0.06) 0%,transparent 65%)" }} />
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, position:"relative", zIndex:1 }}>
              <img src={photo.dataUrl} alt={name} style={{ width:56, height:56, borderRadius:"50%", objectFit:"cover", boxShadow:`0 0 0 2px #030a06, 0 0 0 3px rgba(45,255,140,0.4)` }} />
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.white, letterSpacing:"-0.01em" }}>{name}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:2 }}>Mi plan de bienestar · Día 1</div>
              </div>
              <div style={{ marginLeft:"auto", fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, color:scoreColor, position:"relative", zIndex:1 }}>{d.wellness_score}<span style={{ fontSize:11, color:C.muted }}>/100</span></div>
            </div>
            <div style={{ background:"rgba(45,255,140,0.06)", border:"1px solid rgba(45,255,140,0.12)", borderRadius:12, padding:"10px 12px", marginBottom:10, position:"relative", zIndex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.white, marginBottom:2 }}>🍹 Mi smoothie del día</div>
              {d.smoothies?.[0] && <>
                <div style={{ fontSize:12, color:C.green }}>{d.smoothies[0].name}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{d.smoothies[0].benefit}</div>
              </>}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:1 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:"rgba(45,255,140,0.4)" }}>dr.smoothie.ai · purelifewellnessclub.org</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:C.green }}>ÚNETE →</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12 }}>
            {["📲 Instagram Stories","💬 WhatsApp","🎵 TikTok"].map(p=>(
              <button key={p} className="btn-ghost" style={{ fontSize:11, padding:"9px 4px" }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"12px 16px", marginBottom:28, fontSize:11, color:C.muted, lineHeight:1.6 }}>
        ⚕️ <strong style={{ color:"rgba(240,237,230,0.4)" }}>Orientación nutricional y de bienestar alternativo.</strong> No constituye diagnóstico médico ni reemplaza la consulta profesional. El análisis de foto evalúa únicamente indicadores de bienestar externo con fines nutricionales.
      </div>

      {/* CTA VIDEO */}
      <div style={{ background:`linear-gradient(135deg,rgba(45,255,140,0.06),rgba(0,229,200,0.04))`, border:"1px solid rgba(45,255,140,0.2)", borderRadius:22, padding:"28px 28px", textAlign:"center" }}>
        <div style={{ fontSize:38, marginBottom:12 }}>🎬</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, letterSpacing:"-0.03em", color:C.white, marginBottom:8 }}>
          El Dr. Smoothie tiene un mensaje para ti
        </h3>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, maxWidth:420, margin:"0 auto 24px" }}>
          {photo ? `Tu foto aparecerá en el video — el Dr. Smoothie te hablará por tu nombre y mostrará tu diagnóstico visualmente.` : "El Dr. Smoothie te explicará en video tu plan, por qué seguirlo y qué esperar en 30, 60 y 90 días."}
        </p>
        <button className="btn-p" style={{ fontSize:14, padding:"14px 32px" }} onClick={onGenerateVideo}>
          {photo ? "🤖 Generar mi video personalizado con foto" : "🤖 Generar mi video personalizado"}
        </button>
        <div style={{ marginTop:14, display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {["🎭 Avatar HeyGen","🗣️ Voz personalizada",photo?"📸 Tu foto en el video":"","⏱️ ~90 segundos","📲 Descargable"].filter(Boolean).map(t=>(
            <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, border:"1px solid rgba(255,255,255,0.06)", borderRadius:100, padding:"3px 10px" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCREEN: VIDEO READY
═══════════════════════════════════════ */
function VideoReadyScreen({ script, name, photo, diagnosis:d, onRestart }) {
  return (
    <div style={{ padding:"80px 24px 60px", maxWidth:780, margin:"0 auto", animation:"fadeUp 0.7s ease" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:900, letterSpacing:"-0.04em", color:C.white, marginBottom:8 }}>
          Tu video está <span style={{ color:C.green }}>listo</span>
        </h2>
        <p style={{ fontSize:14, color:C.muted }}>El Dr. Smoothie tiene un mensaje exclusivo para ti, {name}</p>
      </div>

      {/* Video player mockup */}
      <div style={{ background:`linear-gradient(135deg,#030a06,#061410,#030a06)`, border:"1px solid rgba(45,255,140,0.12)", borderRadius:24, overflow:"hidden", position:"relative", aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, boxShadow:"0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 55%,rgba(45,255,140,0.08) 0%,transparent 65%)" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(45,255,140,0.01) 0px,rgba(45,255,140,0.01) 1px,transparent 1px,transparent 4px)" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(45,255,140,0.5),transparent)", animation:"scan 3s linear infinite" }} />

        {/* Split: avatar + member photo */}
        <div style={{ display:"flex", gap:40, alignItems:"center", zIndex:1 }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${C.bg2},${C.bg3})`, border:`2px solid rgba(45,255,140,0.4)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, boxShadow:"0 0 40px rgba(45,255,140,0.25)", animation:"floatY 3s ease-in-out infinite", marginBottom:8 }}>🧑‍⚕️</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green }}>DR. SMOOTHIE</div>
          </div>
          {photo && (
            <>
              <div style={{ width:2, height:80, background:`linear-gradient(180deg,transparent,rgba(45,255,140,0.4),transparent)` }} />
              <div style={{ textAlign:"center" }}>
                <img src={photo.dataUrl} alt={name} style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover", boxShadow:`0 0 0 2px #030a06, 0 0 0 3px rgba(45,255,140,0.5), 0 0 30px rgba(45,255,140,0.2)`, marginBottom:8, animation:"floatY 3s ease-in-out infinite 1s" }} />
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.white }}>{name.split(" ")[0].toUpperCase()}</div>
              </div>
            </>
          )}
        </div>

        {/* Badges */}
        <div style={{ position:"absolute", top:14, left:14, background:"rgba(2,6,10,0.85)", backdropFilter:"blur(10px)", border:"1px solid rgba(45,255,140,0.2)", borderRadius:8, padding:"5px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, zIndex:2 }}>🎭 HeyGen{photo?" · Split View":""}</div>
        <div style={{ position:"absolute", top:14, right:14, background:"rgba(2,6,10,0.85)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"5px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"rgba(240,237,230,0.5)", zIndex:2 }}>1:30 · 1080p</div>
        <div style={{ position:"absolute", bottom:60, left:20, right:20, background:"rgba(2,6,10,0.9)", borderRadius:10, padding:"10px 16px", textAlign:"center", zIndex:3, fontSize:12, color:"rgba(240,237,230,0.85)", lineHeight:1.5, border:"1px solid rgba(255,255,255,0.05)" }}>
          "Tu plan personalizado está diseñado específicamente para tu perfil de salud…"
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(0deg,rgba(2,6,10,0.95),transparent)", padding:"14px 20px", zIndex:3 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white }}>Dr. Smoothie — Diagnóstico Personal · {name}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.green, marginTop:2, textTransform:"uppercase", letterSpacing:"0.06em" }}>Generado exclusivamente para tu perfil{photo?" + análisis visual":""}</div>
        </div>
      </div>

      {/* Script */}
      <div style={{ background:"#020806", border:"1px solid rgba(45,255,140,0.12)", borderLeft:"3px solid rgba(45,255,140,0.5)", borderRadius:14, padding:"16px 20px", marginBottom:16 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>📝 Guión de tu video · Generado por Claude</div>
        <p style={{ fontSize:12, color:"rgba(240,237,230,0.55)", lineHeight:1.8, fontStyle:"italic" }}>"{script}"</p>
      </div>

      {/* Share */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
        {[["⬇️","Descargar"],["📲","TikTok"],["📸","Reels"],["💬","WhatsApp"]].map(([i,l])=>(
          <button key={l} className="btn-ghost" style={{ padding:"11px 6px", fontSize:11, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:20 }}>{i}</span>{l}
          </button>
        ))}
      </div>

      {/* 30/60/90 */}
      <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:20, padding:"22px 24px", backdropFilter:"blur(20px)", marginBottom:24 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:18 }}>📅 Tu hoja de ruta — resultados esperados</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[{t:"30 días",c:C.green,r:["Más energía","Mejor sueño","Piel más luminosa"]},{t:"60 días",c:C.teal,r:["Digestión optimizada","Menos inflamación","Hábito consolidado"]},{t:"90 días",c:C.gold,r:["Peso en rango","Glucosa estable","Bienestar integral"]}].map(tl=>(
            <div key={tl.t} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${tl.c}30`, borderRadius:14, padding:"16px 14px", borderTop:`2px solid ${tl.c}` }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:tl.c, marginBottom:12 }}>{tl.t}</div>
              {tl.r.map(r=>(
                <div key={r} style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:6, fontSize:11, color:"rgba(240,237,230,0.6)", lineHeight:1.4 }}>
                  <span style={{ color:tl.c, flexShrink:0 }}>✓</span>{r}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"12px 16px", marginBottom:24, fontSize:11, color:C.muted, lineHeight:1.6, textAlign:"center" }}>
        ⚕️ Orientación nutricional y de bienestar alternativo — no reemplaza la consulta médica profesional.
      </div>

      <div style={{ textAlign:"center" }}>
        <button className="btn-g" onClick={onRestart}>↺ Actualizar mi perfil</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function HealthProfileV2() {
  const [screen,    setScreen]   = useState("intro");
  const [answers,   setAnswers]  = useState({});
  const [diagnosis, setDiag]     = useState(null);
  const [script,    setScript]   = useState("");
  const [error,     setError]    = useState("");
  const videoTimer = useRef(null);

  useEffect(() => { injectCSS(); }, []);

  /* ── ANALYZE: text + optional vision ── */
  const analyze = useCallback(async (ans) => {
    setAnswers(ans);
    setScreen("analyzing");
    try {
      const profileLines = Object.entries(ans)
        .filter(([k]) => k !== "photo")
        .map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(", "):v}`)
        .join("\n");

      // Build content array (text + optional image)
      const userContent = [];

      // If photo with consent
      if (ans.photo?.base64) {
        userContent.push({
          type: "image",
          source: { type:"base64", media_type:ans.photo.mimeType||"image/jpeg", data:ans.photo.base64 }
        });
        userContent.push({
          type: "text",
          text: `Analiza esta foto junto con el perfil de salud del miembro para generar observaciones de bienestar VISUAL únicamente (tono de piel, señales de fatiga, hidratación aparente). Incluye esto en el campo vision_observations del JSON. NUNCA hagas diagnósticos médicos basados en la foto.\n\nPerfil del miembro:\n${profileLines}`
        });
      } else {
        userContent.push({ type:"text", text:`Perfil del miembro:\n${profileLines}` });
      }

      const raw = await askClaude(
        `Eres el Dr. Smoothie, experto en nutrición y bienestar alternativo de dr.smoothie.ai (JRMB Food Network LLC).
Analiza el perfil de salud y genera un diagnóstico de bienestar en JSON con este formato EXACTO:
{
  "wellness_score": número 0-100,
  "summary": "resumen del estado general en 2 oraciones",
  "vision_observations": [{"title":"título","detail":"observación","recommendation":"sugerencia nutricional","positive":true/false}],
  "alerts": [{"icon":"emoji","title":"título","detail":"detalle"}],
  "smoothies": [{"emoji":"emoji","name":"nombre","ingredients":"ingredientes","timing":"momento","benefit":"beneficio"}],
  "avoid": ["ingrediente1","ingrediente2"]
}
REGLAS:
- vision_observations: solo si hay foto — máximo 4 observaciones de bienestar VISIBLES y POSITIVAS. Nunca diagnósticos médicos. Si no hay foto, usa array vacío [].
- 3 smoothies ultra-personalizados según condiciones, alergias y medicamentos
- Alertas específicas al perfil
- avoid: alergias + interacciones medicamento-ingrediente
- NUNCA: "diagnóstico médico", "tratamiento", "cura"
- Responde SOLO con el JSON, sin markdown`,
        userContent,
        1800
      );

      const parsed = parseJSON(raw);
      if (!parsed) throw new Error("JSON inválido");
      setDiag(parsed);
      setScreen("diagnosis");
    } catch(e) {
      setError("Error al analizar el perfil. Verifica la conexión.");
      setScreen("error");
    }
  }, []);

  /* ── GENERATE VIDEO SCRIPT ── */
  const generateVideo = useCallback(async () => {
    setScreen("video-generating");
    try {
      const sc = await askClaude(
        `Eres el Dr. Smoothie de dr.smoothie.ai. Genera un guión de video de 90 segundos (~200 palabras).
ESTRUCTURA: saludo con nombre (0:00) → hallazgos del perfil (0:12) → importancia de NO fallar (0:28) → promesa 30/60/90 días (0:45) → cierre + disclaimer (1:10).
TONO: cálido, motivador, científico accesible.
REGLAS: NUNCA "diagnóstico médico". Usa "orientación nutricional" y "bienestar alternativo".
Cierre: "Recuerda: este plan complementa, nunca reemplaza, la atención de tu médico."
Responde SOLO el guión de voz.`,
        `Nombre: ${answers.name}. Objetivo: ${Array.isArray(answers.goal)?answers.goal.join(","):answers.goal}. Condiciones: ${Array.isArray(answers.conditions)?answers.conditions.join(","):answers.conditions}. Historial familiar: ${Array.isArray(answers.family)?answers.family.join(","):answers.family}. Score: ${diagnosis?.wellness_score}. Smoothies: ${diagnosis?.smoothies?.map(s=>s.name).join(", ")}. ${answers.photo?"(El miembro compartió su foto para análisis visual de bienestar.)":""}`,
        800
      );
      setScript(sc.trim());
      await new Promise(r=>{ videoTimer.current=setTimeout(r,7000); });
      setScreen("video-ready");
    } catch {
      setError("Error al generar el video.");
      setScreen("error");
    }
  }, [answers, diagnosis]);

  const restart = () => { setScreen("intro"); setAnswers({}); setDiag(null); setScript(""); setError(""); };

  /* ── Background canvas ── */
  const canvasRef = useRef(null);
  useEffect(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d"); let id,W,H,pts=[];
    const resize=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    resize(); window.addEventListener("resize",resize);
    class P{constructor(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.r=Math.random()*1.6+.3;this.ph=Math.random()*Math.PI*2;}tick(){this.x+=this.vx;this.y+=this.vy;this.ph+=.016;if(this.x<-8||this.x>W+8||this.y<-8||this.y>H+8){this.x=Math.random()*W;this.y=Math.random()*H;}}draw(){const a=.08+Math.sin(this.ph)*.05;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(45,255,140,${a})`;ctx.fill();}}
    for(let i=0;i<85;i++)pts.push(new P());
    const frame=()=>{ctx.clearRect(0,0,W,H);for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(45,255,140,${(1-d/100)*.07})`;ctx.lineWidth=.5;ctx.stroke();}}pts.forEach(p=>{p.tick();p.draw();});id=requestAnimationFrame(frame);};
    frame();
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);

  const VideoGenerating = () => (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(45,255,140,0.08)", border:"2px solid rgba(45,255,140,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:28, animation:"floatY 3s ease-in-out infinite" }}>🎭</div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:900, letterSpacing:"-0.03em", color:C.white, marginBottom:8 }}>Generando tu video<span style={{ color:C.green }}>…</span></h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:28 }}>{answers.photo?"El Dr. Smoothie está preparando tu mensaje con tu foto incluida":"El Dr. Smoothie está preparando tu mensaje personalizado"}</p>
      <div style={{ background:C.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:18, padding:"22px 28px", backdropFilter:"blur(20px)", width:"100%", maxWidth:440 }}>
        {["Claude genera el guión personalizado…","HeyGen renderiza el avatar…","Sincronizando voz en español…", answers.photo?"Integrando tu foto en el video…":"Aplicando branding dr.smoothie.ai…","Finalizando video 1080p…"].map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none", alignItems:"center", fontSize:12 }}>
            <div style={{ width:20, height:20, borderRadius:"50%", border:"1.5px solid rgba(45,255,140,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.green, flexShrink:0, animation:i===1?"spin 1.5s linear infinite":"none" }}>
              {i===1?"⟳":"✓"}
            </div>
            <span style={{ color:"rgba(240,237,230,0.65)" }}>{s}</span>
          </div>
        ))}
      </div>
      {script && <div style={{ background:"#020806", border:"1px solid rgba(45,255,140,0.1)", borderLeft:"3px solid rgba(45,255,140,0.4)", borderRadius:12, padding:"14px 18px", width:"100%", maxWidth:440, marginTop:16, textAlign:"left" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>📝 Guión generado para {answers.name}</div>
        <p style={{ fontSize:11, color:"rgba(240,237,230,0.5)", lineHeight:1.7, fontStyle:"italic" }}>"{script.substring(0,250)}…"</p>
      </div>}
    </div>
  );

  return (
    <>
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, opacity:.4, pointerEvents:"none" }} />
      <div style={{ position:"fixed", inset:0, zIndex:1, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.02'/%3E%3C/svg%3E")`, pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(ellipse,rgba(45,255,140,0.04) 0%,transparent 70%)", zIndex:0, pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:2, minHeight:"100vh" }}>
        {screen==="intro"           && <IntroScreen onStart={()=>setScreen("wizard")} />}
        {screen==="wizard"          && <WizardScreen onComplete={analyze} />}
        {screen==="analyzing"       && <AnalyzingScreen name={answers.name} hasPhoto={!!answers.photo?.base64} />}
        {screen==="diagnosis"       && diagnosis && <DiagnosisScreen diagnosis={diagnosis} answers={answers} onGenerateVideo={generateVideo} />}
        {screen==="video-generating"&& <VideoGenerating />}
        {screen==="video-ready"     && <VideoReadyScreen script={script} name={answers.name} photo={answers.photo} diagnosis={diagnosis} onRestart={restart} />}
        {screen==="error"           && (
          <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:C.white, marginBottom:8 }}>Error de conexión</h2>
            <p style={{ color:C.muted, marginBottom:24 }}>{error}</p>
            <button className="btn-p" onClick={restart}>↺ Intentar de nuevo</button>
          </div>
        )}
      </div>
    </>
  );
}
