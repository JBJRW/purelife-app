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
const DEEP = '#0F1F17';

// Convierte un emoji a la URL de su ícono SVG (Twemoji) — evita
// depender de que el entorno de render tenga fuentes de emoji a
// color instaladas (Chromium headless en Lambda no las trae).
function emojiToTwemojiUrl(emoji: string): string {
  const codepoints = Array.from(emoji)
    .map((char) => char.codePointAt(0)!.toString(16))
    .filter((cp) => cp !== 'fe0f') // variation selector, twemoji no lo incluye en el nombre de archivo
    .join('-');
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codepoints}.svg`;
}

const EmojiIcon: React.FC<{ emoji: string; size: number }> = ({ emoji, size }) => (
  <Img src={emojiToTwemojiUrl(emoji)} style={{ width: size, height: size, display: 'block' }} />
);

export type RecipeVideoProps = {
  name: string;
  ingredients: string[];
  benefits: string;
  category: string;
};

// Ícono grande según la categoría de la receta
const CATEGORY_ICON: Record<string, string> = {
  detox: '♻️',
  weight_loss: '🔥',
  energy: '⚡',
  muscle: '💪',
  heart: '❤️',
  immunity: '🛡️',
  diabetic: '💧',
  hypertension: '🩺',
};

// Detecta el emoji de un ingrediente buscando palabras clave en el texto
// (el texto viene libre, ej. "Fresh spinach (2 cups)")
const INGREDIENT_KEYWORDS: [string, string][] = [
  ['spinach', '🥬'], ['kale', '🥬'], ['lettuce', '🥬'], ['celery', '🥬'],
  ['banana', '🍌'], ['blueberr', '🫐'], ['berry', '🫐'], ['berries', '🫐'],
  ['mango', '🥭'], ['ginger', '🫚'], ['lemon', '🍋'], ['lime', '🍋'],
  ['coconut', '🥥'], ['orange', '🍊'], ['cucumber', '🥒'], ['avocado', '🥑'],
  ['carrot', '🥕'], ['beet', '🍠'], ['apple', '🍏'], ['mint', '🌿'],
  ['matcha', '🍵'], ['tea', '🍵'], ['cacao', '🍫'], ['chocolate', '🍫'],
  ['cinnamon', '🟤'], ['turmeric', '🟠'], ['pepper', '⚫'], ['walnut', '🌰'],
  ['almond', '🌰'], ['peanut', '🥜'], ['nut', '🌰'], ['oat', '🌾'],
  ['chia', '⚫'], ['flax', '🟤'], ['protein', '🥛'], ['milk', '🥛'],
  ['yogurt', '🥛'], ['pineapple', '🍍'], ['strawberr', '🍓'], ['grape', '🍇'],
  ['papaya', '🧡'], ['maca', '🟫'], ['honey', '🍯'], ['seed', '🌱'],
];

function iconFor(ingredient: string): string {
  const lower = ingredient.toLowerCase();
  for (const [kw, icon] of INGREDIENT_KEYWORDS) {
    if (lower.includes(kw)) return icon;
  }
  return '🌿';
}

export const RecipeVideo: React.FC<RecipeVideoProps> = ({
  name,
  ingredients,
  benefits,
  category,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const categoryIcon = CATEGORY_ICON[category?.toLowerCase()] || '🌿';

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame, fps, config: { damping: 12 } });

  // Vaso de smoothie animado: se "llena" de abajo hacia arriba
  const glassFill = interpolate(frame, [5, 40], [0, 78], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glassBob = Math.sin(frame / 12) * 6;

  const titleIn = spring({ frame: frame - 20, fps, config: { damping: 14 } });
  const bigIconPop = spring({ frame: frame - 15, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ background: DEEP, fontFamily: 'DM Sans, Arial, sans-serif' }}>
      {/* Glow de fondo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 15%, ${JADE}33 0%, transparent 60%)`,
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
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <EmojiIcon emoji="🥤" size={70} />
            </div>
            <div style={{ fontSize: 34, color: GOLD, letterSpacing: 6, fontWeight: 700 }}>
              PURELIFE
            </div>
            <div style={{ fontSize: 16, color: CREAM, opacity: 0.7, marginTop: 6 }}>
              WELLNESS CLUB
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Vaso de smoothie animado, visible desde el inicio del título en adelante, arriba a la derecha */}
      <Sequence from={18}>
        <AbsoluteFill style={{ alignItems: 'flex-end', justifyContent: 'flex-start' }}>
          <div
            style={{
              marginTop: 70 + glassBob,
              marginRight: 55,
              transform: `scale(${bigIconPop})`,
              width: 150,
              height: 190,
              position: 'relative',
            }}
          >
            {/* Vaso (contorno) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px 10px 26px 26px',
                border: `4px solid ${GOLD}`,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Relleno del smoothie */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: `${glassFill}%`,
                  background: `linear-gradient(180deg, ${JADE}, #1E7A54)`,
                }}
              />
              {/* Ícono grande de la categoría flotando dentro del vaso */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmojiIcon emoji={categoryIcon} size={54} />
              </div>
            </div>
            {/* Sorbete */}
            <div
              style={{
                position: 'absolute',
                top: -38,
                right: 28,
                width: 10,
                height: 55,
                background: GOLD,
                borderRadius: 6,
                transform: 'rotate(18deg)',
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Titulo + categoria (20 frames en adelante) */}
      <Sequence from={20}>
        <AbsoluteFill style={{ padding: '90px 190px 0 60px' }}>
          <div
            style={{
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 30}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
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
              <span style={{ display: 'flex' }}><EmojiIcon emoji={categoryIcon} size={16} /></span> {category}
            </div>
            <div
              style={{
                fontSize: 46,
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

      {/* Ingredientes animados, uno por uno, cada uno con su ícono */}
      <Sequence from={50}>
        <AbsoluteFill style={{ padding: '400px 60px 0' }}>
          {ingredients.map((ing, i) => {
            const delay = i * 12;
            const p = spring({ frame: frame - 50 - delay, fps, config: { damping: 14 } });
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${GOLD}1c`,
                    border: `1px solid ${GOLD}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <EmojiIcon emoji={iconFor(ing)} size={28} />
                </div>
                <div style={{ fontSize: 25, color: CREAM, fontWeight: 500 }}>{ing}</div>
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
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                  <EmojiIcon emoji="✨" size={40} />
                </div>
                <div style={{ fontSize: 22, color: GOLD, fontStyle: 'italic', marginBottom: 14 }}>
                  {benefits}
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
