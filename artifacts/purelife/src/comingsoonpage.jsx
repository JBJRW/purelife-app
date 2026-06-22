// ═══════════════════════════════════════════════════════════
// PureLife — EPIC SPLASH LANDING v5.0
// 3D effects · Logo · Dr. Smoothie · Language flags · Particles
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import { LANGUAGES } from "./i18n";
import WellnessDiagnostic from "./components/WellnessDiagnostic";

// ── Assets ───────────────────────────────────────────────
const LOGO_SRC      = "/purelife-logo-3d.png";
const DR_SMOOTHIE   = "/dr-smoothie-hero.jpg";

// ── Brand tokens ─────────────────────────────────────────
const C = {
  bg:       "#060D08",
  green:    "#1A5C3A",
  greenL:   "#2D8653",
  gold:     "#C9973A",
  goldL:    "#E8B84B",
  cream:    "#F5F0E8",
  muted:    "rgba(245,240,232,0.6)",
  dim:      "rgba(245,240,232,0.18)",
  glass:    "rgba(10,30,18,0.72)",
  glassBorder: "rgba(201,151,58,0.28)",
};

// ── Translations (minimal — just entry screen) ────────────
const T = {
  en: { tagline: "THE LONGEVITY CLINIC IN YOUR POCKET", sub: "AI + Nutritional Science to transform your vital energy", cta: "START YOUR JOURNEY", lang: "Choose your language" },
  es: { tagline: "LA CLÍNICA DE LONGEVIDAD EN TU BOLSILLO", sub: "IA + Ciencia nutricional para transformar tu energía vital", cta: "INICIA TU VIAJE", lang: "Elige tu idioma" },
  fr: { tagline: "LA CLINIQUE DE LONGÉVITÉ DANS VOTRE POCHE", sub: "IA + Science nutritionnelle pour transformer votre énergie", cta: "COMMENCEZ", lang: "Choisissez votre langue" },
  pt: { tagline: "A CLÍNICA DE LONGEVIDADE NO SEU BOLSO", sub: "IA + Ciência nutricional para transformar sua energia vital", cta: "INICIE SUA JORNADA", lang: "Escolha seu idioma" },
  de: { tagline: "DIE LANGLEBIGKEITSKLINIK IN IHRER TASCHE", sub: "KI + Ernährungswissenschaft für mehr Vitalität", cta: "STARTEN SIE JETZT", lang: "Sprache wählen" },
  it: { tagline: "LA CLINICA DELLA LONGEVITÀ IN TASCA", sub: "IA + Scienza nutrizionale per trasformare la tua energia", cta: "INIZIA IL TUO VIAGGIO", lang: "Scegli la lingua" },
  zh: { tagline: "您口袋里的长寿诊所", sub: "人工智能 + 营养科学改变您的生命活力", cta: "开始您的旅程", lang: "选择语言" },
  ja: { tagline: "あなたのポケットの中の長寿クリニック", sub: "AI+栄養科学で活力を変える", cta: "旅を始める", lang: "言語を選択" },
  ko: { tagline: "주머니 속 장수 클리닉", sub: "AI + 영양 과학으로 활력 변환", cta: "여정 시작하기", lang: "언어 선택" },
  ar: { tagline: "عيادة طول العمر في جيبك", sub: "الذكاء الاصطناعي + العلوم الغذائية لتحويل طاقتك الحيوية", cta: "ابدأ رحلتك", lang: "اختر لغتك" },
  hi: { tagline: "आपकी जेब में दीर्घायु क्लिनिक", sub: "AI + पोषण विज्ञान आपकी जीवन शक्ति को बदलने के लिए", cta: "अपनी यात्रा शुरू करें", lang: "भाषा चुनें" },
  ru: { tagline: "КЛИНИКА ДОЛГОЛЕТИЯ В ВАШЕМ КАРМАНЕ", sub: "ИИ + наука о питании для трансформации вашей энергии", cta: "НАЧАТЬ ПУТЕШЕСТВИЕ", lang: "Выберите язык" },
  tr: { tagline: "CEBİNİZDEKİ UZUN ÖMÜR KLİNİĞİ", sub: "Yapay zeka + beslenme bilimi ile hayat enerjinizi dönüştürün", cta: "YOLCULUĞA BAŞLA", lang: "Dil seçin" },
  nl: { tagline: "DE LEVENSDUURKLINIEK IN UW ZAK", sub: "AI + voedingswetenschap om uw vitale energie te transformeren", cta: "BEGIN UW REIS", lang: "Kies uw taal" },
  pl: { tagline: "KLINIKA DŁUGOWIECZNOŚCI W TWOJEJ KIESZENI", sub: "AI + nauka o żywieniu dla transformacji Twojej energii", cta: "ROZPOCZNIJ PODRÓŻ", lang: "Wybierz język" },
};

