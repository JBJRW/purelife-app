import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { askDrSmoothie } from '../App';
import { tui } from '../i18n';

// Instrucción interna para el modelo (no visible al usuario) — se mantiene en español
// porque el AI la interpreta como instrucción de formato, no como contenido a mostrar.
const RECIPE_INSTRUCTION = '\n\n(Format instruction for this response: after your normal text reply, add on a separate line a block delimited exactly like this, with valid JSON on a single line: ```recipe\n{"name":"smoothie name","ingredients":["ingredient 1","ingredient 2"],"macros":{"protein":0,"carbs":0,"fat":0,"fiber":0}}\n``` — macros values are relative percentages 0-100 for visual bars, not exact grams.)';

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

function RecipeBlock({ recipe, lang }) {
  const bars = [
    { key: 'protein', label: tui(lang, 'itRecipeProtein'), color: IT.emerald },
    { key: 'carbs', label: tui(lang, 'itRecipeCarbs'), color: IT.gold },
    { key: 'fat', label: tui(lang, 'itRecipeFat'), color: IT.sage },
    { key: 'fiber', label: tui(lang, 'itRecipeFiber'), color: IT.goldLight },
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

function Shimmer({ children }) {
  return (
    <motion.p
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
      style={{
        margin: 0, fontSize: 13, fontStyle: 'italic',
        backgroundImage: `linear-gradient(90deg, ${IT.textSecondary} 0%, ${IT.goldLight} 50%, ${IT.textSecondary} 100%)`,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }}
    >
      {children}
    </motion.p>
  );
}

export default function ChatTab({ user, hermes, lang = 'en', onNavigate }) {
  const CHIPS = [
    { id: 'recipe', label: tui(lang, 'itChatChipRecipe') },
    { id: 'diagnosis', label: tui(lang, 'itChatChipDiagnosis') },
    { id: 'reminders', label: tui(lang, 'itChatChipReminders') },
  ];
  const [messages, setMessages] = useState([
    { role: 'ai', text: tui(lang, 'itChatWelcome'), recipe: null },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Si el usuario cambia de idioma con el chat recién abierto (sin mensajes propios), refresca el saludo
  useEffect(() => {
    setMessages(m => (m.length === 1 && m[0].role === 'ai' ? [{ role: 'ai', text: tui(lang, 'itChatWelcome'), recipe: null }] : m));
  }, [lang]);

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
      setMessages(m => [...m, { role: 'ai', text: tui(lang, 'itChatError'), recipe: null }]);
    }
    setLoading(false);
  };

  const handleChip = (id) => {
    if (id === 'recipe') sendMessage(tui(lang, 'itChatChipRecipe'), RECIPE_INSTRUCTION);
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
          <div style={{ fontSize: 11, color: IT.emerald, letterSpacing: '0.04em' }}>{tui(lang, 'itChatOnline')}</div>
        </div>
      </div>
      <div className="it-divider" />

      {/* Chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto' }} className="it-scroll-hide">
        {CHIPS.map(c => (
          <button
            key={c.id}
            onClick={() => handleChip(c.id)}
            className="it-tap"
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
      <div style={{ flex: 1, padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'stretch' }}>
            {m.role === 'user' ? (
              <div style={{
                maxWidth: '86%', background: 'rgba(201,168,76,0.14)', border: `1px solid ${IT.gold}33`,
                borderRadius: '18px 18px 4px 18px', padding: '10px 16px',
                fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: IT.cream,
              }}>
                {m.text}
              </div>
            ) : (
              <div style={{ padding: '6px 0' }}>
                <div style={{
                  fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: IT.textSecondary, marginBottom: 6,
                }}>
                  Dr. Smoothie AI
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: IT.cream }}>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p style={{ margin: '0 0 10px' }}>{children}</p>,
                      h1: ({ children }) => <div style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 8px', color: IT.goldLight }}>{children}</div>,
                      h2: ({ children }) => <div style={{ fontSize: 15, fontWeight: 700, margin: '10px 0 6px', color: IT.goldLight }}>{children}</div>,
                      h3: ({ children }) => <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 4px' }}>{children}</div>,
                      ul: ({ children }) => <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: '0 0 10px', paddingLeft: 18 }}>{children}</ol>,
                      li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                      strong: ({ children }) => <strong style={{ color: IT.goldLight, fontWeight: 700 }}>{children}</strong>,
                      hr: () => <div style={{ borderTop: `1px solid ${IT.divider}`, margin: '10px 0' }} />,
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            {m.recipe && <RecipeBlock recipe={m.recipe} lang={lang} />}
          </div>
        ))}
        {loading && (
          <div style={{ padding: '6px 0' }}>
            <Shimmer>{tui(lang, 'itChatTyping')}</Shimmer>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: 'sticky', bottom: 0, padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: IT.obsidian, borderTop: `1px solid ${IT.divider}`,
        display: 'flex', alignItems: 'flex-end', gap: 10,
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          border: `1px solid ${IT.gold}55`, borderRadius: 28,
          background: 'rgba(255,255,255,0.02)', padding: '4px 6px 4px 18px',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={tui(lang, 'itChatPlaceholder')}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, padding: '10px 0', outline: 'none',
            }}
          />
          <motion.button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              background: input.trim() ? IT.gold : 'rgba(255,255,255,0.06)',
              color: input.trim() ? IT.obsidian : IT.textSecondary, fontSize: 16,
            }}
          >
            →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
