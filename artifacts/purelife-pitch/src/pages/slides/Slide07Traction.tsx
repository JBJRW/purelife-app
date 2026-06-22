export default function Slide07Traction() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0F1F17 0%, #0d1b12 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{
          width: "30vw",
          background: "linear-gradient(to left, rgba(26,92,58,0.15) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ padding: "6vh 7vw 5vh" }}>
        <div>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "1.5vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Early Traction
            </span>
          </div>
          <h2
            className="font-display text-text"
            style={{ fontSize: "4.5vw", fontWeight: 700, lineHeight: 1.1 }}
          >
            Foundation built. Growth underway.
          </h2>
        </div>

        <div
          className="grid"
          style={{
            marginTop: "5vh",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "2.5vw",
            flex: 1,
          }}
        >
          <div style={{ borderTop: "2px solid #C9973A", paddingTop: "3vh" }}>
            <div
              className="font-display text-accent"
              style={{ fontSize: "6vw", fontWeight: 900, lineHeight: 1 }}
            >
              15
            </div>
            <div
              className="font-body text-text"
              style={{ fontSize: "2.4vw", fontWeight: 500, marginTop: "1vh" }}
            >
              Languages Supported
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.8vh", lineHeight: 1.4 }}
            >
              English, Spanish, Portuguese, French, and 11 more — full i18n from launch
            </div>
          </div>

          <div style={{ borderTop: "2px solid rgba(201,151,58,0.4)", paddingTop: "3vh" }}>
            <div
              className="font-display text-accent"
              style={{ fontSize: "6vw", fontWeight: 900, lineHeight: 1 }}
            >
              2
            </div>
            <div
              className="font-body text-text"
              style={{ fontSize: "2.4vw", fontWeight: 500, marginTop: "1vh" }}
            >
              Platforms Live
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.8vh", lineHeight: 1.4 }}
            >
              Web app and native mobile (iOS + Android) — both deployed and feature-complete
            </div>
          </div>

          <div style={{ borderTop: "2px solid rgba(201,151,58,0.4)", paddingTop: "3vh" }}>
            <div
              className="font-display text-accent"
              style={{ fontSize: "6vw", fontWeight: 900, lineHeight: 1 }}
            >
              6
            </div>
            <div
              className="font-body text-text"
              style={{ fontSize: "2.4vw", fontWeight: 500, marginTop: "1vh" }}
            >
              Core Product Features
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.8vh", lineHeight: 1.4 }}
            >
              AI chat, recipes, store locator, video, community, health profiling — all shipped
            </div>
          </div>

          <div style={{ borderTop: "2px solid rgba(201,151,58,0.4)", paddingTop: "3vh" }}>
            <div
              className="font-display text-accent"
              style={{ fontSize: "6vw", fontWeight: 900, lineHeight: 1 }}
            >
              Ready
            </div>
            <div
              className="font-body text-text"
              style={{ fontSize: "2.4vw", fontWeight: 500, marginTop: "1vh" }}
            >
              Monetization Infrastructure
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.8vh", lineHeight: 1.4 }}
            >
              Stripe subscription checkout integrated — payment infrastructure complete for launch
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        07
      </div>
    </div>
  );
}
