export default function Slide05Market() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0F1F17 0%, #0e1c13 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0"
        style={{
          width: "55vw",
          height: "100vh",
          background: "radial-gradient(ellipse 70% 60% at 100% 50%, rgba(26,92,58,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex h-full">
        <div
          className="flex flex-col justify-center"
          style={{ paddingLeft: "7vw", width: "50vw" }}
        >
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "4vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Market Opportunity
            </span>
          </div>

          <div
            className="font-display text-accent"
            style={{ fontSize: "11vw", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em" }}
          >
            $4.5T
          </div>
          <div
            className="font-body text-text"
            style={{ fontSize: "2.8vw", fontWeight: 400, marginTop: "2vh" }}
          >
            Global wellness market in 2024
          </div>
          <div
            className="font-body text-muted"
            style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "1.5vh", lineHeight: 1.5 }}
          >
            Growing at 8.6% CAGR — on track to exceed $6T by 2030. AI-powered wellness tools are the fastest-expanding segment.
          </div>

          <div
            style={{
              marginTop: "5vh",
              paddingTop: "3vh",
              borderTop: "1px solid rgba(201,151,58,0.2)",
            }}
          >
            <div className="font-body text-muted uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 400, marginBottom: "2vh" }}>
              Addressable segments
            </div>
            <div className="flex gap-[3vw]">
              <div>
                <div className="font-display text-text" style={{ fontSize: "3.5vw", fontWeight: 700 }}>$650B</div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>Digital Nutrition</div>
              </div>
              <div>
                <div className="font-display text-text" style={{ fontSize: "3.5vw", fontWeight: 700 }}>$420B</div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>Fitness Apps</div>
              </div>
              <div>
                <div className="font-display text-text" style={{ fontSize: "3.5vw", fontWeight: 700 }}>$180B</div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>Mindfulness Tech</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "50vw", paddingRight: "5vw" }}
        >
          <div
            className="relative"
            style={{ width: "28vw", height: "28vw" }}
          >
            <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,151,58,0.1)" strokeWidth="1" />
              <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(201,151,58,0.15)" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(201,151,58,0.2)" strokeWidth="1" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#C9973A" strokeWidth="3"
                strokeDasharray="280 475" strokeLinecap="round" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="73" fill="rgba(26,92,58,0.3)" stroke="#C9973A" strokeWidth="2"
                strokeDasharray="180 460" strokeLinecap="round" transform="rotate(-90 100 100)" />
              <circle cx="100" cy="100" r="58" fill="rgba(201,151,58,0.15)" stroke="#C9973A" strokeWidth="2"
                strokeDasharray="100 370" strokeLinecap="round" transform="rotate(-90 100 100)" />
              <text x="100" y="88" textAnchor="middle" fill="#C9973A" fontSize="18" fontWeight="bold" fontFamily="Playfair Display">TAM</text>
              <text x="100" y="105" textAnchor="middle" fill="#F5F0E8" fontSize="13" fontFamily="DM Sans">$4.5T</text>
              <text x="100" y="120" textAnchor="middle" fill="#7A9080" fontSize="10" fontFamily="DM Sans">Global</text>
            </svg>
          </div>

          <div className="flex gap-[3vw]" style={{ marginTop: "2vh" }}>
            <div className="flex items-center gap-[0.8vw]">
              <div className="rounded-full bg-accent" style={{ width: "1.2vw", height: "1.2vw" }} />
              <span className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>TAM $4.5T</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="rounded-full bg-secondary" style={{ width: "1.2vw", height: "1.2vw" }} />
              <span className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>SAM $1.2T</span>
            </div>
            <div className="flex items-center gap-[0.8vw]">
              <div className="rounded-full" style={{ width: "1.2vw", height: "1.2vw", background: "rgba(201,151,58,0.4)" }} />
              <span className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300 }}>SOM $85B</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        05
      </div>
    </div>
  );
}
