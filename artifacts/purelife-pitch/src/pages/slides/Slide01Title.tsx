export default function Slide01Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 110% 50%, #1A5C3A 0%, #0F1F17 60%)",
        }}
      />
      <div className="absolute top-0 bottom-0" style={{ left: "48vw", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(201,151,58,0.25), transparent)" }} />

      <div className="relative z-10 flex h-full">
        <div className="flex flex-col justify-center" style={{ paddingLeft: "7vw", width: "48vw" }}>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "3vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "4vw" }} />
            <span className="font-body text-accent tracking-[0.25em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Investor Presentation
            </span>
          </div>

          <h1
            className="font-display text-text tracking-tight leading-none"
            style={{ fontSize: "7.5vw", fontWeight: 900, textWrap: "balance" }}
          >
            Pure
            <span className="text-accent">Life</span>
          </h1>
          <h2
            className="font-display text-text"
            style={{ fontSize: "3.2vw", fontWeight: 400, marginTop: "1.5vh", letterSpacing: "0.02em" }}
          >
            Wellness Club
          </h2>

          <p
            className="font-body text-muted"
            style={{ fontSize: "2.2vw", marginTop: "3vh", fontWeight: 300, maxWidth: "36vw", lineHeight: 1.6 }}
          >
            AI-powered personal wellness — nutrition, movement, and mindset in one adaptive platform.
          </p>

          <div className="flex items-center gap-[1vw]" style={{ marginTop: "5vh" }}>
            <div className="h-[1px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent" style={{ fontSize: "2.2vw", fontWeight: 400 }}>
              dr.smoothie.ai
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center" style={{ width: "52vw" }}>
          <div
            className="relative flex items-center justify-center"
            style={{ width: "28vw", height: "28vw" }}
          >
            <div
              className="absolute inset-0 rounded-full border border-accent opacity-20"
              style={{ transform: "scale(1.15)" }}
            />
            <div
              className="absolute inset-0 rounded-full border border-accent opacity-10"
              style={{ transform: "scale(1.35)" }}
            />
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "22vw",
                height: "22vw",
                background: "radial-gradient(circle, rgba(45,134,83,0.15) 0%, rgba(26,92,58,0.25) 60%, transparent 100%)",
                border: "1px solid rgba(201,151,58,0.3)",
              }}
            >
              <div className="text-center">
                <div
                  className="font-display text-accent"
                  style={{ fontSize: "5vw", fontWeight: 900, lineHeight: 1 }}
                >
                  Dr.
                </div>
                <div
                  className="font-display text-text"
                  style={{ fontSize: "3.2vw", fontWeight: 700, lineHeight: 1.1 }}
                >
                  Smoothie
                </div>
                <div
                  className="font-body text-muted"
                  style={{ fontSize: "2.2vw", marginTop: "0.8vh", letterSpacing: "0.15em", fontWeight: 300 }}
                >
                  AI WELLNESS
                </div>
              </div>
            </div>
          </div>

          <div
            className="font-body text-muted text-center"
            style={{ fontSize: "2.2vw", marginTop: "3vh", fontWeight: 300, letterSpacing: "0.05em" }}
          >
            2026 Seed Round
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,151,58,0.4), transparent)" }}
      />
    </div>
  );
}
