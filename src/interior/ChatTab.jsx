import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IT, IT_FONT_HEAD, IT_FONT_BODY, IT_EASE } from './tokens';
import { askDrSmoothie } from '../App';

const RECIPE_INSTRUCTION = '\n\n(Instrucción de formato para esta respuesta: después de tu respuesta normal en texto, agrega en una línea aparte un bloque delimitado exactamente así, con JSON válido en una sola línea: ```recipe\n{"name":"nombre del smoothie","ingredients":["ingrediente 1","ingrediente 2"],"macros":{"protein":0,"carbs":0,"fat":0,"fiber":0}}\n``` — los valores de macros son porcentajes relativos 0-100 para barras visuales, no gramos exactos.)';

const CHIPS = [
  { id: 'recipe', label: 'Receta del día' },
  { id: 'diagnosis', label: 'Mi diagnóstico' },
  { id: 'reminders', label: 'Recordatorios' },
];

function extractRecipeBlock(text) {
  const match = text.match(/```recipe\s*([\s\S]*?)```/);
  if (!match) return { text: text.trim(), recipe: null };
  const clean = text.replace(match[0], '').trim();
  try {
    return { text: clean, recipe: JSON.parse(match[1].trim()) };
  } catch {
    return { text: clean, recipe: null };
  }
}

function RecipeBlock({ recipe }) {
  const bars = [
    { key: 'protein', label: 'Proteína', color: IT.emerald },
    { key: 'carbs', label: 'Carbohidratos', color: IT.gold },
    { key: 'fat', label: 'Grasas', color: IT.sage },
    { key: 'fiber', label: 'Fibra', color: IT.goldLight },
  ];
  return (
    <div style={{ padding: '14px 0', borderTop: `1px solid ${IT.divider}`, marginTop: 10 }}>
      <div style={{
        fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 22,
        fontStyle: 'italic', marginBottom: 10,
      }}>
        {recipe.name}
      </div>
      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
        <ul style={{ margin: '0 0 14px', padding: 0, listStyle: 'none' }}>
          {recipe.ingredients.map((ing, i) => (
            <li key={i} style={{
              fontSize: 13, color: IT.cream, opacity: 0.85,
              padding: '4px 0', display: 'flex', gap: 8,
            }}>
              <span style={{ color: IT.gold }}>—</span> {ing}
            </li>
          ))}
        </ul>
      )}
      {recipe.macros && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bars.map(b => {
            const val = Math.min(Math.max(Number(recipe.macros[b.key]) || 0, 0), 100);
            return (
              <div key={b.key}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 10, color: IT.textSecondary, marginBottom: 3,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  <span>{b.label}</span><span>{val}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(244,239,230,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{ height: '100%', background: b.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChatTab({ user, hermes, lang = 'es', onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy Dr. Smoothie AI 🌿 ¿En qué te ayudo hoy?', recipe: null },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (visibleText, hiddenSuffix = '') => {
    const displayText = (visibleText ?? input).trim();
    if (!displayText || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: displayText, recipe: null }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const history = newMessages.slice(1).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }));
      const reply = await askDrSmoothie(displayText + hiddenSuffix, history, user?.id, user?.token, lang);
      const { text, recipe } = extractRecipeBlock(reply);
      setMessages(m => [...m, { role: 'ai', text, recipe }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Hubo un error de conexión. Intenta de nuevo. 🌿', recipe: null }]);
    }
    setLoading(false);
  };

  const handleChip = (id) => {
    if (id === 'recipe') sendMessage('Receta del día', RECIPE_INSTRUCTION);
    else if (id === 'diagnosis') onNavigate?.('progreso');
    else if (id === 'reminders') onNavigate?.('progreso');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src="/dr-smoothie-avatar.jpg"
            alt="Dr. Smoothie AI"
            style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${IT.emerald}` }}
          />
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
            borderRadius: '50%', background: IT.emerald, border: `2px solid ${IT.obsidian}`,
          }} />
        </div>
        <div>
          <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic' }}>
            Dr. Smoothie AI
          </div>
          <div style={{ fontSize: 11, color: IT.emerald, letterSpacing: '0.04em' }}>En línea</div>
        </div>
      </div>
      <div className="it-divider" />

      {/* Chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto' }} className="it-scroll-hide">
        {CHIPS.map(c => (
          <button
            key={c.id}
            onClick={() => handleChip(c.id)}
            style={{
              whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 20,
              border: `1px solid ${IT.divider}`, background: 'transparent',
              color: IT.cream, fontSize: 12, fontFamily: IT_FONT_BODY, cursor: 'pointer',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${IT.divider}` }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: IT.textSecondary, marginBottom: 4, textAlign: m.role === 'user' ? 'right' : 'left',
            }}>
              {m.role === 'user' ? 'Tú' : 'Dr. Smoothie AI'}
            </div>
            <div style={{
              fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap',
              color: IT.cream, textAlign: m.role === 'user' ? 'right' : 'left',
            }}>
              {m.text}
            </div>
            {m.recipe && <RecipeBlock recipe={m.recipe} />}
          </div>
        ))}
        {loading && (
          <div style={{ padding: '10px 0', color: IT.textSecondary, fontSize: 13, fontStyle: 'italic' }}>
            Dr. Smoothie está escribiendo…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: 'sticky', bottom: 0, padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: IT.obsidian, borderTop: `1px solid ${IT.divider}`,
        display: 'flex', gap: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Pregúntale a Dr. Smoothie…"
          style={{
            flex: 1, background: 'transparent', border: 'none', borderBottom: `1px solid ${IT.divider}`,
            color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, padding: '8px 2px', outline: 'none',
          }}
        />
        <motion.button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22, ease: IT_EASE }}
          style={{
            background: 'none', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
            color: input.trim() ? IT.goldLight : IT.textSecondary, fontSize: 18, fontFamily: IT_FONT_BODY,
          }}
        >
          →
        </motion.button>
      </div>
    </div>
  );
}
