// ============================================================
// PureLife Wellness Club — Nutrition Label Scanner
// src/components/NutritionLabelScanner.jsx · JRMB Food Network LLC
//
// Free-tier feature powered by Gemini vision (gemini-flash-latest).
// User photographs/uploads a nutrition label, backend (api/analyze-label.js)
// returns structured data in the user's selected language.
// ============================================================
import { useRef, useState } from 'react';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from '../interior/tokens';
import { tui } from '../i18n';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is like "data:image/jpeg;base64,AAAA..."
      const [, base64] = reader.result.split(',');
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const scoreColor = (score) => {
  if (score >= 7) return IT.emerald;
  if (score >= 4) return IT.gold;
  return '#E06B5C';
};

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${IT.divider}` }}>
      <span style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY }}>{label}</span>
      <span style={{ color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function NutritionLabelScanner({ lang = 'en' }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setResult(null);
    setImagePreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/analyze-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64, mime_type: file.type || 'image/jpeg', lang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || tui(lang, 'labelError'));
      if (!data.product_name) throw new Error(data.recommendation || tui(lang, 'labelError'));
      setResult(data);
    } catch (e) {
      setError(e.message || tui(lang, 'labelError'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏷️</div>
        <h2 style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 24, fontStyle: 'italic', margin: '0 0 6px' }}>
          {tui(lang, 'labelTitle')}
        </h2>
        <p style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY }}>
          {tui(lang, 'labelSubtitle')}
        </p>
      </div>

      {imagePreview && (
        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 16, border: `1px solid ${IT.divider}` }}>
          <img src={imagePreview} alt="" style={{ width: '100%', display: 'block', maxHeight: 260, objectFit: 'cover' }} />
        </div>
      )}

      {!imagePreview && (
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="it-tap"
            style={{
              flex: 1, padding: '16px 10px', borderRadius: 14, cursor: 'pointer',
              border: `1.5px solid ${IT.gold}`, background: `${IT.gold}18`,
              color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
            }}
          >
            📷 {tui(lang, 'labelCtaCamera')}
          </button>
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="it-tap"
            style={{
              flex: 1, padding: '16px 10px', borderRadius: 14, cursor: 'pointer',
              border: `1.5px solid ${IT.divider}`, background: 'rgba(255,255,255,0.04)',
              color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
            }}
          >
            🖼️ {tui(lang, 'labelCtaUpload')}
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: IT.textSecondary, fontFamily: IT_FONT_BODY, fontSize: 14 }}>
          ⏳ {tui(lang, 'labelAnalyzing')}
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
        <div style={{ marginTop: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic' }}>
              {result.product_name}
            </div>
            {result.serving_size && (
              <div style={{ color: IT.textSecondary, fontSize: 12, fontFamily: IT_FONT_BODY, marginTop: 2 }}>
                {tui(lang, 'labelServing')}: {result.serving_size}
              </div>
            )}
          </div>

          {typeof result.health_score === 'number' && (
            <div style={{
              textAlign: 'center', marginBottom: 18, padding: '14px',
              borderRadius: 14, border: `1.5px solid ${scoreColor(result.health_score)}55`,
              background: `${scoreColor(result.health_score)}12`,
            }}>
              <div style={{ fontSize: 11, color: IT.textSecondary, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {tui(lang, 'labelHealthScore')}
              </div>
              <div style={{ fontFamily: IT_FONT_HEAD, fontSize: 32, color: scoreColor(result.health_score), fontWeight: 700 }}>
                {result.health_score}/10
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <Row label={tui(lang, 'labelCalories')} value={result.calories} />
            <Row label={tui(lang, 'labelProtein')} value={result.protein} />
            <Row label={tui(lang, 'labelCarbs')} value={result.carbs} />
            <Row label={tui(lang, 'labelFat')} value={result.fat} />
            <Row label={tui(lang, 'labelFiber')} value={result.fiber} />
            <Row label={tui(lang, 'labelSugar')} value={result.sugar} />
            <Row label={tui(lang, 'labelSodium')} value={result.sodium} />
          </div>

          {result.ingredients?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: IT.goldLight, fontSize: 13, fontWeight: 700, fontFamily: IT_FONT_BODY, marginBottom: 6 }}>
                {tui(lang, 'labelIngredients')}
              </div>
              <div style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY, lineHeight: 1.6 }}>
                {result.ingredients.join(', ')}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ color: IT.goldLight, fontSize: 13, fontWeight: 700, fontFamily: IT_FONT_BODY, marginBottom: 6 }}>
              {tui(lang, 'labelAllergens')}
            </div>
            <div style={{ color: IT.textSecondary, fontSize: 13, fontFamily: IT_FONT_BODY }}>
              {result.allergens?.length > 0 ? result.allergens.join(', ') : tui(lang, 'labelNoAllergens')}
            </div>
          </div>

          {result.recommendation && (
            <div style={{
              padding: '14px 16px', borderRadius: 14, background: `${IT.emerald}14`,
              border: `1px solid ${IT.emerald}44`, marginBottom: 20,
            }}>
              <div style={{ color: IT.emerald, fontSize: 11, fontWeight: 700, fontFamily: IT_FONT_BODY, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                🌿 {tui(lang, 'labelRecommendation')}
              </div>
              <div style={{ color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, lineHeight: 1.6, fontStyle: 'italic' }}>
                {result.recommendation}
              </div>
            </div>
          )}
        </div>
      )}

      {(result || error) && !loading && (
        <button
          onClick={reset}
          className="it-tap"
          style={{
            width: '100%', padding: '14px', borderRadius: 14, cursor: 'pointer',
            border: `1px solid ${IT.divider}`, background: 'none',
            color: IT.goldLight, fontSize: 14, fontWeight: 600, fontFamily: IT_FONT_BODY,
          }}
        >
          {tui(lang, 'labelRetake')}
        </button>
      )}
    </div>
  );
}
