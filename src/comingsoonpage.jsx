// ═══════════════════════════════════════════════════════════
// PureLife — Coming Soon Page v4.0
// Multilenguaje real-time + Founding Members Counter
// src/comingsoonpage.jsx
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { useLanguage } from "./context/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";
import { t } from "./i18n";

const COLORS = {
  dark:   "#060D08",
  green:  "#1A5C3A",
  gold:   "#C9973A",
  goldL:  "#E8B84B",
  cream:  "#F5F0E8",
  muted:  "rgba(245,240,232,0.55)",
  dim:    "rgba(245,240,232,0.2)",
  borderGold: "rgba(201,151,58,0.35)",
};

const MOTION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');

  @media (prefers-reduced-motion: reduce) {
    .pl-enter, .pl-float, .pl-pulse, .pl-bar-fill { animation: none !important; }
    .pl-btn { transition: none !important; }
  }

  @keyframes pl-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pl-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes pl-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26,92,58,0); }
    50%       { box-shadow: 0 0 0 10px rgba(26,92,58,0.2); }
  }
  @keyframes pl-bar {
    from { width: 0%; }
    to   { width: var(--bar-w); }
  }
  @keyframes pl-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pl-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .pl-enter { animation: pl-fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pl-d1    { animation-delay: 80ms; }
  .pl-d2    { animation-delay: 160ms; }
  .pl-d3    { animation-delay: 240ms; }
  .pl-d4    { animation-delay: 320ms; }
  .pl-d5    { animation-delay: 400ms; }
  .pl-float { animation: pl-float 3.2s ease-in-out infinite; }
  .pl-pulse { animation: pl-pulse 2s ease infinite; }
  .pl-bar-fill { animation: pl-bar 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }

  .pl-btn {
    transition: transform 180ms cubic-bezier(0.34,1.56,0.64,1),
                opacity 180ms ease, box-shadow 180ms ease;
  }
  .pl-btn:hover  { transform: translateY(-1px); }
  .pl-btn:active { transform: scale(0.96); }

  .pl-input { transition: border-color 150ms ease, box-shadow 150ms ease; }
  .pl-input:focus {
    border-color: rgba(201,151,58,0.75) !important;
    box-shadow: 0 0 0 3px rgba(201,151,58,0.2);
    outline: none;
  }
  .pl-counter-shimmer {
    background: linear-gradient(90deg,
      transparent 0%, rgba(201,151,58,0.15) 50%, transparent 100%);
    background-size: 400px 100%;
    animation: pl-shimmer 2.5s ease infinite;
  }
  .pl-globe:hover { animation: pl-spin 1s linear; }
`;

// Traducciones adicionales para el ComingSoon no cubiertas por T
const CS = {
  en: {
    headline1: "Your body responds",
    headline2: "to what you give it.",
    sub: "Visible results in 21 days — or your money back.",
    founding: "Founding Members",
    slotsLeft: (n) => `${n} free spots left`,
    spotsUrgent: (n) => `⚡ Only ${n} free spots left. Then $182/year.`,
    slotsFull: "🔴 Free spots are full",
    slotsNormal: (n) => `First 100 members join FREE. ${n} spots remaining.`,
    slotsFullMsg: "The 100 free founding spots are gone. Join the annual plan for $182/year.",
    counterLabel: (total) => `${total} / 100 spots taken`,
    ctaFree: "Claim my free spot →",
    ctaPaid: "Join for $182/year →",
    loading: "Saving your spot...",
    successTitle: (pos) => `You're Founding Member #${pos}!`,
    successMsg: (rem) => `Free access confirmed. ${rem} spots remaining.`,
    successGeneric: "You're on the list. We'll see you soon.",
    errorEmail: "Enter a valid email to continue.",
    errorGeneric: "Something went wrong. Try again or email us at hello@purelifewellnessclub.org",
    socialProof: "No spam · Cancel anytime",
    socialProofFree: "Free for the first 100 · No card required · No spam",
    memberBtn: "Already a member? Enter →",
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
  },
  es: {
    headline1: "Tu cuerpo responde",
    headline2: "a lo que le das.",
    sub: "Resultados visibles en 21 días — o te devolvemos tu dinero.",
    founding: "Founding Members",
    slotsLeft: (n) => `${n} cupos gratuitos restantes`,
    spotsUrgent: (n) => `⚡ Solo quedan ${n} cupos gratuitos. Después $182/año.`,
    slotsFull: "🔴 Cupos cerrados",
    slotsNormal: (n) => `Los primeros 100 miembros entran GRATIS. Quedan ${n} cupos.`,
    slotsFullMsg: "Los 100 cupos gratuitos se agotaron. Únete al plan anual por $182/año.",
    counterLabel: (total) => `${total} / 100 cupos tomados`,
    ctaFree: "Quiero mi lugar gratuito →",
    ctaPaid: "Unirme por $182/año →",
    loading: "Reservando tu lugar...",
    successTitle: (pos) => `¡Eres el Founding Member #${pos}!`,
    successMsg: (rem) => `Acceso gratuito confirmado. Quedan ${rem} cupos.`,
    successGeneric: "¡Listo! Eres parte de la lista.",
    errorEmail: "Ingresa un email válido para continuar.",
    errorGeneric: "Algo salió mal. Intenta de nuevo o escríbenos a hola@purelifewellnessclub.org",
    socialProof: "Sin spam · Cancela cuando quieras",
    socialProofFree: "Gratis para los primeros 100 · Sin tarjeta · Sin spam",
    memberBtn: "Ya soy miembro → Entrar",
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
  },
  fr: {
    headline1: "Votre corps répond",
    headline2: "à ce que vous lui donnez.",
    sub: "Résultats visibles en 21 jours — ou remboursé.",
    founding: "Membres Fondateurs",
    slotsLeft: (n) => `${n} places gratuites restantes`,
    spotsUrgent: (n) => `⚡ Seulement ${n} places gratuites restantes. Puis $182/an.`,
    slotsFull: "🔴 Places épuisées",
    slotsNormal: (n) => `Les 100 premiers membres entrent GRATUITEMENT. ${n} places restantes.`,
    slotsFullMsg: "Les 100 places gratuites sont épuisées. Rejoignez le plan annuel à $182/an.",
    counterLabel: (total) => `${total} / 100 places prises`,
    ctaFree: "Réclamer ma place gratuite →",
    ctaPaid: "Rejoindre pour $182/an →",
    loading: "Réservation en cours...",
    successTitle: (pos) => `Vous êtes le Membre Fondateur #${pos} !`,
    successMsg: (rem) => `Accès gratuit confirmé. ${rem} places restantes.`,
    successGeneric: "Vous êtes sur la liste. À bientôt.",
    errorEmail: "Entrez un email valide pour continuer.",
    errorGeneric: "Quelque chose s'est mal passé. Réessayez.",
    socialProof: "Sans spam · Annulez quand vous voulez",
    socialProofFree: "Gratuit pour les 100 premiers · Sans carte",
    memberBtn: "Déjà membre ? Entrer →",
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
  },
  pt: {
    headline1: "Seu corpo responde",
    headline2: "ao que você oferece.",
    sub: "Resultados visíveis em 21 dias — ou seu dinheiro de volta.",
    founding: "Membros Fundadores",
    slotsLeft: (n) => `${n} vagas gratuitas restantes`,
    spotsUrgent: (n) => `⚡ Apenas ${n} vagas gratuitas restantes. Depois $182/ano.`,
    slotsFull: "🔴 Vagas esgotadas",
    slotsNormal: (n) => `Os primeiros 100 membros entram DE GRAÇA. ${n} vagas restantes.`,
    slotsFullMsg: "As 100 vagas gratuitas acabaram. Junte-se ao plano anual por $182/ano.",
    counterLabel: (total) => `${total} / 100 vagas ocupadas`,
    ctaFree: "Quero minha vaga gratuita →",
    ctaPaid: "Entrar por $182/ano →",
    loading: "Reservando sua vaga...",
    successTitle: (pos) => `Você é o Membro Fundador #${pos}!`,
    successMsg: (rem) => `Acesso gratuito confirmado. ${rem} vagas restantes.`,
    successGeneric: "Você está na lista. Até breve.",
    errorEmail: "Digite um email válido para continuar.",
    errorGeneric: "Algo deu errado. Tente novamente.",
    socialProof: "Sem spam · Cancele quando quiser",
    socialProofFree: "Gratuito para os primeiros 100 · Sem cartão",
    memberBtn: "Já sou membro? Entrar →",
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
  },
};

