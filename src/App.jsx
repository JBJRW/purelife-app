import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import NewsSection from './components/NewsSection';

// ═════════════════════════════════════════════════════════════
//  PURELIFE — INTERIOR v2
//  Chat Dr. Smoothie = pantalla principal
//  5 pestañas: Chat · Videos · Recetas · Progreso · Club
//  Estilo sin tarjetas: contenido flotando + separadores finos
// ═════════════════════════════════════════════════════════════

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

const WARM = {
  surface:  'rgba(245,240,232,0.04)',
  surfaceHover: 'rgba(245,240,232,0.08)',
  border:   'rgba(245,240,232,0.10)',
  borderStrong: 'rgba(245,240,232,0.18)',
  goldGlow: 'rgba(201,151,58,0.20)',
  greenGlow: 'rgba(26,92,58,0.30)',
};

const IMGS = {
  smoothie1: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80',
  smoothie2: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80',
  smoothie3: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
  fruits:    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
  wellness:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  herbs:     'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  avocado:   'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=800&q=80',
  berries:   'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80',
};

const FONT_HEAD = "'Georgia', serif";
const FONT_BODY = "'Helvetica Neue', Arial, sans-serif";

// ── SUPABASE CONFIG ─────────────────────────────────────────
const SB_URL = 'https://slcvymfgcpoafjufaplx.supabase.co';
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

// ── SHARED ───────────────────────────────────────────────────
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
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </motion.button>
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
            <motion.button
              key={g.id}
              onClick={() => toggleGoal(g.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              style={{
                padding: '16px 12px', borderRadius: 14, cursor: 'pointer',
                border: `2px solid ${selectedGoals.includes(g.id) ? C.mint : C.glassBorder}`,
                background: selectedGoals.includes(g.id) ? `${C.mint}22` : C.glass,
                color: C.cream, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
                textAlign: 'center',
              }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{g.emoji}</div>
              {g.label}
            </motion.button>
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

// ── SCREEN: CHAT DR. SMOOTHIE AI — PANTALLA PRINCIPAL ────────
function ChatScreen({ user, hermes, lang = 'en', onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: tui(lang, 'chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  const suggestions = tui(lang, 'suggestions') || [];

  // Today's Wellness — vive dentro del chat como sugerencias del día
  const dailyTips = [
    {
      img: IMGS.smoothie1,
      title: tui(lang,'smoothieOfDay') || 'Smoothie of the day',
      ask: tui(lang,'smoothieDesc') || 'Spinach + mango + ginger',
    },
    {
      img: IMGS.berries,
      title: 'Power of berries',
      ask: 'Blueberries reduce oxidative stress — add them daily',
    },
    {
      img: IMGS.herbs,
      title: tui(lang,'hydration') || 'Hydration',
      ask: tui(lang,'hydrationDesc') || 'Drink at least 8 glasses today',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? tui(lang,'greeting_morning')
    : hour < 18
      ? tui(lang,'greeting_afternoon')
      : tui(lang,'greeting_evening');

  const showUpsell = hermes?.upsell?.show;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 92px)',
      maxWidth: 480, margin: '0 auto',
    }}>

      {/* ── HEADER — el saludo del home vive aquí ahora ── */}
      <div style={{
        position: 'relative',
        padding: '16px 20px 14px',
        borderBottom: `1px solid ${WARM.border}`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(26,92,58,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="/dr-smoothie-avatar.jpg"
              alt="Dr. Smoothie AI"
              style={{
                width: 48, height: 48, borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(201,151,58,0.5)',
                boxShadow: '0 0 16px rgba(26,92,58,0.4)',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 12, height: 12, borderRadius: '50%',
              background: '#2D8653',
              border: '2px solid #0F1F17',
              animation: 'pulse 2s ease infinite',
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              color: '#F5F0E8', fontWeight: 700, fontSize: 16,
              fontFamily: "'Fraunces', serif",
            }}>
              Dr. Smoothie AI
            </div>
            <div style={{
              color: 'rgba(245,240,232,0.55)', fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {hermes?.welcomeMessage || `${greeting || 'Hello'} ${hermes?.name || user?.name || ''}`.trim()}
            </div>
          </div>

          {hermes?.permissions && (
            <div style={{
              fontSize: 11, fontFamily: "'DM Sans', sans-serif",
              color: hermes.permissions.chatRemaining > 0 ? '#2D8653' : '#C9973A',
              background: 'rgba(255,255,255,0.05)',
              padding: '4px 10px', borderRadius: 20,
              border: `1px solid ${WARM.border}`,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {hermes.permissions.chatRemaining > 50 ? '∞' : hermes.permissions.chatRemaining} {tui(lang,'chatRemaining') || 'left'}
            </div>
          )}
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 16,
        scrollbarWidth: 'none',
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end', gap: 8,
          }}>
            {m.role === 'ai' && (
              <img
                src="/dr-smoothie-avatar.jpg"
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  objectFit: 'cover', flexShrink: 0,
                  border: '1.5px solid rgba(201,151,58,0.3)',
                }}
              />
            )}

            <div style={{
              maxWidth: '78%',
              padding: m.role === 'user' ? '12px 16px' : '14px 18px',
              borderRadius: m.role === 'user'
                ? '20px 20px 4px 20px'
                : '4px 20px 20px 20px',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, #2D8653, #1A5C3A)'
                : WARM.surface,
              border: m.role === 'ai' ? `1px solid ${WARM.border}` : 'none',
              color: '#F5F0E8',
              fontSize: 14, lineHeight: 1.65,
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: 'pre-wrap',
              boxShadow: m.role === 'user'
                ? '0 2px 12px rgba(26,92,58,0.3)'
                : 'none',
            }}>
              {m.role === 'ai' && i === 0 && (
                <div style={{
                  fontSize: 11, fontWeight: 700, color: '#C9973A',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  Dr. Smoothie AI 🌿
                </div>
              )}
              {m.text}
            </div>

            {m.role === 'user' && (
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9973A, #E8B84B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#0F1F17',
                flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
              }}>
                {(user?.name || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <img
              src="/dr-smoothie-avatar.jpg"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid rgba(201,151,58,0.3)',
              }}
            />
            <div style={{
              padding: '14px 18px',
              borderRadius: '4px 20px 20px 20px',
              background: WARM.surface,
              border: `1px solid ${WARM.border}`,
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#2D8653',
                  animation: `typingDot 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {isListening && (
          <div style={{
            textAlign: 'center', padding: '10px',
            color: '#5CB87A', fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            animation: 'pulse 1s infinite',
          }}>
            🎙️ Listening... speak now
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── TODAY'S WELLNESS — integrado al chat (solo al inicio) ── */}
      {messages.length === 1 && (
        <div style={{ padding: '0 16px 10px' }}>
          <div st
