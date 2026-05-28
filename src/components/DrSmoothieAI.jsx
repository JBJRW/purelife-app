import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg0: "#02060a", bg1: "#060d0a", bg2: "#0a1410", bg3: "#0e1c16",
  green: "#2dff8c", teal: "#00e5c8", gold: "#d4a843",
  white: "#f0ede6", muted: "#3d5449",
  glass: "rgba(13,26,19,0.7)", border: "rgba(45,255,140,0.1)",
};

/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800;900&family=Satoshi:wght@300;400;500;700;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { background:${T.bg0}; color:${T.white}; font-family:'Satoshi',system-ui,sans-serif; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:#060d0a; }
  ::-webkit-scrollbar-thumb { background:rgba(45,255,140,0.3); border-radius:2px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseDot { 0%{box-shadow:0 0 0 0 rgba(45,255,140,0.6)} 70%{box-shadow:0 0 0 10px rgba(45,255,140,0)} 100%{box-shadow:0 0 0 0 rgba(45,255,140,0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes scanLine { 0%{top:-10%} 100%{top:110%} }
  @keyframes barGrow  { from{transform:scaleY(0);transform-origin:bottom} to{transform:scaleY(1)} }

  .reveal { opacity:0; transform:translateY(32px); transition:opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .nav-link { font-size:13px; font-weight:500; color:${T.muted}; text-decoration:none; transition:color 0.25s; cursor:pointer; }
  .nav-link:hover { color:${T.white}; }

  .btn-ghost {
    padding:8px 18px; border-radius:8px; border:1px solid rgba(45,255,140,0.2);
    background:transparent; color:${T.green}; font-size:12px; font-weight:600;
    font-family:'Satoshi',sans-serif; cursor:pointer; transition:all 0.25s; letter-spacing:0.02em;
  }
  .btn-ghost:hover { background:rgba(45,255,140,0.06); border-color:rgba(45,255,140,0.4); }

  .btn-primary {
    padding:10px 22px; border-radius:8px; border:none; background:${T.green};
    color:#02060a; font-size:13px; font-weight:800; font-family:'Satoshi',sans-serif;
    cursor:pointer; transition:all 0.25s; letter-spacing:0.02em;
    box-shadow:0 0 28px rgba(45,255,140,0.3);
  }
  .btn-primary:hover { background:#45ffaa; box-shadow:0 0 40px rgba(45,255,140,0.5); transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .tier-card { transition:transform 0.35s, box-shadow 0.35s; }
  .tier-card:hover { transform:translateY(-8px); box-shadow:0 40px 100px rgba(0,0,0,0.55) !important; }

  .step-card { transition:all 0.3s; }
  .step-card:hover { transform:translateY(-4px); border-color:rgba(45,255,140,0.25) !important; }

  .bento-card { transition:all 0.3s; }
  .bento-card:hover { transform:translateY(-3px); border-color:rgba(45,255,140,0.2) !important; }

  .ingr-tag { transition:all 0.2s; cursor:default; }
  .ingr-tag:hover { background:rgba(45,255,140,0.12); color:${T.green}; border-color:rgba(45,255,140,0.3); }

  textarea, input, select {
    font-family:'Satoshi',sans-serif;
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(45,255,140,0.15);
    border-radius:12px; color:${T.white};
    padding:12px 16px; font-size:14px; outline:none;
    transition:border-color 0.25s;
  }
  textarea:focus, input:focus, select:focus { border-color:rgba(45,255,140,0.4); }
  select option { background:#0a1410; }

  .progress-bar {
    height:2px; background:rgba(45,255,140,0.1); border-radius:1px; overflow:hidden;
  }
  .progress-fill {
    height:100%; border-radius:1px;
    background:linear-gradient(90deg, ${T.green}, ${T.teal});
    transition:width 0.5s ease;
    box-shadow:0 0 8px ${T.green};
  }

  .video-result { animation:fadeUp 0.6s ease both; }

  .share-btn { transition:all 0.2s; cursor:pointer; }
  .share-btn:hover { transform:scale(1.05); }

  @media(max-width:900px) {
    .hero-grid { grid-template-columns:1fr !important; }
    .hero-right-panel { display:none !important; }
    .steps-grid { grid-template-columns:1fr 1fr !important; }
    .tiers-grid { grid-template-columns:1fr !important; }
    .bento-grid { grid-template-columns:1fr !important; }
    .bento-wide { grid-column:span 1 !important; }
    .footer-grid { grid-template-columns:1fr 1fr !important; }
    .studio-grid { grid-template-columns:1fr !important; }
    nav { padding:0 16px !important; }
    .nav-links-desktop { display:none !important; }
    .section-pad { padding:80px 20px !important; }
    .hero-pad { padding:120px 20px 80px !important; }
  }
`;

/* ─────────────────────────────────────────
   HOOK: CANVAS PARTICLES
───────────────────────────────────────── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H, particles = [];

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : (Math.random() > 0.5 ? -4 : H + 4);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.8 + 0.4;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.phase += 0.018;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset(false);
      }
      draw() {
        const a = 0.12 + Math.sin(this.phase) * 0.06;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,255,140,${a})`;
        ctx.fill();
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 130; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(45,255,140,${(1 - d / 110) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        particles[i].update();
        particles[i].draw();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
}

/* ─────────────────────────────────────────
   HOOK: SCROLL REVEAL
───────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────
   CLAUDE API HELPER
───────────────────────────────────────── */
async function callClaude(systemPrompt, userPrompt, maxTokens = 800) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav({ activeSection }) {
  const links = [
    { href: "como-funciona", label: "Cómo funciona" },
    { href: "video-studio",  label: "Video AI 🎬" },
    { href: "features",      label: "Features" },
    { href: "planes",        label: "Planes" },
  ];
  const scroll = href => document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      height:68, display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 48px",
      backdropFilter:"blur(24px)",
      background:"rgba(2,6,10,0.7)",
      borderBottom:"1px solid rgba(45,255,140,0.06)",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background:`linear-gradient(135deg,${T.bg2},${T.bg3})`,
          border:"1px solid rgba(45,255,140,0.3)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700,
          color:T.green,
          boxShadow:"0 0 20px rgba(45,255,140,0.15)",
        }}>dr</div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:T.white }}>
          <span style={{ color:T.green }}>dr.</span>smoothie<span style={{ color:T.green }}>.ai</span>
        </span>
      </div>

      {/* Links */}
      <ul className="nav-links-desktop" style={{ display:"flex", gap:36, listStyle:"none" }}>
        {links.map(l => (
          <li key={l.href}>
            <span className="nav-link" onClick={() => scroll(l.href)}>{l.label}</span>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div style={{ display:"flex", gap:10 }}>
        <button className="btn-ghost">Iniciar sesión</button>
        <button className="btn-primary" onClick={() => scroll("planes")}>Comenzar gratis</button>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
  const stats = [
    { num:"200", sup:"+", label:"Ingredientes activos" },
    { num:"4K",  sup:" AI", label:"Video generado" },
    { num:"24",  sup:"/7",  label:"Dr. Smoothie live" },
    { num:"3",   sup:"x",   label:"Tiers de membresía" },
  ];

  const scrollToStudio = () => document.getElementById("video-studio")?.scrollIntoView({ behavior:"smooth" });
  const scrollToPlanes = () => document.getElementById("planes")?.scrollIntoView({ behavior:"smooth" });

  return (
    <section className="hero-pad" style={{
      minHeight:"100vh", padding:"140px 48px 100px",
      display:"grid", gridTemplateColumns:"1fr 440px", gap:60,
      alignItems:"center", position:"relative",
    }} className="hero-grid">
      {/* vertical scan */}
      <div style={{
        position:"absolute", left:"50%", top:0, bottom:0, width:1,
        background:"linear-gradient(180deg,transparent 0%,rgba(45,255,140,0.12) 30%,rgba(45,255,140,0.06) 70%,transparent 100%)",
        pointerEvents:"none",
      }} />

      {/* LEFT */}
      <div>
        {/* eyebrow */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          border:"1px solid rgba(45,255,140,0.2)", background:"rgba(45,255,140,0.04)",
          borderRadius:100, padding:"5px 14px 5px 8px", marginBottom:32,
          animation:"fadeUp 0.8s ease both",
        }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:T.green, animation:"pulseDot 2s infinite", flexShrink:0 }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, letterSpacing:"0.08em", textTransform:"uppercase" }}>
            AI Wellness Platform · Now Live
          </span>
        </div>

        {/* headline */}
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontSize:"clamp(52px,5.5vw,80px)",
          fontWeight:900, lineHeight:0.93, letterSpacing:"-0.04em",
          marginBottom:28, animation:"fadeUp 0.8s 0.1s ease both", color:T.white,
        }}>
          Tu smoothie.<br/>
          <span style={{ color:T.green }}>Inteligencia real.</span><br/>
          <span style={{ color:"rgba(240,237,230,0.3)" }}>Resultados visibles.</span>
        </h1>

        <p style={{
          fontSize:16, fontWeight:400, color:"rgba(240,237,230,0.5)",
          lineHeight:1.75, maxWidth:480, marginBottom:44,
          animation:"fadeUp 0.8s 0.2s ease both",
        }}>
          La primera plataforma que combina <strong style={{ color:"rgba(240,237,230,0.85)" }}>IA conversacional</strong>,
          ciencia de ingredientes y <strong style={{ color:T.green }}>generación de video 4K</strong> para
          tu bienestar. No es una app. Es tu laboratorio personal.
        </p>

        {/* CTAs */}
        <div style={{ display:"flex", alignItems:"center", gap:16, animation:"fadeUp 0.8s 0.3s ease both" }}>
          <button className="btn-primary" style={{ padding:"14px 28px", fontSize:14 }} onClick={scrollToPlanes}>
            ⚡ Empieza gratis hoy
          </button>
          <div onClick={scrollToStudio} style={{ display:"flex", alignItems:"center", gap:10, color:"rgba(240,237,230,0.4)", fontSize:13, cursor:"pointer", transition:"color 0.25s" }}
            onMouseEnter={e => e.currentTarget.style.color="rgba(240,237,230,0.8)"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(240,237,230,0.4)"}>
            <div style={{
              width:44, height:44, borderRadius:"50%",
              border:"1px solid rgba(240,237,230,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, color:T.white, transition:"all 0.25s",
            }}>▶</div>
            Ver el Video AI
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display:"flex", gap:36, marginTop:52,
          paddingTop:28, borderTop:"1px solid rgba(45,255,140,0.07)",
          animation:"fadeUp 0.8s 0.45s ease both",
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:900, letterSpacing:"-0.04em", color:T.white, lineHeight:1 }}>
                {s.num}<span style={{ color:T.green, fontSize:16 }}>{s.sup}</span>
              </div>
              <div style={{ fontSize:10, color:T.muted, marginTop:4, fontWeight:500, letterSpacing:"0.02em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — App preview card */}
      <div className="hero-right-panel" style={{ position:"relative", animation:"fadeUp 0.8s 0.2s ease both" }}>
        {/* floating badges */}
        {[
          { style:{ top:-14, left:-36 }, label:"AI Model", val:"claude-sonnet-4", green:true },
          { style:{ bottom:70, right:-36 }, label:"Calidad", val:"4K Ultra HD", green:false },
          { style:{ bottom:-14, left:24 }, label:"Listo en", val:"38s ⚡", green:true },
        ].map((b,i) => (
          <div key={i} style={{
            position:"absolute", ...b.style,
            background:T.glass, border:"1px solid rgba(45,255,140,0.15)",
            backdropFilter:"blur(20px)", borderRadius:12, padding:"8px 14px",
            boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
            animation:`floatY ${5+i}s ease-in-out infinite`,
            animationDelay:`${i*1.5}s`,
          }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>{b.label}</div>
            <div style={{ fontSize:12, fontWeight:700, color: b.green ? T.green : T.white }}>{b.val}</div>
          </div>
        ))}

        {/* Main card */}
        <div style={{
          background:T.glass, border:"1px solid rgba(45,255,140,0.12)",
          borderRadius:28, padding:28,
          backdropFilter:"blur(40px)",
          boxShadow:"0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation:"floatY 6s ease-in-out infinite",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:T.green }}>dr.smoothie.ai</span>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:T.green, animation:"pulseDot 2s infinite" }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.green, textTransform:"uppercase", letterSpacing:"0.06em" }}>AI activo</span>
            </div>
          </div>

          {/* Video frame */}
          <div style={{
            height:172, borderRadius:18, marginBottom:18,
            background:"linear-gradient(135deg,#030a06,#071510,#030a06)",
            border:"1px solid rgba(45,255,140,0.08)",
            position:"relative", overflow:"hidden",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 60%, rgba(45,255,140,0.1) 0%, transparent 65%)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,rgba(45,255,140,0.015) 0px,rgba(45,255,140,0.015) 1px,transparent 1px,transparent 4px)", pointerEvents:"none" }} />
            {/* Scan line */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(45,255,140,0.4),transparent)", animation:"scanLine 3s linear infinite", pointerEvents:"none" }} />
            <div style={{
              width:52, height:52, borderRadius:"50%",
              background:"rgba(45,255,140,0.12)", border:"1.5px solid rgba(45,255,140,0.5)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, color:T.green, position:"relative", zIndex:1,
              boxShadow:"0 0 40px rgba(45,255,140,0.3)",
            }}>▶</div>
            <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(2,6,10,0.85)", backdropFilter:"blur(10px)", border:"1px solid rgba(45,255,140,0.15)", borderRadius:8, padding:"4px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.green, zIndex:2 }}>🎬 4K HD</div>
            <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(2,6,10,0.85)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:8, padding:"4px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(240,237,230,0.5)", zIndex:2 }}>0:10</div>
          </div>

          {/* Chat preview */}
          {[
            { user:false, msg:<>Recomiendo <strong style={{color:T.green}}>Mango + Jengibre + Cúrcuma</strong> — blend antiinflamatorio. ¿Genero el video 4K?</> },
            { user:true,  msg:"Sí, genera en 4K ahora" },
          ].map((c,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:10, flexDirection:c.user?"row-reverse":"row", alignItems:"flex-start" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", border:"1px solid rgba(45,255,140,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, background:T.bg2 }}>{c.user?"👤":"🤖"}</div>
              <div style={{
                background:c.user?"rgba(45,255,140,0.06)":"rgba(255,255,255,0.04)",
                border:`1px solid ${c.user?"rgba(45,255,140,0.12)":"rgba(255,255,255,0.07)"}`,
                borderRadius:c.user?"14px 0 14px 14px":"0 14px 14px 14px",
                padding:"8px 12px", fontSize:11, lineHeight:1.5, color:"rgba(240,237,230,0.75)", flex:1,
              }}>{c.msg}</div>
            </div>
          ))}

          <button className="btn-primary" style={{ width:"100%", marginTop:6 }}>🎬 Generando video 4K…</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n:"01", icon:"💬", name:"Cuéntale al AI", desc:"Dile al Dr. Smoothie cómo te sientes, qué necesitas o qué tienes en casa. Conversación natural." },
    { n:"02", icon:"🧬", name:"Análisis de ingredientes", desc:"200+ ingredientes analizados. La IA genera tu combinación óptima basada en propiedades reales." },
    { n:"03", icon:"🎬", name:"Genera video 4K", desc:"Con un clic, el AI genera un video cinematográfico de tu smoothie personalizado. En 30-60 segundos." },
    { n:"04", icon:"📲", name:"Comparte y disfruta", desc:"Descarga tu video y compártelo directamente en TikTok, Instagram Reels o WhatsApp." },
  ];

  return (
    <section id="como-funciona" className="section-pad" style={{ padding:"120px 48px", position:"relative" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, letterSpacing:"0.12em", textTransform:"uppercase" }}>Proceso</span>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(45,255,140,0.2),transparent)" }} />
      </div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:900, letterSpacing:"-0.04em", color:T.white, marginBottom:14 }}>
        Así de simple<span style={{ color:T.green }}>.</span>
      </h2>
      <p style={{ fontSize:15, color:"rgba(240,237,230,0.4)", maxWidth:480, lineHeight:1.7, marginBottom:60 }}>
        Cuatro pasos. Del ingrediente al video viral. Todo en menos de 60 segundos.
      </p>

      <div className="reveal steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2, position:"relative" }}>
        <div style={{ position:"absolute", top:42, left:"8%", right:"8%", height:1, background:"linear-gradient(90deg,transparent,rgba(45,255,140,0.1),rgba(45,255,140,0.1),transparent)", zIndex:0 }} />
        {steps.map(s => (
          <div key={s.n} className="step-card" style={{
            background:T.glass, border:"1px solid rgba(45,255,140,0.1)",
            borderRadius:20, padding:"28px 24px", position:"relative", zIndex:1, backdropFilter:"blur(20px)",
          }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(45,255,140,0.06)", border:"1px solid rgba(45,255,140,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:T.green, marginBottom:18, boxShadow:"0 0 24px rgba(45,255,140,0.1)" }}>{s.n}</div>
            <div style={{ fontSize:28, marginBottom:14 }}>{s.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, color:T.white, marginBottom:8, letterSpacing:"-0.01em" }}>{s.name}</div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   VIDEO STUDIO  ← NEW SECTION
───────────────────────────────────────── */
function VideoStudio() {
  const [ingredients, setIngredients] = useState("Mango, jengibre, cúrcuma, leche de coco");
  const [goal, setGoal]               = useState("antiinflamatorio");
  const [prompt, setPrompt]           = useState("");
  const [model, setModel]             = useState("kling");
  const [duration, setDuration]       = useState("10");
  const [resolution, setResolution]   = useState("4k");
  const [phase, setPhase]             = useState("idle"); // idle | generating-prompt | prompt-ready | generating-video | done | error
  const [progress, setProgress]       = useState(0);
  const [log, setLog]                 = useState("💡 Listo para generar tu video 4K");
  const [videoUrl, setVideoUrl]       = useState("");
  const [aiMsg, setAiMsg]             = useState("");
  const timerRef = useRef(null);

  const addLog = msg => setLog(msg);

  /* STEP 1: Claude generates cinematic prompt */
  const generatePrompt = async () => {
    setPhase("generating-prompt");
    setAiMsg("");
    addLog("🤖 Analizando ingredientes con IA…");
    try {
      const result = await callClaude(
        `Eres un director de fotografía y experto en wellness. Genera prompts cinematográficos ultra-detallados para videos AI (Kling/Veo) de smoothies saludables. El prompt debe estar en inglés, ser visual, cinematográfico, y mencionar: lighting (golden hour / soft studio / macro), camera movement (slow motion / dolly / macro close-up), mood, y los ingredientes clave. Máximo 80 palabras. Solo el prompt, sin explicación.`,
        `Ingredientes: ${ingredients}. Objetivo de salud: ${goal}. Duración: ${duration}s. Calidad: ${resolution}.`
      );
      setPrompt(result.trim());
      setAiMsg(`✨ Prompt generado con claude-sonnet-4`);
      setPhase("prompt-ready");
      addLog("✅ Prompt listo — revisa y genera el video");
    } catch(e) {
      setPhase("error");
      addLog("❌ Error al generar prompt. Verifica la conexión.");
    }
  };

  /* STEP 2: Simulate video generation (real: fal.ai pending) */
  const generateVideo = async () => {
    setPhase("generating-video");
    setProgress(0);
    addLog("🎬 Enviando a fal.ai · Procesando video…");

    // Progress simulation (real: polling fal.ai status)
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 4 + 1;
      if (p >= 95) { p = 95; clearInterval(timerRef.current); }
      setProgress(Math.min(p, 95));
    }, 800);

    // Simulate 8s generation (real: await fal.subscribe())
    await new Promise(r => setTimeout(r, 8000));
    clearInterval(timerRef.current);
    setProgress(100);

    // Demo video (real: data.videoUrl from fal.ai)
    setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    setPhase("done");
    addLog("✅ Video listo · Descarga o comparte");
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setPhase("idle"); setProgress(0); setPrompt(""); setVideoUrl(""); setAiMsg("");
    addLog("💡 Listo para generar tu video 4K");
  };

  const models = [
    { v:"kling",     label:"🎥 Kling v1.6",    desc:"Realista · Movimiento natural" },
    { v:"veo",       label:"🎬 Veo 3.1",        desc:"Cinemático · Alta fidelidad" },
    { v:"sora",      label:"✨ Sora 2",         desc:"Creativo · Estilo artístico" },
    { v:"seedance",  label:"🌟 Seedance Pro",   desc:"Profesional · Ultra detalle" },
  ];

  const isWorking = phase === "generating-prompt" || phase === "generating-video";

  return (
    <section id="video-studio" style={{ padding:"120px 48px", position:"relative" }} className="section-pad">
      {/* glow */}
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:400, background:"radial-gradient(ellipse,rgba(45,255,140,0.05) 0%,transparent 70%)", pointerEvents:"none" }} />

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, letterSpacing:"0.12em", textTransform:"uppercase" }}>Video AI Studio</span>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(45,255,140,0.2),transparent)" }} />
        <div style={{ background:"rgba(45,255,140,0.08)", border:"1px solid rgba(45,255,140,0.2)", borderRadius:20, padding:"3px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.green }}>BETA · fal.ai + HeyGen</div>
      </div>

      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:900, letterSpacing:"-0.04em", color:T.white, marginBottom:14 }}>
        Tu smoothie,<br/><span style={{ color:T.green }}>en video 4K.</span>
      </h2>
      <p style={{ fontSize:15, color:"rgba(240,237,230,0.4)", maxWidth:500, lineHeight:1.7, marginBottom:56 }}>
        El AI genera el guión, elige el modelo perfecto y renderiza tu video en 4K.
        Listo para TikTok, Reels y WhatsApp. Solo en Bloom y Canopy.
      </p>

      <div className="reveal studio-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* LEFT PANEL: Controls */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Ingredients */}
          <div style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:20, padding:24, backdropFilter:"blur(20px)" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>
              🧬 Ingredientes de tu smoothie
            </div>
            <textarea
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              rows={3}
              placeholder="Ej: mango, jengibre, cúrcuma, leche de almendras…"
              style={{ width:"100%", resize:"vertical" }}
              disabled={isWorking}
            />
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", margin:"12px 0 8px" }}>
              🎯 Objetivo de salud
            </div>
            <select value={goal} onChange={e=>setGoal(e.target.value)} style={{ width:"100%" }} disabled={isWorking}>
              <option value="antiinflamatorio">💪 Antiinflamatorio</option>
              <option value="energia y vitalidad">⚡ Energía y vitalidad</option>
              <option value="detox y digestión">🍃 Detox y digestión</option>
              <option value="inmunidad">🛡️ Refuerzo inmune</option>
              <option value="relajación">😌 Relajación</option>
              <option value="pérdida de peso">🔥 Pérdida de peso</option>
            </select>
          </div>

          {/* Model selector */}
          <div style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:20, padding:24, backdropFilter:"blur(20px)" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>
              🤖 Modelo de video
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {models.map(m => (
                <div key={m.v} onClick={() => !isWorking && setModel(m.v)} style={{
                  padding:"12px 14px", borderRadius:12, cursor:isWorking?"not-allowed":"pointer",
                  border:`1px solid ${model===m.v?"rgba(45,255,140,0.4)":"rgba(255,255,255,0.06)"}`,
                  background:model===m.v?"rgba(45,255,140,0.08)":"rgba(255,255,255,0.02)",
                  transition:"all 0.2s",
                }}>
                  <div style={{ fontSize:12, fontWeight:700, color: model===m.v ? T.green : T.white, marginBottom:3 }}>{m.label}</div>
                  <div style={{ fontSize:10, color:T.muted }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Duration + Resolution */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:14 }}>
              <div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Duración</div>
                <select value={duration} onChange={e=>setDuration(e.target.value)} style={{ width:"100%" }} disabled={isWorking}>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="15">15 segundos (MAX)</option>
                </select>
              </div>
              <div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Calidad</div>
                <select value={resolution} onChange={e=>setResolution(e.target.value)} style={{ width:"100%" }} disabled={isWorking}>
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {phase === "idle" && (
              <button className="btn-primary" style={{ width:"100%", padding:"14px" }} onClick={generatePrompt}>
                🤖 Paso 1 — Generar prompt con AI
              </button>
            )}
            {phase === "generating-prompt" && (
              <button className="btn-primary" style={{ width:"100%", padding:"14px" }} disabled>
                <span style={{ animation:"spin 1s linear infinite", display:"inline-block", marginRight:8 }}>⟳</span>
                Analizando ingredientes…
              </button>
            )}
            {phase === "prompt-ready" && (
              <>
                <button className="btn-primary" style={{ width:"100%", padding:"14px" }} onClick={generateVideo}>
                  🎬 Paso 2 — Generar Video 4K
                </button>
                <button className="btn-ghost" style={{ width:"100%" }} onClick={generatePrompt}>
                  ↺ Regenerar prompt
                </button>
              </>
            )}
            {phase === "generating-video" && (
              <button className="btn-primary" style={{ width:"100%", padding:"14px" }} disabled>
                <span style={{ animation:"spin 1s linear infinite", display:"inline-block", marginRight:8 }}>⟳</span>
                Renderizando en {resolution} · {duration}s…
              </button>
            )}
            {(phase === "done" || phase === "error") && (
              <button className="btn-ghost" style={{ width:"100%", padding:"13px" }} onClick={reset}>
                ↺ Nuevo video
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Preview + Result */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Log bar */}
          <div style={{ background:"#030806", border:"1px solid rgba(45,255,140,0.1)", borderLeft:"3px solid rgba(45,255,140,0.5)", borderRadius:14, padding:"12px 16px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(45,255,140,0.8)", lineHeight:1.6 }}>
            {log}
          </div>

          {/* Prompt preview */}
          {(phase === "prompt-ready" || phase === "generating-video" || phase === "done") && (
            <div style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.15)", borderRadius:20, padding:22, backdropFilter:"blur(20px)", animation:"fadeUp 0.5s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>📝 Prompt generado</div>
                {aiMsg && <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.green }}>{aiMsg}</div>}
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={5}
                style={{ width:"100%", fontSize:12, lineHeight:1.6, resize:"vertical" }}
                disabled={isWorking}
              />
            </div>
          )}

          {/* Progress */}
          {phase === "generating-video" && (
            <div style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:20, padding:22, backdropFilter:"blur(20px)", animation:"fadeUp 0.4s ease" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.muted }}>Renderizando {resolution} · {model} · {duration}s</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.green }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${progress}%` }} />
              </div>
              <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {["Prompt parsed","Frames init","AI rendering"].map((s,i) => (
                  <div key={s} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:"8px 10px" }}>
                    <div style={{ fontSize:10, color: progress > i*33 ? T.green : T.muted, fontFamily:"'JetBrains Mono',monospace" }}>
                      {progress > i*33 ? "✓" : "○"} {s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result video */}
          {phase === "done" && videoUrl && (
            <div className="video-result" style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.2)", borderRadius:20, padding:22, backdropFilter:"blur(20px)" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>
                ✅ Video listo · {resolution} · {model}
              </div>
              <video controls style={{ width:"100%", borderRadius:14, background:"#000", maxHeight:240 }}>
                <source src={videoUrl} type="video/mp4" />
              </video>
              {/* Share row */}
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                {[
                  { label:"⬇️ Descargar", primary:true },
                  { label:"📲 TikTok" },
                  { label:"📸 Reels" },
                  { label:"💬 WhatsApp" },
                ].map(btn => (
                  <button key={btn.label} className={`share-btn ${btn.primary ? "btn-primary" : "btn-ghost"}`} style={{ flex:1, padding:"8px 6px", fontSize:10, borderRadius:10 }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {phase === "idle" && (
            <div style={{
              background:T.glass, border:"1px solid rgba(45,255,140,0.08)",
              borderRadius:20, padding:40, backdropFilter:"blur(20px)",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              minHeight:200, textAlign:"center",
            }}>
              <div style={{ fontSize:52, marginBottom:16, opacity:0.4 }}>🎬</div>
              <div style={{ fontSize:14, color:T.muted, lineHeight:1.6 }}>
                Describe tus ingredientes y el AI<br/>
                generará el prompt cinematográfico perfecto
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES BENTO
───────────────────────────────────────── */
function Features() {
  const tags = ["Mango","Jengibre","Espinaca","Cúrcuma","Plátano","Kale","Aguacate","Limón","Moringa","Chía"];
  const active = ["Mango","Jengibre","Plátano"];
  const bars = [30,50,40,65,55,80,70,95];

  return (
    <section id="features" className="section-pad" style={{ padding:"120px 48px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, letterSpacing:"0.12em", textTransform:"uppercase" }}>Features</span>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(45,255,140,0.2),transparent)" }} />
      </div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:900, letterSpacing:"-0.04em", color:T.white, marginBottom:14 }}>
        Todo en un<span style={{ color:T.green }}> lugar</span>
      </h2>
      <p style={{ fontSize:15, color:"rgba(240,237,230,0.4)", maxWidth:480, lineHeight:1.7, marginBottom:60 }}>
        De la recomendación inteligente al video viral. La suite completa de wellness con IA.
      </p>

      <div className="reveal bento-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {/* AI Chat — wide */}
        <div className="bento-card bento-wide" style={{ gridColumn:"span 2", background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:24, padding:"28px 26px", backdropFilter:"blur(20px)" }}>
          <div style={{ fontSize:36, marginBottom:16 }}>🤖</div>
          <div style={{ fontSize:16, fontWeight:700, color:T.white, marginBottom:8, letterSpacing:"-0.02em" }}>AI Chat con el Dr. Smoothie</div>
          <div style={{ fontSize:12, color:T.muted, lineHeight:1.65, marginBottom:18 }}>Conversación en tiempo real entrenada en 200+ ingredientes, combinaciones y perfiles nutricionales. No es un chatbot genérico — es tu especialista en wellness.</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {tags.map(t => (
              <span key={t} className="ingr-tag" style={{ background:active.includes(t)?"rgba(45,255,140,0.1)":"rgba(45,255,140,0.04)", border:`1px solid ${active.includes(t)?"rgba(45,255,140,0.3)":"rgba(45,255,140,0.1)"}`, borderRadius:100, padding:"4px 12px", fontSize:11, color:active.includes(t)?T.green:"rgba(240,237,230,0.5)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Video Studio — tall */}
        <div className="bento-card" style={{ gridRow:"span 2", background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:24, padding:"28px 26px", backdropFilter:"blur(20px)", display:"flex", flexDirection:"column" }}>
          <div style={{ fontSize:36, marginBottom:16 }}>🎬</div>
          <div style={{ fontSize:16, fontWeight:700, color:T.white, marginBottom:8, letterSpacing:"-0.02em" }}>Video Studio 4K</div>
          <div style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>El generador más avanzado del ecosistema wellness. Kling, Veo o Sora — el AI elige el mejor modelo para tu escena específica.</div>
          <div style={{ marginTop:"auto", paddingTop:24 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>Videos · últimos 7 días</div>
            <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:64 }}>
              {bars.map((h,i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"4px 4px 0 0", background:i>5?"rgba(45,255,140,0.4)":"rgba(45,255,140,0.12)", border:`1px solid ${i>5?"rgba(45,255,140,0.5)":"rgba(45,255,140,0.2)"}`, animation:`barGrow 1.5s ${i*0.1}s ease both` }} />
              ))}
            </div>
          </div>
        </div>

        {[
          { icon:"🏅", title:"Sistema de Rewards", desc:"Badges, streaks y puntos por cada smoothie creado, video generado y día de bienestar completado." },
          { icon:"🧬", title:"Swarm Intelligence", desc:"MiroFish integrado · 53K+ agentes de inteligencia colectiva optimizando tus combinaciones en tiempo real." },
          { icon:"🌍", title:"Multilingüe · Global", desc:"Español, inglés, portugués. Plataforma diseñada para escalar globalmente desde el día 1." },
          { icon:"🔒", title:"Privacidad total", desc:"Supabase RLS en todas las tablas. Sin venta de datos. Sin anuncios. Tu historial es tuyo." },
        ].map(f => (
          <div key={f.title} className="bento-card" style={{ background:T.glass, border:"1px solid rgba(45,255,140,0.1)", borderRadius:24, padding:"28px 26px", backdropFilter:"blur(20px)" }}>
            <div style={{ fontSize:34, marginBottom:14 }}>{f.icon}</div>
            <div style={{ fontSize:15, fontWeight:700, color:T.white, marginBottom:8, letterSpacing:"-0.02em" }}>{f.title}</div>
            <div style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MEMBERSHIP TIERS
───────────────────────────────────────── */
function Tiers() {
  const tiers = [
    {
      emoji:"🌱", name:"Seed", price:29, period:"Para explorar",
      color:T.gold, top:T.gold,
      features:[
        { ok:true,  text:"AI Chat ilimitado" },
        { ok:true,  text:"200+ ingredientes" },
        { ok:true,  text:"1 Video AI / mes (720p)" },
        { ok:true,  text:"Rewards básico" },
        { ok:true,  text:"PWA mobile" },
        { ok:false, text:"Sin watermark" },
        { ok:false, text:"Swarm simulator" },
      ],
      btn:"Comenzar con Seed", fill:false,
    },
    {
      emoji:"🌿", name:"Bloom", price:49, period:"Para el wellness serio",
      color:T.green, top:T.green, popular:true,
      features:[
        { ok:true, text:"AI Chat ilimitado" },
        { ok:true, text:"5 Videos AI / mes (1080p)" },
        { ok:true, text:"Sin watermark" },
        { ok:true, text:"Kling + Veo models" },
        { ok:true, text:"Swarm (5 simulaciones)" },
        { ok:true, text:"Auto-prompt del Chat" },
        { ok:false, text:"Avatar HeyGen" },
      ],
      btn:"Comenzar con Bloom", fill:true,
    },
    {
      emoji:"🌳", name:"Canopy", price:79, period:"El arsenal completo",
      color:T.teal, top:`linear-gradient(90deg,${T.green},${T.teal})`,
      features:[
        { ok:true, text:"Todo lo de Bloom" },
        { ok:true, text:"Videos ilimitados (4K)" },
        { ok:true, text:"Avatar Dr. Smoothie HeyGen" },
        { ok:true, text:"Voz español + inglés" },
        { ok:true, text:"Swarm ilimitado" },
        { ok:true, text:"Share directo redes" },
        { ok:true, text:"Prioridad de generación" },
      ],
      btn:"Comenzar con Canopy", fill:false,
    },
  ];

  return (
    <section id="planes" className="section-pad" style={{ padding:"120px 48px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:T.green, letterSpacing:"0.12em", textTransform:"uppercase" }}>Membresías</span>
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(45,255,140,0.2),transparent)" }} />
      </div>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,4vw,56px)", fontWeight:900, letterSpacing:"-0.04em", color:T.white, marginBottom:14 }}>
        Elige tu<span style={{ color:T.green }}> nivel</span>
      </h2>
      <p style={{ fontSize:15, color:"rgba(240,237,230,0.4)", maxWidth:480, lineHeight:1.7, marginBottom:60 }}>
        Desde exploración hasta dominio total. Cancela cuando quieras.
      </p>

      <div className="reveal tiers-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {tiers.map(t => (
          <div key={t.name} className="tier-card" style={{
            background:T.glass, borderRadius:24, padding:"32px 28px",
            backdropFilter:"blur(30px)",
            border:`1px solid ${t.popular?"rgba(45,255,140,0.25)":"rgba(255,255,255,0.05)"}`,
            boxShadow:t.popular?"0 0 80px rgba(45,255,140,0.07)":"none",
            position:"relative", overflow:"hidden",
          }}>
            {/* top accent */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:t.top }} />
            {/* popular tag */}
            {t.popular && <div style={{ position:"absolute", top:18, right:18, background:T.green, color:"#02060a", fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"0.08em" }}>MÁS POPULAR</div>}

            <div style={{ fontSize:32, marginBottom:12 }}>{t.emoji}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, color:T.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>{t.name}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:48, fontWeight:900, letterSpacing:"-0.04em", lineHeight:1, color:T.white, marginBottom:4 }}>
              ${t.price}<span style={{ fontSize:16, color:T.muted, fontFamily:"'Satoshi',sans-serif", fontWeight:400 }}>/mo</span>
            </div>
            <div style={{ fontSize:11, color:T.muted, marginBottom:28 }}>{t.period}</div>

            <ul style={{ listStyle:"none", marginBottom:28 }}>
              {t.features.map(f => (
                <li key={f.text} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:12, color:"rgba(240,237,230,0.65)", lineHeight:1.4 }}>
                  <span style={{ color:f.ok?T.green:T.muted, fontSize:12, flexShrink:0, marginTop:1 }}>{f.ok?"✓":"—"}</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <button
              className={t.fill?"btn-primary":"btn-ghost"}
              style={{ width:"100%", padding:13, fontSize:13, borderRadius:12, ...(t.fill?{}:{ borderColor:`rgba(${t.color===T.green?"45,255,140":t.color===T.teal?"0,229,200":"212,168,67"},0.3)`, color:t.color }) }}
            >{t.btn}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  const cols = [
    { title:"Producto", links:["AI Chat","Video Studio","Membresías","Rewards","Swarm"] },
    { title:"Empresa",  links:["JRMB Food Network","Términos","Privacidad","Contacto"] },
    { title:"Comunidad",links:["TikTok","Instagram","YouTube","WhatsApp"] },
  ];
  return (
    <footer className="footer-grid" style={{ padding:"80px 48px 40px", borderTop:"1px solid rgba(45,255,140,0.06)", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:40 }}>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${T.bg2},${T.bg3})`, border:"1px solid rgba(45,255,140,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:T.green }}>dr</div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:T.white }}><span style={{ color:T.green }}>dr.</span>smoothie<span style={{ color:T.green }}>.ai</span></span>
        </div>
        <p style={{ fontSize:12, color:T.muted, lineHeight:1.6, maxWidth:200 }}>La plataforma de wellness más avanzada del mundo. Ciencia + naturaleza + IA.</p>
      </div>
      {cols.map(c => (
        <div key={c.title}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(240,237,230,0.25)", marginBottom:16 }}>{c.title}</div>
          <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
            {c.links.map(l => (
              <li key={l}><a href="#" style={{ fontSize:13, color:T.muted, textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=T.white} onMouseLeave={e=>e.target.style.color=T.muted}>{l}</a></li>
            ))}
          </ul>
        </div>
      ))}
      <div style={{ gridColumn:"1/-1", paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.18)" }}>© 2026 JRMB Food Network LLC · <span style={{ color:T.green }}>dr.smoothie.ai</span></span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.14)" }}>Powered by Claude · fal.ai · Supabase · Vercel</span>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   DIVIDER
