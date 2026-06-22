// ================================================================
// PureLife — ReminderSystem.jsx
// Alarmas personalizables + Web Push + fallback email
// Service Worker + Supabase reminders table
// JRMB Food Network LLC · 2026
// ================================================================

import { useState, useEffect } from 'react';

const C = {
  obsidian: '#080B0A', deep: '#0D1210', surface: '#111815',
  surface2: '#162019', surface3: '#1C2920',
  gold: '#C9A84C', gold2: '#E8C96A', cream: '#F4EFE6',
  cream2: '#E8E0D0', sage: '#4A7C59', emerald: '#00C97B',
  muted: '#6B7E74', border: 'rgba(201,168,76,0.15)',
  border2: 'rgba(201,168,76,0.08)',
};

const REMINDER_TYPES = [
  { id: 'smoothie',     emoji: '🥤', label: 'Tomar smoothie',         msg: '¡Hora de tu smoothie! Los nutrientes trabajan mejor con consistencia.' },
  { id: 'shopping',     emoji: '🛒', label: 'Comprar ingredientes',    msg: 'Recuerda comprar tus ingredientes frescos hoy. La frescura maximiza los nutrientes.' },
  { id: 'video',        emoji: '🎬', label: 'Ver video semanal',       msg: '¡Nuevo video disponible! Aprende mientras te inspiras.' },
  { id: 'progress',     emoji: '📊', label: 'Registrar progreso',      msg: 'Tomarte 2 minutos para registrar cómo te sientes hoy acelera tus resultados.' },
  { id: 'hydration',    emoji: '💧', label: 'Hidratación',             msg: '¡Recuerda hidratarte! 8 vasos al día potencian todos los beneficios de tus smoothies.' },
  { id: 'meditation',   emoji: '🧘', label: 'Momento wellness',        msg: 'Un minuto de respiración consciente reduce el cortisol y maximiza la absorción de nutrientes.' },
];

const DAYS = [
  { id: 0, label: 'D', full: 'Dom' },
  { id: 1, label: 'L', full: 'Lun' },
  { id: 2, label: 'M', full: 'Mar' },
  { id: 3, label: 'X', full: 'Mié' },
  { id: 4, label: 'J', full: 'Jue' },
  { id: 5, label: 'V', full: 'Vie' },
  { id: 6, label: 'S', full: 'Sáb' },
];

