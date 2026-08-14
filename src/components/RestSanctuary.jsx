// ============================================================
// PureLife Wellness Club — Santuario de Descanso
// src/components/RestSanctuary.jsx · JRMB Food Network LLC
//
// Ported and adapted from an earlier design prototype. Fully
// self-contained: ambient sounds are synthesized live with the
// Web Audio API (no audio files, no external assets, $0 cost).
// Persistence is local to the device (localStorage) — matches
// the original design; can be upgraded to Supabase sync later
// if Jorge wants cross-device history.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { IT, IT_FONT_HEAD, IT_FONT_BODY } from '../interior/tokens';
import { tui } from '../i18n';

// ---------- Web Audio ambient sound generator ----------
class SoundGenerator {
  ctx = null;
  nodes = [];
  gainNode = null;

  getContext() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  }

  createNoiseBuffer(type) {
    const ctx = this.getContext();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playRain() {
    this.stop();
    const ctx = this.getContext();
    const source = ctx.createBufferSource();
    source.buffer = this.createNoiseBuffer('brown');
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    source.connect(filter).connect(this.gainNode).connect(ctx.destination);
    source.start();
    this.nodes = [source, filter, this.gainNode];
  }

  playForest() {
    this.stop();
    const ctx = this.getContext();
    const source = ctx.createBufferSource();
    source.buffer = this.createNoiseBuffer('pink');
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    source.connect(filter).connect(this.gainNode).connect(ctx.destination);
    source.start();
    this.nodes = [source, filter, this.gainNode];
  }

  playOcean() {
    this.stop();
    const ctx = this.getContext();
    const source = ctx.createBufferSource();
    source.buffer = this.createNoiseBuffer('pink');
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.3;
    lfo.connect(lfoGain).connect(this.gainNode.gain);
    lfo.start();
    source.connect(filter).connect(this.gainNode).connect(ctx.destination);
    source.start();
    this.nodes = [source, filter, this.gainNode, lfo, lfoGain];
  }

  stop() {
    this.nodes.forEach((node) => {
      try {
        if (node instanceof AudioBufferSourceNode || node instanceof OscillatorNode) node.stop();
        node.disconnect();
      } catch {}
    });
    this.nodes = [];
    this.gainNode = null;
  }

  dispose() {
    this.stop();
    if (this.ctx) this.ctx.close();
    this.ctx = null;
  }
}
const soundGenerator = new SoundGenerator();

const readLocal = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

function Divider() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${IT.divider}, transparent)`, margin: '40px 0' }} />;
}

function SectionLabel({ eyebrow, title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: IT.gold, marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h3 style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 22, fontStyle: 'italic', margin: 0 }}>
        {title}
      </h3>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
      background: IT.obsidian, border: `1px solid ${IT.gold}`, borderRadius: 999,
      padding: '10px 20px', color: IT.cream, fontSize: 13, fontFamily: IT_FONT_BODY,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '85%',
    }}>
      {message}
    </div>
  );
}

// ---------- Breathing tool ----------
function BreathTool({ lang }) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const timerRef = useRef(null);
  const breathingRef = useRef(false);

  const runCycle = () => {
    setPhase('inhale');
    timerRef.current = setTimeout(() => {
      setPhase('hold');
      timerRef.current = setTimeout(() => {
        setPhase('exhale');
        timerRef.current = setTimeout(() => {
          if (breathingRef.current) runCycle();
        }, 6000);
      }, 4000);
    }, 4000);
  };

  const start = () => { breathingRef.current = true; setIsBreathing(true); runCycle(); };
  const stop = () => { breathingRef.current = false; setIsBreathing(false); clearTimeout(timerRef.current); setPhase('inhale'); };

  useEffect(() => () => { breathingRef.current = false; clearTimeout(timerRef.current); }, []);

  const scale = !isBreathing ? 1 : phase === 'exhale' ? 1 : 1.3;
  const opacity = !isBreathing ? 0.5 : phase === 'exhale' ? 0.4 : phase === 'hold' ? 0.95 : 0.8;
  const phaseLabel = phase === 'inhale' ? tui(lang, 'restInhale') : phase === 'hold' ? tui(lang, 'restHold') : tui(lang, 'restExhale');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SectionLabel eyebrow={tui(lang, 'restBreathEyebrow')} title={tui(lang, 'restBreathTitle')} />
      <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', borderRadius: '50%', border: `1px solid rgba(44,156,110,0.35)`,
          width: `${scale * 92}%`, height: `${scale * 92}%`, opacity, transition: 'all 4s ease-in-out',
        }} />
        <div style={{
          position: 'relative', width: 128, height: 128, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,156,110,0.22), transparent 70%)',
          border: `1px solid rgba(44,156,110,0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: `scale(${scale})`, opacity, transition: 'all 4s ease-in-out',
        }}>
          <span style={{ fontFamily: IT_FONT_HEAD, fontStyle: 'italic', color: IT.goldLight, fontSize: 16 }}>{phaseLabel}</span>
        </div>
      </div>
      <button
        onClick={isBreathing ? stop : start}
        className="it-tap"
        style={{
          marginTop: 24, padding: '12px 28px', borderRadius: 999, cursor: 'pointer',
          border: `1.5px solid ${IT.gold}`, background: isBreathing ? 'transparent' : `${IT.gold}22`,
          color: IT.cream, fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
        }}
      >
        {isBreathing ? tui(lang, 'restStop') : tui(lang, 'restStart')}
      </button>
      <p style={{ marginTop: 10, fontSize: 11, color: IT.textSecondary, fontFamily: IT_FONT_BODY }}>
        {tui(lang, 'restBreathTiming')}
      </p>
    </div>
  );
}

