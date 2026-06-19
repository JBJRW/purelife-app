import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const COLORS = {
  forest: '#0F1F17',
  forestLight: '#1a3528',
  gold: '#C9973A',
  goldLight: '#E8B84B',
  cream: '#F5F0E8',
  muted: 'rgba(245,240,232,0.55)',
};

const QUESTIONS = [
  {
    key: 'goal',
    question: '¿Cuál es tu objetivo principal?',
    options: [
      { value: 'energy', label: '⚡ Más energía' },
      { value: 'digestion', label: '🌿 Mejor digestión' },
      { value: 'weight', label: '⚖️ Control de peso' },
      { value: 'skin', label: '✨ Piel más sana' },
      { value: 'immunity', label: '🛡️ Reforzar inmunidad' },
    ],
  },
  {
    key: 'energy_level',
    question: '¿Cómo describirías tu energía estos días?',
    options: [
      { value: 1, label: '😴 Muy baja' },
      { value: 2, label: '😐 Baja' },
      { value: 3, label: '🙂 Normal' },
      { value: 4, label: '😃 Buena' },
      { value: 5, label: '🚀 Excelente' },
    ],
  },
  {
    key: 'restriction',
    question: '¿Tienes alguna restricción alimentaria?',
    options: [
      { value: 'none', label: 'Ninguna' },
      { value: 'lactose', label: 'Lácteos' },
      { value: 'gluten', label: 'Gluten' },
      { value: 'sugar', label: 'Azúcar' },
    ],
  },
  {
    key: 'produce_frequency',
    question: '¿Con qué frecuencia comes frutas/verduras frescas?',
    options: [
      { value: 'rarely', label: 'Casi nunca' },
      { value: 'sometimes', label: 'Algunas veces por semana' },
      { value: 'daily', label: 'Todos los días' },
    ],
  },
  {
    key: 'best_time',
    question: '¿En qué momento del día más lo necesitas?',
    options: [
      { value: 'morning', label: '🌅 Mañana' },
      { value: 'afternoon', label: '☀️ Tarde' },
      { value: 'post_workout', label: '💪 Post-entreno' },
    ],
  },
];

const RECOMMENDATIONS = {
  energy: { name: 'Amanecer Verde', desc: 'Espinaca, piña, jengibre y matcha — energía sostenida sin el bajón del café.' },
  digestion: { name: 'Calma Tropical', desc: 'Papaya, menta y semillas de chía — suaviza la digestión de forma natural.' },
  weight: { name: 'Equilibrio Cítrico', desc: 'Toronja, pepino y proteína vegetal — saciante y bajo en azúcar.' },
  skin: { name: 'Brillo Natural', desc: 'Zanahoria, naranja y colágeno marino — antioxidantes para tu piel.' },
  immunity: { name: 'Escudo Dorado', desc: 'Cúrcuma, naranja y jengibre — tu defensa diaria.' },
};

function getAnonId() {
  let id = localStorage.getItem('pl_anon_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pl_anon_id', id);
  }
  return id;
}

const cardStyle = {
  borderRadius: 18,
  padding: '28px 24px',
  width: '100%',
  maxWidth: 380,
  margin: '0 auto',
  backgroundColor: COLORS.forest,
  color: COLORS.cream,
  boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
  border: `1px solid ${COLORS.gold}30`,
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box',
};

const optionButtonStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '13px 16px',
  borderRadius: 12,
  fontSize: 14,
  color: COLORS.cream,
  backgroundColor: 'rgba(245,240,232,0.06)',
  border: `1px solid ${COLORS.gold}30`,
  cursor: 'pointer',
  marginBottom: 8,
  transition: 'background-color 0.15s ease',
  fontFamily: "'DM Sans', sans-serif",
};

const primaryButtonStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 14,
  border: 'none',
  cursor: 'pointer',
  backgroundColor: COLORS.gold,
  color: COLORS.forest,
  fontFamily: "'DM Sans', sans-serif",
};

export default function WellnessDiagnostic({ onJoin, lang = 'es' }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profileId, setProfileId] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    const id = getAnonId();
    setProfileId(id);
    supabase
      .from('wellness_diagnostic_profiles')
      .upsert({ id, lang }, { onConflict: 'id' })
      .then(({ error }) => {
        if (error) console.error('Error creando perfil:', error.message);
      });
  }, []);

  const persist = async (patch) => {
    if (savingRef.current) return;
    savingRef.current = true;
    const { error } = await supabase
      .from('wellness_diagnostic_profiles')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', profileId);
    if (error) console.error('Error guardando respuesta:', error.message);
    savingRef.current = false;
  };

  const handleAnswer = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    persist({ [key]: value });

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      const rec = RECOMMENDATIONS[updated.goal] || RECOMMENDATIONS.energy;
      persist({ recommended_smoothie: rec.name });
      setShowResult(true);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    await persist({ email });
    setEmailSaved(true);
  };

  const progress = showResult ? 100 : Math.round((step / QUESTIONS.length) * 100);
  const rec = RECOMMENDATIONS[answers.goal] || RECOMMENDATIONS.energy;

  return (
    <div style={cardStyle}>
      <div
        style={{
          width: '100%',
          height: 5,
          borderRadius: 99,
          marginBottom: 22,
          overflow: 'hidden',
          backgroundColor: 'rgba(245,240,232,0.1)',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 99,
            width: `${progress}%`,
            backgroundColor: COLORS.gold,
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {!showResult ? (
        <>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.55, marginBottom: 8 }}>
            Pregunta {step + 1} de {QUESTIONS.length}
          </p>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 18,
              fontFamily: "'Fraunces', serif",
              lineHeight: 1.3,
            }}
          >
            {QUESTIONS[step].question}
          </h3>
          <div>
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(QUESTIONS[step].key, opt.value)}
                style={optionButtonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.06)')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.gold, marginBottom: 6 }}>
            ✨ Tu recomendación
          </p>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: "'Fraunces', serif" }}>
            {rec.name}
          </h3>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24, lineHeight: 1.5 }}>{rec.desc}</p>

          {!emailSaved ? (
            <div>
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 10 }}>
                Déjanos tu email para guardar tu perfil y desbloquear tu plan completo:
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  marginBottom: 10,
                  backgroundColor: 'rgba(245,240,232,0.06)',
                  border: `1px solid ${COLORS.gold}40`,
                  color: COLORS.cream,
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <button onClick={handleEmailSubmit} style={primaryButtonStyle}>
                Guardar mi perfil →
              </button>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 14,
                padding: 18,
                backgroundColor: `${COLORS.gold}18`,
              }}
            >
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                👑 ¿Quieres ser parte de la familia PureLife?
              </p>
              <p style={{ fontSize: 12, opacity: 0.75, marginBottom: 16, lineHeight: 1.5 }}>
                Tu perfil ya está guardado. Únete ahora como Founding Member y desbloquea tu plan completo.
              </p>
              <button
                onClick={() => onJoin && onJoin({ profileId, ...answers })}
                style={primaryButtonStyle}
              >
                Unirme a la familia wellness →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
