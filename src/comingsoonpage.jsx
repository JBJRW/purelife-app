import { useState, useEffect } from "react";

const COLORS = {
  dark: "#060D08",
  green: "#1A5C3A",
  gold: "#C9973A",
  cream: "#F5F0E8",
  muted: "rgba(245,240,232,0.5)",
};

export default function ComingSoonPage({ onEnterApp }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060D08",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "Georgia, serif",
        color: COLORS.cream,
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <img
        src="/purelife-logo.png"
        alt="PureLife"
        style={{ width: 72, height: 72, borderRadius: "50%", marginBottom: "1.5rem" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.2rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
          marginBottom: "0.5rem",
          color: COLORS.cream,
        }}
      >
        PureLife Wellness Club
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: COLORS.gold,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
        }}
      >
        Launching 2026
      </p>

      <p
        style={{
          maxWidth: 480,
          fontSize: "1rem",
          lineHeight: 1.7,
          color: COLORS.muted,
          marginBottom: "2.5rem",
        }}
      >
        Tu asesor de bienestar nutricional con IA. Smoothies, jugos y hábitos
        diseñados para ti — Dr. Smoothie te guía.
      </p>

      {/* Email capture */}
      {!submitted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
            maxWidth: 380,
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              padding: "0.85rem 1.2rem",
              borderRadius: 8,
              border: `1px solid rgba(201,151,58,0.4)`,
              background: "rgba(255,255,255,0.05)",
              color: COLORS.cream,
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.85rem",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.green}, #2D8653)`,
              color: "#fff",
              border: "none",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Procesando..." : "Reservar mi lugar"}
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: "1rem 2rem",
            borderRadius: 8,
            background: "rgba(26,92,58,0.2)",
            border: `1px solid ${COLORS.green}`,
            color: COLORS.cream,
            marginBottom: "1.5rem",
          }}
        >
          ✓ ¡Listo! Te notificamos cuando abramos.
        </div>
      )}

      {/* Enter app button */}
      <button
        onClick={onEnterApp}
        style={{
          background: "transparent",
          color: COLORS.muted,
          border: `1px solid rgba(255,255,255,0.15)`,
          padding: "0.65rem 1.4rem",
          borderRadius: 8,
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Ya soy miembro → Entrar
      </button>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "1.5rem",
          fontSize: "0.72rem",
          color: "rgba(245,240,232,0.2)",
          letterSpacing: "0.08em",
        }}
      >
        © 2026 JRMB Food Network LLC · PureLife Wellness Club
      </p>
    </div>
  );
}
