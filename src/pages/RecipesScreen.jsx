// src/pages/RecipesScreen.jsx
// PureLife Wellness Club — Recetas + Lista de Compra Inteligente
// Supabase real + Claude AI suggestions + compartir | JRMB Food Network LLC

import React, { useState, useEffect, useCallback } from 'react';

const C = {
  dark: '#0F1F17', green: '#1A5C3A', mint: '#2D8653',
  light: '#5CB87A', cream: '#F5F0E8', gold: '#C9973A',
  goldL: '#E8B84B', muted: '#7A9080', red: '#C0392B',
  glass: 'rgba(255,255,255,0.07)', glassBorder: 'rgba(255,255,255,0.12)',
};
const FONT_HEAD = "'Georgia', serif";
const FONT = "'Helvetica Neue', Arial, sans-serif";

const SB_URL = 'https://slcvymfgcpoafjufaplx.supabase.co';

async function sbFetch(path, token, opts = {}) {
  const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token || KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...opts.headers,
    },
    ...opts,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

// Categorías de recetas por objetivo
const CATEGORIES = [
  { id: 'all', label: 'Todas', emoji: '✨' },
  { id: 'detox', label: 'Detox', emoji: '🌿' },
  { id: 'energy', label: 'Energía', emoji: '⚡' },
  { id: 'weight', label: 'Peso', emoji: '⚖️' },
  { id: 'immunity', label: 'Inmunidad', emoji: '🛡️' },
  { id: 'sleep', label: 'Sueño', emoji: '🌙' },
];

// Recetas starter que se muestran si el usuario no tiene ninguna
const STARTER_RECIPES = [
  {
    id: 'starter-1', name: 'Verde Renovación', category: 'detox',
    emoji: '💚', prep_time: 5, servings: 1,
    ingredients: ['2 tazas espinaca fresca', '1 taza piña en trozos', '1 manzana verde', '1 cm jengibre', '1 taza agua de coco'],
    instructions: 'Licúa todos los ingredientes hasta obtener una mezcla suave. Sirve inmediatamente con hielo.',
    benefits: 'Depura el hígado, alcaliniza el cuerpo, mejora digestión',
    calories: 180, is_starter: true,
  },
  {
    id: 'starter-2', name: 'Poder Matutino', category: 'energy',
    emoji: '⚡', prep_time: 3, servings: 1,
    ingredients: ['1 plátano maduro', '1 taza mango', '1 naranja (jugo)', '1 cdta cúrcuma', '1 cdta miel', '½ taza leche de almendras'],
    instructions: 'Mezcla todos en licuadora. Añade hielo al gusto. Consume en los primeros 30 minutos del día.',
    benefits: 'Energía sostenida, antiinflamatorio, vitamina C natural',
    calories: 240, is_starter: true,
  },
  {
    id: 'starter-3', name: 'Escudo Morado', category: 'immunity',
    emoji: '🛡️', prep_time: 5, servings: 1,
    ingredients: ['1 taza arándanos', '½ taza frambuesas', '1 taza leche de coco', '1 cdta spirulina', '1 cdta miel de Manuka'],
    instructions: 'Licúa arándanos y frambuesas con leche de coco. Añade spirulina y miel. Mezcla bien.',
    benefits: 'Alto en antioxidantes, vitamina C, fortalece sistema inmune',
    calories: 200, is_starter: true,
  },
];

