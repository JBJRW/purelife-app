import { useState } from "react";

export function MemberCard({ member, isFollowing, onFollow, onDismiss }) {
  const [followLoading, setFollowLoading] = useState(false);

  const TIER_COLORS = { seed: "#74C69D", bloom: "#C89A3F", canopy: "#40916C" };
  const TIER_LABELS = { seed: "🌱 Seed", bloom: "🌸 Bloom", canopy: "🌿 Canopy" };
  const tierColor = TIER_COLORS[member.membership_tier] || "#74C69D";
  const tierLabel = TIER_LABELS[member.membership_tier] || "🌱 Seed";

  const handleFollow = async () => {
    setFollowLoading(true);
    await onFollow(member.id);
    setFollowLoading(false);
  };

  return (
    <div style={{
      minWidth: 140, maxWidth: 140,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "16px 12px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 8,
      position: "relative", flexShrink: 0,
    }}>
      {/* Dismiss */}
      <button
        onClick={() => onDismiss(member.id)}
        style={{
          position: "absolute", top: 8, right: 8,
          background: "transparent", border: "none",
          color: "rgba(249,243,232,0.3)", cursor: "pointer",
          fontSize: 14, lineHeight: 1, padding: 2,
        }}
      >×</button>

      {/* Avatar */}
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: `linear-gradient(135deg, ${tierColor}44, ${tierColor}22)`,
        border: `2px solid ${tierColor}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, overflow: "hidden",
      }}>
        {member.avatar_url
          ? <img src={member.avatar_url} alt={member.full_name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          : (member.full_name?.[0] || "?").toUpperCase()
        }
      </div>

      {/* Name */}
      <div style={{
        color: "#F9F3E8", fontSize: 12, fontWeight: 700,
        textAlign: "center", lineHeight: 1.3,
        fontFamily: "DM Sans, sans-serif",
        maxWidth: "100%", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {member.full_name || "Member"}
      </div>

      {/* Tier badge */}
      <div style={{
        fontSize: 9, padding: "2px 8px", borderRadius: 100,
        background: `${tierColor}22`, color: tierColor,
        border: `1px solid ${tierColor}44`, fontWeight: 600,
        letterSpacing: 0.3,
      }}>
        {tierLabel}
      </div>

      {/* Follows you */}
      {member.follows_you && (
        <div style={{
          fontSize: 9, color: "rgba(249,243,232,0.45)",
          fontFamily: "DM Sans, sans-serif",
        }}>
          Follows you
        </div>
      )}

      {/* Follow button */}
      <button
        onClick={handleFollow}
        disabled={followLoading}
        style={{
          width: "100%", padding: "7px 0",
          borderRadius: 8, border: "none", cursor: followLoading ? "not-allowed" : "pointer",
          background: isFollowing
            ? "rgba(255,255,255,0.06)"
            : `linear-gradient(135deg, #1B4332, #2D6A4F)`,
          color: isFollowing ? "rgba(249,243,232,0.5)" : "#F9F3E8",
          fontSize: 11, fontWeight: 700,
          fontFamily: "DM Sans, sans-serif",
          transition: "all 0.2s",
          opacity: followLoading ? 0.6 : 1,
        }}
      >
        {followLoading ? "..." : isFollowing ? "Following" : member.follows_you ? "Follow back" : "Follow"}
      </button>
    </div>
  );
}