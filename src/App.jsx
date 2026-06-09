
import React, { useState, useRef, useEffect } from 'react';
import ComingSoonPage + reemplaza LandingScreen
import VideoAgent from './pages/VideoAgent';
import { useHermes } from './hooks/useHermes';
// ── PALETA OFICIAL PURELIFE ─────────────────────────────────
const C = {
  dark:    '#0F1F17',
  green:   '#1A5C3A',
  mint:    '#2D8653',
  light:   '#5CB87A',
  cream:   '#F5F0E8',
  gold:    '#C9973A',
  goldL:   '#E8B84B',
  white:   '#FFFFFF',
  muted:   '#7A9080',
  red:     '#C0392B',
  glass:   'rgba(255,255,255,0.07)',
  glassBorder: 'rgba(255,255,255,0.12)',
};

const FONT_HEAD = "'Georgia', serif";
const FONT_BODY = "'Helvetica Neue', Arial, sans-serif";

// ── SUPABASE CONFIG ─────────────────────────────────────────
const SB_URL = 'https://efatctcxlcotsgxhmgjg.supabase.co';
const SB_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

async function sbFetch(path, opts = {}) {
  const res = await fetch(`${SB_URL}${path}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...opts.headers,
    },
    ...opts,
  });
  return res.json();
}

// ── CLAUDE API — via proxy seguro /api/chat ──────────────────
// El modelo y la API key viven en el servidor (api/chat.js).
// El frontend nunca toca Anthropic directamente.
async function askDrSmoothie(messages, userId, accessToken) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      accessToken,
      system: `Eres Dr. Smoothie AI — el asistente de bienestar de PureLife Wellness Club, 
creado por JRMB Food Network LLC. Eres cálido, experto en nutrición, smoothies y jugos saludables.
Siempre personalizas tus recomendaciones. Respondes en el idioma del usuario.
Nunca das consejos médicos — eres un guía de bienestar. 
Formato: respuestas concisas, usa emojis con moderación, sugiere recetas cuando sea relevante.`,
      messages,
    }),
  });
  const data = await res.json();
  return data?.content?.[0]?.text || 'Lo siento, hubo un error. Intenta de nuevo. 🌿';
}

// ── PLANES ──────────────────────────────────────────────────
const PLANS = [
  {
    id: 'seed', name: 'Seed', emoji: '🌱', price: '$4.99',
    period: '/mes', color: C.light,
    features: ['5 consultas AI/mes', 'Recetas básicas', 'Guías de bienestar', 'Acceso comunidad'],
    stripe: 'https://buy.stripe.com/seed',
  },
  {
    id: 'bloom', name: 'Bloom', emoji: '🌸', price: '$12.99',
    period: '/mes', color: C.gold, popular: true,
    features: ['50 consultas AI/mes', 'Plan nutricional personalizado', 'Video Agent Dr. Smoothie', 'Analytics personal', 'Soporte prioritario'],
    stripe: 'https://buy.stripe.com/bloom',
  },
  {
    id: 'canopy', name: 'Canopy', emoji: '🌿', price: '$24.99',
    period: '/mes', color: C.mint,
    features: ['Consultas ilimitadas', 'AI Coach personal 24/7', 'Recetas exclusivas chef', 'Dashboard analytics pro', 'Video consultations', 'API access'],
    stripe: 'https://buy.stripe.com/canopy',
  },
];

// ── GOALS ───────────────────────────────────────────────────
const GOALS = [
  { id: 'weight_loss', label: 'Bajar de peso', emoji: '⚖️' },
  { id: 'detox', label: 'Detox & limpieza', emoji: '✨' },
  { id: 'energy', label: 'Más energía', emoji: '⚡' },
  { id: 'fitness', label: 'Fitness & músculo', emoji: '💪' },
  { id: 'diabetic', label: 'Control glucosa', emoji: '🩺' },
  { id: 'heart', label: 'Salud cardíaca', emoji: '❤️' },
  { id: 'sleep', label: 'Mejor sueño', emoji: '🌙' },
  { id: 'immunity', label: 'Inmunidad', emoji: '🛡️' },
];

// ── SHARED COMPONENTS ────────────────────────────────────────

function Btn({ children, onClick, variant = 'primary', style = {}, disabled }) {
  const base = {
    border: 'none', borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: FONT_BODY, fontWeight: 700, transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1, ...style,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.mint}, ${C.green})`, color: C.white, padding: '14px 28px', fontSize: 15 },
    gold: { background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`, color: C.dark, padding: '14px 28px', fontSize: 15 },
    ghost: { background: C.glass, border: `1px solid ${C.glassBorder}`, color: C.cream, padding: '12px 24px', fontSize: 14 },
    danger: { background: C.red, color: C.white, padding: '10px 20px', fontSize: 14 },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.glass, border: `1px solid ${C.glassBorder}`,
      borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── SCREEN: SPLASH / ONBOARDING ──────────────────────────────
function SplashScreen({ onContinue }) {
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);

  const toggleGoal = (id) => {
    setSelectedGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  };

  if (step === 0) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      background: `radial-gradient(ellipse at 30% 20%, ${C.green}44 0%, transparent 60%),
                   radial-gradient(ellipse at 70% 80%, ${C.gold}22 0%, transparent 50%),
                   ${C.dark}`,
      textAlign: 'center',
    }}>
      <img src="/purelife-logo.png" alt="PureLife" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, boxShadow: '0 0 40px rgba(201,168,76,0.3)' }} />
      <h1 style={{
        fontFamily: FONT_HEAD, fontSize: 42, color: C.cream,
        margin: '0 0 8px', letterSpacing: '-1px',
      }}>PureLife</h1>
      <p style={{ color: C.goldL, fontSize: 16, fontWeight: 600, marginBottom: 16, letterSpacing: '0.1em' }}>
        WELLNESS CLUB
      </p>
      <p style={{ color: C.muted, fontSize: 15, maxWidth: 300, lineHeight: 1.7, marginBottom: 48 }}>
        Tu guía personal de bienestar con inteligencia artificial — smoothies, nutrición y salud real.
      </p>
      <Btn onClick={() => setStep(1)} style={{ width: '100%', maxWidth: 320, fontSize: 17, padding: '16px' }}>
        Comenzar mi journey 🚀
      </Btn>
      <p style={{ color: C.muted, fontSize: 12, marginTop: 16 }}>
        Powered by Dr. Smoothie AI · JRMB Food Network LLC
      </p>
    </div>
  );

  if (step === 1) return (
    <div style={{
      minHeight: '100vh', padding: '48px 24px',
      background: `radial-gradient(ellipse at top, ${C.green}33 0%, transparent 60%), ${C.dark}`,
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 28, margin: '0 0 8px' }}>
            ¿Cuál es tu objetivo?
          </h2>
          <p style={{ color: C.muted, fontSize: 14 }}>Selecciona uno o más</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
          {GOALS.map(g => (
            <button key={g.id} onClick={() => toggleGoal(g.id)} style={{
              padding: '16px 12px', borderRadius: 14, cursor: 'pointer',
              border: `2px solid ${selectedGoals.includes(g.id) ? C.mint : C.glassBorder}`,
              background: selectedGoals.includes(g.id) ? `${C.mint}22` : C.glass,
              color: C.cream, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{g.emoji}</div>
              {g.label}
            </button>
          ))}
        </div>
        <Btn
          onClick={() => onContinue(selectedGoals)}
          style={{ width: '100%', fontSize: 16, padding: '16px' }}
          disabled={selectedGoals.length === 0}
        >
          Continuar →
        </Btn>
      </div>
    </div>
  );
}

// ── SCREEN: HOME ─────────────────────────────────────────────
function HomeScreen({ user, goals, onNavigate, hermes }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const quickActions = [
    { label: hermes?.suggestedAction?.message || 'Consultar Dr. Smoothie', emoji: '🤖', isAvatar: true, tab: hermes?.suggestedAction?.tab || 'chat', color: C.mint },
    { label: 'Ver mi plan', emoji: '💎', tab: 'plans', color: C.gold },
    { label: 'Mi progreso', emoji: '📊', tab: 'dashboard', color: C.light },
    { label: 'Video AI', emoji: '🎥', tab: 'video', color: '#8B5CF6' },
  ];

  const tips = [
    { emoji: '🥬', title: 'Smoothie del día', desc: 'Espinaca + mango + jengibre — perfecto para energía matutina', tag: 'Energía' },
    { emoji: '💧', title: 'Hidratación', desc: 'Recuerda beber al menos 8 vasos de agua hoy', tag: 'Bienestar' },
    { emoji: '🫐', title: 'Súper alimento', desc: 'Los arándanos reducen el estrés oxidativo — añádelos a tu rutina', tag: 'Nutrición' },
  ];

  const showUpsell = hermes && hermes.upsell && hermes.upsell.show;
  const upsellMsg = showUpsell ? hermes.upsell.message : '';

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: C.muted, fontSize: 13, margin: '0 0 4px' }}>
          {hermes?.welcomeMessage || (greeting + ' 👋')}
        </p>
        <h1 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 30, margin: 0 }}>
          {hermes?.name || user?.name || 'Bienvenido'}
        </h1>
        <p style={{ color: C.light, fontSize: 13, marginTop: 4 }}>
          🌿 Tu journey de bienestar continúa
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Días activo', value: String(hermes?.stats?.daysActive || 0), emoji: '🔥' },
          { label: 'Consultas', value: String(hermes?.stats?.chatCount || 0), emoji: '🤖', isAvatar: true },
          { label: 'Plan', value: hermes?.tierLabel || '🌿', emoji: '💎' },
        ].map(s => (
          <Card key={s.label} style={{ padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>
              {s.isAvatar
                ? <img src="/dr-smoothie-avatar.jpg" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${C.mint}` }} />
                : s.emoji}
            </div>
            <div style={{ color: C.cream, fontWeight: 800, fontSize: 22, fontFamily: FONT_HEAD }}>{s.value}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ color: C.cream, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Acciones rápidas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {quickActions.map(a => (
          <button key={a.tab} onClick={() => onNavigate(a.tab)} style={{
            padding: '18px 14px', borderRadius: 16, cursor: 'pointer',
            border: `1.5px solid ${a.color}44`,
            background: `${a.color}14`,
            color: C.cream, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
            textAlign: 'left', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>
              {a.isAvatar
                ? <img src="/dr-smoothie-avatar.jpg" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.mint}` }} />
                : a.emoji}
            </div>
            {a.label}
          </button>
        ))}
      </div>

      {/* Upsell Banner HERMES */}
      {showUpsell && (
        <div style={{
          background: 'rgba(201,151,58,0.12)',
          border: '1px solid rgba(201,151,58,0.35)',
          borderRadius: 16, padding: '14px 18px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 26 }}>⚡</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#E8B84B', fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>
              {upsellMsg}
            </p>
            <button
              onClick={() => onNavigate('plans')}
              style={{
                background: 'linear-gradient(135deg,#E8B84B,#C9973A)',
                border: 'none', borderRadius: 8, padding: '6px 14px',
                color: '#0F1F17', fontSize: 12, fontWeight: 800, cursor: 'pointer',
              }}
            >
              Ver planes →
            </button>
          </div>
        </div>
      )}

      {/* Tips del día */}
      <h3 style={{ color: C.cream, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        💡 Tips de hoy
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tips.map(t => (
          <Card key={t.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px' }}>
            <div style={{ fontSize: 32 }}>{t.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ color: C.cream, fontWeight: 700, fontSize: 14 }}>{t.title}</span>
                <span style={{
                  background: `${C.mint}33`, color: C.light,
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                }}>{t.tag}</span>
              </div>
              <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SCREEN: CHAT DR. SMOOTHIE AI ─────────────────────────────
function ChatScreen({ user }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy Dr. Smoothie AI 🌿 Tu guía personal de bienestar. ¿En qué te puedo ayudar hoy? Puedo recomendarte smoothies, crear planes nutricionales, o responder tus preguntas de salud.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== 'ai' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      history.push({ role: 'user', content: userMsg });
      const reply = await askDrSmoothie(history, user?.id, user?.token);
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Error de conexión. Verifica tu API key de Anthropic.' }]);
    }
    setLoading(false);
  };

  const suggestions = [
    '🥤 Smoothie para bajar de peso',
    '⚡ Receta energizante mañana',
    '🩺 Jugos para diabéticos',
    '🌙 Smoothie para dormir mejor',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', borderBottom: `1px solid ${C.glassBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/dr-smoothie-avatar.jpg" alt="Dr. Smoothie AI" style={{
            width: 44, height: 44, borderRadius: '50%', objectFit: 'cover',
            border: `2px solid ${C.green}`, boxShadow: '0 0 12px rgba(0,201,123,0.3)',
          }} />
          <div>
            <div style={{ color: C.cream, fontWeight: 800, fontSize: 16 }}>Dr. Smoothie AI</div>
            <div style={{ color: C.light, fontSize: 12 }}>● Online · Powered by Claude</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '82%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user'
                ? `linear-gradient(135deg, ${C.mint}, ${C.green})`
                : C.glass,
              border: m.role === 'ai' ? `1px solid ${C.glassBorder}` : 'none',
              color: C.cream, fontSize: 14, lineHeight: 1.6,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: C.glass, border: `1px solid ${C.glassBorder}`, color: C.muted, fontSize: 14 }}>
              Dr. Smoothie está pensando... 🌿
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{ padding: '8px 20px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => { setInput(s); }} style={{
              whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: 20,
              border: `1px solid ${C.glassBorder}`, background: C.glass,
              color: C.cream, fontSize: 12, fontFamily: FONT_BODY, cursor: 'pointer',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Pregúntale a Dr. Smoothie..."
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: `1.5px solid ${C.glassBorder}`, background: C.glass,
            color: C.cream, fontSize: 14, fontFamily: FONT_BODY,
            outline: 'none',
          }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          width: 48, height: 48, borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
          color: C.white, fontSize: 20, cursor: 'pointer',
          opacity: loading || !input.trim() ? 0.5 : 1,
        }}>→</button>
      </div>
    </div>
  );
}

