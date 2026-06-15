
import React, { useState, useRef, useEffect } from 'react';
import { loadLang, saveLang, tui } from './i18n';
import LanguageSelector from './components/LanguageSelector';
import ComingSoonPage from './comingsoonpage';
import VideoAgent from './pages/VideoAgent';
import RecipesScreen from './pages/RecipesScreen';
import MapScreen from './pages/MapScreen';
import OnboardingChat from './components/OnboardingChat';
import ReminderSystem from './components/ReminderSystem';
import ProgressExam from './components/ProgressExam';
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
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
async function askDrSmoothie(message, history, userId, accessToken, lang = "en") {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      accessToken,
      message,
      history: history.slice(-10),
      lang,
    }),
  });
  const data = await res.json();
  return data?.reply || data?.content?.[0]?.text || 'Lo siento, hubo un error. Intenta de nuevo. 🌿';
}

// ── PLANES ──────────────────────────────────────────────────
// IMPECCABLE: precios reales Stripe — Seed $29 / Bloom $49 / Canopy $79 / Anual $182
const PLAN_TAGLINES = {
  seed:   { en: 'Start seeing results',         es: 'Empieza a ver resultados'      },
  bloom:  { en: 'Your body responds in 21 days', es: 'Tu cuerpo responde en 21 días' },
  canopy: { en: 'Full access. No limits.',       es: 'Acceso total. Sin límites.'    },
};
const getPlans = (lang = 'en') => [
  {
    id: 'seed', name: 'Seed', emoji: '🌱', price: '$29',
    period: '/mo', color: C.light,
    tagline: PLAN_TAGLINES.seed[lang] || PLAN_TAGLINES.seed.en,
    features: tui(lang,'features','seed'),
    stripe: 'https://buy.stripe.com/eVa5nf7Iz6dI7Ly9AB',
  },
  {
    id: 'bloom', name: 'Bloom', emoji: '🌸', price: '$49',
    period: '/mo', color: C.gold, popular: true,
    tagline: PLAN_TAGLINES.bloom[lang] || PLAN_TAGLINES.bloom.en,
    features: tui(lang,'features','bloom'),
    stripe: 'https://buy.stripe.com/eVa5nf7Iz6dI7Ly9AB',
  },
  {
    id: 'canopy', name: 'Canopy', emoji: '🌿', price: '$79',
    period: '/mo', color: C.goldL,
    tagline: PLAN_TAGLINES.canopy[lang] || PLAN_TAGLINES.canopy.en,
    features: tui(lang,'features','canopy'),
    stripe: 'https://buy.stripe.com/eVa5nf7Iz6dI7Ly9AB',
  },
];
const PLANS = getPlans();

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
function SplashScreen({ onContinue, lang = 'en' }) {
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
function HomeScreen({ user, goals, onNavigate, hermes, lang = 'en' }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? tui(lang,'greeting_morning') : hour < 18 ? tui(lang,'greeting_afternoon') : tui(lang,'greeting_evening');

  const quickActions = [
    { label: hermes?.suggestedAction?.message || 'Consultar Dr. Smoothie', emoji: '🤖', isAvatar: true, tab: hermes?.suggestedAction?.tab || 'chat', color: C.mint },
    { label: '🍽️ Mis Recetas', emoji: '🍽️', tab: 'recipes', color: C.gold },
    { label: '🗺️ Tiendas cercanas', emoji: '🗺️', tab: 'map', color: C.light },
    { label: '🎥 Video AI', emoji: '🎥', tab: 'video', color: '#8B5CF6' },
  ];

  const tips = [
    { emoji: '🥬', title: tui(lang,'smoothieOfDay'), desc: tui(lang,'smoothieDesc'), tag: tui(lang,'energyTag') },
    { emoji: '💧', title: tui(lang,'hydration'), desc: tui(lang,'hydrationDesc'), tag: tui(lang,'wellnessTag') },
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
          { label: tui(lang,'daysActive'), value: String(hermes?.stats?.daysActive || 0), emoji: '🔥' },
          { label: tui(lang,'consultations'), value: String(hermes?.stats?.chatCount || 0), emoji: '🤖', isAvatar: true },
          { label: tui(lang,'plan'), value: hermes?.tierLabel || '🌿', emoji: '💎' },
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

// ── SCREEN: CHAT DR. SMOOTHIE AI + VOZ ───────────────────────
function ChatScreen({ user, hermes, lang = 'en' }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: tui(lang, 'chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar Web Speech API
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      setVoiceSupported(true);
      const rec = new SpeechRec();
      rec.lang = lang === 'es' ? 'es-ES' : lang === 'pt' ? 'pt-BR' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
        // Auto-enviar después de reconocimiento de voz
        setTimeout(() => sendMessage(text), 300);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [lang]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (textOverride) => {
    const userMsg = (textOverride || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(1, -1).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }));
      const reply = await askDrSmoothie(userMsg, history, user?.id, user?.token, lang);
      setMessages(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Error de conexión. Verifica tu conexión a internet.' }]);
    }
    setLoading(false);
  };

  const suggestions = tui(lang, 'suggestions') || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', borderBottom: `1px solid ${C.glassBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/dr-smoothie-avatar.jpg" alt="Dr. Smoothie AI" style={{
            width: 44, height: 44, borderRadius: '50%', objectFit: 'cover',
            border: `2px solid ${C.green}`, boxShadow: '0 0 12px rgba(0,201,123,0.3)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: C.cream, fontWeight: 800, fontSize: 16 }}>Dr. Smoothie AI</div>
            <div style={{ color: C.light, fontSize: 12 }}>● Online · Claude · {voiceSupported ? '🎙️ Voz activada' : ''}</div>
          </div>
          {hermes?.permissions && (
            <div style={{
              fontSize: 11, color: hermes.permissions.chatRemaining > 0 ? C.mint : C.gold,
              background: 'rgba(255,255,255,0.06)', padding: '4px 10px',
              borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap',
            }}>
              {hermes.permissions.chatRemaining > 50 ? '∞' : hermes.permissions.chatRemaining} {tui(lang,'chatRemaining')}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {m.role === 'ai' && (
              <img src="/dr-smoothie-avatar.jpg" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 8, alignSelf: 'flex-end', flexShrink: 0 }} />
            )}
            <div style={{
              maxWidth: '78%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user'
                ? `linear-gradient(135deg, ${C.mint}, ${C.green})`
                : C.glass,
              border: m.role === 'ai' ? `1px solid ${C.glassBorder}` : 'none',
              color: C.cream, fontSize: 14, lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            <img src="/dr-smoothie-avatar.jpg" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: C.glass, border: `1px solid ${C.glassBorder}`, color: C.muted, fontSize: 14 }}>
              🌿 Pensando...
            </div>
          </div>
        )}
        {/* Indicador de voz activa */}
        {isListening && (
          <div style={{ textAlign: 'center', padding: '12px', color: C.light, fontSize: 13, animation: 'pulse 1s infinite' }}>
            🎙️ Escuchando... habla ahora
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

      {/* Input + Voice */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8 }}>
        {/* Botón de voz */}
        {voiceSupported && (
          <button onClick={toggleVoice} style={{
            width: 48, height: 48, borderRadius: 14, border: 'none',
            background: isListening ? `linear-gradient(135deg, ${C.red}, #8B1A1A)` : C.glass,
            border: `1.5px solid ${isListening ? C.red : C.glassBorder}`,
            color: C.cream, fontSize: 18, cursor: 'pointer',
            flexShrink: 0, transition: 'all 0.2s',
            animation: isListening ? 'pulse 1s infinite' : 'none',
          }}>
            {isListening ? '⏹' : '🎙️'}
          </button>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={isListening ? 'Escuchando...' : tui(lang, 'chatPlaceholder')}
          style={{
            flex: 1, padding: '14px 18px', borderRadius: 14,
            border: `1.5px solid ${C.glassBorder}`, background: C.glass,
            color: C.cream, fontSize: 14, fontFamily: FONT_BODY,
            outline: 'none',
          }}
        />
        <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
          width: 48, height: 48, borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
          color: C.white, fontSize: 20, cursor: 'pointer',
          opacity: loading || !input.trim() ? 0.5 : 1,
        }}>→</button>
      </div>
    </div>
  );
}

