import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';

const JADE = '#2C9C6E';
const CREAM = '#FAF7F1';
const GOLD = '#C9A84C';
const DEEP = '#0F1F17';

export type RecipeVideoProps = {
  name: string;
  ingredients: string[];
  benefits: string;
  category: string;
};

export const RecipeVideo: React.FC<RecipeVideoProps> = ({
  name,
  ingredients,
  benefits,
  category,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame, fps, config: { damping: 12 } });

  const titleIn = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ background: DEEP, fontFamily: 'DM Sans, Arial, sans-serif' }}>
      {/* Glow de fondo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 20%, ${JADE}33 0%, transparent 60%)`,
        }}
      />

      {/* Logo / marca (0-20 frames) */}
      <Sequence from={0} durationInFrames={30}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 34, color: GOLD, letterSpacing: 6, fontWeight: 700 }}>
              PURELIFE
            </div>
            <div style={{ fontSize: 16, color: CREAM, opacity: 0.7, marginTop: 6 }}>
              WELLNESS CLUB
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Titulo + categoria (20 frames en adelante) */}
      <Sequence from={20}>
        <AbsoluteFill style={{ padding: '90px 60px 0' }}>
          <div
            style={{
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 30}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: `${JADE}22`,
                border: `1px solid ${JADE}55`,
                color: JADE,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                padding: '6px 16px',
                borderRadius: 20,
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              {category}
            </div>
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: CREAM,
                lineHeight: 1.15,
              }}
            >
              {name}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Ingredientes animados, uno por uno */}
      <Sequence from={45}>
        <AbsoluteFill style={{ padding: '380px 60px 0' }}>
          {ingredients.map((ing, i) => {
            const delay = i * 12;
            const p = spring({ frame: frame - 45 - delay, fps, config: { damping: 14 } });
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: GOLD,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 28, color: CREAM, fontWeight: 500 }}>{ing}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* Beneficio + outro */}
      <Sequence from={fps * 6}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', padding: '0 60px 100px' }}>
          {(() => {
            const p = spring({ frame: frame - fps * 6, fps, config: { damping: 14 } });
            return (
              <div style={{ opacity: p, textAlign: 'center' }}>
                <div style={{ fontSize: 22, color: GOLD, fontStyle: 'italic', marginBottom: 14 }}>
                  ✨ {benefits}
                </div>
                <div style={{ fontSize: 14, color: CREAM, opacity: 0.5, letterSpacing: 1 }}>
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