// Fallback para idiomas sin traducción CS completa
function cs(lang, key, arg) {
  const l = CS[lang] || CS['en'];
  const val = l[key] || CS['en'][key];
  if (typeof val === 'function') return val(arg);
  return val;
}

export default function ComingSoonPage({ onEnterApp }) {
  const { lang, setLang } = useLanguage();

  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [freeResult, setFreeResult] = useState(null);
  const [counter, setCounter]     = useState({ total: 0, remaining: 100, percentFull: 0, isFull: false });
  const [counterLoaded, setCounterLoaded] = useState(false);

  useEffect(() => {
    const id = "pl-coming-soon-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = MOTION_CSS;
      document.head.appendChild(el);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/subscriber-count");
        if (res.ok) setCounter(await res.json());
      } catch (_) {}
      finally { setCounterLoaded(true); }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(cs(lang, 'errorEmail'));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.free) {
        setFreeResult(data);
        setSubmitted(true);
        setCounter(prev => ({
          ...prev,
          total: data.position,
          remaining: 100 - data.position,
          percentFull: Math.round((data.position / 100) * 100),
        }));
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || cs(lang, 'errorGeneric'));
      }
    } catch {
      setError(cs(lang, 'errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const { total, remaining, percentFull, isFull } = counter;

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.dark,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2.5rem 1.5rem",
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.cream,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Fondo ambiental */}
      <div style={{
        position: "absolute", width: "70vw", height: "70vw",
        maxWidth: 600, maxHeight: 600, borderRadius: "50%",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(26,92,58,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── GLOBE LANGUAGE SELECTOR — top right ── */}
      <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 100 }}>
        <LanguageSelector
          lang={lang}
          onChange={setLang}
          globeIcon="🌐"
        />
      </div>

      {/* Logo */}
      <div className="pl-float pl-enter" style={{ marginBottom: "1.75rem" }}>
        <img
          src="/purelife-logo.png"
          alt="PureLife Wellness Club"
          style={{
            width: 76, height: 76, borderRadius: "50%",
            border: `2px solid ${COLORS.borderGold}`,
            boxShadow: "0 0 24px rgba(201,151,58,0.15)",
          }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div style={{
          display: "none", width: 76, height: 76, borderRadius: "50%",
          background: "linear-gradient(135deg, #1A5C3A, #060D08)",
          border: `2px solid ${COLORS.borderGold}`,
          alignItems: "center", justifyContent: "center", fontSize: 30,
        }}>🌿</div>
      </div>

      {/* Eyebrow */}
      <p className="pl-enter pl-d1" style={{
        fontSize: 11, letterSpacing: "0.14em", color: COLORS.gold,
        textTransform: "uppercase", marginBottom: 14, fontWeight: 600,
      }}>
        {cs(lang, 'eyebrow')}
      </p>

      {/* Headline */}
      <h1 className="pl-enter pl-d2" style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(2rem, 6vw, 3.4rem)",
        fontWeight: 700, lineHeight: 1.15,
        letterSpacing: "-0.01em",
        color: COLORS.cream, marginBottom: "0.75rem", maxWidth: 520,
      }}>
        {cs(lang, 'headline1')}<br />
        <em style={{ color: COLORS.gold, fontStyle: "italic", fontWeight: 300 }}>
          {cs(lang, 'headline2')}
        </em>
      </h1>

      {/* Subhead */}
      <p className="pl-enter pl-d3" style={{
        maxWidth: 400, fontSize: "0.95rem", lineHeight: 1.7,
        color: COLORS.muted, marginBottom: "2rem",
      }}>
        {cs(lang, 'sub')}
      </p>

      {/* ── FOUNDING MEMBERS COUNTER BANNER ── */}
      {counterLoaded && (
        <div className="pl-enter pl-d4 pl-counter-shimmer" style={{
          width: "100%", maxWidth: 370,
          background: "rgba(201,151,58,0.06)",
          border: `1px solid ${COLORS.borderGold}`,
          borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {isFull ? cs(lang, 'slotsFull') : `🟢 ${cs(lang, 'founding')}`}
            </span>
            <span style={{ fontSize: 12, color: COLORS.muted }}>
              {cs(lang, 'counterLabel', total)}
            </span>
          </div>

          <div style={{
            width: "100%", height: 6, borderRadius: 99,
            background: "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 10,
          }}>
            <div className="pl-bar-fill" style={{
              "--bar-w": `${percentFull}%`, height: "100%", borderRadius: 99,
              background: isFull ? "#e05555" : `linear-gradient(90deg, ${COLORS.green}, ${COLORS.gold})`,
            }} />
          </div>

          <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
            {isFull
              ? cs(lang, 'slotsFullMsg')
              : remaining <= 10
                ? cs(lang, 'spotsUrgent', remaining)
                : cs(lang, 'slotsNormal', remaining)}
          </p>
        </div>
      )}

      {/* Email capture / Success */}
      {!submitted ? (
        <div className="pl-enter pl-d5" style={{
          display: "flex", flexDirection: "column",
          gap: "0.6rem", width: "100%", maxWidth: 370, marginBottom: "1.5rem",
        }}>
          <input
            className="pl-input"
            type="email"
            placeholder={t(lang, 'emailPlaceholder')}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              padding: "0.85rem 1.2rem", borderRadius: 10,
              border: `1px solid ${error ? "rgba(255,100,100,0.5)" : COLORS.borderGold}`,
              background: "rgba(255,255,255,0.04)",
              color: COLORS.cream, fontSize: "0.95rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          {error && (
            <p style={{ fontSize: 12, color: "#ff8080", textAlign: "left", paddingLeft: 4 }}>
              {error}
            </p>
          )}

          <button
            className="pl-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.9rem", borderRadius: 10,
              background: loading
                ? "rgba(201,151,58,0.5)"
                : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldL})`,
              color: "#060D08", border: "none",
              fontSize: "0.9rem", fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.02em",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? cs(lang, 'loading') : isFull ? cs(lang, 'ctaPaid') : cs(lang, 'ctaFree')}
          </button>

          <p style={{ fontSize: 11, color: COLORS.dim, marginTop: 2 }}>
            {isFull ? cs(lang, 'socialProof') : cs(lang, 'socialProofFree')}
          </p>
        </div>
      ) : (
        <div className="pl-pulse pl-enter" style={{
          padding: "1.25rem 2rem", borderRadius: 12,
          background: "rgba(26,92,58,0.15)",
          border: `1px solid ${COLORS.green}`,
          color: COLORS.cream, marginBottom: "1.5rem",
          maxWidth: 340, width: "100%",
        }}>
          <p style={{ fontSize: 22, marginBottom: 6 }}>✓</p>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Fraunces', serif", marginBottom: 6 }}>
            {freeResult ? cs(lang, 'successTitle', freeResult.position) : cs(lang, 'successGeneric')}
          </p>
          <p style={{ fontSize: 13, color: COLORS.muted }}>
            {freeResult ? cs(lang, 'successMsg', freeResult.remaining) : ""}
          </p>
        </div>
      )}

      {/* Botón miembro */}
      <button
        className="pl-btn"
        onClick={onEnterApp}
        style={{
          background: "transparent", color: COLORS.muted,
          border: `1px solid rgba(255,255,255,0.12)`,
          padding: "0.6rem 1.4rem", borderRadius: 8,
          fontSize: "0.78rem", letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
        }}
      >
        {cs(lang, 'memberBtn')}
      </button>

      {/* Footer */}
      <p style={{
        position: "absolute", bottom: "1.5rem",
        fontSize: "0.7rem", color: "rgba(245,240,232,0.18)",
        letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif",
      }}>
        © 2026 JRMB Food Network LLC · PureLife Wellness Club
      </p>
    </div>
  );
}
