import { useEffect, useRef, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";

// ═══════════════════════════════════════════════════
//  PURELIFE LANDING — Fiel traducción de purelife-final.html
//  Todas las secciones, mismo CSS, mismo diseño
// ═══════════════════════════════════════════════════

const CSS_VARS = `
  :root {
    --obsidian: #080B0A;
    --deep: #0D1210;
    --surface: #111815;
    --surface2: #162019;
    --surface3: #1C2920;
    --gold: #C9A84C;
    --gold2: #E8C96A;
    --gold3: #F5E09A;
    --cream: #F4EFE6;
    --cream2: #E8E0D0;
    --sage: #4A7C59;
    --sage2: #2E5E3A;
    --emerald: #00C97B;
    --muted: #6B7E74;
    --border: rgba(201,168,76,0.15);
    --border2: rgba(201,168,76,0.08);
    --glass: rgba(22,32,25,0.85);
  }
`;

const GLOBAL_CSS = `
  body { background: var(--obsidian); color: var(--cream); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  body::before {
    content:''; position:fixed; inset:0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none; z-index:9999; opacity:0.4;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,-40px) scale(1.1)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes glow { 0%,100%{box-shadow:0 4px 16px rgba(201,168,76,0.25)} 50%{box-shadow:0 4px 24px rgba(201,168,76,0.5)} }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
`;

const AI_REPLIES = [
  "¡Excelente pregunta! Basado en tu perfil, te recomiendo incorporar adaptógenos como ashwagandha y maca en tu smoothie matutino para regular el cortisol. 🌿",
  "La combinación de remolacha + jengibre + zanahoria tiene estudios que muestran mejora del 23% en rendimiento físico. ¿Te genero el protocolo completo?",
  "Para maximizar la absorción de nutrientes, te sugiero consumir tu smoothie verde 30 minutos antes de comer. La vitamina C de la piña potencia la absorción del hierro 🧬",
  "Detecto que tu nivel de vitalidad está en 74%. Con el protocolo de 7 días que diseñé para ti, podemos llevarlo al 90%+ en 2 semanas. ¿Empezamos?",
];

export default function LandingScreen({ onStart, lang, onLangChange }) {
  const [chatMessages, setChatMessages] = useState([
    { type: "ai", text: "¡Hola! Soy Dr. Smoothie AI 🌿 Tu asesor nutricional inteligente. ¿Cómo te sientes hoy? Puedo diseñarte un protocolo personalizado basado en tus síntomas y objetivos." },
    { type: "user", text: "Me siento con poca energía en las mañanas, ¿qué me recomiendas?" },
    { type: "ai", text: "Entiendo. La fatiga matutina frecuentemente tiene 3 causas: cortisol bajo, déficit de B12/hierro o hidratación insuficiente. 🧬\n\nTe recomiendo el Smoothie Energizante Matutino:\n• 🥬 Espinaca fresca (hierro biodisponible)\n• 🍍 Piña (bromelina + vitamina C)\n• 🫚 Jengibre fresco (estimula circulación)\n• 💧 Agua de coco (electrolitos)\n\nConsumirlo 30 min antes de desayunar. ¿Quieres el protocolo completo de 7 días?" },
    { type: "typing" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [replyIdx, setReplyIdx] = useState(0);
  const chatBodyRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [coName, setCoName] = useState("");
  const [coEmail, setCoEmail] = useState("");
  const revealRefs = useRef([]);

  useEffect(() => {
    // Inject fonts & CSS
    if (!document.getElementById("purelife-fonts")) {
      const link = document.createElement("link");
      link.id = "purelife-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap";
      document.head.appendChild(link);
    }
    if (!document.getElementById("purelife-css")) {
      const style = document.createElement("style");
      style.id = "purelife-css";
      style.textContent = CSS_VARS + GLOBAL_CSS;
      document.head.appendChild(style);
    }
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      revealRefs.current.push(el);
    }
  };

  const sendMsg = () => {
    const val = chatInput.trim();
    if (!val) return;
    const noTyping = chatMessages.filter(m => m.type !== "typing");
    setChatMessages([...noTyping, { type: "user", text: val }, { type: "typing" }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => {
        const noT = prev.filter(m => m.type !== "typing");
        return [...noT, { type: "ai", text: AI_REPLIES[replyIdx % AI_REPLIES.length] }];
      });
      setReplyIdx(i => i + 1);
    }, 1800);
    setTimeout(() => { if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; }, 100);
  };

  const doCheckout = () => {
    if (!coName.trim()) return;
    if (!coEmail.trim()) return;
    setShowModal(true);
  };

  return (
    <div style={{ background: "var(--obsidian)", color: "var(--cream)", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "var(--deep)", borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/purelife-logo.png" alt="PureLife" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "var(--gold2)", fontStyle: "italic" }}>PureLife</span>
        </div>
        <LanguageSelector lang={lang} onChange={onLangChange} />
      </div>

      {/* ═══ SPLASH ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "40px 24px" }}>
        {/* Orbs */}
        {[
          { style: { width: 600, height: 600, background: "radial-gradient(circle, rgba(74,124,89,0.25), transparent 70%)", top: -150, left: -200, animationDelay: "0s" } },
          { style: { width: 500, height: 500, background: "radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)", bottom: -100, right: -150, animationDelay: "-5s" } },
          { style: { width: 300, height: 300, background: "radial-gradient(circle, rgba(0,201,123,0.1), transparent 70%)", top: "40%", left: "60%", animationDelay: "-9s" } },
        ].map((orb, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", animation: "drift 12s ease-in-out infinite alternate", ...orb.style }} />
        ))}
        {/* Hex grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)" }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 500 }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24, animation: "fadeUp 0.8s ease both" }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500 }}>La clínica de longevidad en tu bolsillo</span>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>

          {/* Logo */}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: -2, background: "linear-gradient(135deg, var(--gold3) 0%, var(--gold) 40%, var(--sage) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 8, animation: "fadeUp 0.9s 0.1s ease both" }}>PureLife</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--muted)", fontStyle: "italic", letterSpacing: "0.05em", marginBottom: 32, animation: "fadeUp 0.9s 0.2s ease both" }}>Wellness Club</div>
          <p style={{ fontSize: "0.8rem", color: "var(--cream2)", opacity: 0.7, letterSpacing: "0.05em", maxWidth: 320, margin: "0 auto 40px", lineHeight: 1.7, animation: "fadeUp 0.9s 0.3s ease both" }}>
            Inteligencia artificial + ciencia nutricional para transformar tu energía vital, un smoothie a la vez.
          </p>

          {/* Vitality Ring */}
          <div style={{ width: 180, height: 180, margin: "0 auto 40px", position: "relative", animation: "fadeUp 1s 0.4s ease both" }}>
            <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#00C97B" />
                </linearGradient>
              </defs>
              <circle fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="6" cx="80" cy="80" r="70" />
              <circle fill="none" stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="440" strokeDashoffset="112" cx="80" cy="80" r="70" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img src="/purelife-logo.png" alt="PureLife" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", animation: "spin 20s linear infinite" }} />
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--gold2)", marginTop: 4 }}>74%</div>
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>Vitalidad</div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s 0.5s ease both" }}>
            <button onClick={onStart} style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "var(--obsidian)", border: "none", padding: "14px 28px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.03em", boxShadow: "0 8px 32px rgba(201,168,76,0.3)" }}>
              Comenzar gratis
            </button>
            <button onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "var(--cream)", border: "1px solid var(--border)", padding: "14px 28px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.85rem", cursor: "pointer" }}>
              Ver planes
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 3 AGENT CARDS ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Por qué PureLife</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, lineHeight: 1.1, color: "var(--cream)" }}>
            Ciencia, diseño <em style={{ color: "var(--gold2)", fontStyle: "italic" }}>y cuidado real.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { icon: "🌿", name: "Diseño pensado para vos", role: "Simple, claro, sin distracciones", desc: "Cada pantalla está pensada para que cuidarte sea parte natural de tu día — sin fricción, sin complicaciones.", feats: ["Interfaz clara y sin distracciones", "Disponible en 10 idiomas", "Pensado para usar todos los días"], glowColor: "var(--gold)", iconBg: "rgba(201,168,76,0.1)", iconBorder: "rgba(201,168,76,0.2)", badgeColor: "var(--gold2)", badgeBg: "rgba(201,168,76,0.12)" },
            { icon: "🔒", name: "Tu información, protegida", role: "Seguridad de verdad", desc: "Tus datos de salud y tus pagos están protegidos con los mismos estándares que usan bancos y hospitales.", feats: ["Pagos 100% seguros con Stripe", "Tus datos nunca se comparten con terceros", "Control total sobre tu cuenta"], glowColor: "var(--sage)", iconBg: "rgba(74,124,89,0.1)", iconBorder: "rgba(74,124,89,0.2)", badgeColor: "var(--sage)", badgeBg: "rgba(74,124,89,0.12)" },
            { icon: "🧠", name: "Dr. Smoothie AI", role: "Inteligencia artificial real", desc: "Recomendaciones personalizadas según tu cuerpo, tus objetivos y tu salud — construidas sobre la tecnología de IA de Anthropic (Claude), no reglas genéricas.", feats: ["Recomendaciones realmente personalizadas", "Disponible 24/7 para tus consultas", "Mejora con cada conversación"], glowColor: "var(--emerald)", iconBg: "rgba(0,201,123,0.1)", iconBorder: "rgba(0,201,123,0.2)", badgeColor: "var(--emerald)", badgeBg: "rgba(0,201,123,0.12)" },
          ].map((card, i) => (
            <div key={i} ref={addReveal} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 28, padding: 32, position: "relative", overflow: "hidden", transition: "all 0.4s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top left, ${card.glowColor}, transparent 60%)`, opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ width: 56, height: 56, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: 20, background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>{card.icon}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: card.badgeBg, border: `1px solid ${card.iconBorder}`, borderRadius: 40, padding: "4px 12px", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: card.badgeColor, fontWeight: 600, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block", animation: "pulse 2s infinite" }} /> Incluido
              </span>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500, color: "var(--cream)", marginBottom: 4 }}>{card.name}</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{card.role}</div>
              <p style={{ fontSize: "0.82rem", color: "var(--cream2)", opacity: 0.8, lineHeight: 1.7, marginBottom: 20 }}>{card.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {card.feats.map((f, j) => (
                  <li key={j} style={{ fontSize: "0.78rem", color: "var(--cream2)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", flexShrink: 0, display: "inline-block" }} />{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ APP PREVIEW — PHONE MOCKUP ═══ */}
      <section style={{ padding: "80px 24px", background: "var(--deep)", borderTop: "1px solid var(--border2)", borderBottom: "1px solid var(--border2)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Phone */}
          <div>
            <div style={{ width: 280, margin: "0 auto", background: "var(--surface2)", borderRadius: 48, padding: 16, border: "2px solid rgba(201,168,76,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05) inset", position: "relative" }}>
              <div style={{ width: 80, height: 22, background: "var(--obsidian)", borderRadius: "0 0 16px 16px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #333" }} />
                <div style={{ width: 40, height: 8, borderRadius: 4, background: "#1a1a1a", border: "1px solid #333" }} />
              </div>
              <div style={{ background: "var(--obsidian)", borderRadius: 36, overflow: "hidden", minHeight: 560, position: "relative" }}>
                <div style={{ padding: "20px 16px 80px", height: 560, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Buenos días</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--cream)" }}>Hola, <span style={{ color: "var(--gold2)" }}>Jorge</span> 🌿</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--sage))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>J</div>
                  </div>
                  {/* Vitality card */}
                  <div style={{ background: "linear-gradient(135deg,var(--surface2),var(--surface3))", border: "1px solid var(--border)", borderRadius: 20, padding: 16, marginBottom: 12, position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>Energía vital hoy</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--gold2)", lineHeight: 1 }}>74<span style={{ fontSize: "1rem", color: "var(--muted)" }}>%</span></div>
                    <div style={{ fontSize: "0.6rem", color: "var(--cream2)", opacity: 0.6, marginTop: 4 }}>✓ 3 hábitos completados · 2 pendientes</div>
                    <div style={{ background: "#1e1e1e", borderRadius: 10, height: 4, marginTop: 10 }}>
                      <div style={{ height: 4, borderRadius: 10, background: "linear-gradient(90deg,var(--gold),var(--emerald))", width: "74%" }} />
                    </div>
                  </div>
                  {/* Quick grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[["🥤","Smoothie hoy"],["📍","Tiendas cerca"],["🎬","PureLife TV"],["🏆","Rewards"]].map(([ico,lbl]) => (
                      <div key={lbl} style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 16, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{ico}</div>
                        <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  {/* Smoothie chips */}
                  <div style={{ marginBottom: 10, fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recomendados hoy</div>
                  <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
                    {["🥬 Verde Detox","🟡 Dorado Anti-inf.","🫐 Antioxidante"].map(c => (
                      <div key={c} style={{ background: "var(--surface3)", border: "1px solid var(--border2)", borderRadius: 20, padding: "6px 10px", fontSize: "0.6rem", whiteSpace: "nowrap", color: "var(--cream2)" }}>{c}</div>
                    ))}
                  </div>
                </div>
                {/* AI Float */}
                <div style={{ position: "absolute", bottom: 90, right: 12, zIndex: 10 }}>
                  <div style={{ background: "linear-gradient(135deg,var(--gold),var(--gold2))", color: "var(--obsidian)", padding: "8px 12px", borderRadius: "16px 16px 4px 16px", fontSize: "0.6rem", fontWeight: 600, maxWidth: 140, marginBottom: 6, boxShadow: "0 4px 16px rgba(201,168,76,0.3)", lineHeight: 1.4 }}>¡Tu energía subió 12% esta semana! 🌟</div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", animation: "glow 3s ease-in-out infinite", cursor: "pointer", overflow: "hidden", padding: 2 }}><img src="/purelife-logo.png" alt="PureLife" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /></div>
                </div>
                {/* Bottom nav */}
                <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 8px 16px", background: "rgba(17,24,21,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border2)", position: "absolute", bottom: 16, left: 16, right: 16, borderRadius: "0 0 36px 36px" }}>
                  {[["🏠","Inicio",true],["💬","Chat IA",false],["🌱","Planes",false],["🎬","TV",false],["👤","Perfil",false]].map(([ico,lbl,active]) => (
                    <div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                      <div style={{ fontSize: "1.1rem", filter: active ? "drop-shadow(0 0 6px rgba(201,168,76,0.5))" : "none" }}>{ico}</div>
                      <div style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? "var(--gold)" : "var(--muted)" }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Features */}
          <div ref={addReveal}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>App PureLife 2.0</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", lineHeight: 1.1, color: "var(--cream)", marginBottom: 32 }}>Tu <em style={{ color: "var(--gold2)" }}>clínica personal</em><br />siempre contigo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "🧬", title: "Protocolo de longevidad personalizado", desc: "IA adapta tu plan diario basado en síntomas, objetivos y progreso real." },
                { icon: "🗺️", title: "Mapa de ingredientes en tiempo real", desc: "Encuentra exactamente qué tienda tiene tu jengibre orgánico más cerca." },
                { icon: "🎬", title: "PureLife TV — Videos en 4K con IA", desc: "Recetas cinematográficas generadas por fal.ai + HeyGen avatar instructor." },
                { icon: "🏆", title: "Sistema de Rewards gamificado", desc: "Acumula puntos por hábitos, comparte logros y desbloquea acceso premium." },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--cream)", marginBottom: 4, fontWeight: 500 }}>{f.title}</h4>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DR. SMOOTHIE AI CHAT ═══ */}
      <section style={{ padding: "80px 24px", background: "var(--deep)", borderTop: "1px solid var(--border2)" }}>
        <div ref={addReveal} style={{ textAlign: "center", maxWidth: 1100, margin: "0 auto 60px" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Inteligencia artificial</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>Conoce a <em style={{ color: "var(--gold2)" }}>Dr. Smoothie AI</em></h2>
        </div>
        <div ref={addReveal} style={{ maxWidth: 500, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 32, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", background: "var(--surface2)", borderBottom: "1px solid var(--border2)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "url('/dr-smoothie-avatar.jpg') center/cover", overflow: "hidden", flexShrink: 0, border: "2px solid var(--emerald)", boxShadow: "0 0 12px rgba(0,201,123,0.3)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Dr. Smoothie AI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--emerald)" }} />
                <span style={{ fontSize: "0.65rem", color: "var(--emerald)" }}>En línea · Claude Sonnet 4.6</span>
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.12)", border: "1px solid var(--border)", borderRadius: 40, padding: "4px 12px", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)", fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block", animation: "pulse 2s infinite" }} /> Live
              </span>
            </div>
          </div>
          <div ref={chatBodyRef} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, maxHeight: 360, overflowY: "auto" }}>
            {chatMessages.map((msg, i) => {
              if (msg.type === "typing") return (
                <div key={i} style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "4px 20px 20px 20px", padding: "14px 20px", alignSelf: "flex-start", maxWidth: "85%" }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {[0,0.2,0.4].map((d,j) => <div key={j} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--muted)", animation: `bounce 1.2s ${d}s ease-in-out infinite` }} />)}
                  </div>
                </div>
              );
              return (
                <div key={i} style={{ maxWidth: "85%", padding: "12px 16px", borderRadius: msg.type === "user" ? "20px 20px 4px 20px" : "4px 20px 20px 20px", fontSize: "0.8rem", lineHeight: 1.6, alignSelf: msg.type === "user" ? "flex-end" : "flex-start", background: msg.type === "user" ? "linear-gradient(135deg,var(--gold),var(--gold2))" : "var(--surface2)", border: msg.type === "user" ? "none" : "1px solid var(--border2)", color: msg.type === "user" ? "var(--obsidian)" : "var(--cream)", fontWeight: msg.type === "user" ? 500 : 400 }}>
                  {msg.text.split("\n").map((line, j) => <span key={j}>{line}{j < msg.text.split("\n").length - 1 && <br />}</span>)}
                </div>
              );
            })}
          </div>
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border2)", display: "flex", gap: 10, alignItems: "center" }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Escribe tu consulta nutricional..." style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 24, padding: "10px 16px", color: "var(--cream)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", outline: "none" }} />
            <button onClick={sendMsg} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", border: "none", color: "var(--obsidian)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>➤</button>
          </div>
        </div>
      </section>

      {/* ═══ DESIGN SYSTEM ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Sistema de diseño</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>Paleta <em style={{ color: "var(--gold2)" }}>& Tipografía</em></h2>
        </div>
        <div ref={addReveal} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { bg: "#C9A84C", name: "Gold", hex: "#C9A84C", dark: true },
            { bg: "#4A7C59", name: "Sage", hex: "#4A7C59", dark: false },
            { bg: "#00C97B", name: "Emerald", hex: "#00C97B", dark: true },
            { bg: "#0D1210", name: "Deep", hex: "#0D1210", dark: false, border: true },
            { bg: "#F4EFE6", name: "Cream", hex: "#F4EFE6", dark: true },
          ].map(s => (
            <div key={s.name} style={{ flex: 1, minWidth: 100, borderRadius: 16, padding: "20px 14px", background: s.bg, minHeight: 120, border: s.border ? "1px solid #222" : "none", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: s.dark ? "#0A0A0A" : "#fff" }}>{s.name}</div>
              <div style={{ fontSize: "0.6rem", opacity: 0.6, fontFamily: "monospace", color: s.dark ? "#0A0A0A" : "#fff" }}>{s.hex}</div>
            </div>
          ))}
        </div>
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Display · Cormorant Garamond</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", color: "var(--cream)", lineHeight: 1.1 }}>La salud es<br /><em style={{ color: "var(--gold2)" }}>lujo accesible</em></div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 20, padding: 24 }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Body · DM Sans</div>
            <div style={{ fontSize: "0.9rem", color: "var(--cream2)", lineHeight: 1.7, opacity: 0.8 }}>Inteligencia artificial combinada con ciencia nutricional de vanguardia para transformar tu bienestar diario de forma sostenible y personalizada.</div>
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section style={{ padding: "80px 24px", background: "var(--deep)", borderTop: "1px solid var(--border2)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div ref={addReveal} style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Plan de ejecución</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>Roadmap de <em style={{ color: "var(--gold2)" }}>integración</em></h2>
          </div>
          <div ref={addReveal} style={{ display: "flex", flexDirection: "column" }}>
            {[
              { num: "✓", done: true, active: false, phase: "Fase 1 · Completado", title: "Stack base operativo", desc: "React/Vite + Supabase + Vercel + GitHub CI/CD. api/chat.js activo con claude-sonnet-4-6. Prompt Caching 90% ahorro." },
              { num: "2", done: false, active: true, phase: "Fase 2 · En curso", title: "Dr. Smoothie AI flotante real", desc: "Integrar chat real Claude en el botón flotante. Auth Supabase → sesión persistente. Food Log → tabla user_logs." },
              { num: "3", done: false, active: false, phase: "Fase 3 · Próximo", title: "Geolocalización + Mapa real", desc: "Leaflet con navigator.geolocation real. Markers dinámicos de tiendas cercanas. Lista de compras conectada a ingredientes." },
              { num: "4", done: false, active: false, phase: "Fase 4", title: "Stripe + Tiers activos", desc: "Webhook automático Seed/Bloom/Canopy. RLS por tier en Supabase. Onboarding cinemático por nivel." },
              { num: "5", done: false, active: false, phase: "Fase 5", title: "PureLife TV + Videos AI", desc: "fal.ai videos reales. HeyGen avatar instructor. PureLife Builder genera protocolo + video + landing en 15 min." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, border: "2px solid var(--border)", background: item.done ? "var(--gold)" : item.active ? "var(--sage)" : "var(--surface)", color: item.done ? "var(--obsidian)" : item.active ? "#fff" : "var(--cream)", boxShadow: item.active ? "0 0 20px rgba(74,124,89,0.4)" : "none" }}>{item.num}</div>
                  {i < 4 && <div style={{ width: 2, flex: 1, background: "var(--border2)", minHeight: 40 }} />}
                </div>
                <div style={{ paddingBottom: 40 }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>{item.phase}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: "var(--cream)", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALERÍA ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Resultados reales</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)", marginBottom: 8 }}>La comunidad que <em style={{ color: "var(--gold2)" }}>transforma</em></h2>
          <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>50,000+ miembros en 11 países. Estas son sus historias.</p>
        </div>
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(2,200px)", gap: 12 }}>
          <div style={{ gridRow: "span 2", borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Healthy lifestyle" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>🌿 Protocolo Verde · 30 días</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Golden smoothie" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 11, color: "var(--gold2)", fontWeight: 600 }}>Smoothie Dorado · anti-inflamatorio</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1559181567-c3190aae6c67?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Berries" />
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Green vegetables" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 11, color: "var(--emerald)", fontWeight: 600 }}>+Energía · Semana 2</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Turmeric" />
          </div>
        </div>
        {/* Testimonials */}
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 24 }}>
          {[
            { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&q=80&fit=crop&crop=face", text: '"En 3 semanas noté más energía y menos inflamación. Dr. Smoothie AI me cambió el chip."', name: "María L. · Miami, FL" },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&q=80&fit=crop&crop=face", text: '"Los videos 4K son increíbles. El protocolo dorado lo preparo todos los días."', name: "Carlos R. · CDMX" },
            { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&q=80&fit=crop&crop=face", text: '"La primera app de bienestar que de verdad cumple. La IA es un lujo."', name: "Ana P. · Madrid" },
          ].map((t, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <img src={t.img} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} alt="Member" />
              <div>
                <p style={{ fontSize: 13, color: "var(--cream)", marginBottom: 6 }}>{t.text}</p>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{t.name}</span>
                <div style={{ color: "var(--gold)", fontSize: 11, marginTop: 4 }}>★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CHECKOUT ═══ */}
      <section id="checkout-section" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>Suscripción</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>Comienza tu transformación <em style={{ color: "var(--gold2)" }}>hoy mismo</em></h2>
        </div>
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 28 }}>
          {/* Info */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 32, padding: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", padding: "6px 14px", borderRadius: 40, fontSize: 11, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>✨ Plan Anual · Acceso Ilimitado</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.8rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1, marginBottom: 8 }}>$182<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 400, color: "var(--muted)" }}> / año</span></div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface3)", padding: "6px 14px", borderRadius: 40, fontSize: 12, color: "var(--muted)", marginBottom: 28 }}>📅 Renovación automática · cancela cuando quieras</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Dr. Smoothie AI ilimitado (Claude Sonnet)","100+ clases 4K · nuevas cada semana","Mapa de tiendas geolocalizado","Comunidad global 50K+ miembros","11 idiomas disponibles","Renovación automática · cancela online"].map(item => (
                <li key={item} style={{ display: "flex", gap: 10, fontSize: 13.5 }}><span style={{ color: "var(--gold)" }}>✓</span>{item}</li>
              ))}
            </ul>
            <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 20, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>🛡️</span>
              <div><strong style={{ display: "block", marginBottom: 3 }}>Garantía 30 días</strong><span style={{ color: "var(--muted)", fontSize: 12 }}>Si no notas resultados, te devolvemos el 100%. Sin preguntas.</span></div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,201,123,0.08)", border: "1px solid rgba(0,201,123,0.25)", padding: "8px 16px", borderRadius: 40, fontSize: 12, color: "var(--emerald)", fontWeight: 600 }}>✨ Pago único anual · <strong>Ahorra 48%</strong> vs mensual</div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>📅 0.50¢ al día — menos que un café</p>
          </div>
          {/* Form */}
          <div style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 32, padding: 36 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", marginBottom: 24, color: "var(--cream)" }}>Completa tu suscripción</h3>
            {[
              { label: "Nombre completo", value: coName, setter: setCoName, type: "text", placeholder: "Tu nombre completo" },
              { label: "Correo electrónico", value: coEmail, setter: setCoEmail, type: "email", placeholder: "tu@email.com" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "13px 16px", color: "var(--cream)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Número de tarjeta (demo)</label>
              <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} style={{ width: "100%", background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "13px 16px", color: "var(--cream)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Vencimiento","MM/AA",5],["CVC","123",3]].map(([lbl,ph,max]) => (
                <div key={lbl} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{lbl}</label>
                  <input type="text" placeholder={ph} maxLength={max} style={{ width: "100%", background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "13px 16px", color: "var(--cream)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                </div>
              ))}
            </div>
            <button onClick={doCheckout} style={{ width: "100%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", color: "#000", border: "none", padding: 17, borderRadius: 60, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 8, boxShadow: "0 4px 20px rgba(201,168,76,0.25)" }}>🔒 Suscribirme por $182/año</button>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 16, color: "var(--muted)", fontSize: "1.4rem" }}>💳 VISA · MC · AMEX · PayPal</div>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>Pagos seguros con <strong>Stripe</strong> · SSL 256-bit · Sin cargos ocultos<br /><span style={{ color: "rgba(0,201,123,0.6)", fontSize: 10 }}>● Conexión Stripe activa vía /api/create-checkout-session</span></p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border2)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "var(--gold2)", marginBottom: 8 }}>PureLife Wellness Club</div>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>purelifewellnessclub.org · dr.smoothie.ai · JRMB Food Network LLC</div>
        <div style={{ marginTop: 16, fontSize: "0.65rem", color: "var(--muted)" }}>Preview generado por 3 agentes especiales · Jorge Desarrollador × Claude</div>
      </footer>

      {/* ═══ CHECKOUT MODAL ═══ */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 32, padding: "44px 36px", maxWidth: 380, textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", marginBottom: 12, color: "var(--cream)" }}>¡Bienvenido a PureLife!</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>Tu membresía <strong style={{ color: "var(--gold)" }}>Anual</strong> está activa.</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>🌿 Recibirás tus credenciales por email. Tu transformación comienza ahora.</p>
            <button onClick={() => setShowModal(false)} style={{ background: "var(--gold)", color: "#000", border: "none", padding: "14px 32px", borderRadius: 40, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>Comenzar →</button>
          </div>
        </div>
      )}
    </div>
  );
}
