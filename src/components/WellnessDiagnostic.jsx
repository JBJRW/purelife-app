import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';

const COLORS = {
  forest: '#0F1F17',
  gold: '#C9973A',
  cream: '#F5F0E8',
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
    // Crea la fila vacía desde el primer render — antes de la primera respuesta.
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

  return (
    <div
      className="rounded-2xl p-6 max-w-md mx-auto"
      style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
    >
      <div
        className="w-full h-1.5 rounded-full mb-6 overflow-hidden"
        style={{ backgroundColor: `${COLORS.cream}15` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: COLORS.gold }}
        />
      </div>

      {!showResult ? (
        <>
          <p className="text-xs uppercase tracking-wide opacity-60 mb-2">
            Pregunta {step + 1} de {QUESTIONS.length}
          </p>
          <h3
            className="text-xl font-bold mb-5"
            style={{ fontFamily: 'Fraunces, serif' }}
          >
            {QUESTIONS[step].question}
          </h3>
          <div className="flex flex-col gap-2">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(QUESTIONS[step].key, opt.value)}
                className="text-left px-4 py-3 rounded-xl text-sm transition"
                style={{ backgroundColor: `${COLORS.cream}10`, border: `1px solid ${COLORS.gold}30` }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} style={{ color: COLORS.gold }} />
            <p className="text-xs uppercase tracking-wide" style={{ color: COLORS.gold }}>
              Tu recomendación
            </p>
          </div>
          {(() => {
            const rec = RECOMMENDATIONS[answers.goal] || RECOMMENDATIONS.energy;
            return (
              <>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: 'Fraunces, serif' }}
                >
                  {rec.name}
                </h3>
                <p className="text-sm opacity-80 mb-6">{rec.desc}</p>
              </>
            );
          })()}

          {!emailSaved ? (
            <div className="flex flex-col gap-2 mb-4">
              <p className="text-sm opacity-80">
                Déjanos tu email para guardar tu perfil y desbloquear tu plan completo:
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="px-4 py-3 rounded-xl text-sm"
                style={{ backgroundColor: `${COLORS.cream}10`, border: `1px solid ${COLORS.gold}30`, color: COLORS.cream }}
              />
              <button
                onClick={handleEmailSubmit}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
              >
                Guardar mi perfil <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 mb-4"
              style={{ backgroundColor: `${COLORS.gold}15` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} style={{ color: COLORS.gold }} />
                <p className="font-semibold text-sm">¿Quieres ser parte de la familia PureLife?</p>
              </div>
              <p className="text-xs opacity-70 mb-4">
                Tu perfil ya está guardado. Únete ahora como Founding Member y desbloquea tu plan completo.
              </p>
              <button
                onClick={() => onJoin && onJoin({ profileId, ...answers })}
                className="w-full py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
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
