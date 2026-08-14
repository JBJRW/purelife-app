// ============================================================
// PureLife Wellness Club — AI Video Script Writer
// src/components/VideoScriptWriter.jsx · JRMB Food Network LLC
//
// Free-tier feature powered by Gemini (gemini-flash-latest, text-only).
// Dr. Smoothie AI writes a complete shoot-ready video script from a
// topic the user types in — scenes, camera direction, voiceover,
// on-screen text — fully translated in the user's selected language.
// ============================================================
import { useState } from 'react';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from '../interior/tokens';
import { tui } from '../i18n';

const TOPIC_SUGGESTIONS = {
  en: ['3-ingredient morning smoothie', 'why hydration matters', '5-minute desk stretch routine', 'reading a nutrition label'],
  es: ['smoothie matutino de 3 ingredientes', 'por qué importa la hidratación', 'rutina de estiramiento de 5 minutos', 'cómo leer una etiqueta nutricional'],
  fr: ['smoothie matinal à 3 ingrédients', "pourquoi l'hydratation compte", 'routine d\'étirement de 5 minutes', 'lire une étiquette nutritionnelle'],
  pt: ['smoothie matinal com 3 ingredientes', 'por que a hidratação importa', 'rotina de alongamento de 5 minutos', 'como ler um rótulo nutricional'],
  it: ['smoothie mattutino a 3 ingredienti', "perché l'idratazione conta", 'routine di stretching da 5 minuti', 'leggere un\'etichetta nutrizionale'],
};

