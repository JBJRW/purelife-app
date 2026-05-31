import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   PURELIFE WELLNESS CLUB — dr.smoothie.ai
   Design System: Emil Kowalski + Impeccable + Taste Skill
   
   PRINCIPLES APPLIED:
   • Emil Kowalski: spring physics, purposeful motion <300ms,
     ease-out default, momentum-based gestures, restraint
   • Impeccable: 8px grid, typographic hierarchy, coherent palette,
     no AI slop (no Inter, no purple gradients, no card grids)
   • Taste Skill: perceptual psychology, asymmetric layouts,
     editorial rhythm, wellness luxury aesthetic
   
   TOKENS: Fraunces (editorial display) + Instrument Sans (body)
   PALETTE: Deep forest black / Bio-green / Warm cream / Gold
   MOTION: All transitions < 280ms, spring cubic-bezier
═══════════════════════════════════════════════════════════════ */

/* ── DESIGN TOKENS ──────────────────────────────────────────── */
const T = {
  // Backgrounds — layered depth
  ink:    "#040A06",
  forest: "#071009",
  canopy: "#0C1A10",
  moss:   "#112016",

  // Brand colors
  bio:    "#1AE05A",   // Primary green — more restrained than #2dff8c
  sage:   "#4CAF7D",   // Secondary
  dew:    "#00D4A8",   // Accent teal
  amber:  "#C8923A",   // Gold — warmer, less saturated

  // Text
  cream:  "#F2EDE4",
  stone:  "#8A9E8F",
  bark:   "#3A5040",

  // Glass
  glass:  "rgba(11,22,14,0.75)",
  glassL: "rgba(18,36,22,0.6)",
  border: "rgba(26,224,90,0.09)",
  borderH:"rgba(26,224,90,0.22)",

  // Spring easing (Emil Kowalski standard)
  spring: "cubic-bezier(0.34,1.56,0.64,1)",
  ease:   "cubic-bezier(0.25,0,0,1)",
  swift:  "cubic-bezier(0.4,0,0.2,1)",
};

/* ── WELLNESS SYSTEM PROMPT (cached via TurboQuant) ─────────── */
const WELLNESS_PROMPT = `You are Dr. Smoothie AI — the lead wellness intelligence for PureLife Wellness Club, a premium global health platform. You combine nutritional science with personalized guidance.

PERSONALITY: Warm, authoritative, science-backed. Never preachy. Think of a brilliant friend who happens to be a nutritionist.

INGREDIENT SCIENCE DATABASE:
Spinach: Iron 2.7mg/100g, Folate 194mcg, Vit K, lutein. Best pairs: banana, mango, ginger, apple
Kale: Vit C 120mg/100g, K1, zeaxanthin, sulforaphane. Best pairs: pineapple, lemon, cucumber
Mango: Beta-carotene, digestive enzymes, Vit C 36mg. Best pairs: turmeric, coconut, lime, spinach
Pineapple: Bromelain (anti-inflammatory enzyme), Mn. Best pairs: ginger, turmeric, mint
Banana: Potassium 358mg, B6, resistant starch. Best pairs: almond milk, cocoa, berries, oats
Blueberry: Anthocyanins, pterostilbene, ORAC 4,669. Best pairs: acai, spinach, almond milk
Turmeric: Curcumin 3-5%, needs black pepper for bioavailability. Best pairs: mango, ginger, coconut
Ginger: Gingerols, thermogenic, anti-nausea. Best pairs: lemon, turmeric, carrot, apple
Matcha: L-theanine + caffeine synergy, EGCG catechins. Best pairs: almond milk, banana, mango
Spirulina: 60-70% protein, B12, phycocyanin. Best pairs: banana, mango, pineapple
Beet: Nitrates for blood flow, betaine. Best pairs: apple, ginger, lemon, carrot
Acai: ORAC 102,700 μmol TE/100g, omega-3. Best pairs: blueberry, banana, coconut
Coconut water: 600mg K, 250mg Na, cytokinins. Universal base
Cucumber: 96% water, silica (skin), electrolytes. Best pairs: mint, lime, celery

HEALTH PROTOCOLS:
Energy & Performance → Matcha + banana + spinach + almond milk + maca (30-60min pre-workout)
Immunity Defense → Orange + ginger + turmeric + carrot + black pepper (morning, fasted)
Anti-Inflammatory → Tart cherry + beet + ginger + turmeric + pineapple (post-workout)
Gut Health → Papaya + pineapple + ginger + coconut water + mint (morning)
Skin & Glow → Cucumber + watermelon + mint + lime + collagen (midday)
Mental Focus → Matcha + lion's mane + almond milk + banana + ashwagandha (morning)
Weight Management → Green apple + celery + cucumber + ginger + lemon (morning, can replace meal)
Sleep & Recovery → Tart cherry + banana + magnesium + coconut milk + vanilla (evening)

SAFETY: Never diagnose or prescribe. Flag allergens. Note drug-nutrient interactions.
MEMBERSHIP TIERS: Seed $29/mo | Bloom $49/mo | Canopy $79/mo

RESPONSE FORMAT: 
- Lead with the recommendation immediately
- 1-2 sentence science rationale
- Optional: timing, pro tip, or variation
- Max 220 words unless detailed plan requested
- End with a specific, actionable next step`;

