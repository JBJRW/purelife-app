import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { SuggestedMembers } from "../components/SuggestedMembers";

export default function CommunityPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1f18 0%, #1a1a1a 50%, #0d1a10 100%)",
      color: "#F9F3E8",
      fontFamily: "DM Sans, sans-serif",
      padding: "32px 20px 80px",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(116,198,157,0.12)",
            border: "1px solid rgba(116,198,157,0.3)",
            borderRadius: 100, padding: "5px 14px",
            fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
            color: "#74C69D", marginBottom: 16,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#74C69D", animation: "pulse 2s infinite", display: "inline-block" }} />
            Community · PureLife
          </div>
          <h1 style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800, lineHeight: 1.1,
            margin: "0 0 8px",
            background: "linear-gradient(135deg, #F9F3E8 0%, #74C69D 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Tu Comunidad Wellness
          </h1>
          <p style={{ color: "rgba(249,243,232,0.5)", fontSize: 14, margin: 0 }}>
            Conecta con miembros que comparten tu journey de bienestar
          </p>
        </div>

        {/* Follow — Members you may know */}
        <SuggestedMembers currentUser={user} maxCards={6} />

        {/* Community placeholder */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20, padding: "40px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
          <h2 style={{
            color: "#F9F3E8", fontFamily: "Fraunces, serif",
            fontSize: 22, fontWeight: 700, marginBottom: 8,
          }}>
            Community Hub
          </h2>
          <p style={{ color: "rgba(249,243,232,0.45)", fontSize: 14, margin: 0 }}>
            Posts, grupos y más — próximamente
          </p>
        </div>

      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}