// ── SERVICE WORKER + PUSH ──────────────────────────────────────
async function registerPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { supported: false, reason: 'push_not_supported' };
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return { supported: false, reason: 'permission_denied' };

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjZJgLIyXKE1YE3ZiY0NKIIBVJQM'
      ),
    });
    return { supported: true, subscription: sub };
  } catch (e) {
    return { supported: false, reason: e.message };
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function ReminderSystem({ user, supabase }) {
  const [reminders, setReminders] = useState([]);
  const [creating, setCreating] = useState(false);
  const [pushSupported, setPushSupported] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Nuevo reminder en creación
  const [newReminder, setNewReminder] = useState({
    type: 'smoothie',
    time: '08:00',
    days: [1, 2, 3, 4, 5], // L-V por defecto
    active: true,
  });

  useEffect(() => {
    loadReminders();
    checkPushSupport();
  }, []);

  const checkPushSupport = async () => {
    const result = await registerPushNotifications();
    setPushSupported(result.supported);
    if (result.supported && result.subscription && user?.id) {
      // Guardar subscription en Supabase
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          accessToken: user.access_token,
          subscription: result.subscription,
        }),
      });
    }
  };

  const loadReminders = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', userId: user.id, accessToken: user.access_token }),
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || []);
      }
    } catch (e) { console.error(e); }
  };

  const saveReminder = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userId: user.id,
          accessToken: user.access_token,
          reminder: newReminder,
        }),
      });
      if (res.ok) {
        showToast('✅ Alarma guardada');
        setCreating(false);
        loadReminders();
        setNewReminder({ type: 'smoothie', time: '08:00', days: [1,2,3,4,5], active: true });
      } else {
        showToast('❌ Error al guardar');
      }
    } catch { showToast('❌ Error de conexión'); }
    setSaving(false);
  };

  const toggleReminder = async (id, active) => {
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle', userId: user.id, accessToken: user.access_token, reminderId: id, active }),
    });
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active } : r));
  };

  const deleteReminder = async (id) => {
    await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', userId: user.id, accessToken: user.access_token, reminderId: id }),
    });
    setReminders(prev => prev.filter(r => r.id !== id));
    showToast('🗑️ Alarma eliminada');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleDay = (dayId) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(dayId) ? prev.days.filter(d => d !== dayId) : [...prev.days, dayId],
    }));
  };

  const getTypeData = (typeId) => REMINDER_TYPES.find(t => t.id === typeId) || REMINDER_TYPES[0];

  return (
    <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: C.cream, marginBottom: 6 }}>
          Mis alarmas ⏰
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>
          Dr. Smoothie AI te enviará mensajes motivacionales con cada recordatorio.
        </p>
      </div>

      {/* Push notification status */}
      {pushSupported === false && (
        <div style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: C.gold2 }}>
          ⚠️ Notificaciones push no disponibles en este dispositivo. Las alarmas se enviarán por email.
        </div>
      )}
      {pushSupported === true && (
        <div style={{ background: 'rgba(0,201,123,0.06)', border: '1px solid rgba(0,201,123,0.2)', borderRadius: 16, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: C.emerald }}>
          ✅ Notificaciones push activadas
        </div>
      )}

      {/* Lista de reminders */}
      {reminders.length === 0 && !creating && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
          <p style={{ fontSize: 14, marginBottom: 20 }}>Aún no tienes alarmas configuradas</p>
        </div>
      )}

      {reminders.map(r => {
        const typeData = getTypeData(r.type);
        return (
          <div key={r.id} style={{ background: C.surface, border: `1px solid ${r.active ? C.border : C.border2}`, borderRadius: 20, padding: '16px 18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, opacity: r.active ? 1 : 0.5 }}>
            <div style={{ fontSize: 28 }}>{typeData.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.cream, fontWeight: 600, fontSize: 14 }}>{typeData.label}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                {r.time} · {r.days?.map(d => DAYS.find(x => x.id === d)?.label).join(' ')}
              </div>
            </div>
            {/* Toggle */}
            <div onClick={() => toggleReminder(r.id, !r.active)} style={{ width: 44, height: 24, borderRadius: 12, background: r.active ? C.emerald : C.surface2, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: `1px solid ${r.active ? C.emerald : C.border}` }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: r.active ? 22 : 2, transition: 'left 0.2s' }} />
            </div>
            <button onClick={() => deleteReminder(r.id)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 16, padding: 4 }}>🗑️</button>
          </div>
        );
      })}

      {/* Crear nueva alarma */}
      {creating ? (
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 24, padding: '24px 20px', marginBottom: 16 }}>
          <h3 style={{ color: C.cream, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Nueva alarma</h3>

          {/* Tipo */}
          <label style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Tipo</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {REMINDER_TYPES.map(t => (
              <button key={t.id} onClick={() => setNewReminder(prev => ({ ...prev, type: t.id }))}
                style={{ background: newReminder.type === t.id ? `rgba(201,168,76,0.15)` : C.surface, border: `1px solid ${newReminder.type === t.id ? C.gold : C.border2}`, borderRadius: 12, padding: '10px 12px', color: newReminder.type === t.id ? C.gold2 : C.cream2, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{t.emoji}</span><span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Hora */}
          <label style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Hora</label>
          <input type="time" value={newReminder.time} onChange={e => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 16px', color: C.cream, fontSize: 16, outline: 'none', marginBottom: 20, width: '100%', fontFamily: "'DM Sans', sans-serif" }} />

          {/* Días */}
          <label style={{ color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Días</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {DAYS.map(d => (
              <button key={d.id} onClick={() => toggleDay(d.id)}
                style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${newReminder.days.includes(d.id) ? C.gold : C.border2}`, background: newReminder.days.includes(d.id) ? `rgba(201,168,76,0.2)` : 'transparent', color: newReminder.days.includes(d.id) ? C.gold2 : C.muted, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                {d.label}
              </button>
            ))}
          </div>

          {/* Preview mensaje */}
          <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 16, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: C.cream2, lineHeight: 1.6 }}>
            <div style={{ color: C.gold2, fontWeight: 600, marginBottom: 4 }}>Vista previa del mensaje:</div>
            💬 {getTypeData(newReminder.type).msg}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={saveReminder} disabled={saving} style={{ flex: 1, background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '14px', borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Guardando...' : '✅ Guardar alarma'}
            </button>
            <button onClick={() => setCreating(false)} style={{ padding: '14px 20px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 50, color: C.cream, cursor: 'pointer', fontSize: 14 }}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setCreating(true)} style={{ width: '100%', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: 20, padding: '16px', color: C.gold2, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>+</span> Nueva alarma
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 40, padding: '12px 24px', color: C.cream, fontSize: 14, zIndex: 9999, animation: 'fadeUp 0.3s ease' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
