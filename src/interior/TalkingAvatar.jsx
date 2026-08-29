import { motion, AnimatePresence } from 'framer-motion';
import { IT } from './tokens';

/**
 * Avatar animado de Dr. Smoothie AI — se "mueve" mientras habla (TTS activo).
 * Adaptado del prototipo de Lovable (dr-smoothie-ai-hub), pero sin ninguna
 * dependencia de su backend: solo CSS/framer-motion sobre la imagen que ya
 * usa este proyecto (/dr-smoothie-avatar.jpg), sincronizado con el estado
 * `speakingIdx` que ya existe en ChatTab.jsx (no agrega ninguna llamada
 * nueva a ninguna API).
 */
export default function TalkingAvatar({ isSpeaking, size = 44 }) {
  return (
    <div className="relative flex items-center gap-2" style={{ flexShrink: 0 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Anillo de brillo pulsante mientras habla */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.span
              key="glow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.25, 1] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                background: `${IT.gold}55`, filter: 'blur(6px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Avatar con leve balanceo mientras habla */}
        <motion.img
          src="/dr-smoothie-avatar.jpg"
          alt="Dr. Smoothie AI"
          style={{
            position: 'relative', width: size, height: size, borderRadius: '50%',
            objectFit: 'cover', border: `2px solid ${IT.emerald}`,
          }}
          animate={
            isSpeaking
              ? { y: [0, -2, 0, -1, 0], rotate: [0, -2, 0, 2, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={
            isSpeaking
              ? { repeat: Infinity, duration: 0.55, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        />

        {/* Punto de estado — verde fijo (online), dorado pulsante mientras habla */}
        <span style={{
          position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
          borderRadius: '50%', background: isSpeaking ? IT.gold : IT.emerald,
          border: `2px solid ${IT.obsidian}`,
        }} />

        {/* "Boca" animada — pequeño óvalo que se abre/cierra mientras habla */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.span
              key="mouth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                pointerEvents: 'none', position: 'absolute', left: '50%',
                transform: 'translateX(-50%)', bottom: size * 0.2,
              }}
            >
              <motion.span
                style={{ display: 'block', borderRadius: 999, background: '#3a1a0f' }}
                animate={{
                  height: [2, size * 0.09, 3, size * 0.07, 2],
                  width: [size * 0.16, size * 0.13, size * 0.18, size * 0.14, size * 0.16],
                }}
                transition={{ repeat: Infinity, duration: 0.42, ease: 'easeInOut' }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Barras de onda de audio */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            style={{ display: 'flex', alignItems: 'flex-end', gap: 2, overflow: 'hidden' }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                style={{ width: 2, borderRadius: 999, background: IT.gold }}
                animate={{ height: [4, 14, 6, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut', delay: i * 0.08 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

