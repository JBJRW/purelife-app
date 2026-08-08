import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from './tokens';
import { tui } from '../i18n';

const TIER_LABELS = { seed: 'Seed 🌱', bloom: 'Bloom 🌸', canopy: 'Canopy 🌿' };

function daysAgo(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) / 86400000;
}

function Bar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', fontSize: 11,
        color: IT.textSecondary, marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span>{label}</span><span>{value}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(244,239,230,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ height: '100%', background: color }}
        />
      </div>
    </div>
  );
}

function ExamForm({ user, onDone, lang }) {
  const EXAM_FIELDS = [
    { key: 'energy_level', label: tui(lang, 'itExamEnergy') },
    { key: 'hydration_level', label: tui(lang, 'itExamHydration') },
    { key: 'rest_quality', label: tui(lang, 'itExamRest') },
    { key: 'mood', label: tui(lang, 'itExamMood') },
  ];
  const [answers, setAnswers] = useState({ energy_level: 3, hydration_level: 3, rest_quality: 3, mood: 3 });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    const score = Math.round((Object.values(answers).reduce((a, b) => a + b, 0) / 20) * 100);
    const { error } = await supabase.from('progress_exams').insert({
      user_id: user.id,
      exam_type: 'wellness_check',
      score,
      answers,
    });
    setSaving(false);
    if (!error) onDone();
  };

  return (
    <div style={{ padding: '16px 0' }}>
      {EXAM_FIELDS.map(f => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: IT.cream, marginBottom: 8 }}>{f.label}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setAnswers(a => ({ ...a, [f.key]: n }))}
                className="it-tap"
                style={{
                  width: 34, height: 34, borderRadius: '50%', cursor: 'pointer',
                  border: `1px solid ${answers[f.key] === n ? IT.goldLight : IT.divider}`,
                  background: answers[f.key] === n ? 'rgba(232,201,106,0.15)' : 'transparent',
                  color: answers[f.key] === n ? IT.goldLight : IT.textSecondary,
                  fontSize: 13, fontFamily: IT_FONT_BODY,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={submit}
        disabled={saving}
        className="it-tap"
        style={{
          width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${IT.gold}, ${IT.goldLight})`,
          color: IT.obsidian, fontWeight: 700, fontSize: 14, fontFamily: IT_FONT_BODY,
        }}
      >
        {saving ? tui(lang, 'itProgresoSaving') : tui(lang, 'itProgresoSaveExam')}
      </button>
    </div>
  );
}

function ReminderRow({ reminder, onToggle, lang }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderTop: `1px solid ${IT.divider}`,
    }}>
      <div>
        <div style={{ fontSize: 13, color: IT.cream }}>{reminder.title}</div>
        <div style={{ fontSize: 11, color: IT.textSecondary, marginTop: 2 }}>
          {new Date(reminder.scheduled_at).toLocaleString(lang || 'en', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
          {reminder.recurrence && reminder.recurrence !== 'none' ? ` · ${reminder.recurrence}` : ''}
        </div>
      </div>
      <button
        onClick={() => onToggle(reminder)}
        className="it-tap"
        style={{
          width: 38, height: 22, borderRadius: 12, border: `1px solid ${IT.divider}`, cursor: 'pointer',
          background: reminder.is_active ? IT.sage : 'transparent', position: 'relative', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 1, left: reminder.is_active ? 17 : 1,
          width: 18, height: 18, borderRadius: '50%', background: IT.cream, transition: 'left 160ms ease',
        }} />
      </button>
    </div>
  );
}

function NewReminderForm({ user, onCreated, lang }) {
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState('');
  const [recurrence, setRecurrence] = useState('none');

  const submit = async () => {
    if (!title || !when) return;
    const { error } = await supabase.from('reminders').insert({
      user_id: user.id, title, scheduled_at: new Date(when).toISOString(), recurrence,
    });
    if (!error) { setTitle(''); setWhen(''); setRecurrence('none'); onCreated(); }
  };

  const inputStyle = {
    background: 'transparent', border: 'none', borderBottom: `1px solid ${IT.divider}`,
    color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY, padding: '8px 2px', outline: 'none', width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 0' }}>
      <input style={inputStyle} placeholder={tui(lang, 'itReminderTitlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} />
      <input style={inputStyle} type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} />
      <select style={{ ...inputStyle, color: IT.textSecondary }} value={recurrence} onChange={e => setRecurrence(e.target.value)}>
        <option value="none">{tui(lang, 'itFreqOnce')}</option>
        <option value="daily">{tui(lang, 'itFreqDaily')}</option>
        <option value="weekly">{tui(lang, 'itFreqWeekly')}</option>
      </select>
      <button
        onClick={submit}
        className="it-tap"
        style={{
          padding: '10px', borderRadius: 10, border: `1px solid ${IT.divider}`, background: 'transparent',
          color: IT.goldLight, fontSize: 13, fontFamily: IT_FONT_BODY, cursor: 'pointer',
        }}
      >
        + {tui(lang, 'itProgresoAddReminder').replace(/^\+\s*/, '')}
      </button>
    </div>
  );
}

export default function ProgresoTab({ user, hermes, lang = 'en' }) {
  const [exam, setExam] = useState(undefined); // undefined = cargando, null = sin datos
  const [reminders, setReminders] = useState(undefined);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reducedData, setReducedData] = useState(false);

  useEffect(() => {
    setReducedData(!!navigator.connection?.saveData);
  }, []);

  const loadExam = () => {
    if (!user?.id) return;
    supabase
      .from('progress_exams')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .then(({ data }) => setExam(data?.[0] || null));
  };

  const loadReminders = () => {
    if (!user?.id) return;
    supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true })
      .then(({ data }) => setReminders(data || []));
  };

  useEffect(() => { loadExam(); loadReminders(); }, [user?.id]);

  const toggleReminder = async (reminder) => {
    setReminders(rs => rs.map(r => r.id === reminder.id ? { ...r, is_active: !r.is_active } : r));
    await supabase.from('reminders').update({ is_active: !reminder.is_active }).eq('id', reminder.id);
  };

  const needsExam = exam !== undefined && (!exam || daysAgo(exam.taken_at) > 7);
  const bars = exam?.answers ? [
    { label: tui(lang, 'itProgresoBarEnergy'), value: Math.round((exam.answers.energy_level || 0) / 5 * 100), color: IT.emerald },
    { label: tui(lang, 'itProgresoBarHydration'), value: Math.round((exam.answers.hydration_level || 0) / 5 * 100), color: IT.gold },
    { label: tui(lang, 'itProgresoBarRest'), value: Math.round((exam.answers.rest_quality || 0) / 5 * 100), color: IT.sage },
  ] : [];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {!reducedData && (
        <>
          <div className="it-glow it-glow-progreso" />
          <img
            src="/backgrounds/bg-progreso.webp"
            alt=""
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            className="it-bg-figure"
          />
        </>
      )}
      <div style={{ position: 'fixed', inset: 0, background: IT.obsidian, opacity: 0.75, zIndex: 0 }} />
      {!reducedData && (
        <>
          <span className="it-particle" style={{ top: '18%', left: '20%', animationDelay: '0s' }} />
          <span className="it-particle" style={{ top: '30%', right: '18%', animationDelay: '1.6s' }} />
          <span className="it-particle" style={{ top: '50%', left: '12%', animationDelay: '3.2s' }} />
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }} className="it-scrim-text">
        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 30, fontStyle: 'italic', marginBottom: 4 }}>
          {tui(lang, 'itProgresoTitle')}
        </div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: IT_FONT_HEAD, fontSize: 22, color: IT.cream }}>
              🔥 {hermes?.stats?.daysActive ?? 0}
            </div>
            <div style={{ fontSize: 10, color: IT.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tui(lang, 'itProgresoStreak')}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: IT_FONT_HEAD, fontSize: 22, color: IT.cream }}>
              {TIER_LABELS[hermes?.tier] || 'Seed 🌱'}
            </div>
            <div style={{ fontSize: 10, color: IT.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tui(lang, 'itProgresoMembership')}
            </div>
          </div>
        </div>

        <div className="it-divider" style={{ marginBottom: 20 }} />

        {exam === undefined ? (
          <div style={{ color: IT.textSecondary, fontSize: 13 }}>{tui(lang, 'itProgresoLoading')}</div>
        ) : bars.length > 0 ? (
          <div style={{ marginBottom: 20 }}>
            {bars.map(b => <Bar key={b.label} {...b} />)}
          </div>
        ) : (
          <div style={{ color: IT.textSecondary, fontSize: 13, marginBottom: 20 }}>
            {tui(lang, 'itProgresoNoExam')}
          </div>
        )}

        {needsExam && !showExamForm && (
          <button
            onClick={() => setShowExamForm(true)}
            className="it-tap"
            style={{
              width: '100%', padding: '13px', marginBottom: 20, borderRadius: 10,
              border: `1px solid ${IT.goldLight}`, background: 'transparent',
              color: IT.goldLight, fontSize: 13, fontFamily: IT_FONT_BODY, cursor: 'pointer',
            }}
          >
            {exam ? tui(lang, 'itProgresoTakeExamWeek') : tui(lang, 'itProgresoTakeExamNow')}
          </button>
        )}
        {showExamForm && (
          <ExamForm user={user} lang={lang} onDone={() => { setShowExamForm(false); loadExam(); }} />
        )}

        <div className="it-divider" style={{ margin: '20px 0' }} />

        <div style={{ fontFamily: IT_FONT_HEAD, color: IT.goldLight, fontSize: 20, fontStyle: 'italic', marginBottom: 6 }}>
          {tui(lang, 'itProgresoReminders')}
        </div>
        {reminders === undefined ? (
          <div style={{ color: IT.textSecondary, fontSize: 13 }}>{tui(lang, 'itProgresoLoading')}</div>
        ) : reminders.length === 0 && !showReminderForm ? (
          <div style={{ color: IT.textSecondary, fontSize: 13 }}>{tui(lang, 'itProgresoNoReminders')}</div>
        ) : (
          reminders.map(r => <ReminderRow key={r.id} reminder={r} onToggle={toggleReminder} lang={lang} />)
        )}

        {showReminderForm ? (
          <NewReminderForm user={user} lang={lang} onCreated={() => { setShowReminderForm(false); loadReminders(); }} />
        ) : (
          <button
            onClick={() => setShowReminderForm(true)}
            className="it-tap"
            style={{
              marginTop: 12, padding: '10px 0', background: 'none', border: 'none',
              color: IT.gold, fontSize: 13, fontFamily: IT_FONT_BODY, cursor: 'pointer',
            }}
          >
            {tui(lang, 'itProgresoAddReminder')}
          </button>
        )}
      </div>
    </div>
  );
}