// ---------- Sound tool ----------
function SoundTool({ lang }) {
  const [active, setActive] = useState(null);
  useEffect(() => () => soundGenerator.dispose(), []);

  const toggle = (id) => {
    if (active === id) { soundGenerator.stop(); setActive(null); return; }
    soundGenerator.stop();
    if (id === 'rain') soundGenerator.playRain();
    else if (id === 'forest') soundGenerator.playForest();
    else soundGenerator.playOcean();
    setActive(id);
  };

  const sounds = [
    { id: 'rain', icon: '🌧️', label: tui(lang, 'restSoundRain') },
    { id: 'forest', icon: '🌲', label: tui(lang, 'restSoundForest') },
    { id: 'ocean', icon: '🌊', label: tui(lang, 'restSoundOcean') },
  ];

  return (
    <div>
      <SectionLabel eyebrow={tui(lang, 'restSoundEyebrow')} title={tui(lang, 'restSoundTitle')} />
      <div style={{ display: 'flex', gap: 10 }}>
        {sounds.map((s) => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className="it-tap"
            style={{
              flex: 1, padding: '16px 8px', borderRadius: 18, cursor: 'pointer', textAlign: 'center',
              border: `1px solid ${active === s.id ? IT.emerald : IT.divider}`,
              background: active === s.id ? `${IT.emerald}18` : 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: active === s.id ? IT.goldLight : IT.textSecondary, fontFamily: IT_FONT_BODY, fontWeight: 700 }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Mood diary ----------
function MoodTool({ lang, notify }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const moods = ['😌', '😴', '🤯', '😔', '😊'];
  const moodKeys = ['restMoodCalm', 'restMoodTired', 'restMoodStressed', 'restMoodSad', 'restMoodHappy'];

  const save = () => {
    if (selected === null) return;
    const entries = readLocal('purelife_moods', []);
    window.localStorage.setItem('purelife_moods', JSON.stringify([
      { mood: moodKeys[selected], note: note.trim(), createdAt: new Date().toISOString() },
      ...entries,
    ].slice(0, 90)));
    setSaved(true);
    setNote('');
    notify(tui(lang, 'restMoodSaved'));
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionLabel eyebrow={tui(lang, 'restMoodEyebrow')} title={tui(lang, 'restMoodTitle')} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {moods.map((emoji, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="it-tap"
            style={{
              width: 48, height: 48, borderRadius: 14, fontSize: 20, cursor: 'pointer',
              border: `1px solid ${selected === i ? IT.gold : IT.divider}`,
              background: selected === i ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
              transform: selected === i ? 'scale(1.1)' : 'scale(1)', transition: 'transform .15s',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={tui(lang, 'restMoodPlaceholder')}
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14,
          border: `1px solid ${IT.divider}`, background: 'rgba(255,255,255,0.03)', color: IT.cream,
          fontSize: 13, fontFamily: IT_FONT_BODY, resize: 'none', marginBottom: 12,
        }}
      />
      <button
        onClick={save}
        disabled={selected === null}
        className="it-tap"
        style={{
          width: '100%', padding: '14px', borderRadius: 999, cursor: selected === null ? 'default' : 'pointer',
          border: 'none', background: saved ? IT.emerald : IT.gold, color: IT.obsidian,
          fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY, opacity: selected === null ? 0.5 : 1,
        }}
      >
        {saved ? `✓ ${tui(lang, 'restSaved')}` : tui(lang, 'restSaveEntry')}
      </button>
    </div>
  );
}

// ---------- Sleep log ----------
function SleepTool({ lang, notify }) {
  const [hours, setHours] = useState(7.5);
  const [quality, setQuality] = useState('good');
  const [saved, setSaved] = useState(false);
  const qualities = ['verybad', 'bad', 'normal', 'good', 'excellent'];
  const qualityKeys = { verybad: 'restQVeryBad', bad: 'restQBad', normal: 'restQNormal', good: 'restQGood', excellent: 'restQExcellent' };

  const save = () => {
    const entries = readLocal('purelife_sleep', []);
    window.localStorage.setItem('purelife_sleep', JSON.stringify([
      { hours, quality, createdAt: new Date().toISOString() },
      ...entries,
    ].slice(0, 90)));
    setSaved(true);
    notify(tui(lang, 'restSleepSaved'));
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionLabel eyebrow={tui(lang, 'restSleepEyebrow')} title={tui(lang, 'restSleepTitle')} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: IT.textSecondary, fontFamily: IT_FONT_BODY }}>{tui(lang, 'restSleepHours')}</span>
        <span style={{ fontFamily: IT_FONT_HEAD, fontSize: 22, color: IT.goldLight }}>{hours}h</span>
      </div>
      <input
        type="range" min={0} max={12} step={0.5} value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        style={{ width: '100%', accentColor: IT.gold, marginBottom: 20 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 20 }}>
        {qualities.map((q) => (
          <button
            key={q}
            onClick={() => setQuality(q)}
            className="it-tap"
            style={{
              padding: '10px 4px', borderRadius: 12, fontSize: 10, cursor: 'pointer', fontFamily: IT_FONT_BODY, fontWeight: 600,
              border: `1px solid ${quality === q ? IT.gold : IT.divider}`,
              background: quality === q ? `${IT.gold}22` : 'rgba(255,255,255,0.03)',
              color: quality === q ? IT.goldLight : IT.textSecondary,
            }}
          >
            {tui(lang, qualityKeys[q])}
          </button>
        ))}
      </div>
      <button
        onClick={save}
        className="it-tap"
        style={{
          width: '100%', padding: '14px', borderRadius: 999, cursor: 'pointer',
          border: 'none', background: saved ? IT.emerald : IT.gold, color: IT.obsidian,
          fontSize: 14, fontWeight: 700, fontFamily: IT_FONT_BODY,
        }}
      >
        {saved ? `✓ ${tui(lang, 'restSaved')}` : tui(lang, 'restSaveEntry')}
      </button>
    </div>
  );
}

// ---------- Habit reminders ----------
function HabitTool({ lang, notify }) {
  const saved = readLocal('purelife_reminder', { enabled: false, interval: 60, message: '' });
  const [enabled, setEnabled] = useState(saved.enabled);
  const [interval, setIntervalVal] = useState(saved.interval);
  const [message, setMessage] = useState(saved.message || tui(lang, 'restHabitDefaultMsg'));
  const reminderRef = useRef(null);

  useEffect(() => {
    window.localStorage.setItem('purelife_reminder', JSON.stringify({ enabled, interval, message }));
    if (reminderRef.current) clearInterval(reminderRef.current);
    reminderRef.current = null;
    if (enabled) {
      reminderRef.current = setInterval(() => notify(message || tui(lang, 'restHabitDefaultMsg')), interval * 60000);
    }
    return () => { if (reminderRef.current) clearInterval(reminderRef.current); };
  }, [enabled, interval, message]);

  return (
    <div>
      <SectionLabel eyebrow={tui(lang, 'restHabitEyebrow')} title={tui(lang, 'restHabitTitle')} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: enabled ? 18 : 0 }}>
        <span style={{ fontSize: 13, color: IT.cream, fontFamily: IT_FONT_BODY }}>{tui(lang, 'restHabitToggle')}</span>
        <button
          onClick={() => { setEnabled((e) => !e); if (!enabled) notify(tui(lang, 'restHabitOn')); }}
          style={{
            width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative',
            background: enabled ? IT.emerald : 'rgba(255,255,255,0.12)', transition: 'background .2s',
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: enabled ? 23 : 3, width: 20, height: 20, borderRadius: '50%',
            background: IT.cream, transition: 'left .2s',
          }} />
        </button>
      </div>
      {enabled && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <input
              type="range" min={15} max={180} step={15} value={interval}
              onChange={(e) => setIntervalVal(Number(e.target.value))}
              style={{ flex: 1, accentColor: IT.gold }}
            />
            <span style={{ fontFamily: IT_FONT_HEAD, fontSize: 16, color: IT.goldLight, minWidth: 48, textAlign: 'right' }}>{interval}m</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14,
              border: `1px solid ${IT.divider}`, background: 'rgba(255,255,255,0.03)', color: IT.cream,
              fontSize: 13, fontFamily: IT_FONT_BODY, resize: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function RestSanctuary({ lang = 'en' }) {
  const [toastMsg, setToastMsg] = useState('');
  const notify = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3500); };

  return (
    <div style={{
      minHeight: '100%',
      background: `radial-gradient(circle at 50% -10%, rgba(232,201,106,0.08), transparent 55%), ${IT.obsidian}`,
      padding: '24px 20px 40px',
    }}>
      <Toast message={toastMsg} />
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: IT.gold, marginBottom: 6 }}>
            {tui(lang, 'restEyebrow')}
          </div>
          <h2 style={{ fontFamily: IT_FONT_HEAD, color: IT.cream, fontSize: 30, fontStyle: 'italic', margin: 0 }}>
            {tui(lang, 'restTitle')}
          </h2>
          <p style={{ marginTop: 10, fontSize: 13, color: IT.textSecondary, fontFamily: IT_FONT_BODY, lineHeight: 1.6 }}>
            {tui(lang, 'restSubtitle')}
          </p>
        </div>

        <Divider />
        <BreathTool lang={lang} />
        <Divider />
        <SoundTool lang={lang} />
        <Divider />
        <MoodTool lang={lang} notify={notify} />
        <Divider />
        <SleepTool lang={lang} notify={notify} />
        <Divider />
        <HabitTool lang={lang} notify={notify} />
      </div>
    </div>
  );
}
