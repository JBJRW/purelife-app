import React, { useState, useEffect } from 'react';
import { Crown, Users, Check } from 'lucide-react';

const COLORS = {
  forest: '#0F1F17',
  gold: '#C9973A',
  cream: '#F5F0E8',
};

const PRICE_ID = 'price_1TVbUd2d05WpkcPe9HUVy3eK';
const MAX_FREE_SPOTS = 100;

export default function FoundingMember() {
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/subscriber-count')
      .then((res) => {
        if (!res.ok) throw new Error('count fetch failed');
        return res.json();
      })
      .then((data) => {
        if (active) setSubscriberCount(data.count ?? 0);
      })
      .catch(() => {
        if (active) {
          setFetchError(true);
          setSubscriberCount(0);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICE_ID }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (e) {
      console.error('Checkout error:', e);
      setLoading(false);
    }
  };

  const count = subscriberCount ?? 0;
  const spotsLeft = Math.max(MAX_FREE_SPOTS - count, 0);
  const isFull = spotsLeft <= 0;
  const pct = Math.min((count / MAX_FREE_SPOTS) * 100, 100);

  return (
    <div
      className="rounded-2xl p-6 max-w-md mx-auto relative overflow-hidden"
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
        Los primeros {MAX_FREE_SPOTS} miembros obtienen acceso gratuito de por vida. Después,
        membresía anual a $182/año, precio fijo para siempre.
      </p>

      {subscriberCount === null ? (
        <div className="text-xs opacity-60 py-6 text-center">Cargando disponibilidad...</div>
      ) : !isFull ? (
        <>
          <div className="flex items-center justify-between text-xs mb-1.5 opacity-90">
            <span className="flex items-center gap-1">
              <Users size={14} /> {count} / {MAX_FREE_SPOTS} cupos usados
            </span>
            <span style={{ color: COLORS.gold }}>{spotsLeft} libres</span>
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

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
          >
            {loading ? 'Procesando...' : 'Reclamar mi cupo gratis'}
          </button>
        </>
      ) : (
        <>
          <div
            className="rounded-xl p-3 mb-4 text-sm flex items-center gap-2"
            style={{ backgroundColor: `${COLORS.gold}20` }}
          >
            <Check size={16} style={{ color: COLORS.gold }} />
            Cupos gratuitos agotados. Únete con el precio fundador de $182/año.
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
            style={{ backgroundColor: COLORS.gold, color: COLORS.forest }}
          >
            {loading ? 'Procesando...' : 'Unirme por $182/año'}
          </button>
        </>
      )}

      {fetchError && (
        <p className="text-[11px] mt-3 text-center" style={{ color: '#e08080' }}>
          No se pudo verificar disponibilidad en vivo — mostrando estado por defecto.
        </p>
      )}

      <p className="text-[11px] opacity-50 text-center mt-3">
        Pago único anual · Cancela cuando quieras · Sin compromisos ocultos
      </p>
    </div>
  );
}
