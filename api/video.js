// api/video.js — PureLife Video Agent
// Genera script cinematográfico con Claude.
// Integración fal.ai cuando FAL_KEY esté disponible.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { ingredients, goal, model, resolution, duration } = req.body;
  if (!ingredients) return res.status(400).json({ error: "ingredients required" });

  try {
    // PASO 1: Claude genera el script cinematográfico
    const scriptResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        max_tokens: 600,
        system: "Eres un director de cine especializado en contenido wellness. Generas scripts cinematográficos para videos de smoothies y jugos saludables. Siempre en español. Formato: TITLE, SCENES (3-4 escenas visuales detalladas), NARRATION (voz en off 30 palabras max), HASHTAGS (5 hashtags).",
        messages: [{
          role: "user",
          content: `Crea un script de video ${duration || 10} segundos para un smoothie ${goal || "saludable"} con estos ingredientes: ${ingredients}. Modelo de video: ${model || "kling"}. Resolución: ${resolution || "1080p"}.`
        }]
      }),
    });

    const scriptData = await scriptResponse.json();
    if (!scriptResponse.ok) throw new Error(scriptData.error?.message || "Error generando script");

    const script = scriptData.content?.[0]?.text || "";

    // PASO 2: Intentar fal.ai si hay key disponible
    const falKey = process.env.FAL_KEY;
    let videoUrl = null;
    let videoStatus = "script_ready";

    if (falKey && ingredients) {
      try {
        // Generar prompt visual para fal.ai
        const visualPrompt = `Cinematic ${resolution || "1080p"} smoothie video, ${goal} health drink, ingredients: ${ingredients}. Close-up shots, vibrant colors, natural light, professional food photography style, ${duration || 10} seconds`;

        const falRes = await fetch("https://fal.run/fal-ai/kling-video/v1.6/standard/text-to-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Key ${falKey}`,
          },
          body: JSON.stringify({
            prompt: visualPrompt,
            duration: parseInt(duration) || 10,
            aspect_ratio: "16:9",
          }),
        });

        if (falRes.ok) {
          const falData = await falRes.json();
          videoUrl = falData.video?.url || falData.url || null;
          videoStatus = videoUrl ? "video_ready" : "script_ready";
        }
      } catch (falErr) {
        console.log("[Video] fal.ai no disponible:", falErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      script,
      videoUrl,
      status: videoStatus,
      model: model || "kling",
      resolution: resolution || "1080p",
      message: videoUrl
        ? "✅ Video generado con fal.ai"
        : "✅ Script listo — activa FAL_KEY en Vercel para video real",
    });

  } catch (err) {
    console.error("[Video] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
