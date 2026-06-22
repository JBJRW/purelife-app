import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const FOUNDING_MEMBER_LIMIT = 100;

export default function CheckoutButton({ user, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemberCount();

    // Realtime subscription to counter
    const channel = supabase
      .channel('founding-members-count')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          if (payload.new?.key === 'founding_members_count') {
            setMemberCount(payload.new.value);
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

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  const spotsLeft = FOUNDING_MEMBER_LIMIT - memberCount;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft <= 20 && spotsLeft > 0;

  return (
    <div className={`founding-checkout ${className}`}>
      {/* Founding Member Counter */}
      <div className="founding-counter">
        <div className="counter-track">
          <div
            className="counter-fill"
            style={{ width: `${(memberCount / FOUNDING_MEMBER_LIMIT) * 100}%` }}
          />
        </div>
        <div className="counter-label">
          {isFull ? (
            <span className="counter-full">✦ Los 100 cupos fundadores se llenaron</span>
          ) : (
            <span className={isAlmostFull ? 'counter-urgent' : ''}>
              <strong>{spotsLeft}</strong> cupos fundadores disponibles de {FOUNDING_MEMBER_LIMIT}
              {isAlmostFull && ' — ¡Casi lleno!'}
            </span>
          )}
        </div>
      </div>

      {/* Price Display */}
      <div className="founding-price">
        <span className="price-amount">$182</span>
        <span className="price-period">/ año</span>
        <span className="price-note">Precio fundador — se incrementa al llenarse</span>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleCheckout}
        disabled={loading || isFull}
        className={`checkout-btn ${loading ? 'loading' : ''} ${isFull ? 'full' : ''}`}
      >
        {loading ? (
          <span className="btn-spinner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Procesando...
          </span>
        ) : isFull ? (
          'Cupos agotados'
        ) : (
          '✦ Unirme como Founding Member'
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="checkout-error">⚠️ {error}</p>
      )}

      {/* Trust signals */}
      <div className="checkout-trust">
        <span>🔒 Pago seguro con Stripe</span>
        <span>·</span>
        <span>Cancela cuando quieras</span>
        <span>·</span>
        <span>Acceso inmediato</span>
      </div>

      <style>{`
        .founding-checkout {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 420px;
        }

        .founding-counter {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .counter-track {
          height: 4px;
          background: rgba(201, 151, 58, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .counter-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9973A, #f0c060);
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .counter-label {
          font-size: 13px;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
        }

        .counter-urgent {
          color: #C9973A;
          font-weight: 600;
        }

        .counter-full {
          color: #9ca3af;
        }

        .founding-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }

        .price-amount {
          font-size: 40px;
          font-weight: 700;
          color: #0F1F17;
          font-family: 'Fraunces', serif;
          line-height: 1;
        }

        .price-period {
          font-size: 18px;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
        }

        .price-note {
          display: block;
          width: 100%;
          font-size: 12px;
          color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
        }

        .checkout-btn {
          width: 100%;
          padding: 16px 24px;
          background: #0F1F17;
          color: #F5F0E8;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #1a3528;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15, 31, 23, 0.25);
        }

        .checkout-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .checkout-btn.loading,
        .checkout-btn.full {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-spinner svg {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkout-error {
          font-size: 13px;
          color: #ef4444;
          font-family: 'DM Sans', sans-serif;
          margin: 0;
        }

        .checkout-trust {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