export default function VideoScriptWriter({ lang = 'en' }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const suggestions = TOPIC_SUGGESTIONS[lang] || TOPIC_SUGGESTIONS.en;

  const generate = async (topicOverride) => {
    const t = (topicOverride ?? topic).trim();
    if (!t) return;
    setError('');
    setScript(null);
    setLoading(true);
    try {
      const res = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, lang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || tui(lang, 'scriptError'));
      setScript(data);
    } catch (e) {
      setError(e.message || tui(lang, 'scriptError'));
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!script?.full_script) return;
    navigator.clipboard?.writeText(script.full_script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setScript(null);
    setError('');
    setTopic('');
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎬</div>
        <h2 style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 24, fontStyle: 'italic', margin: '0 0 6px' }}>
          {tui(lang, 'scriptTitle')}
        </h2>
        <p style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY }}>
          {tui(lang, 'scriptSubtitle')}
        </p>
      </div>

      {!script && !loading && (
        <>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={tui(lang, 'scriptTopicPlaceholder')}
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 14,
              border: `1.5px solid ${IT.divider}`, background: 'rgba(255,255,255,0.04)',
              color: IT.cream, fontSize: 15, fontFamily: IT_FONT_BODY, resize: 'none', marginBottom: 12,
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setTopic(s); }}
                style={{
                  padding: '6px 12px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${IT.divider}`, background: 'rgba(255,255,255,0.03)',
                  color: IT.textSecondary, fontFamily: IT_FONT_BODY,
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => generate()}
            disabled={!topic.trim()}
            className="it-tap"
            style={{
              width: '100%', padding: '16px', borderRadius: 14, cursor: topic.trim() ? 'pointer' : 'default',
              border: `1.5px solid ${IT.gold}`, background: topic.trim() ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
              color: topic.trim() ? IT.cream : IT.textSecondary, fontSize: 15, fontWeight: 700, fontFamily: IT_FONT_BODY,
              opacity: topic.trim() ? 1 : 0.6,
            }}
          >
            ✨ {tui(lang, 'scriptCtaGenerate')}
          </button>
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: IT.textSecondary, fontFamily: IT_FONT_BODY, fontSize: 14 }}>
          🌿 {tui(lang, 'scriptGenerating')}
        </div>
      )}

      {error && !loading && (
        <div style={{
          color: '#E06B5C', fontSize: 13, marginTop: 8, padding: '10px 14px',
          background: 'rgba(224,107,92,0.1)', borderRadius: 10, fontFamily: IT_FONT_BODY,
        }}>
          {error}
        </div>
      )}

      {script && !loading && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 22, fontStyle: 'italic' }}>
              {script.title}
            </div>
          </div>

          <div style={{
            padding: '14px 16px', borderRadius: 14, background: `${IT.gold}14`,
            border: `1px solid ${IT.gold}44`, marginBottom: 18,
          }}>
            <div style={{ color: IT.gold, fontSize: 11, fontWeight: 700, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              🎯 {tui(lang, 'scriptHook')}
            </div>
            <div style={{ color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, fontStyle: 'italic', lineHeight: 1.5 }}>
              "{script.hook}"
            </div>
          </div>

          <div style={{ color: IT.goldLight, fontSize: 13, fontWeight: 700, fontFamily: IT_FONT_BODY, marginBottom: 10 }}>
            🎥 {tui(lang, 'scriptScenes')}
          </div>

          {script.scenes?.map((scene, i) => (
            <div key={scene.id ?? i} style={{
              marginBottom: 12, padding: '14px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${IT.divider}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: IT.emerald, fontSize: 12, fontWeight: 700, fontFamily: IT_FONT_BODY }}>
                  {tui(lang, 'scriptScene')} {i + 1}
                </span>
                {scene.duration_seconds && (
                  <span style={{ color: IT.textSecondary, fontSize: 12, fontFamily: IT_FONT_BODY }}>
                    {scene.duration_seconds}{tui(lang, 'scriptSeconds')}
                  </span>
                )}
              </div>
              {scene.visual_direction && (
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: IT.textSecondary, fontSize: 11, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {tui(lang, 'scriptVisual')}:{' '}
                  </span>
                  <span style={{ color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY }}>
                    {scene.visual_direction}
                  </span>
                </div>
              )}
              {scene.voiceover_line && (
                <div style={{ marginBottom: scene.on_screen_text ? 6 : 0 }}>
                  <span style={{ color: IT.textSecondary, fontSize: 11, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {tui(lang, 'scriptVoiceover')}:{' '}
                  </span>
                  <span style={{ color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, fontStyle: 'italic' }}>
                    "{scene.voiceover_line}"
                  </span>
                </div>
              )}
              {scene.on_screen_text && (
                <div>
                  <span style={{ color: IT.textSecondary, fontSize: 11, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {tui(lang, 'scriptOnScreenText')}:{' '}
                  </span>
                  <span style={{ color: IT.goldLight, fontSize: 13, fontFamily: IT_FONT_BODY, fontWeight: 600 }}>
                    {scene.on_screen_text}
                  </span>
                </div>
              )}
            </div>
          ))}

          {script.call_to_action && (
            <div style={{
              padding: '14px 16px', borderRadius: 14, background: `${IT.emerald}14`,
              border: `1px solid ${IT.emerald}44`, marginBottom: 12,
            }}>
              <div style={{ color: IT.emerald, fontSize: 11, fontWeight: 700, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                📢 {tui(lang, 'scriptCTA')}
              </div>
              <div style={{ color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, fontStyle: 'italic' }}>
                "{script.call_to_action}"
              </div>
            </div>
          )}

          {script.music_mood && (
            <div style={{ marginBottom: 20, fontSize: 13, color: IT.textSecondary, fontFamily: IT_FONT_BODY }}>
              🎵 <span style={{ fontWeight: 600 }}>{tui(lang, 'scriptMusicMood')}:</span> {script.music_mood}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={copyScript}
              className="it-tap"
              style={{
                flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
                border: `1.5px solid ${IT.gold}`, background: `${IT.gold}18`,
                color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
              }}
            >
              {copied ? `✓ ${tui(lang, 'scriptCopied')}` : `📋 ${tui(lang, 'scriptCopy')}`}
            </button>
            <button
              onClick={reset}
              className="it-tap"
              style={{
                flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
                border: `1px solid ${IT.divider}`, background: 'none',
                color: IT.goldLight, fontSize: 14, fontWeight: 600, fontFamily: IT_FONT_BODY,
              }}
            >
              {tui(lang, 'scriptRegenerate')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
