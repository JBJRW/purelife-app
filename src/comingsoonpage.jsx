// ═══════════════════════════════════════════════════════════
// PureLife — Coming Soon Page v2.0
// src/comingsoonpage.jsx
// Skills: Emil Kowalski (motion) · Taste (editorial) · Impeccable (calidad)
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

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

// ── EMIL KOWALSKI: CSS animations sin dependencias externas ──
const MOTION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');

  @media (prefers-reduced-motion: reduce) {
    .pl-enter, .pl-float, .pl-pulse { animation: none !important; }
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
  @keyframes pl-glow {
    from { background-position: -400px 0; }
    to   { background-position: 400px 0; }
  }

  .pl-enter    { animation: pl-fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pl-d1       { animation-delay: 80ms; }
  .pl-d2       { animation-delay: 160ms; }
  .pl-d3       { animation-delay: 240ms; }
  .pl-d4       { animation-delay: 320ms; }
  .pl-float    { animation: pl-float 3.2s ease-in-out infinite; }
  .pl-pulse    { animation: pl-pulse 2s ease infinite; }

  .pl-btn {
    transition:
      transform 180ms cubic-bezier(0.34,1.56,0.64,1),
      opacity   180ms ease,
      box-shadow 180ms ease;
  }
  .pl-btn:hover  { transform: translateY(-1px); }
  .pl-btn:active { transform: scale(0.96); }

  .pl-input {
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  .pl-input:focus {
    border-color: rgba(201,151,58,0.75) !important;
    box-shadow: 0 0 0 3px rgba(201,151,58,0.2);
    outline: none;
  }
`;

export default function ComingSoonPage({ onEnterApp }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // IMPECCABLE: inyectar CSS una sola vez, limpio al desmontar
  useEffect(() => {
    const id = "pl-coming-soon-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = MOTION_CSS;
      document.head.appendChild(el);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  const handleSubmit = async () => {
    // IMPECCABLE: validación real con regex, no solo .includes("@")
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Ingresa un email válido para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Listo para conectar: await fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) })
      await new Promise((r) => setTimeout(r, 900));
      setSubmitted(true);
    } catch {
      // IMPECCABLE: error accionable, no genérico
      setError("Algo salió mal. Intenta de nuevo o escríbenos a hola@purelifewellnessclub.org");
    } finally {
      setLoading(false);
    }
  };

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

      {/* EMIL: fondo ambiental — no distrae, da profundidad */}
      <div style={{
        position: "absolute",
        width: "70vw", height: "70vw", maxWidth: 600, maxHeight: 600,
        borderRadius: "50%",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(26,92,58,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo — EMIL: float suave, sin saltar */}
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
            // Fallback elegante si no carga el logo
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        {/* Fallback visual para cuando no hay logo */}
        <div style={{
          display: "none", width: 76, height: 76, borderRadius: "50%",
          background: "linear-gradient(135deg, #1A5C3A, #060D08)",
          border: `2px solid ${COLORS.borderGold}`,
          alignItems: "center", justifyContent: "center",
          fontSize: 30,
        }}>🌿</div>
      </div>

      {/* TASTE: eyebrow — contexto antes del headline, no ruido */}
      <p className="pl-enter pl-d1" style={{
        fontSize: 11, letterSpacing: "0.14em",
        color: COLORS.gold, textTransform: "uppercase",
        marginBottom: 14, fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Dr. Smoothie · PureLife Wellness Club
      </p>

      {/* TASTE: headline = promesa, no nombre del producto */}
      {/* ANTES: "PureLife Wellness Club" — nombre en el hero desperdicia la única oportunidad */}
      {/* DESPUÉS: promesa directa en 5 palabras */}
      <h1 className="pl-enter pl-d2" style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(2rem, 6vw, 3.4rem)",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
        color: COLORS.cream,
        marginBottom: "0.75rem",
        maxWidth: 520,
      }}>
        Tu cuerpo responde<br />
        <em style={{
          color: COLORS.gold,
          fontStyle: "italic",
          fontWeight: 300,
        }}>
          a lo que le das.
        </em>
      </h1>

      {/* TASTE: 1 oración. Número real. Garantía concreta. Sin "journey". */}
      <p className="pl-enter pl-d3" style={{
        maxWidth: 400,
        fontSize: "0.95rem",
        lineHeight: 1.7,
        color: COLORS.muted,
        marginBottom: "2.5rem",
      }}>
        Resultados visibles en 21 días — o te devolvemos tu dinero.
      </p>

      {/* Email capture */}
      {!submitted ? (
        <div className="pl-enter pl-d4" style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          width: "100%",
          maxWidth: 370,
          marginBottom: "1.5rem",
        }}>
          <input
            className="pl-input"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              padding: "0.85rem 1.2rem",
              borderRadius: 10,
              border: `1px solid ${error ? "rgba(255,100,100,0.5)" : COLORS.borderGold}`,
              background: "rgba(255,255,255,0.04)",
              color: COLORS.cream,
              fontSize: "0.95rem",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />

          {/* IMPECCABLE: error visible, accionable, no genérico */}
          {error && (
            <p style={{
              fontSize: 12, color: "#ff8080",
              textAlign: "left", paddingLeft: 4,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {error}
            </p>
          )}

          {/* TASTE: CTA = beneficio claro. ANTES: "Reservar mi lugar" (acción técnica) */}
          {/* DESPUÉS: "Quiero acceso anticipado" (beneficio + urgencia) */}
          <button
            className="pl-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.9rem",
              borderRadius: 10,
              background: loading
                ? "rgba(201,151,58,0.5)"
                : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldL})`,
              color: "#060D08",
              border: "none",
              fontSize: "0.9rem",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.02em",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Guardando tu lugar..." : "Quiero acceso anticipado"}
          </button>

          {/* TASTE: social proof específico, debajo del CTA, subordinado */}
          <p style={{ fontSize: 11, color: COLORS.dim, marginTop: 2 }}>
            +2,400 en lista · Sin spam · Cancela cuando quieras
          </p>
        </div>
      ) : (
        // EMIL + IMPECCABLE: success state con pulse + mensaje con expectativa concreta
        <div className="pl-pulse pl-enter" style={{
          padding: "1.25rem 2rem",
          borderRadius: 12,
          background: "rgba(26,92,58,0.15)",
          border: `1px solid ${COLORS.green}`,
          color: COLORS.cream,
          marginBottom: "1.5rem",
          maxWidth: 340,
          width: "100%",
        }}>
          <p style={{ fontSize: 22, marginBottom: 6 }}>✓</p>
          <p style={{
            fontWeight: 700, fontSize: 15,
            fontFamily: "'Fraunces', serif",
            marginBottom: 6,
          }}>
            ¡Listo! Eres parte de la lista.
          </p>
          {/* TASTE: expectativa concreta, no vaga */}
          <p style={{ fontSize: 13, color: COLORS.muted }}>
            Te avisamos cuando abramos — tú primero.
          </p>
        </div>
      )}

      {/* TASTE: acción secundaria — ghost, visualmente subordinada al CTA principal */}
      <button
        className="pl-btn"
        onClick={onEnterApp}
        style={{
          background: "transparent",
          color: COLORS.muted,
          border: `1px solid rgba(255,255,255,0.12)`,
          padding: "0.6rem 1.4rem",
          borderRadius: 8,
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
        }}
      >
        Ya soy miembro → Entrar
      </button>

      {/* Footer */}
      <p style={{
        position: "absolute",
        bottom: "1.5rem",
        fontSize: "0.7rem",
        color: "rgba(245,240,232,0.18)",
        letterSpacing: "0.08em",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        © 2026 JRMB Food Network LLC · PureLife Wellness Club
      </p>
    </div>
  );
}
