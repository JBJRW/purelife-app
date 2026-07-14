// ================================================================
// PureLife — OnboardingChat.jsx
// Dr. Smoothie AI como guía post-registro
// Claude API + fallback predefinido + botones interactivos
// JRMB Food Network LLC · 2026
// ================================================================

import { useState, useEffect, useRef } from 'react';

const AVATAR = '/dr-smoothie-avatar.jpg';

const C = {
  obsidian: '#080B0A', deep: '#0D1210', surface: '#111815',
  surface2: '#162019', gold: '#C9A84C', gold2: '#E8C96A',
  cream: '#F4EFE6', cream2: '#E8E0D0', sage: '#4A7C59',
  emerald: '#00C97B', muted: '#6B7E74',
  border: 'rgba(201,168,76,0.15)', border2: 'rgba(201,168,76,0.08)',
};

// ── FLOW DE ONBOARDING ──────────────────────────────────────────
const FLOW = [
  {
    id: 'welcome',
    msg: (name) => `¡Hola ${name}! 🌿 Soy Dr. Smoothie AI, tu guía personal de bienestar en PureLife Wellness Club.\n\nEstoy aquí para acompañarte en tu transformación. ¿Por dónde quieres empezar?`,
    options: [
      { label: '¿Qué puedo hacer aquí?', next: 'features' },
      { label: '¿Cómo funciona el diagnóstico?', next: 'diagnosis' },
      { label: 'Quiero empezar ya 🚀', next: 'start' },
    ],
  },
  {
    id: 'features',
    msg: () => `PureLife tiene 5 módulos poderosos para ti:\n\n🧬 **Diagnóstico personalizado** — Analizo tus síntomas y objetivos\n🥤 **Recetas y protocolos** — Plan nutricional específico para ti\n📍 **Localizador de tiendas** — Ingredientes cerca de ti en tiempo real\n🎬 **PureLife TV** — Videos 4K con recetas cinematográficas\n🏆 **Sistema de progreso** — Seguimiento y alarmas personalizadas\n\n¿Cuál te interesa más?`,
    options: [
      { label: '🧬 El diagnóstico', next: 'diagnosis' },
      { label: '🎬 Los videos', next: 'videos' },
      { label: '📍 El localizador', next: 'locator' },
      { label: 'Comenzar diagnóstico', next: 'start' },
    ],
  },
  {
    id: 'diagnosis',
    msg: () => `El diagnóstico inicial toma 3 minutos ⏱️\n\nTe haré preguntas sobre:\n• Tu energía actual y calidad de sueño\n• Objetivos de salud (peso, digestión, inflamación, etc.)\n• Alergias e intolerancias\n• Tu rutina diaria\n\nCon esas respuestas creo un **protocolo 100% personalizado** de smoothies y jugos para ti. Los resultados los iremos ajustando cada semana.\n\n¿Estás listo para comenzar?`,
    options: [
      { label: '¡Sí, comenzar diagnóstico! 🎯', next: 'start' },
      { label: '¿Cuánto tiempo lleva ver resultados?', next: 'results' },
    ],
  },
  {
    id: 'videos',
    msg: () => `PureLife TV tiene contenido exclusivo 🎬\n\n• Videos 4K de recetas preparados con IA\n• Series semanales temáticas (detox, energía, anti-inflamatorio)\n• Avatar Dr. Smoothie como instructor\n• Nuevos videos cada semana\n\nSegún tu plan (Seed/Bloom/Canopy) tienes acceso a diferentes categorías. Los videos Canopy incluyen coaching 1:1 en video.\n\n¿Seguimos?`,
    options: [
      { label: 'Ver mis videos disponibles', next: 'start' },
      { label: 'Ver el localizador de tiendas', next: 'locator' },
    ],
  },
  {
    id: 'locator',
    msg: () => `El localizador usa tu ubicación GPS en tiempo real 📍\n\nBusca tiendas de productos naturales cerca de ti, muestra qué ingredientes tienen disponibles y conecta tu lista de compras del protocolo con las tiendas más cercanas.\n\n¡Nunca más llegarás a casa sin los ingredientes correctos! 🌿`,
    options: [
      { label: '¡Genial! Comenzar diagnóstico', next: 'start' },
      { label: '¿Cómo funcionan las alarmas?', next: 'reminders' },
    ],
  },
  {
    id: 'reminders',
    msg: () => `Las alarmas personalizadas te mantienen en ritmo ⏰\n\nPuedes configurar recordatorios para:\n• 🥤 "Hora de tu smoothie verde"\n• 🛒 "Comprar ingredientes hoy"\n• 🎬 "Nuevo video semanal disponible"\n• 📊 "Registrar tu progreso"\n\nCada alarma incluye un mensaje motivacional mío con datos nutricionales relevantes. ¡Como tener un coach personal 24/7!`,
    options: [
      { label: 'Perfecto, comenzar ahora 🚀', next: 'start' },
      { label: '¿Qué pasa a los 30 días?', next: 'exam' },
    ],
  },
  {
    id: 'results',
    msg: () => `Los resultados son progresivos y reales 📈\n\n**Semana 1-2:** Más energía matutina, mejor hidratación\n**Semana 3-4:** Mejora digestiva, menos inflamación\n**Mes 2-3:** Cambios visibles en peso y tono de piel\n**Mes 3+:** Hábitos consolidados, protocolo optimizado\n\nA los 30 días hacemos un **examen de progreso** donde mides tus avances y puedes crear un video testimonial para compartir. ¡Muchos miembros ven resultados desde la primera semana!`,
    options: [
      { label: 'Quiero empezar ya 🎯', next: 'start' },
      { label: '¿Qué es el examen de 30 días?', next: 'exam' },
    ],
  },
  {
    id: 'exam',
    msg: () => `El examen de progreso es especial ✨\n\nA los 30 días (o cuando completes 20 acciones), te invito a:\n1. Responder preguntas de progreso (energía, sueño, digestión)\n2. Comparar con tu diagnóstico inicial\n3. Opcionalmente subir análisis de laboratorio\n4. **Generar un video testimonial con IA** que puedes compartir en redes\n\nEs tu momento de celebrar y motivar a otros. ¡Los videos testimoniales son virales! 🎬`,
    options: [
      { label: '¡Increíble! Empecemos ya 🚀', next: 'start' },
    ],
  },
  {
    id: 'start',
    msg: (name) => `¡Perfecto ${name}! 🌿 Estás a punto de comenzar tu journey de bienestar.\n\nEl diagnóstico toma 3 minutos y después tendrás tu protocolo personalizado listo. ¡Vamos!`,
    options: [],
    action: 'go_to_diagnosis',
  },
];

