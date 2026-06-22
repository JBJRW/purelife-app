import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════
   TOKENS
═══════════════════════════════ */
const C = {
  bg0:"#02060a", bg2:"#0a1410", bg3:"#0e1c16",
  green:"#2dff8c", teal:"#00e5c8", gold:"#d4a843",
  red:"#ff5757", purple:"#a78bfa", orange:"#ff8c42",
  white:"#f0ede6", muted:"#3d5449",
  glass:"rgba(13,26,19,0.88)",
};

/* ═══════════════════════════════
   CSS
═══════════════════════════════ */
const injectCSS = () => {
  if (document.getElementById("slv2-css")) return;
  const s = document.createElement("style");
  s.id = "slv2-css";
  s.textContent = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800;900&family=Satoshi:wght@300;400;500;700;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
body{background:${C.bg0};color:${C.white};font-family:'Satoshi',sans-serif}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(45,255,140,0.3);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(45,255,140,0.6)}70%{box-shadow:0 0 0 12px rgba(45,255,140,0)}100%{box-shadow:0 0 0 0 rgba(45,255,140,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scan{0%{top:-1px}100%{top:101%}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pinDrop{0%{transform:translateY(-20px) scale(0.7);opacity:0}70%{transform:translateY(3px)}100%{transform:translateY(0) scale(1);opacity:1}}
@keyframes userPulse{0%,100%{box-shadow:0 0 0 4px rgba(45,255,140,0.25),0 0 0 8px rgba(45,255,140,0.1),0 0 20px rgba(45,255,140,0.3)}50%{box-shadow:0 0 0 6px rgba(45,255,140,0.35),0 0 0 14px rgba(45,255,140,0.08),0 0 40px rgba(45,255,140,0.4)}}
@keyframes checkStrike{from{width:0}to{width:100%}}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}

/* Buttons */
.btn-p{padding:12px 24px;border-radius:10px;border:none;background:${C.green};color:#020a06;font-size:13px;font-weight:800;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif;box-shadow:0 0 24px rgba(45,255,140,0.3);letter-spacing:.01em;white-space:nowrap}
.btn-p:hover{background:#4fffa8;box-shadow:0 0 40px rgba(45,255,140,0.5);transform:translateY(-1px)}
.btn-p:disabled{opacity:0.4;cursor:not-allowed;transform:none;box-shadow:none}
.btn-g{padding:10px 20px;border-radius:10px;border:1px solid rgba(45,255,140,0.25);background:transparent;color:${C.green};font-size:12px;font-weight:600;cursor:pointer;transition:all .25s;font-family:'Satoshi',sans-serif;white-space:nowrap}
.btn-g:hover{background:rgba(45,255,140,0.07);border-color:rgba(45,255,140,0.45)}
.btn-ghost{padding:8px 16px;border-radius:9px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(240,237,230,0.5);font-size:11px;cursor:pointer;transition:all .2s;font-family:'Satoshi',sans-serif;white-space:nowrap}
.btn-ghost:hover{border-color:rgba(255,255,255,0.18);color:${C.white}}
.btn-ghost.act{border-color:rgba(45,255,140,0.35);background:rgba(45,255,140,0.07);color:${C.green}}

/* Mode tabs */
.mode-tab{flex:1;padding:14px 10px;border-radius:14px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);cursor:pointer;transition:all .25s;text-align:center;font-family:'Satoshi',sans-serif}
.mode-tab:hover{border-color:rgba(45,255,140,0.2);background:rgba(45,255,140,0.03)}
.mode-tab.mode-active-bar{border-color:rgba(45,255,140,0.45);background:rgba(45,255,140,0.07);box-shadow:0 0 24px rgba(45,255,140,0.1)}
.mode-tab.mode-active-shop{border-color:rgba(255,140,66,0.45);background:rgba(255,140,66,0.07);box-shadow:0 0 24px rgba(255,140,66,0.1)}

/* Map */
.map-container{position:relative;border-radius:20px;overflow:hidden;background:linear-gradient(135deg,#020d06,#061410,#020d06);border:1px solid rgba(45,255,140,0.1)}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(45,255,140,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(45,255,140,0.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.map-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(45,255,140,0.07) 0%,transparent 65%);pointer-events:none}
.map-scan{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(45,255,140,0.3),transparent);animation:scan 5s linear infinite;pointer-events:none}
.user-dot{position:absolute;width:14px;height:14px;border-radius:50%;background:${C.green};transform:translate(-50%,-50%);animation:userPulse 2.5s infinite;z-index:10}
.map-pin-wrap{position:absolute;display:flex;flex-direction:column;align-items:center;transform:translateX(-50%);cursor:pointer;z-index:8;animation:pinDrop .4s ease both}
.map-pin-body{width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #02060a;transition:all .3s;box-shadow:0 4px 20px rgba(0,0,0,0.5)}
.map-pin-wrap:hover .map-pin-body{transform:rotate(-45deg) scale(1.18)}
.map-pin-wrap.sel .map-pin-body{transform:rotate(-45deg) scale(1.25)}
.map-pin-icon{transform:rotate(45deg);font-size:13px;line-height:1}
.map-pin-lbl{background:rgba(2,6,10,0.92);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:3px 8px;font-family:'JetBrains Mono',monospace;font-size:8px;color:#f0ede6;white-space:nowrap;margin-top:3px;backdrop-filter:blur(10px)}
.map-pin-wrap.sel .map-pin-lbl{border-color:rgba(45,255,140,0.3);color:${C.green}}

/* Cards */
.loc-card{background:rgba(13,26,19,0.6);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:13px 14px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;transition:all .25s}
.loc-card:hover{border-color:rgba(45,255,140,0.2);background:rgba(13,26,19,0.85);transform:translateX(2px)}
.loc-card.active-loc{border-color:rgba(45,255,140,0.4);background:rgba(45,255,140,0.05);box-shadow:0 0 30px rgba(45,255,140,0.06)}
.shop-card{background:rgba(20,14,5,0.6);border:1px solid rgba(255,140,66,0.12);border-radius:14px;padding:13px 14px;display:flex;gap:12px;align-items:flex-start;cursor:pointer;transition:all .25s}
.shop-card:hover{border-color:rgba(255,140,66,0.3);background:rgba(20,14,5,0.85);transform:translateX(2px)}
.shop-card.active-loc{border-color:rgba(255,140,66,0.45);background:rgba(255,140,66,0.06);box-shadow:0 0 30px rgba(255,140,66,0.07)}

/* Shopping list */
.shopping-list-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.05);background:rgba(255,255,255,0.02);margin-bottom:7px;transition:all .2s;position:relative;overflow:hidden}
.shopping-list-item.checked{opacity:0.45}
.shopping-list-item.checked::after{content:'';position:absolute;top:50%;left:40px;right:12px;height:1px;background:rgba(255,255,255,0.3)}
.check-box{width:20px;height:20px;border-radius:6px;border:1.5px solid;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-top:1px;transition:all .2s;font-size:11px}

/* Ingredient badge */
.ingr-chip{display:inline-flex;align-items:center;gap:3px;font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 9px;border-radius:100px;margin:2px}
.ic-yes{background:rgba(45,255,140,0.08);border:1px solid rgba(45,255,140,0.2);color:${C.green}}
.ic-orange{background:rgba(255,140,66,0.08);border:1px solid rgba(255,140,66,0.2);color:${C.orange}}
.ic-maybe{background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.2);color:${C.gold}}
.ic-no{background:rgba(255,87,87,0.06);border:1px solid rgba(255,87,87,0.2);color:${C.red}}

/* Tags */
.tag{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.tg{background:rgba(45,255,140,0.1);border:1px solid rgba(45,255,140,0.2);color:${C.green}}
.to{background:rgba(255,140,66,0.1);border:1px solid rgba(255,140,66,0.2);color:${C.orange}}
.tgo{background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.2);color:${C.gold}}
.tt{background:rgba(0,229,200,0.1);border:1px solid rgba(0,229,200,0.2);color:${C.teal}}
.tp{background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);color:${C.purple}}
.tr{background:rgba(255,87,87,0.1);border:1px solid rgba(255,87,87,0.2);color:${C.red}}

/* Match bar */
.match-track{height:4px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;margin-top:5px}
.match-fill{height:100%;border-radius:2px;transition:width .8s ease}

/* Stars */
.stars{letter-spacing:1px}

/* Action button */
.action-btn{width:100%;padding:12px 16px;border-radius:12px;border:1px solid;background:transparent;cursor:pointer;transition:all .2s;font-family:'Satoshi',sans-serif;display:flex;align-items:center;gap:10px;text-align:left}

/* Progress */
.prog-track{height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden}
.prog-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,${C.green},${C.teal});transition:width .5s ease;box-shadow:0 0 6px ${C.green}}
`;
  document.head.appendChild(s);
};

/* ═══════════════════════════════
   CLAUDE API
═══════════════════════════════ */
async function askClaude(system, user, tokens = 1200) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:tokens, system, messages:[{role:"user",content:user}] }),
  });
  if (!r.ok) throw new Error(r.status);
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

function parseJSON(t) {
  try {
    const m = t.match(/```json\s*([\s\S]*?)```/) || t.match(/(\{[\s\S]*\})/);
    return JSON.parse(m ? (m[1]||m[0]) : t);
  } catch { return null; }
}

/* ═══════════════════════════════
   MOCK DATA
═══════════════════════════════ */
function getMockBars(lat, lng) {
  return [
    { id:"b1", name:"Green Blend Wellness",   address:"123 Brickell Ave",  distance:0.4, rating:4.9, open:true,  phone:"+1-305-555-0101", emoji:"🥤", type:"bar",  lat:lat+0.003, lng:lng-0.002 },
    { id:"b2", name:"Juice & Co",              address:"456 Coral Way",     distance:0.8, rating:4.6, open:true,  phone:"+1-305-555-0202", emoji:"🍹", type:"bar",  lat:lat+0.005, lng:lng+0.004 },
    { id:"b3", name:"Wellness Café Coral",     address:"789 SW 8th St",     distance:1.2, rating:4.7, open:true,  phone:"+1-305-555-0303", emoji:"🌿", type:"bar",  lat:lat-0.004, lng:lng+0.007 },
    { id:"b4", name:"Raw Juice Bar",           address:"321 NW 2nd Ave",    distance:1.5, rating:4.4, open:true,  phone:"+1-305-555-0404", emoji:"🧃", type:"bar",  lat:lat-0.006, lng:lng-0.005 },
    { id:"b5", name:"Vida Verde Smoothies",    address:"654 Flagler St",    distance:2.1, rating:4.8, open:false, phone:"+1-305-555-0505", emoji:"🌱", type:"bar",  lat:lat+0.008, lng:lng-0.009 },
  ];
}

function getMockShops(lat, lng) {
  return [
    { id:"s1", name:"Whole Foods Market",      address:"11 SE 1st Ave",     distance:0.6, rating:4.7, open:true,  phone:"+1-305-555-1001", emoji:"🏪", type:"shop", category:"organic", lat:lat-0.002, lng:lng+0.003, specialties:["Cúrcuma orgánica","Jengibre fresco","Leche de coco","Superfoods"] },
    { id:"s2", name:"Fresco y Natural",         address:"230 NW 27th Ave",   distance:0.9, rating:4.8, open:true,  phone:"+1-305-555-1002", emoji:"🥬", type:"shop", category:"health",  lat:lat+0.006, lng:lng-0.003, specialties:["Mango fresco","Cúrcuma","Ashwagandha","Moringa"] },
    { id:"s3", name:"Publix Supermarket",       address:"701 Brickell Key",  distance:1.1, rating:4.3, open:true,  phone:"+1-305-555-1003", emoji:"🛒", type:"shop", category:"super",   lat:lat-0.005, lng:lng+0.006, specialties:["Frutas frescas","Jengibre","Leche de coco","Plátano"] },
    { id:"s4", name:"Natural Health Foods",     address:"4415 Coral Way",    distance:1.4, rating:4.9, open:true,  phone:"+1-305-555-1004", emoji:"🌾", type:"shop", category:"organic", lat:lat+0.007, lng:lng+0.008, specialties:["Superfoods","Adaptogens","Spirulina","Cúrcuma premium"] },
    { id:"s5", name:"Trader Joe's",             address:"3461 SW 22nd St",   distance:1.8, rating:4.6, open:true,  phone:"+1-305-555-1005", emoji:"🏬", type:"shop", category:"super",   lat:lat-0.008, lng:lng-0.007, specialties:["Frutas orgánicas","Leche de almendras","Gengibre en polvo"] },
    { id:"s6", name:"Farmer's Market Brickell", address:"Brickell Park",     distance:2.2, rating:5.0, open:false, phone:"",               emoji:"🧺", type:"shop", category:"market",  lat:lat+0.010, lng:lng-0.006, specialties:["Mango local","Jengibre fresco","Moringa","Todo orgánico"], days:"Sáb-Dom" },
  ];
}

/* ═══════════════════════════════
   GEOLOCATION HOOK
═══════════════════════════════ */
function useGeo() {
  const [loc,  setLoc]  = useState(null);
  const [err,  setErr]  = useState(null);
  const [busy, setBusy] = useState(false);
  const request = useCallback(() => {
    if (!navigator.geolocation) { setErr("Geolocalización no disponible"); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      p => { setLoc({ lat:p.coords.latitude, lng:p.coords.longitude }); setBusy(false); },
      () => { setErr("No se pudo obtener tu ubicación. Verifica permisos."); setBusy(false); },
      { enableHighAccuracy:true, timeout:10000 }
    );
  }, []);
  return { loc, err, busy, request };
}

/* ═══════════════════════════════
   MAP COMPONENT (shared)
═══════════════════════════════ */
function SmartMap({ places, selectedId, onSelect, userLoc, mode }) {
  const [hovered, setHovered] = useState(null);
  const accentBar  = C.green;
  const accentShop = C.orange;

  const normalize = (p) => {
    if (!userLoc || !p) return { x:50, y:50 };
    const scale = 90;
    return {
      x: Math.max(6, Math.min(94, 50 + (p.lng - userLoc.lng) * scale)),
      y: Math.max(6, Math.min(88, 50 - (p.lat - userLoc.lat) * scale)),
    };
  };

  const pinColor = (p) => {
    if (p.type === "bar")  return { "🥤":C.green,"🍹":C.teal,"🌿":C.gold,"🧃":C.purple,"🌱":"#4ecb71" }[p.emoji] || C.green;
    return { organic:"#4ecb71", health:C.teal, super:C.orange, market:C.gold }[p.category] || C.orange;
  };

  const categoryLabel = (p) => {
    if (p.type === "bar") return "";
    return { organic:"🌱 Orgánico", health:"💊 Salud", super:"🛒 Super", market:"🧺 Mercado" }[p.category] || "";
  };

  return (
    <div className="map-container" style={{ height:300 }}>
      <div className="map-grid" />
      <div className="map-glow" />
      <div className="map-scan" />
      {/* Roads */}
      <div style={{ position:"absolute",left:0,right:0,top:"47%",height:3,background:"rgba(45,255,140,0.04)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",left:0,right:0,top:"72%",height:2,background:"rgba(45,255,140,0.025)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,bottom:0,left:"44%",width:3,background:"rgba(45,255,140,0.04)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,bottom:0,left:"73%",width:2,background:"rgba(45,255,140,0.025)",pointerEvents:"none" }} />
      {/* Radius rings */}
      {userLoc && [60,130].map((r,i)=>(
        <div key={r} style={{ position:"absolute",left:"50%",top:"50%",width:r*2,height:r*2,borderRadius:"50%",border:`1px dashed rgba(45,255,140,${0.12-i*0.05})`,transform:"translate(-50%,-50%)",pointerEvents:"none" }} />
      ))}
      {/* Pins */}
      {places.map((p,i)=>{
        const pos=normalize(p);
        const col=pinColor(p);
        const isSel=selectedId===p.id;
        return (
          <div key={p.id} className={`map-pin-wrap${isSel?" sel":""}`}
            style={{ left:`${pos.x}%`,top:`${pos.y}%`,animationDelay:`${i*0.08}s` }}
            onClick={()=>onSelect(p)}
            onMouseEnter={()=>setHovered(p.id)}
            onMouseLeave={()=>setHovered(null)}>
            <div className="map-pin-body" style={{ background:p.open?col:"#252525",boxShadow:isSel?`0 4px 30px ${col}70`:undefined }}>
              <span className="map-pin-icon">{p.emoji}</span>
            </div>
            <div className="map-pin-lbl" style={{ opacity:isSel||hovered===p.id?1:0.65 }}>
              {p.name.length>15?p.name.substring(0,15)+"…":p.name} · {p.distance}km
            </div>
          </div>
        );
      })}
      {/* User dot */}
      {userLoc && <div className="user-dot" style={{ left:"50%",top:"50%" }} />}
      {/* Bottom bar */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"rgba(2,6,10,0.88)",backdropFilter:"blur(12px)",borderTop:"1px solid rgba(45,255,140,0.1)",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:mode==="bar"?C.green:C.orange }}>
          {mode==="bar"?"🥤":"🛒"} {places.length} locaciones en 3km
        </span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.muted }}>Google Places API</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   SHOPPING LIST COMPONENT
═══════════════════════════════ */
function ShoppingList({ ingredients, checkedItems, onToggle, onShareList, store }) {
  const total = ingredients.length;
  const done  = checkedItems.size;
  const pct   = total > 0 ? Math.round((done/total)*100) : 0;

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:0 }}>
      {/* Header + progress */}
      <div style={{ background:"rgba(255,140,66,0.05)",border:"1px solid rgba(255,140,66,0.18)",borderRadius:"14px 14px 0 0",padding:"14px 16px",borderBottom:"none" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:C.orange,textTransform:"uppercase",letterSpacing:"0.1em" }}>
            🛒 Lista de compras · {store?.name||"tu tienda"}
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:pct===100?C.green:C.orange }}>{done}/{total} · {pct}%</div>
        </div>
        <div className="prog-track" style={{ background:"rgba(255,140,66,0.1)" }}>
          <div className="prog-fill" style={{ width:`${pct}%`,background:`linear-gradient(90deg,${C.orange},${C.gold})`,boxShadow:`0 0 6px ${C.orange}60` }} />
        </div>
      </div>

      {/* Items */}
      <div style={{ background:"rgba(13,8,2,0.6)",border:"1px solid rgba(255,140,66,0.15)",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"12px 14px" }}>
        {ingredients.map((ingr, i) => {
          const checked = checkedItems.has(ingr.id);
          return (
            <div key={ingr.id} className={`shopping-list-item${checked?" checked":""}`}
              style={{ animation:`slideIn .3s ${i*0.05}s ease both` }}>
              {/* Checkbox */}
              <div className="check-box"
                style={{ borderColor:checked?C.green:"rgba(255,255,255,0.2)",background:checked?"rgba(45,255,140,0.15)":"transparent",color:C.green }}
                onClick={()=>onToggle(ingr.id)}>
                {checked?"✓":""}
              </div>
              {/* Ingredient info */}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:700,color:checked?"rgba(240,237,230,0.4)":C.white,marginBottom:2,letterSpacing:"-0.01em" }}>
                  {ingr.emoji} {ingr.name}
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:C.muted }}>{ingr.amount} · {ingr.section}</div>
                {ingr.tip && <div style={{ fontSize:10,color:"rgba(255,140,66,0.7)",marginTop:3,fontStyle:"italic" }}>💡 {ingr.tip}</div>}
              </div>
              {/* Price est. */}
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:C.muted,flexShrink:0 }}>
                {ingr.price_est}
              </div>
            </div>
          );
        })}

        {/* Total estimate */}
        <div style={{ marginTop:10,padding:"10px 12px",background:"rgba(255,140,66,0.06)",border:"1px solid rgba(255,140,66,0.15)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontSize:12,color:C.muted }}>Estimado total</span>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:900,color:C.orange }}>
            ${ingredients.reduce((sum,i)=>sum+parseFloat(i.price_est?.replace("$","")||0),0).toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10 }}>
          <button className="btn-p" style={{ background:C.orange,boxShadow:`0 0 20px rgba(255,140,66,0.3)`,fontSize:11,padding:"10px" }} onClick={onShareList}>
            📤 Compartir lista
          </button>
          <button className="btn-ghost" style={{ fontSize:11 }} onClick={()=>onToggle("clear")}>
            ↺ Resetear lista
          </button>
        </div>

        {pct===100 && (
          <div style={{ marginTop:10,padding:"12px 14px",background:"rgba(45,255,140,0.06)",border:"1px solid rgba(45,255,140,0.25)",borderRadius:10,textAlign:"center",animation:"fadeUp 0.4s ease" }}>
            <div style={{ fontSize:20,marginBottom:6 }}>🎉</div>
            <div style={{ fontSize:13,fontWeight:700,color:C.green,marginBottom:3 }}>¡Lista completa!</div>
            <div style={{ fontSize:11,color:C.muted }}>Ya tienes todos los ingredientes para tu plan de 7 días</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   STORE DETAIL PANEL
═══════════════════════════════ */
function StoreDetail({ store, shoppingList, checkedItems, onToggle, onShareList, onDirections, checkedIn, onCheckin }) {
  if (!store) return (
    <div style={{ padding:"40px 24px",textAlign:"center",border:"1px dashed rgba(255,255,255,0.07)",borderRadius:16,color:C.muted,fontSize:13 }}>
      <div style={{ fontSize:32,marginBottom:12 }}>👆</div>
      Selecciona una tienda para ver la lista de compras
    </div>
  );

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      {/* Store header */}
      <div style={{ background:C.glass,border:"1px solid rgba(255,140,66,0.15)",borderRadius:16,padding:"16px 18px",backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:12 }}>
          <div style={{ width:48,height:48,borderRadius:14,background:"rgba(255,140,66,0.1)",border:"1px solid rgba(255,140,66,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{store.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,fontWeight:700,color:C.white,marginBottom:2 }}>{store.name}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted,marginBottom:6 }}>{store.address} · {store.distance}km</div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
              {store.specialties?.slice(0,3).map(s=>(
                <span key={s} className="ingr-chip ic-orange">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="action-btn" style={{ flex:1,borderColor:"rgba(0,229,200,0.2)",fontSize:11 }} onClick={onDirections}>
            <span style={{ fontSize:16 }}>🗺️</span>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:C.white }}>Cómo llegar</div>
              <div style={{ fontSize:10,color:C.muted }}>{Math.round(store.distance*12)} min</div>
            </div>
          </button>
          <button className="action-btn" style={{ flex:1,borderColor:"rgba(212,168,67,0.2)",fontSize:11 }} onClick={onCheckin} disabled={checkedIn}>
            <span style={{ fontSize:16 }}>{checkedIn?"🏅":"✅"}</span>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:checkedIn?C.gold:C.white }}>{checkedIn?"Compra registrada":"Marcar compra"}</div>
              <div style={{ fontSize:10,color:C.muted }}>{checkedIn?"+100 pts":"+ 100 puntos Rewards"}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Shopping list */}
      {shoppingList.length > 0 && (
        <ShoppingList ingredients={shoppingList} checkedItems={checkedItems} onToggle={onToggle} onShareList={onShareList} store={store} />
      )}
    </div>
  );
}

/* ═══════════════════════════════
   BAR DETAIL PANEL (existing)
═══════════════════════════════ */
function BarDetail({ place, rank, smoothie, checkedIn, onCheckin }) {
  const [sent, setSent] = useState(false);

  const shareRecipe = () => {
    const text = `Hola! Soy miembro de dr.smoothie.ai. Quisiera pedir:\n\n🥤 ${smoothie?.name}\nIngredientes: ${smoothie?.ingredients}\n\n¿Pueden prepararlo? ¡Gracias! 🌿`;
    if (navigator.share) navigator.share({ title:`Receta ${smoothie?.name}`, text });
    else window.open(`https://wa.me/${place.phone?.replace(/\D/g,"")}?text=${encodeURIComponent(text)}`,"_blank");
    setSent(true);
  };

  const openMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address+" "+place.name)}`,"_blank");
  };

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      {/* Header */}
      <div style={{ background:C.glass,border:"1px solid rgba(45,255,140,0.12)",borderRadius:16,padding:"16px 18px",backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex",gap:12,marginBottom:12 }}>
          <div style={{ width:48,height:48,borderRadius:14,background:"rgba(45,255,140,0.1)",border:"1px solid rgba(45,255,140,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{place.emoji}</div>
          <div>
            <div style={{ fontSize:14,fontWeight:700,color:C.white,marginBottom:2 }}>{place.name}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted }}>{place.address}</div>
            <div style={{ marginTop:4,fontSize:11,color:C.green }}>{place.open?"● Abierto ahora":"○ Cerrado"}</div>
          </div>
        </div>
        {/* Recipe */}
        <div style={{ background:"rgba(45,255,140,0.04)",border:"1px solid rgba(45,255,140,0.12)",borderRadius:12,padding:"11px 13px",marginBottom:10 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6 }}>Tu receta del diagnóstico</div>
          <div style={{ fontSize:12,fontWeight:700,color:C.white,marginBottom:3 }}>{smoothie?.name}</div>
          <div style={{ fontSize:11,color:C.muted,lineHeight:1.5 }}>{smoothie?.ingredients}</div>
        </div>
        {/* Match */}
        {rank && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted }}>Match de ingredientes</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:C.green }}>{rank.match_pct}%</span>
            </div>
            <div className="match-track"><div className="match-fill" style={{ width:`${rank.match_pct}%`,background:`linear-gradient(90deg,${C.green},${C.teal})`,boxShadow:`0 0 6px ${C.green}50` }} /></div>
            {rank.reason && <div style={{ fontSize:10,color:"rgba(240,237,230,0.45)",fontStyle:"italic",marginTop:5 }}>🤖 "{rank.reason}"</div>}
          </div>
        )}
        {/* Actions */}
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <button className="action-btn" style={{ borderColor:`rgba(45,255,140,${sent?0.1:0.3})` }} onClick={shareRecipe} disabled={sent}>
            <span style={{ fontSize:18 }}>{sent?"✅":"📤"}</span>
            <div><div style={{ fontSize:12,fontWeight:700,color:sent?"rgba(240,237,230,0.4)":C.white }}>{sent?"Receta enviada":"Enviar receta al local"}</div><div style={{ fontSize:10,color:C.muted }}>WhatsApp · {place.name}</div></div>
          </button>
          <button className="action-btn" style={{ borderColor:"rgba(0,229,200,0.2)" }} onClick={openMaps}>
            <span style={{ fontSize:18 }}>🗺️</span>
            <div><div style={{ fontSize:12,fontWeight:700,color:C.white }}>Cómo llegar</div><div style={{ fontSize:10,color:C.muted }}>{place.distance}km · {Math.round(place.distance*12)} min</div></div>
          </button>
          <button className="action-btn" style={{ borderColor:`rgba(212,168,67,${checkedIn?0.35:0.2})`,background:checkedIn?"rgba(212,168,67,0.05)":"transparent" }} onClick={onCheckin} disabled={checkedIn}>
            <span style={{ fontSize:18 }}>{checkedIn?"🏅":"✅"}</span>
            <div><div style={{ fontSize:12,fontWeight:700,color:checkedIn?C.gold:C.white }}>{checkedIn?"¡Smoothie consumido! +50pts":"Marcar como consumido"}</div><div style={{ fontSize:10,color:C.muted }}>{checkedIn?"Streak activo 🔥":"+50 puntos Rewards"}</div></div>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   MAIN MODULE
═══════════════════════════════ */
export default function SmartLocatorV2({ smoothies, memberName, weeklyPlan }) {
  const defaultSmoothie = smoothies?.[0] || { emoji:"🧡",name:"Golden Glow Antiinflamatorio",ingredients:"Mango · Cúrcuma · Jengibre · Leche de coco · Pimienta negra",timing:"Mañana en ayunas",benefit:"Antiinflamatorio" };

  const [mode,       setMode]       = useState("choose"); // choose|bar|shop
  const [activeSm,   setActiveSm]   = useState(defaultSmoothie);
  const [places,     setPlaces]     = useState([]);
  const [rankings,   setRankings]   = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [checked,    setChecked]    = useState(new Set());
  const [phase,      setPhase]      = useState("idle");
  const [phaseMsg,   setPhaseMsg]   = useState("");
  const [barCheckin, setBarCheckin] = useState(false);
  const [shopCheckin,setShopCheckin]= useState(false);
  const [errMsg,     setErrMsg]     = useState("");
  const { loc, err:geoErr, busy:geoBusy, request:requestGeo } = useGeo();

  useEffect(() => { injectCSS(); }, []);
  useEffect(() => { if (loc) searchPlaces(); }, [loc, mode]);
  useEffect(() => { if (geoErr) { setPhase("error"); setErrMsg(geoErr); } }, [geoErr]);

  const startFlow = (selectedMode) => {
    setMode(selectedMode);
    setPhase("locating");
    setPhaseMsg("Detectando tu ubicación…");
    requestGeo();
  };

  const searchPlaces = async () => {
    setPhase("searching");
    setPhaseMsg(mode==="bar"?"Buscando smoothie bars y juice bars…":"Buscando tiendas de ingredientes saludables…");
    await new Promise(r=>setTimeout(r,1100));

    const found = mode==="bar" ? getMockBars(loc.lat,loc.lng) : getMockShops(loc.lat,loc.lng);
    setPlaces(found);

    setPhase("ranking");
    setPhaseMsg(mode==="bar"?"El AI analiza qué local puede preparar tu receta…":"El AI genera tu lista de compras personalizada…");
    await enrichWithClaude(found);
  };

  const enrichWithClaude = async (found) => {
    try {
      if (mode === "bar") {
        // Rank bars by ingredient match
        const list = found.map(p=>`- ${p.id}: ${p.name} (${p.distance}km, ${p.open?"abierto":"cerrado"})`).join("\n");
        const raw = await askClaude(
          `Eres SmartLocator de dr.smoothie.ai. Rankea smoothie bars por probabilidad de match de ingredientes. Responde SOLO JSON: {"rankings":[{"id":"b1","match_pct":95,"ingredients":[{"name":"Mango","available":true,"likely":false},{"name":"Cúrcuma","available":true,"likely":false}],"reason":"1 frase"}]}`,
          `Receta: ${activeSm.name} — ${activeSm.ingredients}\nLocales:\n${list}`, 900
        );
        const parsed = parseJSON(raw);
        if (parsed?.rankings) {
          const map = {};
          parsed.rankings.forEach(r => { map[r.id] = r; });
          setRankings(map);
        } else fallbackRankings(found);
        setSelectedId(found[0]?.id);
        setPhase("ready");

      } else {
        // Generate shopping list + rank stores
        const storeList = found.map(p=>`- ${p.id}: ${p.name} · especialidades: ${p.specialties?.join(", ")}`).join("\n");

        const raw = await askClaude(
          `Eres el nutricionista de dr.smoothie.ai. Con los ingredientes de una receta, genera:
