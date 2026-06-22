export default function Slide11Close() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(26,92,58,0.12) 0%, #0F1F17 60%)",
        }}
      />
      <div
        className="absolute top-0 left-0"
        style={{
          width: "30vw",
          height: "30vw",
          background: "radial-gradient(circle at 0% 0%, rgba(201,151,58,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "30vw",
          height: "30vw",
          background: "radial-gradient(circle at 100% 100%, rgba(201,151,58,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="absolute top-0 left-0 right-0" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,151,58,0.3), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,151,58,0.3), transparent)" }} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <div className="flex items-center gap-[2vw]" style={{ marginBottom: "4vh" }}>
          <div className="h-[1px] bg-accent opacity-50" style={{ width: "6vw" }} />
          <span className="font-body text-accent tracking-[0.25em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
            Let's build this together
          </span>
          <div className="h-[1px] bg-accent opacity-50" style={{ width: "6vw" }} />
        </div>

        <h1
          className="font-display text-text"
          style={{ fontSize: "7vw", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.02em" }}
        >
          Pure
          <span className="text-accent">Life</span>
        </h1>
        <div
          className="font-display text-text"
          style={{ fontSize: "3vw", fontWeight: 400, marginTop: "1.5vh", letterSpacing: "0.05em" }}
        >
          Wellness Club
        </div>

        <div
          className="font-body text-muted"
          style={{ fontSize: "2.2vw", marginTop: "4vh", fontWeight: 300, maxWidth: "55vw", lineHeight: 1.6 }}
        >
          Wellness is a $4.5 trillion problem with a clear AI-native solution. PureLife is live, global-ready, and positioned to own the personalized wellness category.
        </div>

        <div
          style={{
            marginTop: "6vh",
            paddingTop: "4vh",
            borderTop: "1px solid rgba(201,151,58,0.2)",
            display: "flex",
            gap: "6vw",
            alignItems: "center",
          }}
        >
          <div className="text-center">
            <div className="font-body text-muted uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Website
            </div>
            <div className="font-display text-accent" style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "0.5vh" }}>
              dr.smoothie.ai
            </div>
          </div>

          <div style={{ width: "1px", height: "6vh", background: "rgba(201,151,58,0.3)" }} />

          <div className="text-center">
            <div className="font-body text-muted uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Company
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "0.5vh" }}>
              JRMB Food Network
            </div>
          </div>

          <div style={{ width: "1px", height: "6vh", background: "rgba(201,151,58,0.3)" }} />

          <div className="text-center">
            <div className="font-body text-muted uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Round
            </div>
            <div className="font-display text-accent" style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "0.5vh" }}>
              $1.2M Seed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
