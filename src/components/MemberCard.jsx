import { useState } from 'react';
import { UserCheck, UserPlus, X } from 'lucide-react';

const TIER_CONFIG = {
  seed:   { label: 'Seed',   color: '#8BC34A', emoji: '🌱' },
  bloom:  { label: 'Bloom',  color: '#4CAF50', emoji: '🌸' },
  canopy: { label: 'Canopy', color: '#FFD700', emoji: '🌿' },
};

export function MemberCard({ member, isFollowing, onFollow, onDismiss }) {
  const [pressed, setPressed] = useState(false);
  const tier = TIER_CONFIG[member.membership_tier] || TIER_CONFIG.seed;

  const handleFollow = async () => {
    setPressed(true);
    await onFollow(member.id);
    setTimeout(() => setPressed(false), 300);
  };

  const btnLabel = member.follows_you && !isFollowing ? 'Follow back'
    : isFollowing ? 'Following' : 'Follow';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.055)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '16px', padding: '16px 14px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '10px',
      position: 'relative', minWidth: '155px', maxWidth: '165px',
      backdropFilter: 'blur(8px)',
      boxShadow: isFollowing ? `0 0 16px ${tier.color}20` : 'none',
      transition: 'box-shadow 0.3s',
    }}>
      <button onClick={() => onDismiss?.(member.id)} style={{
        position: 'absolute', top: 7, right: 7, background: 'transparent',
        border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
        padding: '3px', display: 'flex', alignItems: 'center',
      }}><X size={13} /></button>

      <div style={{ position: 'relative' }}>
        <div style={{
          width: '68px', height: '68px', borderRadius: '50%',
          overflow: 'hidden', border: `2px solid ${tier.color}`,
          boxShadow: `0 0 12px ${tier.color}40`,
        }}>
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={member.full_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #2D5016, #4A7C59)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontFamily: 'Fraunces, serif', color: '#F5F0E8',
            }}>
              {member.full_name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <span style={{
          position: 'absolute', bottom: -2, right: -2, fontSize: '14px',
          background: '#111c0a', borderRadius: '50%', padding: '1px',
        }}>{tier.emoji}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          color: '#F5F0E8', fontFamily: 'Fraunces, serif',
          fontSize: '13px', fontWeight: '600', margin: 0,
          maxWidth: '130px', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{member.full_name}</p>
        <p style={{ color: tier.color, fontSize: '10px', margin: '3px 0 0', fontFamily: 'DM Sans, sans-serif' }}>
          {tier.emoji} {tier.label} Member
        </p>
      </div>

      {member.mutual_count > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          color: 'rgba(245,240,232,0.45)', fontSize: '10px',
        }}>
          <div style={{ display: 'flex' }}>
            {[...Array(Math.min(3, member.mutual_count))].map((_, i) => (
              <div key={i} style={{
                width: '15px', height: '15px', borderRadius: '50%',
                background: `hsl(${100 + i * 40}, 38%, 42%)`,
                border: '1.5px solid rgba(0,0,0,0.3)',
                marginLeft: i > 0 ? '-5px' : 0,
              }} />
            ))}
          </div>
          <span>{member.mutual_count} mutual{member.mutual_count !== 1 ? 's' : ''}</span>
        </div>
      )}

      <button onClick={handleFollow} style={{
        width: '100%', padding: '8px 0', borderRadius: '8px',
        border: isFollowing ? '1px solid rgba(255,255,255,0.18)' : 'none',
        background: isFollowing ? 'transparent'
          : member.follows_you ? 'linear-gradient(135deg, #2D5016, #3D6B1F)'
          : 'linear-gradient(135deg, #3D6B1F, #4A7C59)',
        color: isFollowing ? 'rgba(245,240,232,0.5)' : '#F5F0E8',
        cursor: 'pointer', fontSize: '12px', fontWeight: '600',
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        transform: pressed ? 'scale(0.96)' : 'scale(1)', transition: 'all 0.15s',
      }}>
        {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
        {btnLabel}
      </button>
    </div>
  );
}