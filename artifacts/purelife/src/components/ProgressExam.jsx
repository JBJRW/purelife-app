// ================================================================
// PureLife — ProgressExam.jsx
// Examen de progreso a los 30 días
// Preguntas + upload análisis + trigger video testimonial
// JRMB Food Network LLC · 2026
// ================================================================

import { useState, useRef } from 'react';

const C = {
  obsidian: '#080B0A', deep: '#0D1210', surface: '#111815',
  surface2: '#162019', gold: '#C9A84C', gold2: '#E8C96A',
  cream: '#F4EFE6', cream2: '#E8E0D0', sage: '#4A7C59',
  emerald: '#00C97B', muted: '#6B7E74',
  border: 'rgba(201,168,76,0.15)', border2: 'rgba(201,168,76,0.08)',
};

const QUESTIONS = [
  {
    id: 'energy', label: '¿Cómo está tu nivel de energía comparado con hace 30 días?',
    type: 'scale', min: 1, max: 5,
    labels: ['Mucho peor', 'Peor', 'Igual', 'Mejor', 'Mucho mejor'],
  },
  {
    id: 'sleep', label: '¿Cómo ha mejorado tu calidad de sueño?',
    type: 'scale', min: 1, max: 5,
    labels: ['Mucho peor', 'Peor', 'Igual', 'Mejor', 'Mucho mejor'],
  },
  {
    id: 'digestion', label: '¿Cómo está tu digestión?',
    type: 'scale', min: 1, max: 5,
    labels: ['Mucho peor', 'Peor', 'Igual', 'Mejor', 'Mucho mejor'],
  },
  {
    id: 'inflammation', label: '¿Has notado reducción en inflamación o dolor?',
    type: 'scale', min: 1, max: 5,
    labels: ['Nada', 'Muy poco', 'Algo', 'Bastante', 'Mucho'],
  },
  {
    id: 'weight', label: '¿Cambio en peso? (opcional)',
    type: 'weight', optional: true,
  },
  {
    id: 'highlight', label: '¿Cuál ha sido tu mayor logro en estos 30 días?',
    type: 'text', placeholder: 'Ej: Tengo más energía por las mañanas, dormí mejor esta semana...',
  },
  {
    id: 'share_permission', label: '¿Nos permites usar tu testimonio para inspirar a otros?',
    type: 'boolean',
  },
];

