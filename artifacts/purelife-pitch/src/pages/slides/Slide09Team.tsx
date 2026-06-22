export default function Slide09Team() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0F1F17 0%, #111f15 100%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle at 100% 100%, rgba(26,92,58,0.2) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ padding: "6vh 7vw 5vh" }}>
        <div>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "1.5vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              The Team
            </span>
          </div>
          <h2
            className="font-display text-text"
            style={{ fontSize: "4.5vw", fontWeight: 700, lineHeight: 1.1 }}
          >
            Built by wellness believers.
          </h2>
        </div>

        <div
          className="grid"
          style={{
            marginTop: "5vh",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "3vw",
          }}
        >
          <div>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "8vw",
                height: "8vw",
                background: "linear-gradient(135deg, rgba(26,92,58,0.6), rgba(15,31,23,0.8))",
                border: "1px solid rgba(201,151,58,0.35)",
                marginBottom: "2.5vh",
              }}
            >
              <span className="font-display text-accent" style={{ fontSize: "3.5vw", fontWeight: 700 }}>
                F
              </span>
            </div>
            <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700, lineHeight: 1.1 }}>
              Founder & CEO
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              JRMB Food Network LLC
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "2vh", lineHeight: 1.5 }}
            >
              Wellness entrepreneur with deep roots in food, nutrition, and community health across Latin America and the US
            </div>
          </div>

          <div>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "8vw",
                height: "8vw",
                background: "linear-gradient(135deg, rgba(26,92,58,0.6), rgba(15,31,23,0.8))",
                border: "1px solid rgba(201,151,58,0.35)",
                marginBottom: "2.5vh",
              }}
            >
              <span className="font-display text-accent" style={{ fontSize: "3.5vw", fontWeight: 700 }}>
                T
              </span>
            </div>
            <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700, lineHeight: 1.1 }}>
              Head of Product
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Technology Lead
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "2vh", lineHeight: 1.5 }}
            >
              Full-stack engineer with expertise in AI product development, React/Node infrastructure, and consumer health apps
            </div>
          </div>

          <div>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "8vw",
                height: "8vw",
                background: "linear-gradient(135deg, rgba(26,92,58,0.6), rgba(15,31,23,0.8))",
                border: "1px solid rgba(201,151,58,0.35)",
                marginBottom: "2.5vh",
              }}
            >
              <span className="font-display text-accent" style={{ fontSize: "3.5vw", fontWeight: 700 }}>
                A
              </span>
            </div>
            <div className="font-display text-text" style={{ fontSize: "3vw", fontWeight: 700, lineHeight: 1.1 }}>
              Head of Growth
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              Partnerships & GTM
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "2vh", lineHeight: 1.5 }}
            >
              Background in consumer brand marketing, B2C subscription growth, and wellness influencer partnerships
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
          <div className="flex gap-[5vw]">
            <div>
              <div className="font-display text-accent" style={{ fontSize: "3vw", fontWeight: 700 }}>Advisors</div>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>
                Nutrition science, digital health, and consumer growth specialists
              </div>
            </div>
            <div>
              <div className="font-display text-accent" style={{ fontSize: "3vw", fontWeight: 700 }}>Hiring</div>
              <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>
                Seed funding enables first two full-time engineering hires
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        09
      </div>
    </div>
  );
}