───────────────────────────────────────── */
const Divider = () => (
  <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(45,255,140,0.08) 20%,rgba(45,255,140,0.08) 80%,transparent)", margin:"0 48px" }} />
);

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  useReveal();

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById("ds-styles")) {
      const s = document.createElement("style");
      s.id = "ds-styles"; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <>
      {/* Canvas background */}
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, opacity:0.55, pointerEvents:"none" }} />
      {/* Grain */}
      <div style={{ position:"fixed", inset:0, zIndex:1, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`, pointerEvents:"none" }} />
      {/* Ambient glows */}
      <div style={{ position:"fixed", top:"10%", left:"5%", width:500, height:500, background:"radial-gradient(ellipse,rgba(45,255,140,0.04) 0%,transparent 70%)", zIndex:0, pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"10%", right:"5%", width:400, height:400, background:"radial-gradient(ellipse,rgba(0,229,200,0.04) 0%,transparent 70%)", zIndex:0, pointerEvents:"none" }} />

      {/* App */}
      <div style={{ position:"relative", zIndex:2 }}>
        <Nav />
        <main>
          <Hero />
          <Divider />
          <HowItWorks />
          <Divider />
          <VideoStudio />
          <Divider />
          <Features />
          <Divider />
          <Tiers />
          <Footer />
        </main>
      </div>
    </>
  );
}
