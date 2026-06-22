export default function Slide06BusinessModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #0F1F17 0%, #111f15 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0"
        style={{
          width: "40vw",
          height: "40vh",
          background: "radial-gradient(circle at 0% 0%, rgba(201,151,58,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ padding: "5vh 7vw 4vh" }}>
        <div>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "1.5vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Business Model
            </span>
          </div>
          <h2
            className="font-display text-text"
            style={{ fontSize: "4vw", fontWeight: 700, lineHeight: 1.1 }}
          >
            Subscription-first. Three tiers.
          </h2>
        </div>

        <div
          className="grid"
          style={{
            marginTop: "3.5vh",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "2.5vw",
            flex: 1,
          }}
        >
          <div
            className="flex flex-col"
            style={{
              background: "rgba(26,92,58,0.15)",
              border: "1px solid rgba(122,144,128,0.3)",
              borderRadius: "1.2vw",
              padding: "2.5vw",
            }}
          >
            <div
              className="font-body text-muted uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 400 }}
            >
              Free
            </div>
            <div
              className="font-display text-text"
              style={{ fontSize: "4vw", fontWeight: 900, marginTop: "1vh", lineHeight: 1 }}
            >
              $0
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}
            >
              /month
            </div>
            <div
              style={{
                flex: 1,
                marginTop: "2.5vh",
                paddingTop: "2vh",
                borderTop: "1px solid rgba(122,144,128,0.2)",
              }}
            >
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Wellness diagnostic quiz
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                3 AI chat queries/day
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Basic recipe access
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Store locator
              </div>
            </div>
          </div>

          <div
            className="flex flex-col relative"
            style={{
              background: "linear-gradient(135deg, rgba(26,92,58,0.45) 0%, rgba(26,92,58,0.25) 100%)",
              border: "1.5px solid rgba(201,151,58,0.5)",
              borderRadius: "1.2vw",
              padding: "2.5vw",
            }}
          >
            <div
              className="absolute font-body text-bg uppercase tracking-widest bg-accent"
              style={{
                fontSize: "2.2vw",
                fontWeight: 500,
                top: "2vh",
                right: "1.5vw",
                padding: "0.4vh 0.8vw",
                borderRadius: "0.4vw",
              }}
            >
              Popular
            </div>
            <div
              className="font-body text-accent uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 400 }}
            >
              Pro
            </div>
            <div
              className="font-display text-accent"
              style={{ fontSize: "4vw", fontWeight: 900, marginTop: "1vh", lineHeight: 1 }}
            >
              $19
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}
            >
              /month
            </div>
            <div
              style={{
                flex: 1,
                marginTop: "2.5vh",
                paddingTop: "2vh",
                borderTop: "1px solid rgba(201,151,58,0.25)",
              }}
            >
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400, lineHeight: 1.7 }}>
                Unlimited AI chat
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400, lineHeight: 1.7 }}>
                Full recipe library
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400, lineHeight: 1.7 }}>
                Video wellness series
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400, lineHeight: 1.7 }}>
                Community Hub access
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 400, lineHeight: 1.7 }}>
                Health profile tracking
              </div>
            </div>
          </div>

          <div
            className="flex flex-col"
            style={{
              background: "rgba(26,92,58,0.15)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1.2vw",
              padding: "2.5vw",
            }}
          >
            <div
              className="font-body text-muted uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 400 }}
            >
              Family
            </div>
            <div
              className="font-display text-text"
              style={{ fontSize: "4vw", fontWeight: 900, marginTop: "1vh", lineHeight: 1 }}
            >
              $39
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}
            >
              /month · up to 6 members
            </div>
            <div
              style={{
                flex: 1,
                marginTop: "2.5vh",
                paddingTop: "2vh",
                borderTop: "1px solid rgba(122,144,128,0.2)",
              }}
            >
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Everything in Pro
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Individual profiles per member
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Family meal planning
              </div>
              <div className="font-body text-text" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.7 }}>
                Priority AI responses
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex gap-[5vw]"
          style={{ marginTop: "3vh", paddingTop: "2.5vh", borderTop: "1px solid rgba(201,151,58,0.15)" }}
        >
          <div>
            <div className="font-display text-accent" style={{ fontSize: "3vw", fontWeight: 700 }}>B2B</div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Corporate wellness packages available
            </div>
          </div>
          <div>
            <div className="font-display text-accent" style={{ fontSize: "3vw", fontWeight: 700 }}>API</div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              White-label partnerships in roadmap
            </div>
          </div>
          <div>
            <div className="font-display text-accent" style={{ fontSize: "3vw", fontWeight: 700 }}>LTV</div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              High retention through personalization loop
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        06
      </div>
    </div>
  );
}