1. Una lista de compras detallada con cantidades, sección del supermercado, tip de compra y precio estimado (USD).
2. Un ranking de tiendas por disponibilidad de ingredientes.
Responde SOLO JSON:
{"shopping_list":[{"id":"i1","name":"Mango","emoji":"🥭","amount":"2 unidades medianas","section":"Frutas y verduras","tip":"Elige maduros de aroma dulce","price_est":"$2.99","smoothie":true}],"store_rankings":[{"store_id":"s1","match_pct":95,"reason":"Tiene todos los ingredientes orgánicos"}]}`,
          `Receta: ${activeSm.name} — Ingredientes: ${activeSm.ingredients}\n\nPlan semanal: ${weeklyPlan ? `${weeklyPlan} días de rutina` : "7 días"}\n\nTiendas cercanas:\n${storeList}`,
          1200
        );
        const parsed = parseJSON(raw);
        if (parsed) {
          if (parsed.shopping_list) setShoppingList(parsed.shopping_list);
          if (parsed.store_rankings) {
            const map = {};
            parsed.store_rankings.forEach(r => { map[r.store_id] = r; });
            setRankings(map);
          }
        } else fallbackShoppingList();
        setSelectedId(found[0]?.id);
        setPhase("ready");
      }
    } catch {
      if (mode==="bar") fallbackRankings(found);
      else fallbackShoppingList();
      setSelectedId(found[0]?.id);
      setPhase("ready");
    }
  };

  const fallbackRankings = (found) => {
    const map = {};
    found.forEach((p,i) => { map[p.id] = { id:p.id,match_pct:95-i*8,reason:"Especializado en smoothies naturales con ingredientes frescos",ingredients:[{name:"Mango",available:true},{name:"Cúrcuma",available:i<2},{name:"Jengibre",available:true},{name:"Leche de coco",available:true}] }; });
    setRankings(map);
  };

  const fallbackShoppingList = () => {
    setShoppingList([
      {id:"i1",name:"Mango",emoji:"🥭",amount:"2 unidades",section:"Frutas y verduras",tip:"Maduros, aroma dulce",price_est:"$2.99",smoothie:true},
      {id:"i2",name:"Cúrcuma en polvo",emoji:"🌿",amount:"1 tarro 50g",section:"Especias",tip:"Busca cúrcuma orgánica para mayor curcumina",price_est:"$4.99",smoothie:true},
      {id:"i3",name:"Jengibre fresco",emoji:"🫚",amount:"1 raíz pequeña",section:"Frutas y verduras",tip:"Fresco es más potente que en polvo",price_est:"$1.49",smoothie:true},
      {id:"i4",name:"Leche de coco",emoji:"🥥",amount:"1 lata 400ml",section:"Lácteos alternativos",tip:"Elige sin azúcar añadida",price_est:"$2.49",smoothie:true},
      {id:"i5",name:"Pimienta negra",emoji:"🫙",amount:"1 pizca / tarro",section:"Especias",tip:"Activa la curcumina del cúrcuma x2000%",price_est:"$1.99",smoothie:true},
    ]);
  };

  const toggleItem = (id) => {
    if (id === "clear") { setChecked(new Set()); return; }
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const shareShoppingList = () => {
    const items = shoppingList.map(i=>`${i.emoji} ${i.name} · ${i.amount} · ${i.price_est}`).join("\n");
    const text  = `🛒 Mi lista de compras dr.smoothie.ai\n\nReceta: ${activeSm.name}\n\n${items}\n\n💚 Plan de bienestar personalizado · purelifewellnessclub.org`;
    if (navigator.share) navigator.share({ title:"Lista dr.smoothie.ai", text });
    else { navigator.clipboard?.writeText(text); alert("Lista copiada al portapapeles"); }
  };

  const selectedPlace = places.find(p => p.id === selectedId);
  const sortedPlaces  = [...places].sort((a,b)=>(rankings[b.id]?.match_pct||50)-(rankings[a.id]?.match_pct||50));

  /* ── CHOOSE MODE ── */
  if (mode === "choose") return (
    <div style={{ display:"flex",flexDirection:"column",gap:20,padding:"32px 24px",background:C.glass,border:"1px solid rgba(45,255,140,0.1)",borderRadius:24,backdropFilter:"blur(20px)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:44,marginBottom:14,animation:"floatY 3s ease-in-out infinite" }}>📍</div>
        <h3 style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,letterSpacing:"-0.03em",color:C.white,marginBottom:8 }}>
          ¿Cómo quieres preparar tu <span style={{ color:C.green }}>{activeSm.name}</span>?
        </h3>
        <p style={{ fontSize:13,color:C.muted,lineHeight:1.7,maxWidth:400,margin:"0 auto" }}>
          Elige cómo cumplir tu rutina hoy — ya sea yendo a un bar o comprando y preparando en casa.
        </p>
      </div>

      {/* Mode cards */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>

        {/* BAR mode */}
        <div className="mode-tab mode-active-bar" onClick={()=>startFlow("bar")}>
          <div style={{ fontSize:36,marginBottom:10 }}>🥤</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,letterSpacing:"-0.02em",color:C.white,marginBottom:6 }}>Que me lo preparen</div>
          <div style={{ fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:14 }}>
            Smoothie bars y juice bars cercanos que pueden preparar exactamente tu receta ahora mismo.
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:14 }}>
            {["🥤 Smoothie bars","🍹 Juice bars","🌿 Wellness cafés"].map(t=>(
              <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green,background:"rgba(45,255,140,0.08)",border:"1px solid rgba(45,255,140,0.15)",borderRadius:100,padding:"3px 9px" }}>{t}</span>
            ))}
          </div>
          <div style={{ background:C.green,color:"#020a06",borderRadius:10,padding:"11px",fontSize:13,fontWeight:800,fontFamily:"'Satoshi',sans-serif" }}>
            📍 Buscar cerca de mí
          </div>
        </div>

        {/* SHOP mode */}
        <div className="mode-tab mode-active-shop" onClick={()=>startFlow("shop")}>
          <div style={{ fontSize:36,marginBottom:10 }}>🛒</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,letterSpacing:"-0.02em",color:C.white,marginBottom:6 }}>Lo preparo en casa</div>
          <div style={{ fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:14 }}>
            Tiendas cercanas con los ingredientes. Lista de compras generada automáticamente con cantidades y tips de selección.
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",marginBottom:14 }}>
            {["🌾 Tiendas orgánicas","🛒 Supermercados","🧺 Mercados locales"].map(t=>(
              <span key={t} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.orange,background:"rgba(255,140,66,0.08)",border:"1px solid rgba(255,140,66,0.15)",borderRadius:100,padding:"3px 9px" }}>{t}</span>
            ))}
          </div>
          <div style={{ background:C.orange,color:"#020a06",borderRadius:10,padding:"11px",fontSize:13,fontWeight:800,fontFamily:"'Satoshi',sans-serif" }}>
            🛒 Ver tiendas + lista
          </div>
        </div>
      </div>

      {/* Recipe preview */}
      <div style={{ background:"rgba(45,255,140,0.04)",border:"1px solid rgba(45,255,140,0.12)",borderRadius:14,padding:"14px 16px" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.green,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8 }}>🍹 Tu receta de hoy · Del diagnóstico</div>
        <div style={{ display:"flex",gap:12,alignItems:"center" }}>
          <div style={{ fontSize:28,flexShrink:0 }}>{activeSm.emoji}</div>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:C.white,marginBottom:2 }}>{activeSm.name}</div>
            <div style={{ fontSize:11,color:C.muted }}>{activeSm.ingredients}</div>
          </div>
        </div>
      </div>

      {/* Smoothie selector */}
      {smoothies?.length > 1 && (
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8 }}>Cambiar receta activa</div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {smoothies.map((s,i)=>(
              <button key={i} className={`btn-ghost${activeSm===s?" act":""}`} style={{ fontSize:11 }} onClick={()=>setActiveSm(s)}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ── LOADING ── */
  if (["locating","searching","ranking"].includes(phase)) return (
    <div style={{ padding:"40px 24px",textAlign:"center",background:C.glass,border:`1px solid rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.1)`,borderRadius:24,backdropFilter:"blur(20px)" }}>
      <div style={{ width:60,height:60,borderRadius:"50%",border:`3px solid rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.2)`,borderTopColor:mode==="bar"?C.green:C.orange,animation:"spin 1s linear infinite",margin:"0 auto 24px" }} />
      <div style={{ fontSize:14,fontWeight:700,color:C.white,marginBottom:8 }}>{phaseMsg}</div>
      <div style={{ display:"flex",flexDirection:"column",gap:7,maxWidth:340,margin:"16px auto 0" }}>
        {[{p:"locating",t:"Ubicación GPS"},{p:"searching",t:mode==="bar"?"Buscando locales":"Buscando tiendas"},{p:"ranking",t:mode==="bar"?"Analizando match":"Generando lista de compras"}].map((s,i)=>(
          <div key={s.p} style={{ display:"flex",gap:10,alignItems:"center",fontSize:12,opacity:["locating","searching","ranking"].indexOf(phase)>=i?1:0.2,transition:"opacity .5s" }}>
            <span style={{ fontSize:13,color:["locating","searching","ranking"].indexOf(phase)>i?C.green:phase===s.p?C.teal:C.muted }}>
              {["locating","searching","ranking"].indexOf(phase)>i?"✓":phase===s.p?"⟳":"○"}
            </span>
            <span style={{ color:phase===s.p?C.white:C.muted }}>{s.t}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── ERROR ── */
  if (phase === "error") return (
    <div style={{ padding:"32px 24px",textAlign:"center",background:"rgba(255,87,87,0.04)",border:"1px solid rgba(255,87,87,0.2)",borderRadius:24 }}>
      <div style={{ fontSize:40,marginBottom:12 }}>📍</div>
      <div style={{ fontSize:14,fontWeight:700,color:C.white,marginBottom:8 }}>Error de ubicación</div>
      <div style={{ fontSize:12,color:C.muted,marginBottom:20 }}>{errMsg}</div>
      <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
        <button className="btn-g" onClick={()=>startFlow(mode)}>Intentar de nuevo</button>
        <button className="btn-ghost" onClick={()=>{setMode("choose");setPhase("idle");}}>← Volver</button>
      </div>
    </div>
  );

  /* ── READY ── */
  const accentCol = mode==="bar"?C.green:C.orange;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:14,animation:"fadeUp 0.4s ease" }}>

      {/* Header strip */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:accentCol,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3 }}>
            {mode==="bar"?"🥤 Smoothie bars":"🛒 Tiendas de ingredientes"} · {places.length} en 3km
          </div>
          <div style={{ fontSize:15,fontWeight:700,color:C.white }}>{memberName?"Para "+memberName+" · ":""}{activeSm.name}</div>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn-ghost" onClick={()=>{setMode("choose");setPhase("idle");setPlaces([]);setSelectedId(null);setBarCheckin(false);setShopCheckin(false);}}>
            ⇄ Cambiar modo
          </button>
          <button className="btn-ghost" onClick={()=>{setPlaces([]);setPhase("locating");setPhaseMsg("Detectando ubicación…");requestGeo();}}>↺</button>
        </div>
      </div>

      {/* Map */}
      <SmartMap places={places} selectedId={selectedId} onSelect={p=>setSelectedId(p.id)} userLoc={loc} mode={mode} />

      {/* Content */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>

        {/* Left: sorted list */}
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2 }}>
            {mode==="bar"?"Ranqueadas por match · Claude AI":"Ordenadas por disponibilidad de ingredientes"}
          </div>
          {sortedPlaces.map(p=>(
            <div key={p.id} className={`${mode==="bar"?"loc-card":"shop-card"}${selectedId===p.id?" active-loc":""}`} onClick={()=>setSelectedId(p.id)}>
              <div style={{ width:40,height:40,borderRadius:11,background:`rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.08)`,border:`1px solid rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.2)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{p.emoji}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:700,color:C.white,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.name}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.muted,marginBottom:4 }}>{p.address} · {p.distance}km</div>
                {mode==="shop" && p.specialties && (
                  <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
                    {p.specialties.slice(0,2).map(s=><span key={s} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:C.orange,background:"rgba(255,140,66,0.07)",borderRadius:100,padding:"2px 7px" }}>{s}</span>)}
                  </div>
                )}
                {rankings[p.id]?.match_pct && (
                  <>
                    <div className="match-track" style={{ marginTop:5 }}>
                      <div className="match-fill" style={{ width:`${rankings[p.id].match_pct}%`,background:mode==="bar"?`linear-gradient(90deg,${C.green},${C.teal})`:`linear-gradient(90deg,${C.orange},${C.gold})`,boxShadow:`0 0 5px ${mode==="bar"?C.green:C.orange}50` }} />
                    </div>
                  </>
                )}
              </div>
              <div style={{ flexShrink:0,textAlign:"right" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:accentCol,background:`rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.08)`,border:`1px solid rgba(${mode==="bar"?"45,255,140":"255,140,66"},0.2)`,borderRadius:100,padding:"2px 9px",marginBottom:3 }}>{p.distance}km</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:p.open?C.green:C.red }}>{p.open?"Abierto":p.days||"Cerrado"}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail panel */}
        <div>
          {mode==="bar" ? (
            <BarDetail place={selectedPlace} rank={selectedPlace?rankings[selectedPlace.id]:null} smoothie={activeSm} checkedIn={barCheckin} onCheckin={()=>setBarCheckin(true)} />
          ) : (
            <StoreDetail
              store={selectedPlace}
              shoppingList={shoppingList}
              checkedItems={checked}
              onToggle={toggleItem}
              onShareList={shareShoppingList}
              onDirections={()=>selectedPlace&&window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPlace.address+" "+selectedPlace.name)}`,"_blank")}
              checkedIn={shopCheckin}
              onCheckin={()=>setShopCheckin(true)}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize:10,color:"rgba(255,255,255,0.15)",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.6 }}>
        SmartLocator usa Google Places API · Los precios son estimados · dr.smoothie.ai no está afiliado con los establecimientos listados
      </div>
    </div>
  );
}
