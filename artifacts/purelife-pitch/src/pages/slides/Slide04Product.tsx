export default function Slide04Product() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0a1a0f 0%, #0F1F17 50%, #111e15 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full" style={{ padding: "5vh 7vw 4vh" }}>
        <div>
          <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "1.5vh" }}>
            <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
            <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
              The Platform
            </span>
          </div>
          <h2
            className="font-display text-text"
            style={{ fontSize: "4vw", fontWeight: 700, lineHeight: 1.1 }}
          >
            Six core features. One coherent experience.
          </h2>
        </div>

        <div
          className="grid flex-1"
          style={{
            marginTop: "3vh",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "1.8vw",
          }}
        >
          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Dr. Smoothie AI
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              AI Chatbot
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              Claude-powered wellness coach personalized to each user's goals and health profile
            </div>
          </div>

          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Smart Nutrition
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              Recipes
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              AI-generated healthy recipes with smart shopping lists, synced in real time
            </div>
          </div>

          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Discovery
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              Store Locator
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              Interactive map to find nearby health food stores, juice bars, and wellness retailers
            </div>
          </div>

          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Content
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              Video Series
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              AI-generated weekly wellness video programs — movement, mindfulness, and nutrition
            </div>
          </div>

          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Community
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              Hub
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              Peer challenges, progress sharing, and expert Q&A for member accountability
            </div>
          </div>

          <div
            style={{
              background: "rgba(26,92,58,0.2)",
              border: "1px solid rgba(201,151,58,0.2)",
              borderRadius: "1vw",
              padding: "2vw",
            }}
          >
            <div className="font-body text-accent uppercase tracking-widest" style={{ fontSize: "2.2vw", fontWeight: 500, marginBottom: "1vh" }}>
              Cross-Platform
            </div>
            <div className="font-display text-text" style={{ fontSize: "2.8vw", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.8vh" }}>
              Mobile App
            </div>
            <div className="font-body text-muted" style={{ fontSize: "2.2vw", fontWeight: 300, lineHeight: 1.4 }}>
              Native iOS and Android via Expo — full feature parity with web
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        04
      </div>
    </div>
  );
}
