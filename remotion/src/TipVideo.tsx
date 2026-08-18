import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
} from 'remotion';

const JADE = '#2C9C6E';
const CREAM = '#FAF7F1';
const GOLD = '#C9A84C';
const GOLD_SOFT = '#E8C76A';
const DEEP = '#04080A';

function emojiToTwemojiUrl(emoji: string): string {
  const codepoints = Array.from(emoji)
    .map((char) => char.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== 'fe0f')
    .join('-');
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoints}.svg`;
}

const EmojiIcon: React.FC<{ emoji: string; size: number }> = ({ emoji, size }) => (
  <Img src={emojiToTwemojiUrl(emoji)} style={{ width: size, height: size, display: 'block' }} />
);

export type TipVideoProps = {
  content: string;
  topic: string;
};

// Divide el texto en 2-3 fragmentos cortos para revelarlos progresivamente
function splitIntoBeats(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map((s) => s.trim()).filter(Boolean).slice(0, 3);
}

const TOPIC_ICON: Record<string, string> = {
  hydration: '💧',
  hidratación: '💧',
  habit: '🌱',
  hábito: '🌱',
  sleep: '🌙',
  sueño: '🌙',
  myth: '🧠',
  mito: '🧠',
  nutrition: '🥗',
  nutrición: '🥗',
};

function iconForTopic(topic: string): string {
  const lower = (topic || '').toLowerCase();
  for (const [kw, icon] of Object.entries(TOPIC_ICON)) {
    if (lower.includes(kw)) return icon;
  }
  return '🌿';
}

// Orbe de luz ambiental animado — reemplazo liviano (CSS puro) del
// sistema de partículas 3D, sin el costo de renderizar Three.js en
// Lambda.
const GlowOrb: React.FC<{ x: number; y: number; size: number; color: string; delay: number }> = ({
  x, y, size, color, delay,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame + delay) / 45) * 30;
  const pulse = 0.5 + 0.5 * Math.sin((frame + delay) / 30);
  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift,
        top: y - drift * 0.6,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.12 + pulse * 0.1,
        filter: 'blur(60px)',
      }}
    />
  );
};

export const TipVideo: React.FC<TipVideoProps> = ({ content, topic }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const icon = iconForTopic(topic);
  const beats = splitIntoBeats(content);

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const badgeIn = spring({ frame: frame - 12, fps, config: { damping: 14 } });

  const beatDuration = Math.floor((durationInFrames - 55) / Math.max(beats.length, 1));

  return (
    <AbsoluteFill style={{ background: DEEP, fontFamily: 'DM Sans, Arial, sans-serif', overflow: 'hidden' }}>
      {/* Orbes de luz ambiental */}
      <GlowOrb x={-80} y={200} size={420} color={JADE} delay={0} />
      <GlowOrb x={700} y={1200} size={480} color={GOLD_SOFT} delay={60} />
      <GlowOrb x={100} y={1500} size={360} color={JADE} delay={120} />

      {/* Viñeta cinematográfica */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(4,8,10,0.75) 100%)',
        }}
      />

      {/* Logo intro */}
      <Sequence from={0} durationInFrames={28}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: 'center' }}>
            <div style={{ fontSize: 30, color: GOLD_SOFT, letterSpacing: 6, fontWeight: 700 }}>
              PURELIFE
            </div>
            <div style={{ fontSize: 14, color: CREAM, opacity: 0.6, marginTop: 6, letterSpacing: 2 }}>
              TEAM TIP
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Badge de tema, persistente desde el frame 12 */}
      <Sequence from={12}>
        <AbsoluteFill style={{ alignItems: 'center', padding: '90px 60px 0' }}>
          <div
            style={{
              opacity: badgeIn,
              transform: `translateY(${(1 - badgeIn) * -20}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(232,199,106,0.1)',
              border: `1px solid ${GOLD_SOFT}55`,
              padding: '10px 22px',
              borderRadius: 30,
            }}
          >
            <EmojiIcon emoji={icon} size={22} />
            <span style={{ color: GOLD_SOFT, fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              {topic}
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Beats de texto, uno a la vez, centrados */}
      {beats.map((beat, i) => {
        const from = 28 + i * beatDuration;
        return (
          <Sequence key={i} from={from} durationInFrames={beatDuration + 15}>
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 70px' }}>
              {(() => {
                const local = frame - from;
                const p = spring({ frame: local, fps, config: { damping: 16 } });
                const out = interpolate(local, [beatDuration - 10, beatDuration + 10], [1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                return (
                  <div
                    style={{
                      opacity: p * out,
                      transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + p * 0.04})`,
                      textAlign: 'center',
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 44,
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: CREAM,
                      lineHeight: 1.35,
                      textShadow: `0 0 40px ${GOLD_SOFT}33`,
                    }}
                  >
                    {beat}
                  </div>
                );
              })()}
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Outro */}
      <Sequence from={durationInFrames - 35}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', padding: '0 0 90px' }}>
          {(() => {
            const local = frame - (durationInFrames - 35);
            const p = spring({ frame: local, fps, config: { damping: 14 } });
            return (
              <div style={{ opacity: p, textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: CREAM, opacity: 0.45, letterSpacing: 1 }}>
                  purelifewellnessclub.org
                </div>
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