// ── Global CSS ────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,200;0,400;0,700;1,200&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes star-twinkle {
    0%, 100% { opacity: 0.15; }
    50%       { opacity: 0.7; }
  }
  @keyframes network-pulse {
    0%,100% { opacity: 0.12; stroke-dashoffset: 0; }
    50%     { opacity: 0.35; stroke-dashoffset: -40; }
  }
  @keyframes logo-float {
    0%,100% { transform: perspective(800px) rotateY(-4deg) rotateX(3deg) translateY(0px); filter: drop-shadow(0 0 24px rgba(201,151,58,0.55)); }
    33%     { transform: perspective(800px) rotateY(4deg)  rotateX(-2deg) translateY(-10px); filter: drop-shadow(0 0 40px rgba(201,151,58,0.8)); }
    66%     { transform: perspective(800px) rotateY(-2deg) rotateX(5deg)  translateY(-5px); filter: drop-shadow(0 0 30px rgba(201,151,58,0.65)); }
  }
  @keyframes logo-glow-ring {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,151,58,0), 0 0 60px rgba(201,151,58,0.2), inset 0 0 40px rgba(26,92,58,0.3); }
    50%     { box-shadow: 0 0 0 20px rgba(201,151,58,0.08), 0 0 100px rgba(201,151,58,0.45), inset 0 0 60px rgba(26,92,58,0.5); }
  }
  @keyframes smoothie-enter {
    from { opacity: 0; transform: translateX(60px) scale(0.8) rotateY(-20deg); }
    to   { opacity: 1; transform: translateX(0)   scale(1)   rotateY(0deg); }
  }
  @keyframes smoothie-bob {
    0%,100% { transform: translateY(0px) rotate(-1deg); }
    50%     { transform: translateY(-12px) rotate(1deg); }
  }
  @keyframes cta-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(201,151,58,0.4), 0 8px 32px rgba(201,151,58,0.25); }
    50%     { box-shadow: 0 0 0 12px rgba(201,151,58,0), 0 12px 48px rgba(201,151,58,0.5); }
  }
  @keyframes cta-shimmer {
    0%   { background-position: -300px 0; }
    100% { background-position: 300px 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px) scaleY(0.95); }
    to   { opacity: 1; transform: translateY(0) scaleY(1); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes border-flow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes scanner {
    0%   { top: 0%; opacity: 0.8; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes orb-float-1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(30px,-20px) scale(1.08); }
  }
  @keyframes orb-float-2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50%     { transform: translate(-20px,30px) scale(0.92); }
  }
  @keyframes lang-in {
    from { opacity: 0; transform: translateY(12px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes node-pulse {
    0%,100% { opacity: 0.4; }
    50%     { opacity: 1; }
  }

  .splash-root {
    position: fixed; inset: 0;
    background: radial-gradient(ellipse 120% 80% at 30% 20%, rgba(26,92,58,0.28) 0%, transparent 60%),
                radial-gradient(ellipse 80% 60% at 80% 80%, rgba(201,151,58,0.12) 0%, transparent 55%),
                #060D08;
    overflow: hidden; font-family: 'DM Sans', sans-serif;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .orb-1 {
    position: absolute; width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(26,92,58,0.09) 0%, transparent 65%);
    top: -200px; left: -150px; pointer-events: none;
    animation: orb-float-1 10s ease-in-out infinite;
    filter: blur(40px);
  }
  .orb-2 {
    position: absolute; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,151,58,0.07) 0%, transparent 65%);
    bottom: -150px; right: -150px; pointer-events: none;
    animation: orb-float-2 12s ease-in-out infinite;
    filter: blur(50px);
  }

  .network-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

  .logo-wrapper {
    position: relative; cursor: pointer;
    animation: logo-float 6s ease-in-out infinite;
    transform-style: preserve-3d;
  }
  .logo-img {
    width: clamp(160px, 22vw, 240px);
    height: clamp(160px, 22vw, 240px);
    object-fit: contain; display: block;
    border-radius: 50%;
    animation: logo-glow-ring 3s ease-in-out infinite;
  }
  .logo-ring {
    position: absolute; inset: -8px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, rgba(201,151,58,0.8) 0%, rgba(26,92,58,0.4) 40%, rgba(201,151,58,0.6) 80%) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    background-size: 200% 200%;
    animation: border-flow 4s ease infinite;
  }
  .scanner-line {
    position: absolute; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,151,58,0.8), transparent);
    animation: scanner 3s ease-in-out infinite;
    border-radius: 50%;
    overflow: hidden;
    pointer-events: none;
  }

  .dr-wrapper {
    animation: smoothie-enter 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.4s both;
  }
  .dr-img {
    animation: smoothie-bob 4s ease-in-out 1.2s infinite;
    width: clamp(120px, 16vw, 180px);
    object-fit: contain; display: block;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(45,134,83,0.3));
    border-radius: 20px;
  }

  .cta-btn {
    position: relative; overflow: hidden;
    border: none; cursor: pointer;
    padding: 18px 48px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 2vw, 16px);
    font-weight: 700; letter-spacing: 0.12em;
    color: #060D08;
    background: linear-gradient(135deg, #E8B84B 0%, #C9973A 50%, #E8B84B 100%);
    background-size: 200% auto;
    animation: cta-pulse 2.5s ease-in-out infinite, cta-shimmer 3s linear infinite;
    transition: transform 0.2s ease, filter 0.2s ease;
  }
  .cta-btn:hover { transform: scale(1.06); filter: brightness(1.1); }
  .cta-btn:active { transform: scale(0.97); }
  .cta-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
    background-size: 300px 100%;
    animation: cta-shimmer 2s linear infinite;
  }

  .lang-grid {
    display: flex; flex-wrap: wrap; gap: 8px;
    justify-content: center; max-width: 520px;
  }
  .lang-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 50px;
    cursor: pointer; border: none; outline: none;
    background: rgba(245,240,232,0.06);
    border: 1px solid rgba(201,151,58,0.15);
    color: rgba(245,240,232,0.7);
    font-size: 12px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
    animation: lang-in 0.4s ease both;
  }
  .lang-pill:hover {
    background: rgba(201,151,58,0.15);
    border-color: rgba(201,151,58,0.5);
    color: #E8B84B;
    transform: translateY(-2px) scale(1.05);
  }
  .lang-pill.active {
    background: linear-gradient(135deg, rgba(201,151,58,0.25), rgba(26,92,58,0.25));
    border-color: rgba(201,151,58,0.7);
    color: #E8B84B;
    box-shadow: 0 4px 16px rgba(201,151,58,0.2);
  }

  .lang-panel {
    position: absolute; inset: 0;
    background: rgba(6,13,8,0.95);
    backdrop-filter: blur(20px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 24px; z-index: 10; padding: 32px;
    animation: slideDown 0.3s ease;
  }

  .globe-btn {
    position: fixed; top: 20px; right: 20px; z-index: 20;
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(10,30,18,0.8);
    border: 1px solid rgba(201,151,58,0.4);
    cursor: pointer; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .globe-btn:hover {
    background: rgba(201,151,58,0.2);
    border-color: rgba(201,151,58,0.8);
    transform: scale(1.08);
  }

  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 50px;
    background: rgba(45,134,83,0.15);
    border: 1px solid rgba(45,134,83,0.35);
    color: #2D8653; font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  }
  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #2D8653;
    animation: cta-pulse 2s ease-in-out infinite;
  }

  .star {
    position: absolute; border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    .hero-row { flex-direction: column !important; gap: 20px !important; }
    .dr-img { width: 100px !important; }
  }
`;

// ── Starfield (simple static twinkle, no CSS variables) ──
const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 137.508;
  return {
    id: i,
    x: (seed * 0.7) % 100,
    y: (seed * 0.5) % 100,
    size: (i % 3) + 1,
    dur: 2 + (i % 5),
    delay: i * 0.18,
    color: i % 4 === 0 ? "#C9973A" : i % 7 === 0 ? "#2D8653" : "#F5F0E8",
  };
});

function Particles() {
  return (
    <>
      {STARS.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.x + "%",
            top: s.y + "%",
            width: s.size + "px",
            height: s.size + "px",
            background: s.color,
            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
            opacity: 0.2,
            animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

// ── SVG Network ───────────────────────────────────────────
function NetworkSVG() {
  const nodes = [
    [12,8],[30,15],[55,5],[80,12],[95,25],
    [8,40],[25,50],[48,35],[70,45],[90,50],
    [15,70],[40,65],[60,75],[82,68],[95,75],
    [5,88],[28,85],[50,92],[72,88],[95,92],
  ];
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,9],
    [10,11],[11,12],[12,13],[13,14],[15,16],[16,17],[17,18],[18,19],
    [0,5],[1,6],[2,7],[3,8],[4,9],[5,10],[6,11],[7,12],[8,13],[9,14],
    [10,15],[11,16],[12,17],[13,18],[14,19],[1,7],[6,12],[7,13],[11,17],
  ];

  return (
    <svg className="network-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9973A" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#2D8653" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9973A" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="url(#lineGrad)"
          strokeWidth="0.15"
          strokeDasharray="4 2"
          style={{
            animation: `network-pulse ${3 + (i % 4)}s ease-in-out ${(i * 0.15) % 3}s infinite`,
          }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r="0.4"
          fill={i % 3 === 0 ? "#C9973A" : "#2D8653"}
          style={{
            animation: `node-pulse ${2 + (i % 3)}s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────
export default function ComingSoonPage({ onEnterApp, lang = "en", onLangChange }) {
  const [showDiag, setShowDiag]     = useState(false);
  const [showLang, setShowLang]     = useState(false);
  const [entered,  setEntered]      = useState(false);

  const t = T[lang] || T.en;
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => setShowDiag(true), 400);
  };

  const handleLangSelect = (code) => {
    onLangChange?.(code);
    setShowLang(false);
  };

  if (showDiag) {
    return (
      <div style={{ background: "#060D08", minHeight: "100vh" }}>
        <WellnessDiagnostic onComplete={onEnterApp} lang={lang} />
      </div>
    );
  }

  return (
    <div
      className="splash-root"
      style={{
        opacity: entered ? 0 : 1,
        transform: entered ? "scale(1.05)" : "scale(1)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      <style>{CSS}</style>

      {/* Ambient gradient accents (CSS only, no DOM blobs) */}

      {/* Network background */}
      <NetworkSVG />

      {/* Floating particles */}
      <Particles />

      {/* Globe / Language selector button */}
      <button className="globe-btn" onClick={() => setShowLang(true)} title="Select Language">
        {currentLang.flag}
      </button>

      {/* Language overlay */}
      {showLang && (
        <div className="lang-panel">
          <button
            onClick={() => setShowLang(false)}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "none", border: "1px solid rgba(201,151,58,0.4)",
              color: C.cream, width: 36, height: 36, borderRadius: "50%",
              cursor: "pointer", fontSize: 18, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >×</button>

          <div style={{ color: C.goldL, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textAlign: "center" }}>
            🌍 {t.lang}
          </div>

          <div className="lang-grid">
            {LANGUAGES.map((l, i) => (
              <button
                key={l.code}
                className={`lang-pill ${l.code === lang ? "active" : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() => handleLangSelect(l.code)}
              >
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 0,
        padding: "20px 24px",
        width: "100%", maxWidth: 860,
        minHeight: "100vh", justifyContent: "center",
      }}>

        {/* Live badge */}
        <div style={{ animation: "fadeUp 0.5s ease 0.1s both", marginBottom: 20 }}>
          <div className="badge">
            <div className="badge-dot" />
            <span>AI POWERED WELLNESS · 2026</span>
          </div>
        </div>

        {/* Hero row: Logo + text + Dr. Smoothie */}
        <div
          className="hero-row"
          style={{
            display: "flex", alignItems: "center",
            gap: 40, width: "100%", justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* 3D Logo */}
          <div style={{ animation: "fadeUp 0.6s ease 0.2s both", flexShrink: 0 }}>
            <div className="logo-wrapper">
              <img src={LOGO_SRC} alt="PureLife" className="logo-img" />
              <div className="logo-ring" />
              <div className="scanner-line" style={{ clipPath: "circle(50%)" }} />
            </div>
          </div>

          {/* Center text */}
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 12, flex: "1 1 280px",
            animation: "fadeUp 0.6s ease 0.3s both",
            textAlign: "center",
          }}>
            {/* Brand name */}
            <div style={{ lineHeight: 1 }}>
              <div style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(48px, 9vw, 88px)",
                fontWeight: 700, color: C.cream,
                letterSpacing: "-0.02em",
                textShadow: "0 0 60px rgba(201,151,58,0.3)",
              }}>
                Pure<span style={{ color: C.goldL }}>Life</span>
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(11px, 1.8vw, 14px)",
                letterSpacing: "0.3em", color: C.muted,
                textTransform: "uppercase", marginTop: 4,
              }}>
                Wellness Club
              </div>
            </div>

            {/* Gold divider */}
            <div style={{
              width: 80, height: 1,
              background: "linear-gradient(90deg, transparent, #C9973A, transparent)",
            }} />

            {/* Tagline */}
            <div style={{
              fontSize: "clamp(10px, 1.6vw, 13px)",
              fontWeight: 600, letterSpacing: "0.18em",
              color: C.gold, textTransform: "uppercase",
              maxWidth: 320,
            }}>
              {t.tagline}
            </div>

            {/* Subtitle */}
            <div style={{
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: C.muted, lineHeight: 1.6,
              maxWidth: 340, fontWeight: 400,
            }}>
              {t.sub}
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
              {["🧠 AI Nutrition", "🌿 Recipes", "📍 Locator", "🎬 Video"].map((f, i) => (
                <div key={i} style={{
                  padding: "5px 12px", borderRadius: 50,
                  background: "rgba(245,240,232,0.06)",
                  border: "1px solid rgba(201,151,58,0.2)",
                  color: C.muted, fontSize: 11, fontWeight: 500,
                  animation: `fadeUp 0.5s ease ${0.5 + i * 0.08}s both`,
                }}>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Dr. Smoothie AI */}
          <div className="dr-wrapper" style={{ flexShrink: 0, position: "relative" }}>
            <div style={{
              position: "absolute", inset: -12,
              background: "radial-gradient(circle, rgba(45,134,83,0.15) 0%, transparent 70%)",
              borderRadius: "24px",
            }} />
            <img src={DR_SMOOTHIE} alt="Dr. Smoothie AI" className="dr-img" />
            <div style={{
              position: "absolute", bottom: -8, left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, rgba(10,30,18,0.95), rgba(26,92,58,0.8))",
              border: "1px solid rgba(201,151,58,0.4)",
              borderRadius: 50, padding: "5px 14px",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
              color: C.goldL, whiteSpace: "nowrap",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}>
              DR. SMOOTHIE AI ✨
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 36, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 16,
          animation: "fadeUp 0.6s ease 0.6s both",
        }}>
          <button className="cta-btn" onClick={handleEnter}>
            ▶ {t.cta}
          </button>

          <div style={{
            fontSize: 11, color: C.dim, letterSpacing: "0.08em",
          }}>
            {currentLang.flag} {currentLang.label} · No credit card required
          </div>
        </div>

        {/* Language strip at bottom */}
        <div style={{
          marginTop: 32, width: "100%",
          animation: "fadeUp 0.6s ease 0.8s both",
        }}>
          <div style={{
            textAlign: "center", fontSize: 10,
            color: "rgba(245,240,232,0.3)", letterSpacing: "0.15em",
            textTransform: "uppercase", marginBottom: 12,
          }}>
            {t.lang}
          </div>
          <div className="lang-grid" style={{ maxWidth: 640, margin: "0 auto" }}>
            {LANGUAGES.map((l, i) => (
              <button
                key={l.code}
                className={`lang-pill ${l.code === lang ? "active" : ""}`}
                style={{ animationDelay: `${0.8 + i * 0.03}s` }}
                onClick={() => handleLangSelect(l.code)}
                title={l.name}
              >
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                <span style={{ fontSize: 11 }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom watermark */}
        <div style={{
          marginTop: 24,
          display: "flex", alignItems: "center", gap: 8,
          opacity: 0.3, fontSize: 10, color: C.cream,
          letterSpacing: "0.15em",
          animation: "fadeUp 0.5s ease 1s both",
        }}>
          <div style={{
            width: 16, height: 16,
            background: "linear-gradient(135deg, #1A5C3A, #2D8653)",
            borderRadius: "50%",
          }} />
          dr.smoothie.ai · Powered by Claude AI
        </div>
      </div>
    </div>
  );
}
