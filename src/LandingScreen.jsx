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
  @keyframes orbGlow { 0%,100%{box-shadow:0 0 30px rgba(201,168,76,0.25)} 50%{box-shadow:0 0 60px rgba(201,168,76,0.5)} }
  @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes glow { 0%,100%{box-shadow:0 4px 16px rgba(201,168,76,0.25)} 50%{box-shadow:0 4px 24px rgba(201,168,76,0.5)} }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
`;

const LT = {
  en: {
    eyebrow: "The longevity clinic in your pocket",
    heroSub: "Wellness Club",
    heroDesc: "Artificial intelligence + cutting-edge nutrition science to transform your vital energy, one smoothie at a time.",
    vitality: "Vitality",
    ctaStart: "Start free",
    ctaPlans: "See plans",
    whyEyebrow: "Why PureLife",
    whyTitleA: "Science, design ", whyTitleB: "and real care.",
    card1Name: "Designed around you", card1Role: "Simple, clear, no distractions",
    card1Desc: "Every screen is built so taking care of yourself becomes a natural part of your day — no friction, no complications.",
    card1F1: "Clean, distraction-free interface", card1F2: "Available in 10 languages", card1F3: "Built for everyday use",
    card2Name: "Your information, protected", card2Role: "Real security",
    card2Desc: "Your health data and payments are protected with the same standards banks and hospitals use.",
    card2F1: "100% secure payments with Stripe", card2F2: "Your data is never shared with third parties", card2F3: "Full control over your account",
    card3Name: "Dr. Smoothie AI", card3Role: "Real artificial intelligence",
    card3Desc: "Personalized recommendations based on your body, goals and health — built on Anthropic's (Claude) AI technology, not generic rules.",
    card3F1: "Truly personalized recommendations", card3F2: "Available 24/7 for your questions", card3F3: "Gets better with every conversation",
    included: "Included",
    appEyebrow: "PureLife App 2.0", appTitleA: "Your ", appTitleB: "personal clinic", appTitleC: "always with you",
    greeting: "Good morning", greetName: "Hi, ", vitalityToday: "Today's vital energy",
    habits: "✓ 3 habits completed · 2 pending",
    quickSmoothie: "Today's smoothie", quickStores: "Nearby stores", quickTV: "PureLife TV", quickRewards: "Rewards",
    recommendedToday: "Recommended today",
    chip1: "🥬 Green Detox", chip2: "🟡 Golden Anti-inf.", chip3: "🫐 Antioxidant",
    aiFloat: "Your energy is up 12% this week! 🌟",
    navHome: "Home", navChat: "AI Chat", navPlans: "Plans", navTV: "TV", navProfile: "Profile",
    feat1T: "Personalized longevity protocol", feat1D: "AI adapts your daily plan based on symptoms, goals and real progress.",
    feat2T: "Real-time ingredient map", feat2D: "Find exactly which store has your organic ginger closest to you.",
    feat3T: "PureLife TV — 4K videos with AI", feat3D: "Cinematic recipes generated with AI, guided step by step.",
    feat4T: "Gamified Rewards system", feat4D: "Earn points for habits, share achievements and unlock premium access.",
    aiEyebrow: "Artificial intelligence", aiTitleA: "Meet ", aiTitleB: "Dr. Smoothie AI",
    online: "Online · Claude Sonnet 4.6", live: "Live",
    chatPlaceholder: "Write your nutrition question...",
    aiReplies: [
      "Great question! Based on your profile, I'd recommend adding adaptogens like ashwagandha and maca to your morning smoothie to help regulate cortisol. 🌿",
      "The combination of beet + ginger + carrot has been studied to show a 23% improvement in physical performance. Want the full protocol?",
      "To maximize nutrient absorption, try having your green smoothie 30 minutes before eating. The vitamin C in pineapple boosts iron absorption 🧬",
      "I'm seeing your vitality level at 74%. With the 7-day protocol I designed for you, we can take it to 90%+ in 2 weeks. Should we start?",
    ],
    chatWelcome: "Hi! I'm Dr. Smoothie AI 🌿 Your intelligent nutrition advisor. How are you feeling today? I can design a personalized protocol based on your symptoms and goals.",
    chatDemoUser: "I feel low on energy in the mornings, what do you recommend?",
    chatDemoAI: "I understand. Morning fatigue usually has 3 causes: low cortisol, B12/iron deficiency, or not enough hydration. 🧬\n\nI'd recommend the Morning Energy Smoothie:\n• 🥬 Fresh spinach (bioavailable iron)\n• 🍍 Pineapple (bromelain + vitamin C)\n• 🫚 Fresh ginger (boosts circulation)\n• 💧 Coconut water (electrolytes)\n\nHave it 30 min before breakfast. Want the full 7-day protocol?",
    galleryEyebrow: "Join from the start", galleryTitleA: "A community that", galleryTitleB: "is just getting started",
    gallerySub: "Early, exclusive access — be part of the first people to build this community.",
    get1: "Recommendations designed around your energy, inflammation and specific goals — not generic.",
    get2: "High-quality video classes and protocols, made to fit into your daily routine.",
    get3: "The first wellness app with AI that truly talks with you and adapts to your profile.",
    subEyebrow: "Subscription", subTitleA: "Start your transformation ", subTitleB: "today",
    planBadge: "✨ Annual Plan · Unlimited Access", perYear: " / year",
    renewal: "📅 Auto-renews · cancel anytime",
    f1: "Unlimited Dr. Smoothie AI (Claude Sonnet)", f2: "100+ 4K classes · new every week", f3: "Geolocated store map",
    f4: "Growing global community", f5: "11 languages available", f6: "Auto-renews · cancel online",
    guaranteeT: "30-day guarantee", guaranteeD: "If you don't see results, we refund you 100%. No questions asked.",
    saveNote: "✨ Single annual payment · ", saveBold: "Save 48%", saveRest: " vs monthly",
    perDay: "📅 50¢ a day — less than a coffee",
    formTitle: "Complete your subscription",
    labelName: "Full name", labelEmail: "Email address",
    phName: "Your full name", phEmail: "you@email.com",
    secureNote: "Your card details are entered on Stripe's secure page, after this step. They never pass through our servers.",
    btnRedirecting: "Redirecting to Stripe…", btnSubscribe: "🔒 Subscribe for $182/year",
    paymentMethods: "💳 VISA · MC · AMEX · PayPal",
    trustText: "Secure payments with ", trustBold: "Stripe", trustRest: " · 256-bit SSL · No hidden fees",
    errName: "Enter your full name", errEmail: "Enter a valid email",
    errGeneric: "Couldn't start payment. Try again.", errConn: "Connection error. Try again.",
    capGreen: "🌿 Green Protocol · 30 days", capGold: "Golden Smoothie · anti-inflammatory", capEnergy: "+Energy · Week 2",
  },
  es: {
    eyebrow: "La clínica de longevidad en tu bolsillo",
    heroSub: "Wellness Club",
    heroDesc: "Inteligencia artificial + ciencia nutricional para transformar tu energía vital, un smoothie a la vez.",
    vitality: "Vitalidad",
    ctaStart: "Comenzar gratis",
    ctaPlans: "Ver planes",
    whyEyebrow: "Por qué PureLife",
    whyTitleA: "Ciencia, diseño ", whyTitleB: "y cuidado real.",
    card1Name: "Diseño pensado para vos", card1Role: "Simple, claro, sin distracciones",
    card1Desc: "Cada pantalla está pensada para que cuidarte sea parte natural de tu día — sin fricción, sin complicaciones.",
    card1F1: "Interfaz clara y sin distracciones", card1F2: "Disponible en 10 idiomas", card1F3: "Pensado para usar todos los días",
    card2Name: "Tu información, protegida", card2Role: "Seguridad de verdad",
    card2Desc: "Tus datos de salud y tus pagos están protegidos con los mismos estándares que usan bancos y hospitales.",
    card2F1: "Pagos 100% seguros con Stripe", card2F2: "Tus datos nunca se comparten con terceros", card2F3: "Control total sobre tu cuenta",
    card3Name: "Dr. Smoothie AI", card3Role: "Inteligencia artificial real",
    card3Desc: "Recomendaciones personalizadas según tu cuerpo, tus objetivos y tu salud — construidas sobre la tecnología de IA de Anthropic (Claude), no reglas genéricas.",
    card3F1: "Recomendaciones realmente personalizadas", card3F2: "Disponible 24/7 para tus consultas", card3F3: "Mejora con cada conversación",
    included: "Incluido",
    appEyebrow: "App PureLife 2.0", appTitleA: "Tu ", appTitleB: "clínica personal", appTitleC: "siempre contigo",
    greeting: "Buenos días", greetName: "Hola, ", vitalityToday: "Energía vital hoy",
    habits: "✓ 3 hábitos completados · 2 pendientes",
    quickSmoothie: "Smoothie hoy", quickStores: "Tiendas cerca", quickTV: "PureLife TV", quickRewards: "Rewards",
    recommendedToday: "Recomendados hoy",
    chip1: "🥬 Verde Detox", chip2: "🟡 Dorado Anti-inf.", chip3: "🫐 Antioxidante",
    aiFloat: "¡Tu energía subió 12% esta semana! 🌟",
    navHome: "Inicio", navChat: "Chat IA", navPlans: "Planes", navTV: "TV", navProfile: "Perfil",
    feat1T: "Protocolo de longevidad personalizado", feat1D: "IA adapta tu plan diario basado en síntomas, objetivos y progreso real.",
    feat2T: "Mapa de ingredientes en tiempo real", feat2D: "Encuentra exactamente qué tienda tiene tu jengibre orgánico más cerca.",
    feat3T: "PureLife TV — Videos en 4K con IA", feat3D: "Recetas cinematográficas generadas con IA, guiadas paso a paso.",
    feat4T: "Sistema de Rewards gamificado", feat4D: "Acumula puntos por hábitos, comparte logros y desbloquea acceso premium.",
    aiEyebrow: "Inteligencia artificial", aiTitleA: "Conoce a ", aiTitleB: "Dr. Smoothie AI",
    online: "En línea · Claude Sonnet 4.6", live: "Live",
    chatPlaceholder: "Escribe tu consulta nutricional...",
    aiReplies: [
      "¡Excelente pregunta! Basado en tu perfil, te recomiendo incorporar adaptógenos como ashwagandha y maca en tu smoothie matutino para regular el cortisol. 🌿",
      "La combinación de remolacha + jengibre + zanahoria tiene estudios que muestran mejora del 23% en rendimiento físico. ¿Te genero el protocolo completo?",
      "Para maximizar la absorción de nutrientes, te sugiero consumir tu smoothie verde 30 minutos antes de comer. La vitamina C de la piña potencia la absorción del hierro 🧬",
      "Detecto que tu nivel de vitalidad está en 74%. Con el protocolo de 7 días que diseñé para ti, podemos llevarlo al 90%+ en 2 semanas. ¿Empezamos?",
    ],
    chatWelcome: "¡Hola! Soy Dr. Smoothie AI 🌿 Tu asesor nutricional inteligente. ¿Cómo te sientes hoy? Puedo diseñarte un protocolo personalizado basado en tus síntomas y objetivos.",
    chatDemoUser: "Me siento con poca energía en las mañanas, ¿qué me recomiendas?",
    chatDemoAI: "Entiendo. La fatiga matutina frecuentemente tiene 3 causas: cortisol bajo, déficit de B12/hierro o hidratación insuficiente. 🧬\n\nTe recomiendo el Smoothie Energizante Matutino:\n• 🥬 Espinaca fresca (hierro biodisponible)\n• 🍍 Piña (bromelina + vitamina C)\n• 🫚 Jengibre fresco (estimula circulación)\n• 💧 Agua de coco (electrolitos)\n\nConsumirlo 30 min antes de desayunar. ¿Quieres el protocolo completo de 7 días?",
    galleryEyebrow: "Únete desde el inicio", galleryTitleA: "Una comunidad que", galleryTitleB: "recién empieza",
    gallerySub: "Acceso anticipado y exclusivo — sé parte de los primeros en construir esta comunidad.",
    get1: "Recomendaciones diseñadas para tu energía, tu inflamación y tus objetivos específicos — no genéricas.",
    get2: "Clases y protocolos en video, en alta calidad, pensados para incorporar a tu rutina diaria.",
    get3: "La primera app de bienestar con IA que realmente conversa con vos y se adapta a tu perfil.",
    subEyebrow: "Suscripción", subTitleA: "Comienza tu transformación ", subTitleB: "hoy mismo",
    planBadge: "✨ Plan Anual · Acceso Ilimitado", perYear: " / año",
    renewal: "📅 Renovación automática · cancela cuando quieras",
    f1: "Dr. Smoothie AI ilimitado (Claude Sonnet)", f2: "100+ clases 4K · nuevas cada semana", f3: "Mapa de tiendas geolocalizado",
    f4: "Comunidad global en crecimiento", f5: "11 idiomas disponibles", f6: "Renovación automática · cancela online",
    guaranteeT: "Garantía 30 días", guaranteeD: "Si no notas resultados, te devolvemos el 100%. Sin preguntas.",
    saveNote: "✨ Pago único anual · ", saveBold: "Ahorra 48%", saveRest: " vs mensual",
    perDay: "📅 0.50¢ al día — menos que un café",
    formTitle: "Completa tu suscripción",
    labelName: "Nombre completo", labelEmail: "Correo electrónico",
    phName: "Tu nombre completo", phEmail: "tu@email.com",
    secureNote: "Los datos de tu tarjeta se ingresan en la página segura de Stripe, después de este paso. Nunca pasan por nuestros servidores.",
    btnRedirecting: "Redirigiendo a Stripe…", btnSubscribe: "🔒 Suscribirme por $182/año",
    paymentMethods: "💳 VISA · MC · AMEX · PayPal",
    trustText: "Pagos seguros con ", trustBold: "Stripe", trustRest: " · SSL 256-bit · Sin cargos ocultos",
    errName: "Ingresá tu nombre completo", errEmail: "Ingresá un correo válido",
    errGeneric: "No se pudo iniciar el pago. Intentá de nuevo.", errConn: "Error de conexión. Intentá de nuevo.",
    capGreen: "🌿 Protocolo Verde · 30 días", capGold: "Smoothie Dorado · anti-inflamatorio", capEnergy: "+Energía · Semana 2",
  },
};

export default function LandingScreen({ onStart, lang, onLangChange }) {
  const dict = LT[lang] || LT.en;
  const L = (key) => dict[key] ?? LT.en[key] ?? key;
  const [chatMessages, setChatMessages] = useState([
    { type: "ai", text: L("chatWelcome") },
    { type: "user", text: L("chatDemoUser") },
    { type: "ai", text: L("chatDemoAI") },
    { type: "typing" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [replyIdx, setReplyIdx] = useState(0);
  const chatBodyRef = useRef(null);
  const [coName, setCoName] = useState("");
  const [coEmail, setCoEmail] = useState("");
  const [coLoading, setCoLoading] = useState(false);
  const [coError, setCoError] = useState("");
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

  useEffect(() => {
    if (replyIdx === 0) {
      setChatMessages([
        { type: "ai", text: L("chatWelcome") },
        { type: "user", text: L("chatDemoUser") },
        { type: "ai", text: L("chatDemoAI") },
        { type: "typing" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
        const replies = L("aiReplies");
        return [...noT, { type: "ai", text: replies[replyIdx % replies.length] }];
      });
      setReplyIdx(i => i + 1);
    }, 1800);
    setTimeout(() => { if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; }, 100);
  };

  const doCheckout = async () => {
    if (!coName.trim()) { setCoError(L("errName")); return; }
    if (!coEmail.trim() || !coEmail.includes("@")) { setCoError(L("errEmail")); return; }
    setCoLoading(true); setCoError("");
    try {
      const res = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: coEmail, name: coName }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setCoError(data.error || L("errGeneric"));
        setCoLoading(false);
      }
    } catch {
      setCoError(L("errConn"));
      setCoLoading(false);
    }
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
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500 }}>{L("eyebrow")}</span>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>

          {/* Logo */}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 300, lineHeight: 1, letterSpacing: -2, background: "linear-gradient(135deg, var(--gold3) 0%, var(--gold) 40%, var(--sage) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 8, animation: "fadeUp 0.9s 0.1s ease both" }}>PureLife</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--muted)", fontStyle: "italic", letterSpacing: "0.05em", marginBottom: 32, animation: "fadeUp 0.9s 0.2s ease both" }}>{L("heroSub")}</div>
          <p style={{ fontSize: "0.8rem", color: "var(--cream2)", opacity: 0.7, letterSpacing: "0.05em", maxWidth: 320, margin: "0 auto 40px", lineHeight: 1.7, animation: "fadeUp 0.9s 0.3s ease both" }}>
            {L("heroDesc")}
          </p>

          {/* Vitality Ring — con anillo punteado rotando y brillo pulsante (inspirado en el diseño de Lovable) */}
          <div style={{ width: 200, height: 200, margin: "0 auto 40px", position: "relative", animation: "fadeUp 1s 0.4s ease both" }}>
            {/* Glow de fondo, pulsante */}
            <div style={{ position: "absolute", inset: -10, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.25), transparent 70%)", filter: "blur(20px)", opacity: 0.6 }} />
            {/* Contenedor con flotado suave */}
            <div style={{ position: "relative", width: "100%", height: "100%", animation: "orbFloat 5s ease-in-out infinite" }}>
              {/* Anillo punteado decorativo, rotando lento */}
              <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: -10, width: "calc(100% + 20px)", height: "calc(100% + 20px)", animation: "spin 24s linear infinite" }}>
                <circle fill="none" stroke="url(#dashGrad)" strokeWidth="1.5" strokeDasharray="6 9" opacity="0.6" cx="100" cy="100" r="94" />
                <defs>
                  <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8C76A" />
                    <stop offset="100%" stopColor="#C9A84C" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Progreso real */}
              <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)", transform: "rotate(-90deg)" }}>
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
                <div style={{ borderRadius: "50%", animation: "orbGlow 3s ease-in-out infinite" }}>
                  <img src="/purelife-logo.png" alt="PureLife" style={{ width: "76px", height: "76px", borderRadius: "50%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--gold2)", marginTop: 8 }}>74%</div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>{L("vitality")}</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 1s 0.5s ease both" }}>
            <button onClick={onStart} style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))", color: "var(--obsidian)", border: "none", padding: "14px 28px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", letterSpacing: "0.03em", boxShadow: "0 8px 32px rgba(201,168,76,0.3)" }}>
              {L("ctaStart")}
            </button>
            <button onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "var(--cream)", border: "1px solid var(--border)", padding: "14px 28px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.85rem", cursor: "pointer" }}>
              {L("ctaPlans")}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ 3 AGENT CARDS ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>{L("whyEyebrow")}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, lineHeight: 1.1, color: "var(--cream)" }}>
            {L("whyTitleA")}<em style={{ color: "var(--gold2)", fontStyle: "italic" }}>{L("whyTitleB")}</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            { icon: "🌿", name: L("card1Name"), role: L("card1Role"), desc: L("card1Desc"), feats: [L("card1F1"), L("card1F2"), L("card1F3")], glowColor: "var(--gold)", iconBg: "rgba(201,168,76,0.1)", iconBorder: "rgba(201,168,76,0.2)", badgeColor: "var(--gold2)", badgeBg: "rgba(201,168,76,0.12)" },
            { icon: "🔒", name: L("card2Name"), role: L("card2Role"), desc: L("card2Desc"), feats: [L("card2F1"), L("card2F2"), L("card2F3")], glowColor: "var(--sage)", iconBg: "rgba(74,124,89,0.1)", iconBorder: "rgba(74,124,89,0.2)", badgeColor: "var(--sage)", badgeBg: "rgba(74,124,89,0.12)" },
            { icon: "🧠", name: L("card3Name"), role: L("card3Role"), desc: L("card3Desc"), feats: [L("card3F1"), L("card3F2"), L("card3F3")], glowColor: "var(--emerald)", iconBg: "rgba(0,201,123,0.1)", iconBorder: "rgba(0,201,123,0.2)", badgeColor: "var(--emerald)", badgeBg: "rgba(0,201,123,0.12)" },
          ].map((card, i) => (
            <div key={i} ref={addReveal} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 28, padding: 32, position: "relative", overflow: "hidden", transition: "all 0.4s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border2)"; }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top left, ${card.glowColor}, transparent 60%)`, opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ width: 56, height: 56, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: 20, background: card.iconBg, border: `1px solid ${card.iconBorder}` }}>{card.icon}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: card.badgeBg, border: `1px solid ${card.iconBorder}`, borderRadius: 40, padding: "4px 12px", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: card.badgeColor, fontWeight: 600, marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block", animation: "pulse 2s infinite" }} /> {L("included")}
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
                      <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{L("greeting")}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--cream)" }}>{L("greetName")}<span style={{ color: "var(--gold2)" }}>Jorge</span> 🌿</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--sage))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>J</div>
                  </div>
                  {/* Vitality card */}
                  <div style={{ background: "linear-gradient(135deg,var(--surface2),var(--surface3))", border: "1px solid var(--border)", borderRadius: 20, padding: 16, marginBottom: 12, position: "relative", overflow: "hidden" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>{L("vitalityToday")}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--gold2)", lineHeight: 1 }}>74<span style={{ fontSize: "1rem", color: "var(--muted)" }}>%</span></div>
                    <div style={{ fontSize: "0.6rem", color: "var(--cream2)", opacity: 0.6, marginTop: 4 }}>{L("habits")}</div>
                    <div style={{ background: "#1e1e1e", borderRadius: 10, height: 4, marginTop: 10 }}>
                      <div style={{ height: 4, borderRadius: 10, background: "linear-gradient(90deg,var(--gold),var(--emerald))", width: "74%" }} />
                    </div>
                  </div>
                  {/* Quick grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                    {[["🥤",L("quickSmoothie")],["📍",L("quickStores")],["🎬",L("quickTV")],["🏆",L("quickRewards")]].map(([ico,lbl]) => (
                      <div key={lbl} style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 16, padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{ico}</div>
                        <div style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                  {/* Smoothie chips */}
                  <div style={{ marginBottom: 10, fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{L("recommendedToday")}</div>
                  <div style={{ display: "flex", gap: 8, overflow: "hidden" }}>
                    {[L("chip1"),L("chip2"),L("chip3")].map(c => (
                      <div key={c} style={{ background: "var(--surface3)", border: "1px solid var(--border2)", borderRadius: 20, padding: "6px 10px", fontSize: "0.6rem", whiteSpace: "nowrap", color: "var(--cream2)" }}>{c}</div>
                    ))}
                  </div>
                </div>
                {/* AI Float */}
                <div style={{ position: "absolute", bottom: 90, right: 12, zIndex: 10 }}>
                  <div style={{ background: "linear-gradient(135deg,var(--gold),var(--gold2))", color: "var(--obsidian)", padding: "8px 12px", borderRadius: "16px 16px 4px 16px", fontSize: "0.6rem", fontWeight: 600, maxWidth: 140, marginBottom: 6, boxShadow: "0 4px 16px rgba(201,168,76,0.3)", lineHeight: 1.4 }}>{L("aiFloat")}</div>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", animation: "glow 3s ease-in-out infinite", cursor: "pointer", overflow: "hidden", padding: 2 }}><img src="/purelife-logo.png" alt="PureLife" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /></div>
                </div>
                {/* Bottom nav */}
                <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 8px 16px", background: "rgba(17,24,21,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border2)", position: "absolute", bottom: 16, left: 16, right: 16, borderRadius: "0 0 36px 36px" }}>
                  {[["🏠",L("navHome"),true],["💬",L("navChat"),false],["🌱",L("navPlans"),false],["🎬",L("navTV"),false],["👤",L("navProfile"),false]].map(([ico,lbl,active]) => (
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
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>{L("appEyebrow")}</span>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", lineHeight: 1.1, color: "var(--cream)", marginBottom: 32 }}>{L("appTitleA")}<em style={{ color: "var(--gold2)" }}>{L("appTitleB")}</em><br />{L("appTitleC")}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "🧬", title: L("feat1T"), desc: L("feat1D") },
                { icon: "🗺️", title: L("feat2T"), desc: L("feat2D") },
                { icon: "🎬", title: L("feat3T"), desc: L("feat3D") },
                { icon: "🏆", title: L("feat4T"), desc: L("feat4D") },
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
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>{L("aiEyebrow")}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>{L("aiTitleA")}<em style={{ color: "var(--gold2)" }}>{L("aiTitleB")}</em></h2>
        </div>
        <div ref={addReveal} style={{ maxWidth: 500, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 32, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", background: "var(--surface2)", borderBottom: "1px solid var(--border2)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "url('/dr-smoothie-avatar.jpg') center/cover", overflow: "hidden", flexShrink: 0, border: "2px solid var(--emerald)", boxShadow: "0 0 12px rgba(0,201,123,0.3)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Dr. Smoothie AI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--emerald)" }} />
                <span style={{ fontSize: "0.65rem", color: "var(--emerald)" }}>{L("online")}</span>
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.12)", border: "1px solid var(--border)", borderRadius: 40, padding: "4px 12px", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold2)", fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block", animation: "pulse 2s infinite" }} /> {L("live")}
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
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder={L("chatPlaceholder")} style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 24, padding: "10px 16px", color: "var(--cream)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", outline: "none" }} />
            <button onClick={sendMsg} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", border: "none", color: "var(--obsidian)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>➤</button>
          </div>
        </div>
      </section>

      {/* ═══ GALERÍA ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>{L("galleryEyebrow")}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)", marginBottom: 8 }}>{L("galleryTitleA")} <em style={{ color: "var(--gold2)" }}>{L("galleryTitleB")}</em></h2>
          <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>{L("gallerySub")}</p>
        </div>
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(2,200px)", gap: 12 }}>
          <div style={{ gridRow: "span 2", borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Healthy lifestyle" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{L("capGreen")}</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Golden smoothie" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 11, color: "var(--gold2)", fontWeight: 600 }}>{L("capGold")}</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1559181567-c3190aae6c67?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Berries" />
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative" }}>
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Green vegetables" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(transparent,rgba(0,0,0,0.7))" }}>
              <span style={{ fontSize: 11, color: "var(--emerald)", fontWeight: 600 }}>{L("capEnergy")}</span>
            </div>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&q=80&fit=crop" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Turmeric" />
          </div>
        </div>
        {/* What you get */}
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginTop: 24 }}>
          {[
            { icon: "⚡", text: L("get1") },
            { icon: "🎥", text: L("get2") },
            { icon: "🌿", text: L("get3") },
          ].map((t, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.6rem", flexShrink: 0 }}>{t.icon}</div>
              <div>
                <p style={{ fontSize: 13, color: "var(--cream)", margin: 0 }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CHECKOUT ═══ */}
      <section id="checkout-section" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div ref={addReveal} style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 12 }}>{L("subEyebrow")}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: "var(--cream)" }}>{L("subTitleA")}<em style={{ color: "var(--gold2)" }}>{L("subTitleB")}</em></h2>
        </div>
        <div ref={addReveal} style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 28 }}>
          {/* Info */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 32, padding: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", padding: "6px 14px", borderRadius: 40, fontSize: 11, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>{L("planBadge")}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.8rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1, marginBottom: 8 }}>$182<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 400, color: "var(--muted)" }}>{L("perYear")}</span></div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--surface3)", padding: "6px 14px", borderRadius: 40, fontSize: 12, color: "var(--muted)", marginBottom: 28 }}>{L("renewal")}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[L("f1"),L("f2"),L("f3"),L("f4"),L("f5"),L("f6")].map(item => (
                <li key={item} style={{ display: "flex", gap: 10, fontSize: 13.5 }}><span style={{ color: "var(--gold)" }}>✓</span>{item}</li>
              ))}
            </ul>
            <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)", borderRadius: 20, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>🛡️</span>
              <div><strong style={{ display: "block", marginBottom: 3 }}>{L("guaranteeT")}</strong><span style={{ color: "var(--muted)", fontSize: 12 }}>{L("guaranteeD")}</span></div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,201,123,0.08)", border: "1px solid rgba(0,201,123,0.25)", padding: "8px 16px", borderRadius: 40, fontSize: 12, color: "var(--emerald)", fontWeight: 600 }}>{L("saveNote")}<strong>{L("saveBold")}</strong>{L("saveRest")}</div>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>{L("perDay")}</p>
          </div>
          {/* Form */}
          <div style={{ background: "var(--surface)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 32, padding: 36 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", marginBottom: 24, color: "var(--cream)" }}>{L("formTitle")}</h3>
            {[
              { label: L("labelName"), value: coName, setter: setCoName, type: "text", placeholder: L("phName") },
              { label: L("labelEmail"), value: coEmail, setter: setCoEmail, type: "email", placeholder: L("phEmail") },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "var(--surface2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "13px 16px", color: "var(--cream)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,201,123,0.06)", border: "1px solid rgba(0,201,123,0.2)", borderRadius: 16, padding: "13px 16px" }}>
              <span style={{ fontSize: "1.2rem" }}>🔒</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{L("secureNote")}</span>
            </div>
            {coError && (
              <p style={{ color: "#FF6B6B", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{coError}</p>
            )}
            <button onClick={doCheckout} disabled={coLoading} style={{ width: "100%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", color: "#000", border: "none", padding: 17, borderRadius: 60, fontWeight: 800, fontSize: 15, cursor: coLoading ? "default" : "pointer", marginTop: 8, boxShadow: "0 4px 20px rgba(201,168,76,0.25)", opacity: coLoading ? 0.7 : 1 }}>{coLoading ? L("btnRedirecting") : L("btnSubscribe")}</button>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 16, color: "var(--muted)", fontSize: "1.4rem" }}>{L("paymentMethods")}</div>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>{L("trustText")}<strong>{L("trustBold")}</strong>{L("trustRest")}<br /><span style={{ color: "rgba(0,201,123,0.6)", fontSize: 10 }}>● Stripe connection active via /api/stripe-checkout</span></p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border2)", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "var(--gold2)", marginBottom: 8 }}>PureLife Wellness Club</div>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em" }}>purelifewellnessclub.org · dr.smoothie.ai · JRMB Food Network LLC</div>
      </footer>
    </div>
  );
}
