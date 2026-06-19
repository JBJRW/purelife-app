import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Crown, Users, Check } from 'lucide-react';

const COLORS = {
  forest: '#0F1F17',
  gold: '#C9973A',
  cream: '#F5F0E8',
};

const FOUNDING_MEMBER_LIMIT = 100;

export default function FoundingMember({ user, className = '' }) {
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberCount();

    const channel = supabase
      .channel('founding-members-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          if (payload.new?.key === 'founding_members_count') {
            setMemberCount(parseInt(payload.new.value) || 0);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchMemberCount() {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'founding_members_count')
      .single();

    if (!error && data) {
      setMemberCount(parseInt(data.value) || 0);
    }
  }

  async function handleCheckout() {
    if (!user) {
      setError('Debes iniciar sesión primero.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  const spotsLeft = Math.max(FOUNDING_MEMBER_LIMIT - memberCount, 0);
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft <= 20 && spotsLeft > 0;
  const pct = Math.min((memberCount / FOUNDING_MEMBER_LIMIT) * 100, 100);

  return (
    <div
      className={`rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden ${className}`}
      style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
    >
      <div
        className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-xl"
        style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
      >
        OFERTA FUNDADORES
      </div>

      <div className="flex items-center gap-2 mb-3 mt-2">
        <Crown size={22} style={{ color: COLORS.gold }} />
        <h3 className="text-xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
          PureLife Founding Member
        </h3>
      </div>

      <p className="text-sm opacity-80 mb-5">
        Los primeros {FOUNDING_MEMBER_LIMIT} miembros obtienen acceso gratuito de por vida.
        Después, membresía anual a $182/año, precio fijo para siempre.
      </p>

      <div className="flex items-center justify-between text-xs mb-1.5 opacity-90">
        <span className="flex items-center gap-1">
          <Users size={14} /> {memberCount} / {FOUNDING_MEMBER_LIMIT} cupos usados
        </span>
        <span style={{ color: isAlmostFull ? '#ff8080' : COLORS.gold }}>
          {isFull ? 'agotados' : `${spotsLeft} libres`}
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full mb-5 overflow-hidden"
        style={{ backgroundColor: `${COLORS.cream}20` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: COLORS.gold }}
        />
      </div>

      {isFull && (
        <div
          className="rounded-xl p-3 mb-4 text-sm flex items-center gap-2"
          style={{ backgroundColor: `${COLORS.gold}20` }}
        >
          <Check size={16} style={{ color: COLORS.gold }} />
          Cupos gratuitos agotados. Únete con el precio fundador de $182/año.
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || isFull}
        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
      >
        {loading ? 'Procesando...' : isFull ? 'Cupos agotados' : 'Reclamar mi cupo gratis'}
      </button>

      {error && (
        <p className="text-[11px] mt-3 text-center" style={{ color: '#ff8080' }}>
          ⚠️ {error}
        </p>
      )}

      <p className="text-[11px] opacity-50 text-center mt-3">
        Pago seguro con Stripe · Cancela cuando quieras · Acceso inmediato
      </p>
    </div>
  );
}