export default function ProgressExam({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [labFile, setLabFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const fileRef = useRef(null);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const totalSteps = QUESTIONS.length + 1; // +1 para lab upload

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [current.id]: value }));
  };

  const nextStep = () => {
    if (isLast) { setStep(QUESTIONS.length); return; } // lab upload
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userId', user?.id);
      formData.append('accessToken', user?.access_token);
      formData.append('answers', JSON.stringify(answers));
      formData.append('examDate', new Date().toISOString());
      if (labFile) formData.append('labFile', labFile);

      const res = await fetch('/api/progress-exam', { method: 'POST', body: formData });
      const data = res.ok ? await res.json() : { success: false };
      setExamResult(data);
      setDone(true);
    } catch {
      setDone(true);
      setExamResult({ success: false });
    }
    setSubmitting(false);
  };

  const ScaleQuestion = ({ q }) => (
    <div>
      <p style={{ color: C.cream, fontSize: 16, fontWeight: 600, marginBottom: 24, lineHeight: 1.5 }}>{q.label}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[1,2,3,4,5].map(v => (
          <button key={v} onClick={() => handleAnswer(v)}
            style={{ flex: 1, minWidth: 48, padding: '16px 8px', background: answers[q.id] === v ? `rgba(201,168,76,0.2)` : C.surface, border: `2px solid ${answers[q.id] === v ? C.gold : C.border2}`, borderRadius: 16, color: answers[q.id] === v ? C.gold2 : C.cream, cursor: 'pointer', fontSize: 18, fontWeight: 700 }}>
            {v}
            <div style={{ fontSize: 9, color: C.muted, marginTop: 4, fontWeight: 400 }}>{q.labels[v-1]}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Pantalla completada
  if (done) {
    const score = Object.values(answers).filter(v => typeof v === 'number').reduce((a,b) => a+b, 0);
    const maxScore = QUESTIONS.filter(q => q.type === 'scale').length * 5;
    const pct = Math.round((score / maxScore) * 100);

    return (
      <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: C.cream, marginBottom: 12 }}>
            ¡Examen completado!
          </h2>
          <div style={{ background: `linear-gradient(135deg, ${C.surface2}, ${C.surface})`, border: `1px solid ${C.border}`, borderRadius: 24, padding: '24px 20px', marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', color: C.gold2, lineHeight: 1 }}>{pct}%</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Índice de progreso PureLife</div>
          </div>
          <p style={{ color: C.cream2, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {pct >= 70 ? '¡Increíble progreso! Tus hábitos están generando resultados reales.' :
             pct >= 50 ? 'Buen avance. Con unos ajustes al protocolo verás mejoras más rápidas.' :
             'Cada paso cuenta. Ajustemos tu protocolo para potenciar tus resultados.'}
          </p>
          {answers.share_permission && (
            <button onClick={() => onComplete?.('video', { answers, score: pct })}
              style={{ width: '100%', background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '16px', borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 12 }}>
              🎬 Crear video testimonial
            </button>
          )}
          <button onClick={() => onComplete?.('home', { answers, score: pct })}
            style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, padding: '14px', borderRadius: 50, color: C.cream, cursor: 'pointer', fontSize: 14 }}>
            Ver mi nuevo protocolo →
          </button>
        </div>
      </div>
    );
  }

  // Lab upload step
  if (step === QUESTIONS.length) {
    return (
      <div style={{ minHeight: '100vh', background: C.obsidian, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          <div style={{ marginBottom: 8, color: C.muted, fontSize: 12 }}>{totalSteps}/{totalSteps}</div>
          <div style={{ height: 4, background: C.surface2, borderRadius: 2, marginBottom: 32 }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})`, borderRadius: 2, width: '100%', transition: 'width 0.4s ease' }} />
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', color: C.cream, marginBottom: 8 }}>Análisis de laboratorio</h3>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>Opcional — Si tienes análisis recientes, súbelos para que Dr. Smoothie AI personalice mejor tu protocolo.</p>

          <div onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${labFile ? C.gold : C.border}`, borderRadius: 20, padding: '32px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, background: labFile ? `rgba(201,168,76,0.05)` : 'transparent' }}>
            <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={e => setLabFile(e.target.files[0])} />
            <div style={{ fontSize: 36, marginBottom: 8 }}>{labFile ? '📄' : '📎'}</div>
            <div style={{ color: labFile ? C.gold2 : C.muted, fontSize: 14 }}>
              {labFile ? labFile.name : 'Toca para subir PDF o imagen'}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: '100%', background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '16px', borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Procesando...' : '✅ Completar examen'}
          </button>
          <button onClick={() => handleSubmit()} style={{ width: '100%', marginTop: 10, background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
            Saltar este paso
          </button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', background: C.obsidian, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 440, width: '100%' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 8, color: C.muted, fontSize: 12 }}>{step + 1}/{totalSteps}</div>
        <div style={{ height: 4, background: C.surface2, borderRadius: 2, marginBottom: 32 }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})`, borderRadius: 2, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>

        {/* Question */}
        <div style={{ animation: 'fadeUp 0.3s ease' }}>
          {current.type === 'scale' && <ScaleQuestion q={current} />}
          {current.type === 'text' && (
            <div>
              <p style={{ color: C.cream, fontSize: 16, fontWeight: 600, marginBottom: 16, lineHeight: 1.5 }}>{current.label}</p>
              <textarea value={answers[current.id] || ''} onChange={e => handleAnswer(e.target.value)}
                placeholder={current.placeholder} rows={4}
                style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px', color: C.cream, fontSize: 14, outline: 'none', resize: 'none', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
            </div>
          )}
          {current.type === 'boolean' && (
            <div>
              <p style={{ color: C.cream, fontSize: 16, fontWeight: 600, marginBottom: 24, lineHeight: 1.5 }}>{current.label}</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[{ v: true, label: '✅ Sí, con gusto' }, { v: false, label: '❌ Prefiero no' }].map(opt => (
                  <button key={String(opt.v)} onClick={() => handleAnswer(opt.v)}
                    style={{ flex: 1, padding: '16px', background: answers[current.id] === opt.v ? `rgba(201,168,76,0.15)` : C.surface, border: `2px solid ${answers[current.id] === opt.v ? C.gold : C.border2}`, borderRadius: 16, color: C.cream, cursor: 'pointer', fontSize: 14 }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {current.type === 'weight' && (
            <div>
              <p style={{ color: C.cream, fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{current.label}</p>
              <p style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Opcional — solo si quieres hacer seguimiento</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input type="number" placeholder="Ej: -2.5" value={answers[current.id] || ''} onChange={e => handleAnswer(e.target.value)}
                  style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', color: C.cream, fontSize: 16, outline: 'none' }} />
                <span style={{ color: C.muted, fontSize: 14 }}>kg</span>
              </div>
            </div>
          )}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: '14px 24px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 50, color: C.cream, cursor: 'pointer', fontSize: 14 }}>
              ← Atrás
            </button>
          )}
          <button onClick={nextStep} disabled={!answers[current.id] && !current.optional}
            style={{ flex: 1, background: answers[current.id] !== undefined || current.optional ? `linear-gradient(135deg, ${C.gold}, ${C.gold2})` : C.surface2, color: C.obsidian, border: 'none', padding: '14px', borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: answers[current.id] !== undefined || current.optional ? 'pointer' : 'not-allowed', opacity: answers[current.id] !== undefined || current.optional ? 1 : 0.4 }}>
            {isLast ? 'Siguiente →' : 'Continuar →'}
          </button>
        </div>

        {current.optional && (
          <button onClick={nextStep} style={{ width: '100%', marginTop: 8, background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>
            Saltar esta pregunta
          </button>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
