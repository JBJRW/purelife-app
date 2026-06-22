export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0F1F17 0%, #152b1c 40%, #0F1F17 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0"
        style={{
          width: "50vw",
          height: "50vh",
          background: "radial-gradient(circle at 0% 100%, rgba(26,92,58,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex h-full">
        <div
          className="flex flex-col justify-center"
          style={{ paddingLeft: "7vw", paddingRight: "4vw", width: "55vw" }}
        >
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "4vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              Our Solution
            </span>
          </div>

          <h2
            className="font-display text-text leading-tight"
            style={{ fontSize: "5vw", fontWeight: 700, textWrap: "balance" }}
          >
            One AI wellness companion. Fully adaptive.
          </h2>

          <p
            className="font-body text-muted"
            style={{ fontSize: "2.2vw", marginTop: "3vh", lineHeight: 1.6, fontWeight: 300, maxWidth: "46vw" }}
          >
            PureLife's Dr. Smoothie AI learns your body, goals, and lifestyle — then delivers personalized nutrition, recipes, and daily guidance in real time.
          </p>

          <div style={{ marginTop: "5vh" }}>
            <div className="flex items-start gap-[2vw]" style={{ marginBottom: "3vh" }}>
              <div
                className="flex-shrink-0 font-display text-accent"
                style={{ fontSize: "3vw", fontWeight: 900, lineHeight: 1, marginTop: "0.2vh" }}
              >
                01
              </div>
              <div>
                <div className="font-body text-text" style={{ fontSize: "2.4vw", fontWeight: 500 }}>
                  AI-First Personalization
                </div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>
                  Claude-powered chatbot adapting to each user's health profile, language, and preferences
                </div>
              </div>
            </div>
            <div className="flex items-start gap-[2vw]" style={{ marginBottom: "3vh" }}>
              <div
                className="flex-shrink-0 font-display text-accent"
                style={{ fontSize: "3vw", fontWeight: 900, lineHeight: 1, marginTop: "0.2vh" }}
              >
                02
              </div>
              <div>
                <div className="font-body text-text" style={{ fontSize: "2.4vw", fontWeight: 500 }}>
                  Integrated Platform
                </div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>
                  Recipes, store locator, video series, and community — all in one place, web and mobile
                </div>
              </div>
            </div>
            <div className="flex items-start gap-[2vw]">
              <div
                className="flex-shrink-0 font-display text-accent"
                style={{ fontSize: "3vw", fontWeight: 900, lineHeight: 1, marginTop: "0.2vh" }}
              >
                03
              </div>
              <div>
                <div className="font-body text-text" style={{ fontSize: "2.4vw", fontWeight: 500 }}>
                  15-Language Access
                </div>
                <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, marginTop: "0.5vh" }}>
                  Built for global reach from day one with full internationalization
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "45vw", paddingRight: "5vw" }}
        >
          <div
            className="relative"
            style={{
              width: "30vw",
              background: "linear-gradient(135deg, rgba(26,92,58,0.4) 0%, rgba(15,31,23,0.6) 100%)",
              border: "1px solid rgba(201,151,58,0.25)",
              borderRadius: "1.5vw",
              padding: "3vw",
            }}
          >
            <div
              className="font-body text-accent uppercase tracking-widest"
              style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "2vh" }}
            >
              Dr. Smoothie AI
            </div>
            <div
              className="font-display text-text"
              style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.2, marginBottom: "3vh" }}
            >
              "What should I eat to reduce inflammation?"
            </div>
            <div
              className="font-body text-muted"
              style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.5 }}
            >
              Personalized plan, shopping list, and nearest health store — in under 3 seconds.
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(to right, transparent, #C9973A, transparent)",
                borderBottomLeftRadius: "1.5vw",
                borderBottomRightRadius: "1.5vw",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        03
      </div>
    </div>
  );
}