// ── SCREEN: PLANES v2 ────────────────────────────────────────
// Skills: Emil Kowalski (spring CSS) · Taste (copy+hierarchy) · Impeccable (precios reales)
function PlansScreen({ hermes, user, lang = 'en' }) {
  const PLANS = getPlans(lang);
  // IMPECCABLE: tier real desde hermes o Supabase — nunca asume 'free' sin verificar
  const activeTier = hermes?.tier || user?.membership_tier || 'free';
  const [selected, setSelected] = useState('bloom');
  const [loading, setLoading]   = useState(false);

  // IMPECCABLE: CSS motion inyectado una vez
  React.useEffect(() => {
    const id = 'pl-plans-css';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = `
        @media (prefers-reduced-motion: reduce) {
          .pl-pcard, .pl-pcta { transition: none !important; }
        }
        .pl-pcard {
          transition:
            transform  220ms cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 220ms ease,
            border-color 180ms ease,
            background  180ms ease;
          cursor: pointer;
        }
        .pl-pcard:hover  { transform: translateY(-2px); }
        .pl-pcard:active { transform: scale(0.99); }
        .pl-pcta {
          transition:
            transform  160ms cubic-bezier(0.34,1.56,0.64,1),
            opacity    160ms ease,
            background 160ms ease;
        }
        .pl-pcta:hover  { transform: translateY(-1px); opacity: 0.92; }
        .pl-pcta:active { transform: scale(0.97); }
        @keyframes pl-fadeUp {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .pl-enter    { animation: pl-fadeUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
        .pl-enter-d1 { animation-delay: 60ms;  }
        .pl-enter-d2 { animation-delay: 130ms; }
        .pl-enter-d3 { animation-delay: 200ms; }
      `;
      document.head.appendChild(el);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const handleCheckout = async () => {
    const plan = PLANS.find(p => p.id === selected);
    if (!plan) return;
    setLoading(true);
    try {
      // Intentar checkout via API (plan anual $182 — mejor valor)
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || '',
          name: user?.name || '',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback a link directo de Stripe
        window.open(plan.stripe, '_blank');
      }
    } catch {
      // IMPECCABLE: fallback siempre funciona
      window.open(plan.stripe, '_blank');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLANS.find(p => p.id === selected);

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>

      {/* TASTE: header limpio — sin emoji 💎 decorativo que no aporta */}
      <div className="pl-enter" style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{
          fontSize: 11, color: C.gold, letterSpacing: '0.14em',
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
        }}>
          Planes
        </p>
        {/* TASTE: headline = promesa, no "Elige tu plan" que es instrucción */}
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 6px', fontWeight: 700 }}>
          Tu cuerpo. Tu ritmo.
        </h2>
        {/* TASTE: beneficio concreto + garantía — no "Cancela cuando quieras" genérico */}
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
          Resultados en 21 días — o te devolvemos tu dinero.
        </p>
      </div>

      {/* Plan actual activo — solo si el usuario ya tiene uno */}
      {activeTier !== 'free' && (
        <div className="pl-enter pl-enter-d1" style={{
          background: 'rgba(201,151,58,0.08)',
          border: '1px solid rgba(201,151,58,0.25)',
          borderRadius: 10, padding: '10px 14px',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13 }}>✓</span>
          {/* TASTE: información contextual, no repetición del nombre del plan */}
          <p style={{ fontSize: 12, color: C.gold, margin: 0 }}>
            Tu plan actual: <strong style={{ textTransform: 'capitalize' }}>{activeTier}</strong>
          </p>
        </div>
      )}

      {/* Cards — EMIL: fade-up escalonado */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PLANS.map((plan, i) => {
          const isSelected = selected === plan.id;
          const isCurrent  = activeTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`pl-pcard pl-enter pl-enter-d${i + 1}`}
              onClick={() => setSelected(plan.id)}
              style={{
                borderRadius: 18, padding: '18px 20px',
                border: `1.5px solid ${isSelected ? plan.color : C.glassBorder}`,
                background: isSelected ? `${plan.color}12` : C.glass,
                position: 'relative',
                // EMIL: shadow gold en seleccionado
                boxShadow: isSelected
                  ? `0 0 0 1px ${plan.color}25, 0 6px 24px rgba(0,0,0,0.25)`
                  : '0 1px 3px rgba(0,0,0,0.15)',
              }}
            >
              {/* TASTE: badge "MÁS POPULAR" sin emoji — limpio */}
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -10, right: 18,
                  background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
                  color: C.dark, fontSize: 9, fontWeight: 800,
                  padding: '4px 12px', borderRadius: 99,
                  letterSpacing: '0.1em', fontFamily: FONT_BODY,
                }}>
                  MÁS POPULAR
                </div>
              )}

              {/* Plan header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{
                    color: C.cream, fontWeight: 700, fontSize: 17,
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3,
                  }}>
                    {plan.emoji} {plan.name}
                    {/* TASTE: badge "Plan actual" solo si aplica — no siempre */}
                    {isCurrent && (
                      <span style={{
                        fontSize: 9, color: plan.color,
                        border: `1px solid ${plan.color}50`,
                        padding: '2px 7px', borderRadius: 99,
                        letterSpacing: '0.08em', fontWeight: 700,
                      }}>
                        ACTIVO
                      </span>
                    )}
                  </div>
                  {/* TASTE: tagline específico por tier — no "PureLife Wellness Club" en cada card */}
                  <div style={{ color: C.muted, fontSize: 12 }}>{plan.tagline}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{
                    color: plan.color, fontFamily: FONT_HEAD,
                    fontSize: 28, fontWeight: 800, lineHeight: 1,
                  }}>
                    {plan.price}
                  </div>
                  <div style={{ color: C.muted, fontSize: 11 }}>{plan.period}</div>
                </div>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {plan.features.map(f => (
                  <div key={f} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    color: isSelected ? C.cream : C.muted, fontSize: 13,
                    transition: 'color 180ms ease',
                  }}>
                    <span style={{ color: plan.color, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA — TASTE: 1 botón primario. Info útil debajo, no decorativa. */}
      <div style={{ marginTop: 20 }}>
        <button
          className="pl-pcta"
          disabled={loading}
          onClick={handleCheckout}
          style={{
            width: '100%', padding: '15px', borderRadius: 12,
            border: 'none', cursor: loading ? 'wait' : 'pointer',
            background: loading
              ? `rgba(201,151,58,0.5)`
              : `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
            color: C.dark, fontSize: 15, fontWeight: 700,
            fontFamily: FONT_BODY, opacity: loading ? 0.8 : 1,
          }}
        >
          {loading
            ? 'Preparando checkout...'
            // TASTE: CTA = nombre del plan seleccionado + acción
            : `Empezar con ${selectedPlan?.name} — ${selectedPlan?.price}/mo`
          }
        </button>

        {/* TASTE: garantía concreta + seguridad — no solo un ícono 🔒 */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16,
          marginTop: 10,
        }}>
          {['🔒 Pago seguro vía Stripe', 'Sin contratos', '30 días garantía'].map(t => (
            <p key={t} style={{ color: C.muted, fontSize: 10, margin: 0 }}>{t}</p>
          ))}
        </div>
      </div>

      {/* TASTE: anual — opción secundaria visible pero subordinada */}
      <div style={{
        marginTop: 16, padding: '12px 16px', borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center',
      }}>
        <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
          ¿Prefieres pagar anual?{' '}
          <span
            onClick={() => window.open('https://buy.stripe.com/eVa5nf7Iz6dI7Ly9AB', '_blank')}
            style={{ color: C.gold, cursor: 'pointer', fontWeight: 600 }}
          >
            $182/año — ahorra 2 meses →
          </span>
        </p>
      </div>
    </div>
  );
}

// ── SCREEN: DASHBOARD ────────────────────────────────────────
function DashboardScreen({ user, hermes, lang = 'en' }) {
  const tier      = hermes?.tier || 'free';
  const tierLabel = hermes?.tierLabel || 'Free 🌿';
  const chatUsed  = hermes?.permissions?.chatUsed || 0;
  const chatLimit = hermes?.permissions?.chatLimit || 3;
  const daysActive = hermes?.stats?.daysActive || 0;
  const chatCount  = hermes?.stats?.chatCount || 0;

  const stats = [
    { label: tui(lang,'consultationsMonth'), value: chatUsed, max: chatLimit, color: C.mint, emoji: '🤖', isAvatar: true },
    { label: tui(lang,'daysActiveLabel'), value: daysActive, max: 30,      color: C.gold,  emoji: '🔥' },
    { label: tui(lang,'totalConsultations'), value: chatCount, max: 999,     color: C.light, emoji: '💬' },
    { label: tui(lang,'activeGoals'), value: 1, max: 5,       color: '#8B5CF6', emoji: '🎯' },
  ];

  const recentActivity = [
    { action: tui(lang,'activity1'), time: tui(lang,'recent'), emoji: '🥤' },
    { action: tui(lang,'activity2'), time: tui(lang,'today'),  emoji: '🎬' },
    { action: tui(lang,'activity3'), time: tui(lang,'recent'), emoji: '🌿' },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 4px' }}>
          📊 {tui(lang,'dashboardTitle')}
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>{tierLabel} · {tui(lang,'currentCycle')}</p>
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
                width: `${Math.min((s.value / s.max) * 100, 100)}%`,
                transition: 'width 1s ease',
              }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Actividad reciente */}
      <h3 style={{ color: C.cream, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        {tui(lang,'recentActivity')}
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
        <button onClick={() => onAuth({ email: 'demo@purelife.app', name: 'Usuario Demo', token: 'demo', id: 'demo' })}
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

// ── BOTTOM NAV — 7 tabs ──────────────────────────────────────
function BottomNav({ active, onNavigate, lang = 'en' }) {
  const items = [
    { id: 'home',      emoji: '🏠', label: tui(lang,'nav','home') || 'Inicio' },
    { id: 'chat',      emoji: '🤖', isAvatar: true, label: tui(lang,'nav','chat') || 'AI' },
    { id: 'recipes',   emoji: '🍽️', label: 'Recetas' },
    { id: 'map',       emoji: '🗺️', label: 'Mapa' },
    { id: 'dashboard', emoji: '📊', label: tui(lang,'nav','dashboard') || 'Stats' },
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
          padding: '4px 8px', borderRadius: 10,
          transition: 'all 0.2s',
        }}>
          <div style={{
            fontSize: 20,
            filter: active === item.id ? 'none' : 'grayscale(60%)',
            transform: active === item.id ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.2s',
          }}>{item.isAvatar
            ? <img src="/dr-smoothie-avatar.jpg" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${active === item.id ? C.mint : 'transparent'}` }} />
            : item.emoji}</div>
          <span style={{
            fontSize: 9, fontFamily: FONT_BODY, fontWeight: 600,
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
  const [lang, setLang] = useState(() => loadLang());
  const [screen, setScreen] = useState('comingsoon');

  const handleLangChange = (code) => { saveLang(code); setLang(code); };
  const [tab, setTab] = useState('home');
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const { hermes, loading: hermesLoading } = useHermes(user);

  const handleSplash = (selectedGoals) => {
    setGoals(selectedGoals);
    setScreen('auth');
  };

  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleAuth = (userData) => {
    setUser(userData);
    const isFirstTime = !userData?.has_completed_onboarding;
    if (isFirstTime) setShowOnboarding(true);
    setScreen('app');
  };

  const [showReminderSetup, setShowReminderSetup] = useState(false);
  const [showProgressExam, setShowProgressExam] = useState(false);

  const handleOnboardingComplete = (onboardingData) => {
    setShowOnboarding(false);
    if (onboardingData?.goals) setGoals(onboardingData.goals);
  };

  if (screen === 'comingsoon') {
    return <ComingSoonPage onEnterApp={() => setScreen('splash')} />;
  }

  if (screen === 'splash') {
    return (
      <div style={{ background: C.dark, minHeight: '100vh', fontFamily: FONT_BODY }}>
        <SplashScreen onContinue={handleSplash} lang={lang} />
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div style={{ background: C.dark, minHeight: '100vh', fontFamily: FONT_BODY }}>
        <AuthScreen onAuth={handleAuth} lang={lang} />
      </div>
    );
  }

  // App principal — screens dict
  const screens = {
    home:      <HomeScreen user={user} goals={goals} onNavigate={setTab} hermes={hermes} lang={lang} />,
    chat:      <ChatScreen user={user} hermes={hermes} lang={lang} />,
    recipes:   <RecipesScreen user={user} />,
    map:       <MapScreen user={user} />,
    plans:     <PlansScreen hermes={hermes} lang={lang} />,
    dashboard: <DashboardScreen user={user} hermes={hermes} lang={lang} onOpenReminders={() => setShowReminderSetup(true)} onOpenProgress={() => setShowProgressExam(true)} />,
    video:     <VideoAgent user={user} hermes={hermes} lang={lang} />,
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
      <BottomNav active={tab} onNavigate={setTab} lang={lang} />
      {showReminderSetup && (
        <ReminderSystem user={user} lang={lang} onClose={() => setShowReminderSetup(false)} />
      )}
      {showProgressExam && (
        <ProgressExam user={user} lang={lang} onClose={() => setShowProgressExam(false)} />
      )}
      {showOnboarding && (
        <OnboardingChat
          user={user} lang={lang}
          onComplete={handleOnboardingComplete}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 100 }}>
        <LanguageSelector lang={lang} onChange={handleLangChange} />
      </div>
    </div>
  );
}