// ── SCREEN: PLANES ───────────────────────────────────────────
function PlansScreen() {
  const [selected, setSelected] = useState('bloom');

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 28, margin: '0 0 8px' }}>
          Elige tu plan
        </h2>
        <p style={{ color: C.muted, fontSize: 14 }}>Cancela cuando quieras</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLANS.map(plan => (
          <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
            borderRadius: 20, padding: '20px 22px', cursor: 'pointer',
            border: `2px solid ${selected === plan.id ? plan.color : C.glassBorder}`,
            background: selected === plan.id ? `${plan.color}18` : C.glass,
            transition: 'all 0.2s', position: 'relative',
          }}>
            {plan.popular && (
              <div style={{
                position: 'absolute', top: -10, right: 20,
                background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
                color: C.dark, fontSize: 10, fontWeight: 800,
                padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em',
              }}>⭐ MÁS POPULAR</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ color: C.cream, fontWeight: 800, fontSize: 18 }}>
                  {plan.emoji} {plan.name}
                </div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>PureLife Wellness Club</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: plan.color, fontFamily: FONT_HEAD, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>
                  {plan.price}
                </div>
                <div style={{ color: C.muted, fontSize: 11 }}>{plan.period}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.cream, fontSize: 13 }}>
                  <span style={{ color: plan.color, fontWeight: 800 }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <Btn
          variant="gold"
          style={{ width: '100%', fontSize: 16, padding: '16px' }}
          onClick={() => {
            const plan = PLANS.find(p => p.id === selected);
            window.open(plan.stripe, '_blank');
          }}
        >
          Comenzar con {PLANS.find(p => p.id === selected)?.name} →
        </Btn>
        <p style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 10 }}>
          🔒 Pago seguro vía Stripe · Sin contratos
        </p>
      </div>
    </div>
  );
}