// Card de receta individual
function RecipeCard({ recipe, onViewDetail, onAddToShopping, onDelete, isOwn }) {
  return (
    <div style={{
      background: C.glass, border: `1px solid ${C.glassBorder}`,
      borderRadius: 20, padding: '18px 20px', marginBottom: 12,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 36 }}>{recipe.emoji || '🥤'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: C.cream, fontWeight: 700, fontSize: 16, fontFamily: FONT_HEAD }}>
              {recipe.name}
            </span>
            {recipe.is_starter && (
              <span style={{ background: `${C.mint}33`, color: C.light, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                STARTER
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <span style={{ color: C.muted, fontSize: 12 }}>⏱ {recipe.prep_time} min</span>
            <span style={{ color: C.muted, fontSize: 12 }}>🍽 {recipe.servings} porción</span>
            <span style={{ color: C.muted, fontSize: 12 }}>🔥 {recipe.calories} kcal</span>
          </div>
        </div>
      </div>

      {recipe.benefits && (
        <p style={{ color: C.light, fontSize: 12, margin: '0 0 12px', fontStyle: 'italic' }}>
          ✨ {recipe.benefits}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => onViewDetail(recipe)} style={{
          padding: '8px 16px', borderRadius: 20,
          border: `1px solid ${C.glassBorder}`, background: C.glass,
          color: C.cream, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
        }}>
          Ver receta →
        </button>
        <button onClick={() => onAddToShopping(recipe)} style={{
          padding: '8px 16px', borderRadius: 20,
          border: `1px solid ${C.mint}44`, background: `${C.mint}14`,
          color: C.light, fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 600,
        }}>
          🛒 Añadir a lista
        </button>
        {isOwn && (
          <button onClick={() => onDelete(recipe.id)} style={{
            padding: '8px 12px', borderRadius: 20,
            border: `1px solid ${C.red}44`, background: 'transparent',
            color: C.red, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
          }}>
            🗑
          </button>
        )}
      </div>
    </div>
  );
}

// Modal de detalle de receta
function RecipeDetail({ recipe, onClose, onAddToShopping }) {
  if (!recipe) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        background: C.dark, borderRadius: '28px 28px 0 0',
        padding: '28px 24px 40px', maxHeight: '85vh', overflowY: 'auto',
        border: `1px solid ${C.glassBorder}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{recipe.emoji || '🥤'}</div>
          <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 6px' }}>
            {recipe.name}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <span style={{ color: C.muted, fontSize: 13 }}>⏱ {recipe.prep_time} min</span>
            <span style={{ color: C.muted, fontSize: 13 }}>🔥 {recipe.calories} kcal</span>
            <span style={{ color: C.muted, fontSize: 13 }}>🍽 {recipe.servings} porción</span>
          </div>
        </div>

        {recipe.benefits && (
          <div style={{ background: `${C.mint}14`, border: `1px solid ${C.mint}33`, borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ color: C.light, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              ✨ <strong>Beneficios:</strong> {recipe.benefits}
            </p>
          </div>
        )}

        <h3 style={{ color: C.goldL, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Ingredientes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {(recipe.ingredients || []).map((ing, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.cream, fontSize: 14 }}>
              <span style={{ color: C.mint, fontWeight: 800, fontSize: 16 }}>·</span>
              {ing}
            </div>
          ))}
        </div>

        <h3 style={{ color: C.goldL, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Preparación</h3>
        <p style={{ color: C.cream, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          {recipe.instructions}
        </p>

        <button onClick={() => { onAddToShopping(recipe); onClose(); }} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
        }}>
          🛒 Agregar ingredientes a mi lista
        </button>
      </div>
    </div>
  );
}

// Formulario nueva receta con Claude AI
function NewRecipeForm({ user, onSave, onClose }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('detox');
  const [loading, setLoading] = useState(false);
  const [aiHelp, setAiHelp] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const askClaude = async () => {
    if (!name) return;
    setLoadingAI(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Crea una receta de smoothie/jugo llamada "${name}" para la categoría ${category}. Responde SOLO en JSON con este formato exacto: {"ingredients":["ingrediente 1","ingrediente 2"],"instructions":"instrucciones en 2-3 pasos","benefits":"beneficios en 1 línea","emoji":"emoji relevante","calories":numero,"prep_time":numero}`,
          history: [],
          userId: user?.id || 'anon',
          lang: 'es',
        }),
      });
      const d = await r.json();
      const text = d.reply || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setIngredients((parsed.ingredients || []).join('\n'));
        setInstructions(parsed.instructions || '');
        setAiHelp(JSON.stringify(parsed));
      }
    } catch { setAiHelp(''); }
    setLoadingAI(false);
  };

  const save = async () => {
    if (!name || !ingredients) return;
    setLoading(true);
    let extras = {};
    try { if (aiHelp) extras = JSON.parse(aiHelp); } catch {}
    const recipe = {
      user_id: user?.id,
      name,
      category,
      ingredients: ingredients.split('\n').map(i => i.trim()).filter(Boolean),
      instructions: instructions || extras.instructions || '',
      benefits: extras.benefits || '',
      emoji: extras.emoji || '🥤',
      calories: extras.calories || 200,
      prep_time: extras.prep_time || 5,
      servings: 1,
    };
    await onSave(recipe);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: C.dark, borderRadius: '28px 28px 0 0', padding: '28px 24px 40px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${C.glassBorder}` }}>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 22, margin: '0 0 20px' }}>✨ Nueva Receta</h2>

        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Nombre del smoothie o jugo..." style={inputSt} />

        <select value={category} onChange={e => setCategory(e.target.value)} style={inputSt}>
          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>

        <button onClick={askClaude} disabled={!name || loadingAI} style={{
          width: '100%', padding: '12px', borderRadius: 12, border: 'none',
          background: loadingAI ? C.glass : `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
          color: loadingAI ? C.muted : C.dark, fontSize: 14, fontWeight: 700,
          cursor: 'pointer', marginBottom: 12, fontFamily: FONT,
        }}>
          {loadingAI ? '🤖 Dr. Smoothie creando receta...' : '🤖 Generar con Dr. Smoothie AI'}
        </button>

        <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
          placeholder={'Ingredientes (uno por línea):\nEj: 2 tazas espinaca\n1 plátano'}
          rows={5} style={{ ...inputSt, borderRadius: 14 }} />

        <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
          placeholder="Instrucciones de preparación..."
          rows={3} style={{ ...inputSt, borderRadius: 14 }} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px', borderRadius: 12, border: `1px solid ${C.glassBorder}`,
            background: 'transparent', color: C.muted, fontSize: 14, cursor: 'pointer', fontFamily: FONT,
          }}>Cancelar</button>
          <button onClick={save} disabled={!name || !ingredients || loading} style={{
            flex: 2, padding: '13px', borderRadius: 12, border: 'none',
            background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
            opacity: (!name || !ingredients || loading) ? 0.6 : 1,
          }}>
            {loading ? 'Guardando...' : '💾 Guardar Receta'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputSt = {
  width: '100%', padding: '12px 16px', margin: '0 0 12px',
  borderRadius: 12, border: `1.5px solid ${C.glassBorder}`,
  background: 'rgba(255,255,255,0.06)', color: C.cream,
  fontSize: 14, fontFamily: FONT, outline: 'none', boxSizing: 'border-box',
};

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────
export default function RecipesScreen({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('recipes'); // recipes | shopping
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 2800); };

  // Cargar recetas del usuario desde Supabase
  const loadRecipes = useCallback(async () => {
    if (!user?.id || user?.id === 'demo' || !user?.token) {
      setRecipes(STARTER_RECIPES);
      setLoading(false);
      return;
    }
    try {
      const data = await sbFetch(`user_recipes?user_id=eq.${user.id}&order=created_at.desc`, user.token);
      setRecipes(Array.isArray(data) && data.length > 0 ? data : STARTER_RECIPES);
    } catch {
      setRecipes(STARTER_RECIPES);
    }
    setLoading(false);
  }, [user]);

  // Cargar lista de compra
  const loadShopping = useCallback(async () => {
    if (!user?.id || !user?.token) {
      const local = JSON.parse(localStorage.getItem('pl_shopping') || '[]');
      setShopping(local);
      return;
    }
    try {
      const data = await sbFetch(`shopping_list?user_id=eq.${user.id}&checked=eq.false&order=created_at.desc`, user.token);
      setShopping(Array.isArray(data) ? data : []);
    } catch {
      setShopping([]);
    }
  }, [user]);

  useEffect(() => { loadRecipes(); loadShopping(); }, [loadRecipes, loadShopping]);

  const addToShopping = async (recipe) => {
    const newItems = (recipe.ingredients || []).map(ing => ({
      ingredient: ing,
      recipe_name: recipe.name,
      checked: false,
      user_id: user?.id,
    }));
    if (!user?.id || !user?.token || user?.id === 'demo') {
      const local = [...shopping, ...newItems.map((i, idx) => ({ ...i, id: Date.now() + idx }))];
      setShopping(local);
      localStorage.setItem('pl_shopping', JSON.stringify(local));
    } else {
      try {
        await sbFetch('shopping_list', user.token, { method: 'POST', body: JSON.stringify(newItems) });
        await loadShopping();
      } catch { setShopping(s => [...s, ...newItems]); }
    }
    toast(`✅ ${recipe.ingredients.length} ingredientes añadidos a tu lista`);
  };

  const checkItem = async (item) => {
    if (!user?.token || user?.id === 'demo') {
      const updated = shopping.filter(s => s.id !== item.id);
      setShopping(updated);
      localStorage.setItem('pl_shopping', JSON.stringify(updated));
      return;
    }
    try {
      await sbFetch(`shopping_list?id=eq.${item.id}`, user.token, {
        method: 'PATCH', body: JSON.stringify({ checked: true }),
      });
      await loadShopping();
    } catch { setShopping(s => s.filter(x => x.id !== item.id)); }
  };

  const clearShopping = async () => {
    if (!user?.token || user?.id === 'demo') {
      setShopping([]);
      localStorage.removeItem('pl_shopping');
      return;
    }
    try {
      await sbFetch(`shopping_list?user_id=eq.${user.id}`, user.token, { method: 'DELETE' });
      setShopping([]);
    } catch { setShopping([]); }
  };

  const saveRecipe = async (recipe) => {
    if (!user?.token || user?.id === 'demo') {
      const newRecipe = { ...recipe, id: `local-${Date.now()}` };
      setRecipes(r => [newRecipe, ...r.filter(x => !x.is_starter)]);
      toast('✅ Receta guardada localmente');
      return;
    }
    try {
      await sbFetch('user_recipes', user.token, { method: 'POST', body: JSON.stringify(recipe) });
      await loadRecipes();
      toast('✅ Receta guardada en tu perfil');
    } catch {
      toast('❌ Error guardando receta');
    }
  };

  const deleteRecipe = async (id) => {
    if (String(id).startsWith('starter')) { toast('Las recetas starter no se pueden eliminar'); return; }
    if (!user?.token || user?.id === 'demo') {
      setRecipes(r => r.filter(x => x.id !== id));
      return;
    }
    try {
      await sbFetch(`user_recipes?id=eq.${id}`, user.token, { method: 'DELETE' });
      await loadRecipes();
    } catch { setRecipes(r => r.filter(x => x.id !== id)); }
  };

  const filtered = activeCategory === 'all'
    ? recipes
    : recipes.filter(r => r.category === activeCategory);

  return (
    <div style={{ padding: '20px 20px 100px', maxWidth: 480, margin: '0 auto' }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: C.mint, color: '#fff', padding: '10px 20px', borderRadius: 20,
          fontSize: 13, fontWeight: 700, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>{toastMsg}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 26, margin: '0 0 4px' }}>
          🍽️ Mis Recetas
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>Creadas con Dr. Smoothie AI · Guardadas en tu perfil</p>
      </div>

      {/* Tabs Recetas / Lista */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 14 }}>
        {[
          { id: 'recipes', label: '🥤 Recetas', count: recipes.length },
          { id: 'shopping', label: '🛒 Lista', count: shopping.length },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: activeTab === t.id ? C.glass : 'transparent',
            border: activeTab === t.id ? `1px solid ${C.glassBorder}` : '1px solid transparent',
            color: activeTab === t.id ? C.cream : C.muted,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
          }}>
            {t.label} {t.count > 0 && <span style={{ background: C.mint, borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── PANEL RECETAS ── */}
      {activeTab === 'recipes' && (
        <>
          {/* Categorías */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 20,
                border: `1.5px solid ${activeCategory === cat.id ? C.mint : C.glassBorder}`,
                background: activeCategory === cat.id ? `${C.mint}22` : 'transparent',
                color: activeCategory === cat.id ? C.light : C.muted,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
              }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Botón nueva receta */}
          <button onClick={() => setShowNewForm(true)} style={{
            width: '100%', padding: '13px', borderRadius: 14, marginBottom: 16,
            border: `1.5px dashed ${C.mint}66`, background: `${C.mint}08`,
            color: C.light, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
          }}>
            ✨ Nueva receta con Dr. Smoothie AI
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Cargando recetas...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p>No hay recetas en esta categoría</p>
            </div>
          ) : (
            filtered.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetail={setDetailRecipe}
                onAddToShopping={addToShopping}
                onDelete={deleteRecipe}
                isOwn={!recipe.is_starter}
              />
            ))
          )}
        </>
      )}

      {/* ── PANEL LISTA DE COMPRA ── */}
      {activeTab === 'shopping' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              {shopping.length} ingredientes pendientes
            </p>
            {shopping.length > 0 && (
              <button onClick={clearShopping} style={{
                padding: '6px 14px', borderRadius: 20, border: `1px solid ${C.red}44`,
                background: 'transparent', color: C.red, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
              }}>
                Limpiar lista
              </button>
            )}
          </div>

          {shopping.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ color: C.muted, fontSize: 14 }}>Tu lista está vacía</p>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
                Añade ingredientes desde tus recetas
              </p>
              <button onClick={() => setActiveTab('recipes')} style={{
                marginTop: 16, padding: '10px 20px', borderRadius: 20,
                border: `1px solid ${C.mint}`, background: 'transparent',
                color: C.light, fontSize: 13, cursor: 'pointer', fontFamily: FONT,
              }}>
                Ver recetas →
              </button>
            </div>
          ) : (
            <>
              {/* Agrupar por receta */}
              {Object.entries(
                shopping.reduce((acc, item) => {
                  const key = item.recipe_name || 'General';
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {})
              ).map(([recName, items]) => (
                <div key={recName} style={{ marginBottom: 20 }}>
                  <p style={{ color: C.goldL, fontSize: 12, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    🥤 {recName}
                  </p>
                  {items.map((item, idx) => (
                    <div key={idx} onClick={() => checkItem(item)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', borderRadius: 12, marginBottom: 6,
                      background: C.glass, border: `1px solid ${C.glassBorder}`,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        border: `2px solid ${C.mint}`, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.mint }} />
                      </div>
                      <span style={{ color: C.cream, fontSize: 14, flex: 1 }}>{item.ingredient}</span>
                      <span style={{ color: C.muted, fontSize: 11 }}>tap para ✓</span>
                    </div>
                  ))}
                </div>
              ))}

              <button onClick={() => {
                const text = shopping.map(s => `• ${s.ingredient} (${s.recipe_name})`).join('\n');
                if (navigator.share) {
                  navigator.share({ title: 'Mi lista PureLife', text });
                } else {
                  navigator.clipboard?.writeText(text);
                  toast('📋 Lista copiada al portapapeles');
                }
              }} style={{
                width: '100%', padding: '13px', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
                color: C.dark, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
              }}>
                📤 Compartir lista de compra
              </button>
            </>
          )}
        </>
      )}

      {/* Modals */}
      {detailRecipe && (
        <RecipeDetail
          recipe={detailRecipe}
          onClose={() => setDetailRecipe(null)}
          onAddToShopping={(r) => { addToShopping(r); setDetailRecipe(null); }}
        />
      )}
      {showNewForm && (
        <NewRecipeForm
          user={user}
          onSave={saveRecipe}
          onClose={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
}
