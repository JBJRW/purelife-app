// ═══════════════════════════════════════════════════════════════
// useHermes — Hook React para el Agente Orquestador HERMES
// src/hooks/useHermes.js
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

const HERMES_CACHE_KEY = 'hermes_context';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

export function useHermes(user) {
  const [hermes, setHermes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHermes = useCallback(async () => {
    if (!user?.id || !user?.token) return;

    // Check cache
    try {
      const cached = sessionStorage.getItem(HERMES_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS && data.userId === user.id) {
          setHermes(data);
          return;
        }
      }
    } catch (_) {}

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/hermes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          accessToken: user.token,
        }),
      });

      if (!res.ok) throw new Error(`HERMES responded ${res.status}`);

      const data = await res.json();
      if (data.success && data.hermes) {
        setHermes(data.hermes);
        // Cache it
        try {
          sessionStorage.setItem(HERMES_CACHE_KEY, JSON.stringify({
            data: data.hermes,
            timestamp: Date.now(),
          }));
        } catch (_) {}
      }
    } catch (err) {
      console.warn('[useHermes] Could not reach HERMES, using fallback:', err.message);
      // Fallback seguro — nunca rompe la app
      setHermes({
        userId: user.id,
        name: user.name || 'Member',
        tier: 'free',
        tierLabel: 'Free',
        permissions: {
          chatLimit: 3,
          chatUsed: 0,
          chatRemaining: 3,
          videoAccess: false,
          communityCreate: false,
        },
        welcomeMessage: `Bienvenido, ${user.name || 'Member'}! 🌿`,
        upsell: { show: false },
        stats: { chatCount: 0, daysActive: 0 },
        suggestedAction: { type: 'chat', message: '¡Pregúntale a Dr. Smoothie!', tab: 'chat' },
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.token]);

  useEffect(() => {
    fetchHermes();
  }, [fetchHermes]);

  // Función para invalidar cache y refrescar
  const refresh = useCallback(() => {
    try { sessionStorage.removeItem(HERMES_CACHE_KEY); } catch (_) {}
    fetchHermes();
  }, [fetchHermes]);

  return { hermes, loading, error, refresh };
}

export default useHermes;
