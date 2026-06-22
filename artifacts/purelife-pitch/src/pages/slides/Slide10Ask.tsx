export default function Slide10Ask() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(150deg, #0F1F17 0%, #0e1c12 100%)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "0",
          left: "0",
          width: "60vw",
          height: "100vh",
          background: "radial-gradient(ellipse 80% 80% at -20% 50%, rgba(26,92,58,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex h-full">
        <div
          className="flex flex-col justify-center"
          style={{ paddingLeft: "7vw", width: "52vw" }}
        >
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "4vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              The Ask
            </span>
          </div>

          <h2
            className="font-display text-text leading-tight"
            style={{ fontSize: "5vw", fontWeight: 700, textWrap: "balance" }}
          >
            Raising a $1.2M seed round.
          </h2>

          <p
            className="font-body text-muted"
            style={{ fontSize: "2.2vw", marginTop: "3vh", lineHeight: 1.6, fontWeight: 300, maxWidth: "44vw" }}
          >
            Pre-revenue, product complete. Funding accelerates paid user acquisition, content production, and the wearable integration sprint before Series A.
          </p>

          <div style={{ marginTop: "5vh" }}>
            <div
              className="font-body text-muted uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 400, marginBottom: "2.5vh" }}
            >
              Use of funds
            </div>

            <div className="flex items-center gap-[2vw]" style={{ marginBottom: "2vh" }}>
              <div
                style={{
                  width: "32vw",
                  height: "1.2vh",
                  background: "rgba(122,144,128,0.2)",
                  borderRadius: "1vh",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "40%", height: "100%", background: "#C9973A", borderRadius: "1vh" }} />
              </div>
              <span className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400 }}>
                40% — User acquisition
              </span>
            </div>

            <div className="flex items-center gap-[2vw]" style={{ marginBottom: "2vh" }}>
              <div
                style={{
                  width: "32vw",
                  height: "1.2vh",
                  background: "rgba(122,144,128,0.2)",
                  borderRadius: "1vh",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "25%", height: "100%", background: "#C9973A", borderRadius: "1vh" }} />
              </div>
              <span className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400 }}>
                25% — Engineering hires
              </span>
            </div>

            <div className="flex items-center gap-[2vw]" style={{ marginBottom: "2vh" }}>
              <div
                style={{
                  width: "32vw",
                  height: "1.2vh",
                  background: "rgba(122,144,128,0.2)",
                  borderRadius: "1vh",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "20%", height: "100%", background: "#C9973A", borderRadius: "1vh" }} />
              </div>
              <span className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400 }}>
                20% — Content production
              </span>
            </div>

            <div className="flex items-center gap-[2vw]">
              <div
                style={{
                  width: "32vw",
                  height: "1.2vh",
                  background: "rgba(122,144,128,0.2)",
                  borderRadius: "1vh",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "15%", height: "100%", background: "#C9973A", borderRadius: "1vh" }} />
              </div>
              <span className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400 }}>
                15% — Operations
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "48vw", paddingRight: "5vw" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(26,92,58,0.35) 0%, rgba(15,31,23,0.5) 100%)",
              border: "1px solid rgba(201,151,58,0.3)",
              borderRadius: "1.5vw",
              padding: "4vw",
              width: "32vw",
            }}
          >
            <div
              className="font-body text-accent uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "3vh" }}
            >
              Round Details
            </div>

            <div style={{ marginBottom: "3vh", paddingBottom: "3vh", borderBottom: "1px solid rgba(201,151,58,0.15)" }}>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>Raise amount</div>
              <div className="font-display text-text" style={{ fontSize: "4vw", fontWeight: 900, lineHeight: 1.1 }}>$1.2M</div>
            </div>

            <div style={{ marginBottom: "3vh", paddingBottom: "3vh", borderBottom: "1px solid rgba(201,151,58,0.15)" }}>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>Instrument</div>
              <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700 }}>SAFE</div>
            </div>

            <div style={{ marginBottom: "3vh", paddingBottom: "3vh", borderBottom: "1px solid rgba(201,151,58,0.15)" }}>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>Valuation cap</div>
              <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700 }}>$6M</div>
            </div>

            <div>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>Target close</div>
              <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700 }}>Q3 2026</div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        10
      </div>
    </div>
  );
}
