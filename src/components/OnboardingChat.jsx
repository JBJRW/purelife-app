// ================================================================
// PureLife — OnboardingChat.jsx
// Dr. Smoothie AI como guía post-registro
// Claude API + fallback predefinido + botones interactivos
// Multilenguaje via prop `lang` (EN/ES/FR/PT/IT — fallback a EN)
// JRMB Food Network LLC · 2026
// ================================================================

import { useState, useEffect, useRef } from 'react';
import { FLOW_I18N, FALLBACK_REPLIES_I18N, UI_I18N } from '../onboardingFlow';

const AVATAR = '/dr-smoothie-avatar.jpg';

const C = {
  obsidian: '#080B0A', deep: '#0D1210', surface: '#111815',
  surface2: '#162019', gold: '#C9A84C', gold2: '#E8C96A',
  cream: '#F4EFE6', cream2: '#E8E0D0', sage: '#4A7C59',
  emerald: '#2C9C6E', muted: '#6B7E74',
  border: 'rgba(201,168,76,0.15)', border2: 'rgba(201,168,76,0.08)',
};

const SUPPORTED = ['en', 'es', 'fr', 'pt', 'it'];
const langFlow = (lang) => FLOW_I18N[SUPPORTED.includes(lang) ? lang : 'en'];
const langFallbacks = (lang) => FALLBACK_REPLIES_I18N[SUPPORTED.includes(lang) ? lang : 'en'];
const ui = (lang, key) => (UI_I18N[SUPPORTED.includes(lang) ? lang : 'en'])[key];

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function OnboardingChat({ user, onComplete, lang = 'en' }) {
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || (lang === 'es' ? 'amigo' : 'friend');
  const FLOW_STEPS = langFlow(lang);
  const FALLBACK_REPLIES = langFallbacks(lang);

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
      const first = FLOW_STEPS['welcome'];
      addMessage('ai', first.msg(name));
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const step = FLOW_STEPS[option.next];
    if (step) {
      setCurrentStep(option.next);
      addMessage('ai', step.msg(name), step.options);
      if (step.action === 'go_to_diagnosis') {
        setTimeout(() => setDone(true), 1400);
      }
    }
    setLoading(false);
  };

  const handleFreeText = async () => {
    const question = inputVal.trim();
    if (!question || loading) return;
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
          message: `[ONBOARDING] ${ui(lang, 'onboardingApiPrefix')} "${question}"`,
          userId: user?.id,
          accessToken: user?.access_token,
          lang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.reply || data.content || FALLBACK_REPLIES[fallbackIdx.current % FALLBACK_REPLIES.length];
        const step = FLOW_STEPS[currentStep];
        addMessage('ai', reply, step?.options || []);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback predefinido
      const reply = FALLBACK_REPLIES[fallbackIdx.current % FALLBACK_REPLIES.length];
      fallbackIdx.current++;
      const step = FLOW_STEPS[currentStep];
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
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: C.cream, marginBottom: 12 }}>{ui(lang,'doneTitle')}</h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>{ui(lang,'doneSubtitle')}</p>
          <button
            onClick={onComplete}
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '16px 40px', borderRadius: 50, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: `0 8px 32px rgba(201,168,76,0.4)` }}
          >
            {ui(lang,'doneBtn')}
          </button>
        </div>
      </div>
    );
  }

  const currentOptions = FLOW_STEPS[currentStep]?.options || [];

  return (
    <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: C.deep, borderBottom: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <img src={AVATAR} alt="Dr. Smoothie" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.emerald}` }} />
        <div>
          <div style={{ fontWeight: 700, color: C.cream, fontSize: 15 }}>Dr. Smoothie AI</div>
          <div style={{ fontSize: 11, color: C.emerald, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            {ui(lang,'welcomeBadge')}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>{ui(lang,'step')}</div>
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
            {ui(lang,'anotherQuestion')}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFreeText()}
              placeholder={ui(lang,'inputPlaceholder')}
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