/* ── CSS INJECTION ──────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body {
    background:${T.ink};
    color:${T.cream};
    font-family:'Instrument Sans', system-ui, sans-serif;
    overflow-x:hidden;
    -webkit-font-smoothing:antialiased;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:${T.forest}; }
  ::-webkit-scrollbar-thumb { background:rgba(26,224,90,0.25); border-radius:2px; }
  ::selection { background:rgba(26,224,90,0.18); color:${T.cream}; }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; }
    to   { opacity:1; }
  }
  @keyframes springIn {
    0%   { opacity:0; transform:scale(0.94) translateY(12px); }
    60%  { transform:scale(1.01) translateY(-2px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }
  @keyframes floatY {
    0%,100% { transform:translateY(0px) rotate(0deg); }
    33%     { transform:translateY(-8px) rotate(1deg); }
    66%     { transform:translateY(-4px) rotate(-0.5deg); }
  }
  @keyframes pulse {
    0%,100% { box-shadow:0 0 0 0 rgba(26,224,90,0.4); }
    50%     { box-shadow:0 0 0 8px rgba(26,224,90,0); }
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes shimmer {
    0%   { background-position:-200% 0; }
    100% { background-position:200% 0; }
  }
  @keyframes scanLine {
    0%   { top:-8%; opacity:0.6; }
    100% { top:108%; opacity:0; }
  }
  @keyframes barGrow {
    from { transform:scaleY(0); transform-origin:bottom; }
    to   { transform:scaleY(1); }
  }
  @keyframes typing {
    0%,60%,100% { transform:translateY(0); }
    30%         { transform:translateY(-4px); }
  }
  @keyframes orbit {
    from { transform:rotate(0deg) translateX(140px) rotate(0deg); }
    to   { transform:rotate(360deg) translateX(140px) rotate(-360deg); }
  }
  @keyframes breathe {
    0%,100% { transform:scale(1); opacity:0.6; }
    50%     { transform:scale(1.04); opacity:0.9; }
  }

  /* ── REVEAL ── */
  .reveal {
    opacity:0;
    transform:translateY(36px);
    transition:opacity 0.75s ${T.ease}, transform 0.75s ${T.ease};
  }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-delay-1 { transition-delay:0.1s; }
  .reveal-delay-2 { transition-delay:0.2s; }
  .reveal-delay-3 { transition-delay:0.3s; }

  /* ── NAVIGATION ── */
  .nav-link {
    font-size:13px; font-weight:500; color:${T.stone};
    text-decoration:none; cursor:pointer;
    transition:color 180ms ${T.ease};
    position:relative;
  }
  .nav-link::after {
    content:''; position:absolute; bottom:-2px; left:0; right:0;
    height:1px; background:${T.bio};
    transform:scaleX(0); transform-origin:left;
    transition:transform 220ms ${T.ease};
  }
  .nav-link:hover { color:${T.cream}; }
  .nav-link:hover::after { transform:scaleX(1); }

  /* ── BUTTONS ── */
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    padding:11px 24px; border-radius:10px; border:none;
    background:${T.bio}; color:${T.ink};
    font-size:13px; font-weight:700;
    font-family:'Instrument Sans', sans-serif;
    cursor:pointer; letter-spacing:-0.01em;
    transition:all 200ms ${T.ease};
    box-shadow:0 0 0 0 rgba(26,224,90,0);
  }
  .btn-primary:hover {
    background:#2ef76a;
    box-shadow:0 0 32px rgba(26,224,90,0.35);
    transform:translateY(-1px);
  }
  .btn-primary:active { transform:translateY(0); transition-duration:80ms; }
  .btn-primary:disabled { opacity:0.45; cursor:not-allowed; transform:none; }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    padding:10px 22px; border-radius:10px;
    border:1px solid rgba(26,224,90,0.18);
    background:transparent; color:${T.bio};
    font-size:13px; font-weight:600;
    font-family:'Instrument Sans', sans-serif;
    cursor:pointer; letter-spacing:-0.01em;
    transition:all 200ms ${T.ease};
  }
  .btn-ghost:hover {
    background:rgba(26,224,90,0.07);
    border-color:rgba(26,224,90,0.35);
    transform:translateY(-1px);
  }

  .btn-tier {
    width:100%; padding:13px;
    border-radius:11px; font-size:13px; font-weight:700;
    font-family:'Instrument Sans', sans-serif;
    cursor:pointer; letter-spacing:-0.01em;
    transition:all 220ms ${T.spring};
  }

  /* ── CARDS ── */
  .tier-card {
    transition:transform 280ms ${T.spring}, box-shadow 280ms ${T.ease};
  }
  .tier-card:hover {
    transform:translateY(-10px);
    box-shadow:0 48px 120px rgba(0,0,0,0.6) !important;
  }
  .bento-card {
    transition:transform 240ms ${T.ease}, border-color 200ms ${T.ease};
  }
  .bento-card:hover {
    transform:translateY(-4px);
    border-color:rgba(26,224,90,0.22) !important;
  }
  .step-card {
    transition:all 240ms ${T.ease};
  }
  .step-card:hover {
    transform:translateY(-5px);
    border-color:rgba(26,224,90,0.28) !important;
  }
  .ingr-tag {
    transition:all 180ms ${T.ease};
    cursor:default;
  }
  .ingr-tag:hover {
    background:rgba(26,224,90,0.14) !important;
    color:${T.bio} !important;
    border-color:rgba(26,224,90,0.35) !important;
  }

  /* ── CHAT ── */
  .chat-bubble-enter { animation:springIn 0.38s ${T.spring} both; }

  /* ── FORM ELEMENTS ── */
  textarea, input, select {
    font-family:'Instrument Sans', sans-serif;
    background:rgba(255,255,255,0.025);
    border:1px solid rgba(26,224,90,0.12);
    border-radius:12px; color:${T.cream};
    padding:12px 16px; font-size:14px; outline:none;
    transition:border-color 180ms ${T.ease}, background 180ms ${T.ease};
  }
  textarea:focus, input:focus, select:focus {
    border-color:rgba(26,224,90,0.38);
    background:rgba(255,255,255,0.04);
  }
  textarea::placeholder, input::placeholder { color:${T.bark}; }
  select option { background:${T.canopy}; }

  /* ── PROGRESS ── */
  .progress-bar {
    height:2px; background:rgba(26,224,90,0.1);
    border-radius:1px; overflow:hidden;
  }
  .progress-fill {
    height:100%; border-radius:1px;
    background:linear-gradient(90deg, ${T.bio}, ${T.dew});
    transition:width 0.45s ${T.ease};
    box-shadow:0 0 10px ${T.bio};
  }

  /* ── RESPONSIVE ── */
  @media(max-width:960px) {
    .hero-grid   { grid-template-columns:1fr !important; }
    .hero-right  { display:none !important; }
    .steps-grid  { grid-template-columns:1fr 1fr !important; }
    .tiers-grid  { grid-template-columns:1fr !important; }
    .bento-grid  { grid-template-columns:1fr !important; }
    .bento-wide  { grid-column:span 1 !important; }
    .footer-grid { grid-template-columns:1fr 1fr !important; }
    .studio-grid { grid-template-columns:1fr !important; }
    .chat-grid   { grid-template-columns:1fr !important; }
    nav          { padding:0 20px !important; }
    .nav-desktop { display:none !important; }
    .section-pad { padding:80px 24px !important; }
    .hero-pad    { padding:120px 24px 80px !important; }
  }
  @media(max-width:480px) {
    .steps-grid  { grid-template-columns:1fr !important; }
    .footer-grid { grid-template-columns:1fr !important; }
  }