// ── SCREEN: DASHBOARD ────────────────────────────────────────
function DashboardScreen() {
  const stats = [
    { label: 'Consultas esta semana', value: 12, max: 50, color: C.mint, emoji: '🤖', isAvatar: true },
    { label: 'Recetas guardadas', value: 5, max: 20, color: C.gold, emoji: '📌' },
    { label: 'Días de racha', value: 7, max: 30, color: C.light, emoji: '🔥' },
    { label: 'Objetivos completados', value: 3, max: 8, color: '#8B5CF6', emoji: '🎯' },
  ];

  const recentActivity = [
    { action: 'Consultaste smoothie detox', time: 'Hace 2 horas', emoji: '🥤' },
    { action: 'Guardaste receta de energía', time: 'Ayer', emoji: '📌' },
    { action: 'Completaste meta semanal', time: 'Hace 2 días', emoji: '🏆' },
    { action: 'Actualizaste objetivos', time: 'Hace 3 días', emoji: '🎯' },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 4px' }}>
          📊 Mi Dashboard
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Plan Bloom 🌸 · Ciclo actual</p>
      </div>

      {/* Progress Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>
                  {s.isAvatar
                    ? <img src="/dr-smoothie-avatar.jpg" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${C.mint}` }} />
                    : s.emoji}
                </span>
                <span style={{ color: C.cream, fontSize: 14, fontWeight: 600 }}>{s.label}</span>
              </div>
              <span style={{ color: s.color, fontWeight: 800, fontSize: 16 }}>
                {s.value}/{s.max}
              </span>
            </div>
            <div style={{ background: `${C.white}15`, borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6,
                background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)`,
                width: `${(s.value / s.max) * 100}%`,
                transition: 'width 1s ease',
              }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Actividad reciente */}
      <h3 style={{ color: C.cream, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        Actividad reciente
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recentActivity.map((a, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 24 }}>{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.cream, fontSize: 13, fontWeight: 600 }}>{a.action}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{a.time}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SCREEN: VIDEO AGENT ──────────────────────────────────────
function VideoScreen() {
  const [status, setStatus] = useState('idle');
  const [topic, setTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const topics = [
    '🥤 Smoothie detox de lunes',
    '⚡ Receta energizante',
    '🩺 Jugos para salud',
    '🌙 Rutina nocturna wellness',
  ];

  const generateVideo = async () => {
    if (!topic) return;
    setStatus('generating');
    // Aquí se conecta HeyGen API v2
    setTimeout(() => {
      setStatus('ready');
      setVideoUrl('https://dr-smoothie-proxy.vercel.app');
    }, 3000);
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎥</div>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 8px' }}>
          Video Agent
        </h2>
        <p style={{ color: C.muted, fontSize: 14 }}>Dr. Smoothie te explica en video · HeyGen AI</p>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <p style={{ color: C.cream, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          ¿Sobre qué quieres el video?
        </p>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Ej: Smoothie para bajar de peso..."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            border: `1.5px solid ${C.glassBorder}`, background: `${C.white}08`,
            color: C.cream, fontSize: 14, fontFamily: FONT_BODY,
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {topics.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={{
              padding: '6px 12px', borderRadius: 20,
              border: `1px solid ${C.glassBorder}`, background: C.glass,
              color: C.cream, fontSize: 12, cursor: 'pointer', fontFamily: FONT_BODY,
            }}>{t}</button>
          ))}
        </div>
      </Card>

      <Btn
        onClick={generateVideo}
        variant="gold"
        disabled={!topic || status === 'generating'}
        style={{ width: '100%', fontSize: 15, padding: '15px' }}
      >
        {status === 'generating' ? '⏳ Generando video...' : '🎬 Generar Video con Dr. Smoothie'}
      </Btn>

      {status === 'ready' && (
        <Card style={{ marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <p style={{ color: C.cream, fontWeight: 700, marginBottom: 12 }}>¡Video listo!</p>
          <Btn onClick={() => window.open(videoUrl, '_blank')} style={{ width: '100%' }}>
            Ver video →
          </Btn>
        </Card>
      )}

      <Card style={{ marginTop: 20, background: `${C.gold}11`, border: `1px solid ${C.gold}33` }}>
        <p style={{ color: C.goldL, fontSize: 12, fontWeight: 700, margin: '0 0 4px' }}>
          ⭐ Plan Bloom o Canopy
        </p>
        <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
          El Video Agent requiere plan Bloom ($12.99/mes) o superior. Conecta HeyGen Creator para activar.
        </p>
      </Card>
    </div>
  );
}

// ── SCREEN: LOGIN / REGISTRO ─────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/v1/token?grant_type=password' : '/auth/v1/signup';
      const body = mode === 'login' ? { email, password } : { email, password, data: { name } };
      const res = await sbFetch(endpoint, { method: 'POST', body: JSON.stringify(body) });
      if (res.error) { setError(res.error.message || 'Error de autenticación'); }
      else { onAuth({ email, name: name || email.split('@')[0], token: res.access_token, id: res.user?.id || res.session?.user?.id }); }
    } catch {
      setError('Error de conexión. Verifica tu configuración de Supabase.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
      background: `radial-gradient(ellipse at top, ${C.green}33 0%, transparent 50%), ${C.dark}`,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/purelife-logo.png" alt="PureLife" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, boxShadow: '0 0 32px rgba(201,168,76,0.3)' }} />
          <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 28, margin: '0 0 6px' }}>
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ color: C.muted, fontSize: 14 }}>PureLife Wellness Club</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Tu nombre" style={inputStyle} />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="Email" style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="Contraseña" style={inputStyle}
            onKeyDown={e => e.key === 'Enter' && handleAuth()} />

          {error && (
            <p style={{ color: '#FF6B6B', fontSize: 13, margin: 0, textAlign: 'center' }}>{error}</p>
          )}

          <Btn onClick={handleAuth} disabled={loading} style={{ width: '100%', fontSize: 16, padding: '15px', marginTop: 4 }}>
            {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </Btn>
        </div>

        <p style={{ color: C.muted, fontSize: 14, textAlign: 'center', marginTop: 20 }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{
            background: 'none', border: 'none', color: C.light,
            cursor: 'pointer', fontWeight: 700, fontSize: 14,
          }}>
            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>

        {/* Demo bypass */}
        <button onClick={() => onAuth({ email: 'demo@purelife.app', name: 'Usuario Demo', token: 'demo' })}
          style={{
            width: '100%', marginTop: 12, padding: '12px',
            background: 'transparent', border: `1px dashed ${C.glassBorder}`,
            color: C.muted, fontSize: 13, borderRadius: 12, cursor: 'pointer', fontFamily: FONT_BODY,
          }}>
          Entrar en modo demo →
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '14px 18px', borderRadius: 12,
  border: `1.5px solid rgba(255,255,255,0.12)`,
  background: 'rgba(255,255,255,0.06)',
  color: '#F5F0E8', fontSize: 14,
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

// ── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ active, onNavigate }) {
  const items = [
    { id: 'home', emoji: '🏠', label: 'Inicio' },
    { id: 'chat', emoji: '🤖', isAvatar: true, label: 'Dr. AI' },
    { id: 'plans', emoji: '💎', label: 'Planes' },
    { id: 'dashboard', emoji: '📊', label: 'Stats' },
    { id: 'video', emoji: '🎬', label: 'Videos' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: `${C.dark}ee`, backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${C.glassBorder}`,
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 0 16px', zIndex: 100,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 12px', borderRadius: 10,
          transition: 'all 0.2s',
        }}>
          <div style={{
            fontSize: 22,
            filter: active === item.id ? 'none' : 'grayscale(60%)',
            transform: active === item.id ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.2s',
          }}>{item.isAvatar
            ? <img src="/dr-smoothie-avatar.jpg" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${active === item.id ? C.mint : 'transparent'}` }} />
            : item.emoji}</div>
          <span style={{
            fontSize: 10, fontFamily: FONT_BODY, fontWeight: 600,
            color: active === item.id ? C.light : C.muted,
          }}>{item.label}</span>
          {active === item.id && (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.light }} />
          )}
        </button>
      ))}
    </div>
  );
}