// ── FALLBACK RESPUESTAS ──────────────────────────────────────────
const FALLBACK_REPLIES = [
  'Entiendo tu pregunta. Lo más importante ahora es completar tu diagnóstico para que pueda darte recomendaciones personalizadas. ¿Seguimos?',
  'Excelente punto. Basado en lo que me dices, el diagnóstico inicial nos ayudará a definir exactamente tu protocolo. ¿Empezamos?',
  'Eso es muy importante para tu salud. Una vez completes el diagnóstico, podremos trabajar específicamente en eso. ¿Continuamos?',
];

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function OnboardingChat({ user, onComplete }) {
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'amigo';
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef(null);
  const fallbackIdx = useRef(0);

  useEffect(() => {
    // Mensaje inicial con delay cinematográfico
    setTimeout(() => {
      const first = FLOW.find(f => f.id === 'welcome');
      addMessage('ai', first.msg(name));
    }, 600);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type, text, options = []) => {
    setMessages(prev => [...prev.filter(m => m.type !== 'typing'), { type, text, options, id: Date.now() }]);
  };

  const addTyping = () => {
    setMessages(prev => [...prev, { type: 'typing', id: 'typing' }]);
  };

  const handleOption = async (option) => {
    // Mensaje del usuario
    addMessage('user', option.label);
    setLoading(true);
    addTyping();

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const step = FLOW.find(f => f.id === option.next);
    if (step) {
      setCurrentStep(step.id);
      addMessage('ai', step.msg(name), step.options);
      if (step.action === 'go_to_diagnosis') {
        setTimeout(() => setDone(true), 1200);
      }
    }
    setLoading(false);
  };

  const handleFreeText = async () => {
    if (!inputVal.trim()) return;
    const question = inputVal.trim();
    setInputVal('');
    addMessage('user', question);
    setLoading(true);
    addTyping();

    try {
      // Intentar Claude API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[ONBOARDING] Usuario pregunta: "${question}". Responde brevemente (máx 3 líneas) y guíalo a completar el diagnóstico inicial.`,
          userId: user?.id,
          accessToken: user?.access_token,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || data.content || FALLBACK_REPLIES[fallbackIdx.current % FALLBACK_REPLIES.length];
        const step = FLOW.find(f => f.id === currentStep);
        addMessage('ai', reply, step?.options || []);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback predefinido
      const reply = FALLBACK_REPLIES[fallbackIdx.current % FALLBACK_REPLIES.length];
      fallbackIdx.current++;
      const step = FLOW.find(f => f.id === currentStep);
      addMessage('ai', reply, step?.options || []);
    }
    setLoading(false);
  };

  // ── PANTALLA DE DIAGNÓSTICO ──────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <img src={AVATAR} alt="Dr. Smoothie" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${C.emerald}`, marginBottom: 24, boxShadow: `0 0 40px rgba(0,201,123,0.4)` }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: C.cream, marginBottom: 12 }}>¡Listo para empezar!</h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>Completaste el tour. Ahora vamos a tu diagnóstico personalizado. Solo toma 3 minutos.</p>
          <button
            onClick={onComplete}
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '16px 40px', borderRadius: 50, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: `0 8px 32px rgba(201,168,76,0.4)` }}
          >
            Iniciar diagnóstico 🎯
          </button>
        </div>
      </div>
    );
  }

  const currentOptions = FLOW.find(f => f.id === currentStep)?.options || [];

  return (
    <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: C.deep, borderBottom: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <img src={AVATAR} alt="Dr. Smoothie" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.emerald}` }} />
        <div>
          <div style={{ fontWeight: 700, color: C.cream, fontSize: 15 }}>Dr. Smoothie AI</div>
          <div style={{ fontSize: 11, color: C.emerald, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Guía de bienvenida · PureLife
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>Paso 1 de 2</div>
      </div>

      {/* Messages */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto', width: '100%' }}>
        {messages.map(msg => {
          if (msg.type === 'typing') return (
            <div key="typing" style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <img src={AVATAR} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: '4px 20px 20px 20px', padding: '12px 18px' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.muted, animation: `bounce 1.2s ${d}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          );

          if (msg.type === 'ai') return (
            <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
              <img src={AVATAR} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: '4px 20px 20px 20px', padding: '14px 18px', fontSize: 14, color: C.cream, lineHeight: 1.7, maxWidth: '85%', whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
                {/* Options */}
                {msg.options && msg.options.length > 0 && !loading && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                    {msg.options.map((opt, i) => (
                      <button key={i} onClick={() => handleOption(opt)} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 40, padding: '8px 16px', color: C.gold2, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.target.style.background = `rgba(201,168,76,0.1)`; e.target.style.borderColor = C.gold; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = C.border; }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );

          if (msg.type === 'user') return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', animation: 'fadeUp 0.3s ease' }}>
              <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, borderRadius: '20px 20px 4px 20px', padding: '12px 18px', fontSize: 14, fontWeight: 500, maxWidth: '75%' }}>
                {msg.text}
              </div>
            </div>
          );
          return null;
        })}
      </div>

      {/* Input libre */}
      <div style={{ background: C.deep, borderTop: `1px solid ${C.border2}`, padding: '12px 20px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
        {!showInput ? (
          <button onClick={() => setShowInput(true)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
            ¿Tienes otra pregunta? Escríbela aquí →
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFreeText()}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 24, padding: '10px 16px', color: C.cream, fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
            />
            <button onClick={handleFreeText} disabled={loading} style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, border: 'none', color: C.obsidian, cursor: 'pointer', fontSize: 16 }}>➤</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
