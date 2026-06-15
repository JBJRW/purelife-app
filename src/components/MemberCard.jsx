// ═══════════════════════════════════════════════════════════
// PureLife — MemberCard v2.0
// src/components/MemberCard.jsx
// Skills: Emil Kowalski (motion) · Taste (editorial) · Impeccable
// ═══════════════════════════════════════════════════════════

import { useState } from 'react';
import { UserCheck, UserPlus, X } from 'lucide-react';

const TIER_CONFIG = {
  seed:   { label: 'Seed',   color: '#8BC34A', emoji: '🌱' },
  bloom:  { label: 'Bloom',  color: '#C9973A', emoji: '🌸' },
  canopy: { label: 'Canopy', color: '#E8B84B', emoji: '🌿' },
};

// EMIL: spring CSS para botón follow — sin dependencia externa
const CARD_CSS = `
  @media (prefers-reduced-motion: reduce) {
    .mc-card, .mc-btn { transition: none !important; }
  }
  .mc-card {
    transition:
      transform  220ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 220ms ease,
      border-color 220ms ease;
  }
  .mc-card:hover {
    transform: translateY(-3px);
  }
  .mc-btn {
    transition:
      transform  160ms cubic-bezier(0.34, 1.56, 0.64, 1),
      background 160ms ease,
      color      160ms ease,
      border     160ms ease,
      box-shadow 160ms ease;
  }
  .mc-btn:hover  { transform: translateY(-1px); }
  .mc-btn:active { transform: scale(0.94) !important; }

  .mc-dismiss {
    transition: opacity 150ms ease, color 150ms ease;
  }
  .mc-dismiss:hover { opacity: 1 !important; color: #F5F0E8 !important; }
`;

// Inyectar CSS una vez al módulo — no por cada instancia
if (typeof document !== 'undefined' && !document.getElementById('mc-styles')) {
  const el = document.createElement('style');
  el.id = 'mc-styles';
  el.textContent = CARD_CSS;
  document.head.appendChild(el);
}

export function MemberCard({ member, isFollowing, onFollow, onDismiss }) {
  const [pressed, setPressed]     = useState(false);
  const [optimistic, setOptimistic] = useState(isFollowing);

  const tier = TIER_CONFIG[member.membership_tier] || TIER_CONFIG.seed;

  const handleFollow = async () => {
    // IMPECCABLE: optimistic update — UI inmediata, luego sync a Supabase
    const next = !optimistic;
    setOptimistic(next);
    setPressed(true);
    try {
      await onFollow(member.id);
    } catch {
      // Revertir si falla el servidor
      setOptimistic(!next);
    } finally {
      setTimeout(() => setPressed(false), 300);
    }
  };

  // TASTE: label claro según contexto social
  const btnLabel = member.follows_you && !optimistic
    ? 'Seguir de vuelta'
    : optimistic ? 'Siguiendo' : 'Seguir';

  return (
    <div
      className="mc-card"
      style={{
        background: 'rgba(255,255,255,0.04)',
        // EMIL: border animado — se ilumina con el tier al hacer follow
        border: `1px solid ${optimistic ? `${tier.color}35` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
        minWidth: 155,
        maxWidth: 165,
        backdropFilter: 'blur(8px)',
        // EMIL: shadow lift solo cuando está siguiendo
        boxShadow: optimistic
          ? `0 4px 20px ${tier.color}18, 0 1px 4px rgba(0,0,0,0.2)`
          : '0 1px 3px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}
    >
      {/* Dismiss — TASTE: invisible hasta hover, no distrae */}
      <button
        className="mc-dismiss"
        onClick={() => onDismiss?.(member.id)}
        style={{
          position: 'absolute', top: 7, right: 7,
          background: 'transparent', border: 'none',
          cursor: 'pointer', color: 'rgba(255,255,255,0.2)',
          padding: 3, display: 'flex', alignItems: 'center',
          opacity: 0.4,
        }}
        aria-label="Descartar"
      >
        <X size={13} />
      </button>

      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid ${tier.color}`,
          // EMIL: glow sutil, no agresivo
          boxShadow: `0 0 10px ${tier.color}35`,
        }}>
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.full_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #2D5016, #4A7C59)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              // TASTE: inicial en Fraunces — consistente con el sistema tipográfico
              fontSize: 24, fontFamily: 'Fraunces, serif', color: '#F5F0E8',
            }}>
              {member.full_name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        {/* Tier emoji badge */}
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          fontSize: 13, background: '#111c0a',
          borderRadius: '50%', padding: '1px',
          lineHeight: 1.4,
        }}>
          {tier.emoji}
        </span>
      </div>

      {/* Nombre + tier — TASTE: info mínima relevante */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#F5F0E8',
          fontFamily: 'Fraunces, serif',
          fontSize: 13, fontWeight: 600,
          margin: 0,
          maxWidth: 130,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {member.full_name}
        </p>
        <p style={{
          color: tier.color,
          fontSize: 10, margin: '3px 0 0',
          fontFamily: 'DM Sans, sans-serif',
          letterSpacing: '0.04em',
        }}>
          {tier.emoji} {tier.label}
        </p>
      </div>

      {/* Mutual connections — solo si hay, no ruido si no */}
      {member.mutual_count > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          color: 'rgba(245,240,232,0.4)', fontSize: 10,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          <div style={{ display: 'flex' }}>
            {[...Array(Math.min(3, member.mutual_count))].map((_, i) => (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: '50%',
                background: `hsl(${100 + i * 40}, 38%, 42%)`,
                border: '1.5px solid rgba(0,0,0,0.3)',
                marginLeft: i > 0 ? -4 : 0,
              }} />
            ))}
          </div>
          <span>
            {member.mutual_count} mutual{member.mutual_count !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Follow button — EMIL: spring en press, color animado en estado */}
      <button
        className="mc-btn"
        onClick={handleFollow}
        style={{
          width: '100%', padding: '8px 0',
          borderRadius: 8,
          border: optimistic ? '1px solid rgba(255,255,255,0.15)' : 'none',
          background: optimistic
            ? 'transparent'
            : member.follows_you
            ? 'linear-gradient(135deg, #2D5016, #3D6B1F)'
            : 'linear-gradient(135deg, #3D6B1F, #4A7C59)',
          color: optimistic ? 'rgba(245,240,232,0.5)' : '#F5F0E8',
          cursor: 'pointer',
          fontSize: 12, fontWeight: 600,
          fontFamily: 'DM Sans, sans-serif',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 5,
          // IMPECCABLE: transform en style inline para poder sobreescribir con :active
          transform: pressed ? 'scale(0.94)' : 'scale(1)',
        }}
        aria-pressed={optimistic}
        aria-label={btnLabel}
      >
        {optimistic ? <UserCheck size={12} /> : <UserPlus size={12} />}
        {btnLabel}
      </button>
    </div>
  );
}

export default MemberCard;
