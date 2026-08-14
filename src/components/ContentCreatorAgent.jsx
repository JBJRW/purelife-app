// ============================================================
// PureLife Wellness Club — Content Creator Agent
// src/components/ContentCreatorAgent.jsx · JRMB Food Network LLC
//
// Agente 1 de 3. Genera contenido adaptado a 4 plataformas con
// un solo tema, usando el tier gratuito de Gemini. Guarda el
// resultado en content_calendar (Supabase) para llevar historial.
// ============================================================
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from '../interior/tokens';
import { tui } from '../i18n';

const PLATFORMS = [
  { id: 'instagram', icon: '📸' },
  { id: 'tiktok', icon: '🎵' },
  { id: 'twitter', icon: '𝕏' },
  { id: 'linkedin', icon: '💼' },
];

const TYPES = ['promocional', 'educativo', 'motivacional'];
const TYPE_KEYS = { promocional: 'contentTypePromo', educativo: 'contentTypeEdu', motivacional: 'contentTypeMotiv' };

export default function ContentCreatorAgent({ lang = 'en', user }) {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('promocional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [saved, setSaved] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setError('');
    setResult(null);
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), contentType, tone: 'profesional', lang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || tui(lang, 'contentError'));
      setResult(data);
      setActivePlatform('instagram');

      if (user?.id) {
        await supabase.from('content_calendar').insert({
          topic: topic.trim(),
          content_type: contentType,
          lang,
          variants: data.variants,
          hashtags: data.hashtags,
          status: 'draft',
          created_by: user.id,
        });
        setSaved(true);
      }
    } catch (e) {
      setError(e.message || tui(lang, 'contentError'));
    } finally {
      setLoading(false);
    }
  };

  const copyActive = () => {
    if (!result?.variants?.[activePlatform]) return;
    const hashtagLine = result.hashtags?.map(h => `#${h}`).join(' ') || '';
    const text = `${result.variants[activePlatform]}\n\n${hashtagLine}`;
    navigator.clipboard?.writeText(text.trim());
    setCopied(activePlatform);
    setTimeout(() => setCopied(''), 2000);
  };

  const reset = () => { setResult(null); setError(''); setTopic(''); setSaved(false); };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 540, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
        <h2 style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 24, fontStyle: 'italic', margin: '0 0 6px' }}>
          {tui(lang, 'contentTitle')}
        </h2>
        <p style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY }}>
          {tui(lang, 'contentSubtitle')}
        </p>
      </div>

      {!result && !loading && (
        <>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={tui(lang, 'contentTopicPlaceholder')}
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 14,
              border: `1.5px solid ${IT.divider}`, background: 'rgba(255,255,255,0.04)',
              color: IT.cream, fontSize: 15, fontFamily: IT_FONT_BODY, resize: 'none', marginBottom: 14,
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1px solid ${contentType === t ? IT.gold : IT.divider}`,
                  background: contentType === t ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
                  color: contentType === t ? IT.goldLight : IT.textSecondary, fontFamily: IT_FONT_BODY,
                }}
              >
                {tui(lang, TYPE_KEYS[t])}
              </button>
            ))}
          </div>
          <button
            onClick={generate}
            disabled={!topic.trim()}
            className="it-tap"
            style={{
              width: '100%', padding: '16px', borderRadius: 14, cursor: topic.trim() ? 'pointer' : 'default',
              border: `1.5px solid ${IT.gold}`, background: topic.trim() ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
              color: topic.trim() ? IT.cream : IT.textSecondary, fontSize: 15, fontWeight: 700, fontFamily: IT_FONT_BODY,
              opacity: topic.trim() ? 1 : 0.6,
            }}
          >
            ✨ {tui(lang, 'contentGenerate')}
          </button>
        </>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: IT.textSecondary, fontFamily: IT_FONT_BODY, fontSize: 14 }}>
          🌿 {tui(lang, 'contentGenerating')}
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

      {result && !loading && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                style={{
                  flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  border: `1px solid ${activePlatform === p.id ? IT.gold : IT.divider}`,
                  background: activePlatform === p.id ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ fontSize: 16 }}>{p.icon}</div>
              </button>
            ))}
          </div>

          <div style={{
            padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${IT.divider}`, marginBottom: 14, minHeight: 140,
          }}>
            <div style={{ color: IT.cream, fontSize: 14, fontFamily: IT_FONT_BODY, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {result.variants[activePlatform]}
            </div>
          </div>

          {result.hashtags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {result.hashtags.map((h) => (
                <span key={h} style={{
                  fontSize: 12, color: IT.emerald, background: `${IT.emerald}14`,
                  padding: '4px 10px', borderRadius: 999, fontFamily: IT_FONT_BODY,
                }}>
                  #{h}
                </span>
              ))}
            </div>
          )}

          {saved && (
            <div style={{ textAlign: 'center', fontSize: 12, color: IT.emerald, marginBottom: 12, fontFamily: IT_FONT_BODY }}>
              ✓ {tui(lang, 'contentSavedToCalendar')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={copyActive}
              className="it-tap"
              style={{
                flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
                border: `1.5px solid ${IT.gold}`, background: `${IT.gold}18`,
                color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
              }}
            >
              {copied === activePlatform ? `✓ ${tui(lang, 'contentCopied')}` : `📋 ${tui(lang, 'contentCopy')}`}
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
              {tui(lang, 'contentRegenerate')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
