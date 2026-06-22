export default function Slide08Roadmap() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0F1F17 0%, #0e1c13 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ padding: "6vh 7vw 5vh" }}>
        <div>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "1.5vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Roadmap
            </span>
          </div>
          <h2
            className="font-display text-text"
            style={{ fontSize: "4.5vw", fontWeight: 700, lineHeight: 1.1 }}
          >
            18 months to scale.
          </h2>
        </div>

        <div
          className="relative flex items-start"
          style={{ marginTop: "6vh", flex: 1, gap: "0" }}
        >
          <div
            className="absolute"
            style={{
              top: "1.5vh",
              left: "3vw",
              right: "3vw",
              height: "2px",
              background: "linear-gradient(to right, #C9973A, rgba(201,151,58,0.3))",
            }}
          />

          <div
            className="flex flex-col items-center"
            style={{ flex: 1, position: "relative" }}
          >
            <div
              className="rounded-full bg-accent"
              style={{ width: "1.5vw", height: "1.5vw", position: "relative", zIndex: 2 }}
            />
            <div
              className="font-body text-accent uppercase tracking-widest text-center"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginTop: "2vh" }}
            >
              Q3 2026
            </div>
            <div
              className="font-display text-text text-center"
              style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "1vh" }}
            >
              Public Launch
            </div>
            <div
              className="font-body text-muted text-center"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "1vh", lineHeight: 1.4, maxWidth: "20vw" }}
            >
              Open registration, paid tier activation, first 1,000 paying members target
            </div>
          </div>

          <div
            className="flex flex-col items-center"
            style={{ flex: 1, position: "relative" }}
          >
            <div
              className="rounded-full"
              style={{
                width: "1.5vw",
                height: "1.5vw",
                background: "rgba(201,151,58,0.5)",
                border: "1.5px solid #C9973A",
                position: "relative",
                zIndex: 2,
              }}
            />
            <div
              className="font-body text-muted uppercase tracking-widest text-center"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginTop: "2vh" }}
            >
              Q4 2026
            </div>
            <div
              className="font-display text-text text-center"
              style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "1vh" }}
            >
              B2B Wellness
            </div>
            <div
              className="font-body text-muted text-center"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "1vh", lineHeight: 1.4, maxWidth: "20vw" }}
            >
              Corporate wellness contracts, HR platform integrations, team dashboard
            </div>
          </div>

          <div
            className="flex flex-col items-center"
            style={{ flex: 1, position: "relative" }}
          >
            <div
              className="rounded-full"
              style={{
                width: "1.5vw",
                height: "1.5vw",
                background: "rgba(201,151,58,0.25)",
                border: "1.5px solid rgba(201,151,58,0.5)",
                position: "relative",
                zIndex: 2,
              }}
            />
            <div
              className="font-body text-muted uppercase tracking-widest text-center"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginTop: "2vh" }}
            >
              Q1 2027
            </div>
            <div
              className="font-display text-text text-center"
              style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "1vh" }}
            >
              Wearable Sync
            </div>
            <div
              className="font-body text-muted text-center"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "1vh", lineHeight: 1.4, maxWidth: "20vw" }}
            >
              Apple Health, Fitbit, Garmin integration — adaptive plans from biometric data
            </div>
          </div>

          <div
            className="flex flex-col items-center"
            style={{ flex: 1, position: "relative" }}
          >
            <div
              className="rounded-full"
              style={{
                width: "1.5vw",
                height: "1.5vw",
                background: "rgba(201,151,58,0.15)",
                border: "1.5px solid rgba(201,151,58,0.3)",
                position: "relative",
                zIndex: 2,
              }}
            />
            <div
              className="font-body text-muted uppercase tracking-widest text-center"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginTop: "2vh" }}
            >
              Q2–Q3 2027
            </div>
            <div
              className="font-display text-text text-center"
              style={{ fontSize: "2.8vw", fontWeight: 700, marginTop: "1vh" }}
            >
              API Platform
            </div>
            <div
              className="font-body text-muted text-center"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "1vh", lineHeight: 1.4, maxWidth: "20vw" }}
            >
              White-label AI wellness API, Series A target with $1M ARR milestone
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "4vh",
            paddingTop: "3vh",
            borderTop: "1px solid rgba(201,151,58,0.15)",
          }}
        >
          <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.5 }}>
            Seed funding accelerates: paid user acquisition, content production, and wearable integrations — all gating the Series A raise.
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        08
      </div>
    </div>
  );
}