`;

/* ── HOOKS ─────────────────────────────────────────────────── */
function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, W, H;
    const particles = [];

    class P {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : (Math.random() > 0.5 ? -4 : H + 4);
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;
        this.r = Math.random() * 1.4 + 0.3;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.phase += 0.014;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset(false);
      }
      draw() {
        const a = 0.08 + Math.sin(this.phase) * 0.04;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,224,90,${a})`;
        ctx.fill();
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 100; i++) particles.push(new P());

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(26,224,90,${(1 - d / 100) * 0.07})`;
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

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── CLAUDE API — TurboQuant Prompt Caching ─────────────────── */
async function callClaude(messages) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: [{
        type: "text",
        text: WELLNESS_PROMPT,
        cache_control: { type: "ephemeral" }, // ← TurboQuant Fase 1
      }],
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return {
    text: data.content?.[0]?.text ?? "",
    usage: data.usage ?? {},
  };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════ */

/* ── NAV ────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      height: 60,
      padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(4,10,6,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
      transition: `all 280ms ${T.ease}`,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `linear-gradient(135deg, ${T.canopy}, ${T.moss})`,
          border: `1px solid rgba(26,224,90,0.28)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          fontWeight: 700, color: T.bio,
        }}>dr</div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
          fontWeight: 700, color: T.cream, letterSpacing: "-0.02em",
        }}>
          <span style={{ color: T.bio }}>dr.</span>smoothie<span style={{ color: T.bio }}>.ai</span>
        </span>
      </div>

      {/* Desktop links */}
      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {["AI Chat", "Features", "Planes", "Video Studio"].map(l => (
          <a key={l} className="nav-link"
            href={`#${l.toLowerCase().replace(" ", "-")}`}
          >{l}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="nav-link nav-desktop" style={{ cursor: "pointer" }}>Entrar</span>
        <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 12 }}>
          Comenzar gratis
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────────────── */
function Hero() {
  const [activeTag, setActiveTag] = useState(0);
  const tags = ["Mango", "Jengibre", "Espinaca", "Cúrcuma", "Plátano", "Kale", "Moringa"];

  useEffect(() => {
    const iv = setInterval(() => setActiveTag(p => (p + 1) % tags.length), 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <section style={{ position: "relative", minHeight: "100vh", padding: "0 40px" }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse, rgba(26,224,90,0.055) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="hero-grid" style={{
        display: "grid", gridTemplateColumns: "1fr 460px",
        alignItems: "center", gap: 80,
        minHeight: "100vh", paddingTop: 100, paddingBottom: 60,
      }}>
        {/* LEFT */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(26,224,90,0.07)",
            border: `1px solid rgba(26,224,90,0.16)`,
            borderRadius: 20, padding: "5px 14px",
            marginBottom: 32, animation: "fadeIn 0.6s ease both",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.bio, animation: "pulse 2s infinite" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              fontWeight: 700, color: T.bio, letterSpacing: "0.1em", textTransform: "uppercase",
            }}>Plataforma global · IA Wellness</span>
          </div>

          {/* Headline — Fraunces editorial */}
          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(44px, 5.5vw, 80px)",
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: T.cream,
            marginBottom: 24,
            animation: "fadeUp 0.7s 0.1s ease both",
          }}>
            Tu smoothie.<br />
            <span style={{
              color: T.bio,
              fontStyle: "italic",
            }}>Inteligencia</span><br />
            real.
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 17, color: T.stone, lineHeight: 1.72,
            maxWidth: 460, marginBottom: 40,
            animation: "fadeUp 0.7s 0.2s ease both",
          }}>
            La primera plataforma que combina <strong style={{ color: T.cream, fontWeight: 600 }}>IA conversacional</strong>,
            ciencia de ingredientes y <strong style={{ color: T.cream, fontWeight: 600 }}>generación de video 4K</strong> para
            tu bienestar. No es una app. Es tu laboratorio personal.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            animation: "fadeUp 0.7s 0.3s ease both",
          }}>
            <button className="btn-primary" style={{ fontSize: 14, padding: "13px 28px" }}>
              Empieza gratis hoy
            </button>
            <button className="btn-ghost" style={{ fontSize: 14 }}>
              Ver el Video AI →
            </button>
          </div>

          {/* Social proof */}
          <div style={{
            display: "flex", alignItems: "center", gap: 20,
            marginTop: 40, animation: "fadeUp 0.7s 0.4s ease both",
          }}>
            <div style={{ display: "flex" }}>
              {["🌿", "🍃", "🌱", "🌿", "🍃"].map((e, i) => (
                <div key={i} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: T.canopy, border: `2px solid ${T.forest}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, marginLeft: i === 0 ? 0 : -8,
                }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.cream }}>+2,400 miembros activos</div>
              <div style={{ fontSize: 12, color: T.stone }}>Seed · Bloom · Canopy</div>
            </div>
            <div style={{ width: 1, height: 32, background: T.border }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.bio }}>★★★★★</div>
              <div style={{ fontSize: 12, color: T.stone }}>4.9 / 5.0</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Live AI Chat Preview */}
        <div className="hero-right" style={{ animation: "fadeUp 0.8s 0.25s ease both" }}>
          <HeroChatPreview tags={tags} activeTag={activeTag} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.bark, letterSpacing: "0.1em", textTransform: "uppercase" }}>scroll</div>
        <div style={{ width: 1, height: 32, background: `linear-gradient(180deg, ${T.bio}44, transparent)` }} />
      </div>
    </section>
  );
}

function HeroChatPreview({ tags, activeTag }) {
  const messages = [
    { role: "user", text: "Quiero más energía para el gimnasio" },
    { role: "ai", text: "Para máximo rendimiento pre-entreno: Matcha + plátano + espinaca + leche de almendras. El L-theanine del matcha + cafeína te da energía sostenida sin crash. 30-60min antes. Agrega 1/2 cucharadita de maca para potenciar aún más." },
  ];

  return (
    <div style={{
      background: T.glass,
      border: `1px solid ${T.border}`,
      borderRadius: 24,
      overflow: "hidden",
      backdropFilter: "blur(32px)",
      boxShadow: "0 48px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(26,224,90,0.06)",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${T.canopy}, ${T.moss})`,
          border: `1px solid rgba(26,224,90,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🌿</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.cream, letterSpacing: "-0.02em" }}>Dr. Smoothie AI</div>
          <div style={{ fontSize: 11, color: T.bio, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.bio, animation: "pulse 2s infinite" }} />
            En línea · TurboQuant activo
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.bark, background: "rgba(26,224,90,0.06)", border: `1px solid ${T.border}`, borderRadius: 12, padding: "3px 10px" }}>
          ⚡ Cache HIT
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            animation: `springIn 0.4s ${i * 0.15}s ${T.spring} both`,
          }}>
            {m.role === "ai" && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(26,224,90,0.12)",
                border: `1px solid rgba(26,224,90,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2,
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "rgba(26,224,90,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${m.role === "user" ? "rgba(26,224,90,0.22)" : "rgba(255,255,255,0.07)"}`,
              fontSize: 13, lineHeight: 1.6,
              color: m.role === "user" ? T.cream : "#C8DDD0",
            }}>{m.text}</div>
          </div>
        ))}

        {/* Typing */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(26,224,90,0.12)", border: `1px solid rgba(26,224,90,0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>🌿</div>
          <div style={{
            display: "flex", gap: 4, padding: "10px 14px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px 16px 16px 4px", alignItems: "center",
          }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} style={{
                width: 5, height: 5, borderRadius: "50%", background: T.bio,
                animation: `typing 1.2s ${d}s infinite`,
                display: "inline-block",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        padding: "12px 16px",
        borderTop: `1px solid ${T.border}`,
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <div style={{
          flex: 1, height: 38,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid rgba(26,224,90,0.1)`,
          borderRadius: 10,
          display: "flex", alignItems: "center",
          padding: "0 14px",
        }}>
          <span style={{ fontSize: 13, color: T.bark }}>Pregunta sobre ingredientes...</span>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: T.bio, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 16, color: T.ink, fontWeight: 700,
        }}>↑</div>
      </div>

      {/* Tags */}
      <div style={{ padding: "12px 16px 16px", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map((t, i) => (
          <span key={t} className="ingr-tag" style={{
            padding: "4px 11px", borderRadius: 20, fontSize: 11,
            background: i === activeTag ? "rgba(26,224,90,0.12)" : "rgba(26,224,90,0.04)",
            border: `1px solid ${i === activeTag ? "rgba(26,224,90,0.3)" : "rgba(26,224,90,0.1)"}`,
            color: i === activeTag ? T.bio : T.stone,
            transition: `all 300ms ${T.ease}`,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ── HOW IT WORKS ────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", icon: "🧬", title: "Dinos tus ingredientes", desc: "Escribe lo que tienes en casa o lo que quieres comprar. El AI entiende 200+ ingredientes y sus propiedades." },
    { n: "02", icon: "🤖", title: "El AI analiza y recomienda", desc: "Claude analiza tu perfil de salud, objetivos y combinaciones óptimas para darte la receta perfecta." },
    { n: "03", icon: "🎬", title: "Genera tu video 4K", desc: "El AI escribe el guión, elige el modelo cinematográfico y renderiza tu smoothie en video viral." },
    { n: "04", icon: "📲", title: "Comparte y repite", desc: "Descarga, publica en TikTok o Reels. Tu comunidad crece, tu bienestar también." },
  ];

  return (
    <section style={{ padding: "120px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, letterSpacing: "0.12em", textTransform: "uppercase" }}>Cómo funciona</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(26,224,90,0.2), transparent)` }} />
      </div>
      <h2 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(36px, 4vw, 60px)",
        fontWeight: 900, letterSpacing: "-0.04em",
        color: T.cream, marginBottom: 16,
      }}>
        De cero a<br /><span style={{ color: T.bio, fontStyle: "italic" }}>resultado</span> en 4 pasos
      </h2>
      <p style={{ fontSize: 16, color: T.stone, maxWidth: 460, lineHeight: 1.7, marginBottom: 64 }}>
        Sin complicaciones. Sin graduación en nutrición. El sistema hace el trabajo.
      </p>

      <div className="reveal steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {steps.map((s, i) => (
          <div key={s.n} className="step-card" style={{
            background: T.glass, border: `1px solid ${T.border}`,
            borderRadius: 20, padding: "28px 24px",
            backdropFilter: "blur(20px)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 16, right: 18,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              fontWeight: 700, color: "rgba(26,224,90,0.15)",
            }}>{s.n}</div>
            <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.cream, marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: T.stone, lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── LIVE AI CHAT ────────────────────────────────────────────── */
function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cacheHit, setCacheHit] = useState(null);
  const [totalSaved, setTotalSaved] = useState(0);
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
      const { text: reply, usage } = await callClaude([...history, { role: "user", content: text }]);
      const elapsed = Date.now() - t0;
      const cr = usage.cache_read_input_tokens ?? 0;
      const cw = usage.cache_creation_input_tokens ?? 0;
      const inp = usage.input_tokens ?? 0;
      const out = usage.output_tokens ?? 0;
      const hit = cr > 0;
      const saved = Math.max(0, ((inp + cr) / 1e6) * 3 - ((inp / 1e6) * 3 + (cw / 1e6) * 3.75 + (cr / 1e6) * 0.3 + (out / 1e6) * 15));
      setCacheHit(hit);
      setTotalSaved(p => p + saved);
      setMessages(p => [...p, { role: "assistant", content: reply, id: Date.now() + 1, hit, elapsed }]);
    } catch (e) {
      setError(e.message);
      setMessages(p => p.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [input, loading, messages]);

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const quick = [
    "🌿 Smoothie antiinflamatorio post-entreno",
    "⚡ Máxima energía sin azúcar",
    "🛡️ Fortalecer inmunidad ahora",
    "✨ Piel radiante esta semana",
    "🧠 Foco y concentración mental",
    "🔥 Perder peso sin pasar hambre",
  ];

  return (
    <section id="ai-chat" style={{ padding: "120px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Chat · TurboQuant Fase 1</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(26,224,90,0.2), transparent)` }} />
        {cacheHit !== null && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: cacheHit ? "rgba(26,224,90,0.08)" : "rgba(200,146,58,0.08)",
            border: `1px solid ${cacheHit ? "rgba(26,224,90,0.2)" : "rgba(200,146,58,0.2)"}`,
            borderRadius: 12, padding: "4px 12px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cacheHit ? T.bio : T.amber }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: cacheHit ? T.bio : T.amber }}>
              {cacheHit ? "⚡ Cache HIT" : "✍️ Cache WRITE"}
            </span>
          </div>
        )}
        {totalSaved > 0 && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.stone }}>
            💰 ${(totalSaved * 100).toFixed(4)}¢ saved
          </span>
        )}
      </div>

      <h2 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(36px, 4vw, 60px)",
        fontWeight: 900, letterSpacing: "-0.04em",
        color: T.cream, marginBottom: 16,
      }}>
        Tu especialista<br /><span style={{ color: T.bio, fontStyle: "italic" }}>siempre disponible</span>
      </h2>
      <p style={{ fontSize: 16, color: T.stone, maxWidth: 440, lineHeight: 1.7, marginBottom: 48 }}>
        Pregunta lo que quieras sobre ingredientes, combinaciones y objetivos de salud. El AI responde con ciencia real.
      </p>

      {/* Chat window */}
      <div className="reveal" style={{
        background: T.glass, border: `1px solid ${T.border}`,
        borderRadius: 24, overflow: "hidden",
        backdropFilter: "blur(32px)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
        maxWidth: 720,
      }}>
        {/* Chat header */}
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: `linear-gradient(135deg, ${T.canopy}, ${T.moss})`,
            border: `1px solid rgba(26,224,90,0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🌿</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.cream, letterSpacing: "-0.02em" }}>Dr. Smoothie AI</div>
            <div style={{ fontSize: 11, color: T.bio, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.bio, animation: "pulse 2s infinite" }} />
              Activo · Anthropic Prompt Caching
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          minHeight: 340, maxHeight: 440, overflowY: "auto",
          padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12, animation: "floatY 4s ease-in-out infinite" }}>🌱</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: T.cream, marginBottom: 8 }}>
                ¿Qué necesita tu cuerpo hoy?
              </div>
              <div style={{ fontSize: 13, color: T.stone, marginBottom: 24 }}>Elige una sugerencia o escribe tu pregunta</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 500, margin: "0 auto" }}>
                {quick.map(q => (
                  <button key={q} style={{
                    background: "rgba(26,224,90,0.05)",
                    border: `1px solid rgba(26,224,90,0.14)`,
                    borderRadius: 12, padding: "10px 14px",
                    color: T.stone, fontSize: 12, cursor: "pointer",
                    textAlign: "left", fontFamily: "'Instrument Sans', sans-serif",
                    transition: `all 180ms ${T.ease}`,
                  }}
                    onClick={() => { setInput(q.replace(/^[^\s]+ /, "")); setTimeout(() => inputRef.current?.focus(), 50); }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,224,90,0.1)"; e.currentTarget.style.color = T.cream; e.currentTarget.style.borderColor = "rgba(26,224,90,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,224,90,0.05)"; e.currentTarget.style.color = T.stone; e.currentTarget.style.borderColor = "rgba(26,224,90,0.14)"; }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className="chat-bubble-enter" style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end", gap: 8,
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(26,224,90,0.1)",
                  border: `1px solid rgba(26,224,90,0.18)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, flexShrink: 0,
                }}>🌿</div>
              )}
              <div style={{ maxWidth: "76%", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{
                  padding: "11px 16px",
                  borderRadius: m.role === "user" ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
                  background: m.role === "user" ? "rgba(26,224,90,0.16)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${m.role === "user" ? "rgba(26,224,90,0.24)" : "rgba(255,255,255,0.07)"}`,
                  fontSize: 14, lineHeight: 1.65, color: m.role === "user" ? T.cream : "#C8DDD0",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>{m.content}</div>
                {m.role === "assistant" && m.elapsed && (
                  <div style={{ display: "flex", gap: 8, paddingLeft: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: m.hit ? T.bio : T.amber }}>
                      {m.hit ? "⚡ cache hit" : "✍️ cache write"}
                    </span>
                    <span style={{ fontSize: 11, color: T.bark }}>
                      {m.elapsed < 1000 ? `${m.elapsed}ms` : `${(m.elapsed / 1000).toFixed(1)}s`}
                    </span>
                  </div>
                )}
              </div>
              {m.role === "user" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "rgba(26,224,90,0.18)",
                  border: `1px solid rgba(26,224,90,0.3)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: T.bio, flexShrink: 0,
                }}>J</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(26,224,90,0.1)", border: `1px solid rgba(26,224,90,0.18)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>🌿</div>
              <div style={{
                display: "flex", gap: 5, padding: "12px 16px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "18px 18px 18px 5px", alignItems: "center",
              }}>
                {[0, 0.18, 0.36].map((d, i) => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: "50%", background: T.bio,
                    display: "inline-block", animation: `typing 1.2s ${d}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.2)",
              borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#FCA5A5",
            }}>
              <span>⚠️ {error}</span>
              <button style={{ background: "none", border: "none", color: "#FCA5A5", cursor: "pointer" }}
                onClick={() => setError(null)}>✕</button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              style={{
                flex: 1, minHeight: 46, maxHeight: 120,
                resize: "none", overflowY: "auto",
                borderRadius: 14, padding: "11px 16px",
                fontSize: 14, lineHeight: 1.5,
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ingredientes, objetivos, recetas..."
              rows={1}
            />
            <button
              className="btn-primary"
              style={{
                width: 46, height: 46, padding: 0,
                borderRadius: 12, fontSize: 18, flexShrink: 0,
                opacity: !input.trim() || loading ? 0.38 : 1,
              }}
              onClick={send}
              disabled={!input.trim() || loading}
            >
              {loading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> : "↑"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.bark }}>Enter enviar · Shift+Enter nueva línea</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.bark }}>🔒 KV Cache · TurboQuant Fase 1</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── VIDEO STUDIO ────────────────────────────────────────────── */
function VideoStudio() {
  const [ingredients, setIngredients] = useState("");
  const [goal, setGoal] = useState("antiinflamatorio");
  const [model, setModel] = useState("kling");
  const [duration, setDuration] = useState("10");
  const [resolution, setResolution] = useState("1080p");
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [log, setLog] = useState("💡 Listo para generar tu video 4K");
  const timerRef = useRef(null);

  const addLog = msg => setLog(msg);

  const generatePrompt = async () => {
    if (!ingredients.trim()) return addLog("⚠️ Agrega tus ingredientes primero");
    setPhase("generating-prompt"); addLog("🤖 Analizando ingredientes con Claude...");
    try {
      const { text } = await callClaude([{
        role: "user",
        content: `Generate a cinematic 45-second video script for a ${goal} smoothie with: ${ingredients}. 
        Format: vivid visual description for AI video generation. Include ingredient close-ups, blending sequence, and final pour. Max 60 words. English only.`,
      }]);
      setPrompt(text); setPhase("prompt-ready");
      addLog("✅ Prompt cinematográfico listo · Revisa y genera tu video");
    } catch (e) {
      setPhase("idle"); addLog(`⚠️ Error: ${e.message}`);
    }
  };

  const generateVideo = () => {
    setPhase("generating-video"); setProgress(0);
    addLog(`🎬 Renderizando en ${resolution} · ${model} · ${duration}s...`);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += Math.random() * 3.5 + 1.2;
      if (p >= 100) {
        clearInterval(timerRef.current);
        setProgress(100);
        setTimeout(() => {
          setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
          setPhase("done"); addLog("✅ Video listo · Descarga o comparte");
        }, 400);
        return;
      }
      setProgress(p);
    }, 280);
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setPhase("idle"); setProgress(0); setPrompt(""); setVideoUrl(""); addLog("💡 Listo para generar tu video 4K");
  };

  const models = [
    { v: "kling", label: "🎥 Kling v1.6", desc: "Realista · Movimiento natural" },
    { v: "veo", label: "🎬 Veo 3.1", desc: "Cinemático · Alta fidelidad" },
    { v: "sora", label: "✨ Sora 2", desc: "Creativo · Artístico" },
    { v: "seedance", label: "🌟 Seedance Pro", desc: "Ultra detalle · 4K" },
  ];
  const isWorking = phase === "generating-prompt" || phase === "generating-video";

  return (
    <section id="video-studio" style={{ padding: "120px 40px", position: "relative" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(26,224,90,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, letterSpacing: "0.12em", textTransform: "uppercase" }}>Video AI Studio</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(26,224,90,0.2), transparent)` }} />
        <div style={{ background: "rgba(26,224,90,0.07)", border: `1px solid rgba(26,224,90,0.18)`, borderRadius: 20, padding: "3px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.bio }}>BETA · fal.ai + HeyGen</div>
      </div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,60px)", fontWeight: 900, letterSpacing: "-0.04em", color: T.cream, marginBottom: 14 }}>
        Tu smoothie,<br /><span style={{ color: T.bio, fontStyle: "italic" }}>en video 4K.</span>
      </h2>
      <p style={{ fontSize: 16, color: T.stone, maxWidth: 480, lineHeight: 1.7, marginBottom: 56 }}>El AI genera el guión, elige el modelo perfecto y renderiza tu video en 4K. Solo en Bloom y Canopy.</p>

      <div className="reveal studio-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, backdropFilter: "blur(20px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.stone, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>🧬 Ingredientes</div>
            <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={3} placeholder="Ej: mango, jengibre, cúrcuma, leche de almendras…" style={{ width: "100%", resize: "vertical" }} disabled={isWorking} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.stone, textTransform: "uppercase", letterSpacing: "0.08em", margin: "12px 0 8px" }}>🎯 Objetivo</div>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={{ width: "100%" }} disabled={isWorking}>
              <option value="antiinflamatorio">💪 Antiinflamatorio</option>
              <option value="energia y vitalidad">⚡ Energía y vitalidad</option>
              <option value="detox y digestión">🍃 Detox y digestión</option>
              <option value="inmunidad">🛡️ Refuerzo inmune</option>
              <option value="relajación">😌 Relajación</option>
              <option value="pérdida de peso">🔥 Pérdida de peso</option>
            </select>
          </div>

          <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, backdropFilter: "blur(20px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.stone, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>🤖 Modelo de video</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {models.map(m => (
                <div key={m.v} onClick={() => !isWorking && setModel(m.v)} style={{
                  padding: "12px 14px", borderRadius: 12, cursor: isWorking ? "not-allowed" : "pointer",
                  border: `1px solid ${model === m.v ? "rgba(26,224,90,0.38)" : "rgba(255,255,255,0.06)"}`,
                  background: model === m.v ? "rgba(26,224,90,0.08)" : "rgba(255,255,255,0.02)",
                  transition: `all 200ms ${T.ease}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: model === m.v ? T.bio : T.cream, marginBottom: 3 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: T.stone }}>{m.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.stone, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Duración</div>
                <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: "100%" }} disabled={isWorking}>
                  <option value="5">5 segundos</option>
                  <option value="10">10 segundos</option>
                  <option value="15">15 segundos</option>
                </select>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.stone, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Calidad</div>
                <select value={resolution} onChange={e => setResolution(e.target.value)} style={{ width: "100%" }} disabled={isWorking}>
                  <option value="720p">720p HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {phase === "idle" && <button className="btn-primary" style={{ width: "100%", padding: "14px", justifyContent: "center" }} onClick={generatePrompt}>🤖 Generar prompt con AI</button>}
            {phase === "generating-prompt" && <button className="btn-primary" style={{ width: "100%", padding: "14px", justifyContent: "center" }} disabled><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Analizando…</button>}
            {phase === "prompt-ready" && <>
              <button className="btn-primary" style={{ width: "100%", padding: "14px", justifyContent: "center" }} onClick={generateVideo}>🎬 Generar Video 4K</button>
              <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={generatePrompt}>↺ Regenerar prompt</button>
            </>}
            {phase === "generating-video" && <button className="btn-primary" style={{ width: "100%", padding: "14px", justifyContent: "center" }} disabled><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Renderizando {resolution}…</button>}
            {(phase === "done" || phase === "error") && <button className="btn-ghost" style={{ width: "100%", padding: "13px", justifyContent: "center" }} onClick={reset}>↺ Nuevo video</button>}
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#040A06", border: `1px solid rgba(26,224,90,0.1)`, borderLeft: `3px solid rgba(26,224,90,0.45)`, borderRadius: 14, padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(26,224,90,0.8)", lineHeight: 1.6 }}>{log}</div>
          {(phase === "prompt-ready" || phase === "generating-video" || phase === "done") && (
            <div style={{ background: T.glass, border: `1px solid rgba(26,224,90,0.15)`, borderRadius: 20, padding: 22, backdropFilter: "blur(20px)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.stone, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>📝 Prompt generado</div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} style={{ width: "100%", fontSize: 12, lineHeight: 1.6, resize: "vertical" }} disabled={isWorking} />
            </div>
          )}
          {phase === "generating-video" && (
            <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 20, padding: 22, backdropFilter: "blur(20px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.stone }}>{model} · {resolution} · {duration}s</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.bio }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
          {phase === "done" && videoUrl && (
            <div style={{ background: T.glass, border: `1px solid rgba(26,224,90,0.2)`, borderRadius: 20, padding: 22, backdropFilter: "blur(20px)" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>✅ Video listo · {resolution}</div>
              <video controls style={{ width: "100%", borderRadius: 14, background: "#000", maxHeight: 240 }}><source src={videoUrl} type="video/mp4" /></video>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {["⬇️ Descargar", "📲 TikTok", "📸 Reels", "💬 WhatsApp"].map((l, i) => (
                  <button key={l} className={i === 0 ? "btn-primary" : "btn-ghost"} style={{ flex: 1, padding: "8px 6px", fontSize: 10, borderRadius: 10, justifyContent: "center" }}>{l}</button>
                ))}
              </div>
            </div>
          )}
          {phase === "idle" && (
            <div style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 20, padding: 40, backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.35 }}>🎬</div>
              <div style={{ fontSize: 14, color: T.stone, lineHeight: 1.6 }}>Describe tus ingredientes y el AI generará el prompt cinematográfico perfecto</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES BENTO ─────────────────────────────────────────── */
function Features() {
  const tags = ["Mango", "Jengibre", "Espinaca", "Cúrcuma", "Plátano", "Kale", "Aguacate", "Limón", "Moringa", "Chía"];
  const active = ["Mango", "Jengibre", "Plátano"];
  const bars = [30, 50, 40, 65, 55, 80, 70, 95];

  const cards = [
    { icon: "🏅", title: "Sistema de Rewards", desc: "Badges, streaks y puntos por cada smoothie, video y día de bienestar completado." },
    { icon: "🧬", title: "Swarm Intelligence", desc: "MiroFish integrado · 53K+ agentes optimizando tus combinaciones en tiempo real." },
    { icon: "🌍", title: "Multilingüe · Global", desc: "Español, inglés, portugués. Plataforma diseñada para escalar globalmente." },
    { icon: "🔒", title: "Privacidad total", desc: "Supabase RLS en todas las tablas. Sin venta de datos. Sin anuncios. Tu historial es tuyo." },
  ];

  return (
    <section id="features" style={{ padding: "120px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, letterSpacing: "0.12em", textTransform: "uppercase" }}>Features</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(26,224,90,0.2), transparent)` }} />
      </div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,60px)", fontWeight: 900, letterSpacing: "-0.04em", color: T.cream, marginBottom: 14 }}>
        Todo en un<span style={{ color: T.bio, fontStyle: "italic" }}> lugar</span>
      </h2>
      <p style={{ fontSize: 16, color: T.stone, maxWidth: 480, lineHeight: 1.7, marginBottom: 60 }}>De la recomendación inteligente al video viral. La suite completa de wellness con IA.</p>

      <div className="reveal bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {/* AI Chat wide */}
        <div className="bento-card bento-wide" style={{ gridColumn: "span 2", background: T.glass, border: `1px solid ${T.border}`, borderRadius: 24, padding: "28px 26px", backdropFilter: "blur(20px)" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🤖</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: T.cream, marginBottom: 8, letterSpacing: "-0.02em" }}>AI Chat con el Dr. Smoothie</div>
          <div style={{ fontSize: 13, color: T.stone, lineHeight: 1.7, marginBottom: 18 }}>Conversación en tiempo real entrenada en 200+ ingredientes. No es un chatbot genérico — es tu especialista en wellness con Anthropic Prompt Caching.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {tags.map(t => (
              <span key={t} className="ingr-tag" style={{ background: active.includes(t) ? "rgba(26,224,90,0.1)" : "rgba(26,224,90,0.04)", border: `1px solid ${active.includes(t) ? "rgba(26,224,90,0.28)" : "rgba(26,224,90,0.1)"}`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: active.includes(t) ? T.bio : T.stone }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Video Studio tall */}
        <div className="bento-card" style={{ gridRow: "span 2", background: T.glass, border: `1px solid ${T.border}`, borderRadius: 24, padding: "28px 26px", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🎬</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700, color: T.cream, marginBottom: 8, letterSpacing: "-0.02em" }}>Video Studio 4K</div>
          <div style={{ fontSize: 13, color: T.stone, lineHeight: 1.7 }}>El generador más avanzado del ecosistema wellness. Kling, Veo o Sora — el AI elige el mejor modelo para tu escena.</div>
          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.stone, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Videos · últimos 7 días</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 64 }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i > 5 ? "rgba(26,224,90,0.4)" : "rgba(26,224,90,0.12)", border: `1px solid ${i > 5 ? "rgba(26,224,90,0.5)" : "rgba(26,224,90,0.18)"}`, animation: `barGrow 1.5s ${i * 0.1}s ease both` }} />
              ))}
            </div>
          </div>
        </div>

        {cards.map(f => (
          <div key={f.title} className="bento-card" style={{ background: T.glass, border: `1px solid ${T.border}`, borderRadius: 24, padding: "28px 26px", backdropFilter: "blur(20px)" }}>
            <div style={{ fontSize: 34, marginBottom: 14 }}>{f.icon}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700, color: T.cream, marginBottom: 8, letterSpacing: "-0.02em" }}>{f.title}</div>
            <div style={{ fontSize: 12, color: T.stone, lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── MEMBERSHIP TIERS ────────────────────────────────────────── */
function Tiers() {
  const tiers = [
    {
      emoji: "🌱", name: "Seed", price: 29, period: "Para explorar",
      color: T.amber, accentColor: T.amber,
      features: [
        { ok: true, text: "AI Chat ilimitado" },
        { ok: true, text: "200+ ingredientes" },
        { ok: true, text: "1 Video AI / mes (720p)" },
        { ok: true, text: "Rewards básico" },
        { ok: true, text: "PWA mobile" },
        { ok: false, text: "Sin watermark" },
        { ok: false, text: "Swarm simulator" },
      ],
      btn: "Comenzar con Seed",
    },
    {
      emoji: "🌿", name: "Bloom", price: 49, period: "Para el wellness serio",
      color: T.bio, accentColor: T.bio, popular: true,
      features: [
        { ok: true, text: "AI Chat ilimitado" },
        { ok: true, text: "5 Videos AI / mes (1080p)" },
        { ok: true, text: "Sin watermark" },
        { ok: true, text: "Kling + Veo models" },
        { ok: true, text: "Swarm (5 simulaciones)" },
        { ok: true, text: "Auto-prompt del Chat" },
        { ok: false, text: "Avatar HeyGen" },
      ],
      btn: "Comenzar con Bloom",
    },
    {
      emoji: "🌳", name: "Canopy", price: 79, period: "El arsenal completo",
      color: T.dew, accentColor: T.dew,
      features: [
        { ok: true, text: "Todo lo de Bloom" },
        { ok: true, text: "Videos ilimitados (4K)" },
        { ok: true, text: "Avatar Dr. Smoothie HeyGen" },
        { ok: true, text: "Voz español + inglés" },
        { ok: true, text: "Swarm ilimitado" },
        { ok: true, text: "Share directo redes" },
        { ok: true, text: "Prioridad de generación" },
      ],
      btn: "Comenzar con Canopy",
    },
  ];

  return (
    <section id="planes" style={{ padding: "120px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: T.bio, letterSpacing: "0.12em", textTransform: "uppercase" }}>Membresías</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, rgba(26,224,90,0.2), transparent)` }} />
      </div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(36px,4vw,60px)", fontWeight: 900, letterSpacing: "-0.04em", color: T.cream, marginBottom: 16 }}>
        Elige tu<span style={{ color: T.bio, fontStyle: "italic" }}> nivel</span>
      </h2>
      <p style={{ fontSize: 16, color: T.stone, maxWidth: 440, lineHeight: 1.7, marginBottom: 60 }}>Desde exploración hasta dominio total. Cancela cuando quieras.</p>

      <div className="reveal tiers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {tiers.map(t => (
          <div key={t.name} className="tier-card" style={{
            background: T.glass, borderRadius: 24, padding: "32px 28px",
            backdropFilter: "blur(30px)",
            border: `1px solid ${t.popular ? "rgba(26,224,90,0.22)" : "rgba(255,255,255,0.05)"}`,
            boxShadow: t.popular ? "0 0 80px rgba(26,224,90,0.07)" : "none",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.accentColor }} />
            {t.popular && (
              <div style={{ position: "absolute", top: 18, right: 18, background: T.bio, color: T.ink, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em" }}>MÁS POPULAR</div>
            )}
            <div style={{ fontSize: 32, marginBottom: 12 }}>{t.emoji}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: T.stone, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{t.name}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 52, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: T.cream, marginBottom: 4 }}>
              ${t.price}<span style={{ fontSize: 16, color: T.stone, fontFamily: "'Instrument Sans', sans-serif", fontWeight: 400 }}>/mo</span>
            </div>
            <div style={{ fontSize: 12, color: T.stone, marginBottom: 28 }}>{t.period}</div>
            <ul style={{ listStyle: "none", marginBottom: 28 }}>
              {t.features.map(f => (
                <li key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13, color: f.ok ? "rgba(242,237,228,0.75)" : T.bark, lineHeight: 1.4 }}>
                  <span style={{ color: f.ok ? T.bio : T.bark, fontSize: 12, flexShrink: 0, marginTop: 1 }}>{f.ok ? "✓" : "—"}</span>
                  {f.text}
                </li>
              ))}
            </ul>
            <button className="btn-tier" style={{
              background: t.popular ? T.bio : "transparent",
              border: t.popular ? "none" : `1px solid rgba(255,255,255,0.1)`,
              color: t.popular ? T.ink : T.cream,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = t.popular ? "#2ef76a" : "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = t.popular ? T.bio : "transparent"; }}
            >{t.btn}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Producto", links: ["AI Chat", "Video Studio", "Membresías", "Rewards", "Swarm"] },
    { title: "Empresa", links: ["JRMB Food Network", "Términos", "Privacidad", "Contacto"] },
    { title: "Comunidad", links: ["TikTok", "Instagram", "YouTube", "WhatsApp"] },
  ];
  return (
    <footer className="footer-grid" style={{ padding: "80px 40px 40px", borderTop: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${T.canopy}, ${T.moss})`, border: `1px solid rgba(26,224,90,0.28)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: T.bio }}>dr</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: T.cream }}>
            <span style={{ color: T.bio }}>dr.</span>smoothie<span style={{ color: T.bio }}>.ai</span>
          </span>
        </div>
        <p style={{ fontSize: 13, color: T.stone, lineHeight: 1.7, maxWidth: 200 }}>La plataforma de wellness más avanzada del mundo. Ciencia + naturaleza + IA.</p>
      </div>
      {cols.map(c => (
        <div key={c.title}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(242,237,228,0.2)", marginBottom: 16 }}>{c.title}</div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {c.links.map(l => (
              <li key={l}>
                <a href="#" style={{ fontSize: 13, color: T.stone, textDecoration: "none", transition: `color 180ms ${T.ease}` }}
                  onMouseEnter={e => e.target.style.color = T.cream}
                  onMouseLeave={e => e.target.style.color = T.stone}
                >{l}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div style={{ gridColumn: "1/-1", paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.16)" }}>
          © 2026 JRMB Food Network LLC · <span style={{ color: T.bio }}>dr.smoothie.ai</span>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.12)" }}>
          Powered by Claude · fal.ai · Supabase · Vercel
        </span>
      </div>
    </footer>
  );
}

const Divider = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(26,224,90,0.08) 20%, rgba(26,224,90,0.08) 80%, transparent)`, margin: "0 40px" }} />
);

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function DrSmoothieApp() {
  const canvasRef = useRef(null);
  useParticles(canvasRef);
  useReveal();

  useEffect(() => {
    if (!document.getElementById("pl-styles")) {
      const s = document.createElement("style");
      s.id = "pl-styles"; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: "none" }} />

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E")`,
      }} />

      {/* Ambient glows */}
      <div style={{ position: "fixed", top: "8%", left: "3%", width: 520, height: 520, background: "radial-gradient(ellipse, rgba(26,224,90,0.04) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "8%", right: "3%", width: 420, height: 420, background: "radial-gradient(ellipse, rgba(0,212,168,0.04) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "45%", right: "15%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(200,146,58,0.025) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <Nav />
        <main>
          <Hero />
          <Divider />
          <HowItWorks />
          <Divider />
          <LiveChat />
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
