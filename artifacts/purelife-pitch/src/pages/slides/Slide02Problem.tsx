export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0F1F17 0%, #131f17 60%, #0c1a10 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0"
        style={{
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(201,151,58,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-center h-full" style={{ paddingLeft: "7vw", paddingRight: "7vw" }}>
        <div className="flex items-center gap-[1.5vw]" style={{ marginBottom: "4vh" }}>
          <div className="h-[2px] bg-accent" style={{ width: "3vw" }} />
          <span className="font-body text-accent tracking-[0.2em] uppercase" style={{ fontSize: "2.2vw", fontWeight: 300 }}>
            The Problem
          </span>
        </div>

        <h2
          className="font-display text-text leading-tight"
          style={{ fontSize: "5.5vw", fontWeight: 700, textWrap: "balance", maxWidth: "70vw" }}
        >
          Wellness advice is everywhere.
          <span className="text-muted"> Personalized guidance is not.</span>
        </h2>

        <div
          className="grid gap-[3vw]"
          style={{ marginTop: "6vh", gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <div
            style={{
              borderTop: "1px solid rgba(201,151,58,0.4)",
              paddingTop: "2.5vh",
            }}
          >
            <div
              className="font-display text-accent"
              style={{ fontSize: "4.5vw", fontWeight: 900, lineHeight: 1 }}
            >
              77%
            </div>
            <p
              className="font-body text-text"
              style={{ fontSize: "2.2vw", marginTop: "1.5vh", lineHeight: 1.4, fontWeight: 400 }}
            >
              of adults feel overwhelmed by conflicting wellness information
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(201,151,58,0.4)",
              paddingTop: "2.5vh",
            }}
          >
            <div
              className="font-display text-accent"
              style={{ fontSize: "4.5vw", fontWeight: 900, lineHeight: 1 }}
            >
              $350+
            </div>
            <p
              className="font-body text-text"
              style={{ fontSize: "2.2vw", marginTop: "1.5vh", lineHeight: 1.4, fontWeight: 400 }}
            >
              avg. monthly spend on wellness apps, coaches, and supplements — with poor coordination
            </p>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(201,151,58,0.4)",
              paddingTop: "2.5vh",
            }}
          >
            <div
              className="font-display text-accent"
              style={{ fontSize: "4.5vw", fontWeight: 900, lineHeight: 1 }}
            >
              1 in 3
            </div>
            <p
              className="font-body text-text"
              style={{ fontSize: "2.2vw", marginTop: "1.5vh", lineHeight: 1.4, fontWeight: 400 }}
            >
              wellness app users quit within 30 days — no personalization, no accountability
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,151,58,0.3), transparent)" }}
      />
      <div
        className="absolute bottom-[4vh] right-[5vw] font-body text-muted"
        style={{ fontSize: "2.2vw", fontWeight: 300, letterSpacing: "0.1em" }}
      >
        02
      </div>
    </div>
  );
}