// ── APP PRINCIPAL ────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('landing'); // landing | splash | auth | app
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const { hermes, loading: hermesLoading } = useHermes(user);

  const handleSplash = (selectedGoals) => {
    setGoals(selectedGoals);
    setScreen('auth');
  };

  const handleAuth = (userData) => {
    setUser(userData);
    setScreen('app');
  };

  // Landing cinematográfica
  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('splash')} />;
  }

  // Splash / Onboarding
  if (screen === 'splash') {
    return (
      <div style={{ background: C.dark, minHeight: '100vh', fontFamily: FONT_BODY }}>
        <SplashScreen onContinue={handleSplash} />
      </div>
    );
  }

  // Auth
  if (screen === 'auth') {
    return (
      <div style={{ background: C.dark, minHeight: '100vh', fontFamily: FONT_BODY }}>
        <AuthScreen onAuth={handleAuth} />
      </div>
    );
  }

  // App principal
  const screens = {
    home: <HomeScreen user={user} goals={goals} onNavigate={setTab} hermes={hermes} />,
    chat: <ChatScreen user={user} />,
    plans: <PlansScreen />,
    dashboard: <DashboardScreen />,
    video: <VideoAgent userTier={hermes?.tier || 'free'} />,
  };

  return (
    <div style={{
      background: `radial-gradient(ellipse at top left, ${C.green}22 0%, transparent 40%),
                   radial-gradient(ellipse at bottom right, ${C.gold}11 0%, transparent 50%),
                   ${C.dark}`,
      minHeight: '100vh', fontFamily: FONT_BODY,
      paddingBottom: 80,
    }}>
      {screens[tab] || screens.home}
      <BottomNav active={tab} onNavigate={setTab} />
    </div>
  );
}

