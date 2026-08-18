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
const CATEGORY_META = [
  { id: 'all', emoji: '✨' },
  { id: 'detox', emoji: '🌿' },
  { id: 'energy', emoji: '⚡' },
  { id: 'weight', emoji: '⚖️' },
  { id: 'immunity', emoji: '🛡️' },
  { id: 'sleep', emoji: '🌙' },
];

const STARTER_META = [
  { id: 'starter-1', category: 'detox', emoji: '💚', prep_time: 5, servings: 1, calories: 180 },
  { id: 'starter-2', category: 'energy', emoji: '⚡', prep_time: 3, servings: 1, calories: 240 },
  { id: 'starter-3', category: 'immunity', emoji: '🛡️', prep_time: 5, servings: 1, calories: 200 },
];

const RS = {
  en: {
    categoryLabel: { all: 'All', detox: 'Detox', energy: 'Energy', weight: 'Weight', immunity: 'Immunity', sleep: 'Sleep' },
    starter: {
      'starter-1': { name: 'Green Renewal', ingredients: ['2 cups fresh spinach', '1 cup pineapple chunks', '1 green apple', '1 cm ginger', '1 cup coconut water'], instructions: 'Blend all ingredients until smooth. Serve immediately with ice.', benefits: 'Cleanses the liver, alkalizes the body, improves digestion' },
      'starter-2': { name: 'Morning Power', ingredients: ['1 ripe banana', '1 cup mango', '1 orange (juiced)', '1 tsp turmeric', '1 tsp honey', '½ cup almond milk'], instructions: 'Blend everything together. Add ice to taste. Drink within the first 30 minutes of the day.', benefits: 'Sustained energy, anti-inflammatory, natural vitamin C' },
      'starter-3': { name: 'Purple Shield', ingredients: ['1 cup blueberries', '½ cup raspberries', '1 cup coconut milk', '1 tsp spirulina', '1 tsp Manuka honey'], instructions: 'Blend blueberries and raspberries with coconut milk. Add spirulina and honey. Mix well.', benefits: 'High in antioxidants, vitamin C, strengthens immune system' },
    },
    starterBadge: 'STARTER', servingUnit: 'serving', viewRecipe: 'View recipe →', addToList: '🛒 Add to list',
    videoStartError: 'Could not start the video', videoTimeout: 'The video is taking longer than usual — try again', videoGenError: 'Error generating the video',
    benefitsLabel: 'Benefits:', ingredientsTitle: 'Ingredients', instructionsTitle: 'Preparation', addIngredientsBtn: '🛒 Add ingredients to my list',
    aiPromptTemplate: (name, category) => `Create a smoothie/juice recipe called "${name}" for the ${category} category. Respond ONLY in JSON with this exact format: {"ingredients":["ingredient 1","ingredient 2"],"instructions":"instructions in 2-3 steps","benefits":"benefits in 1 line","emoji":"relevant emoji","calories":number,"prep_time":number}`,
    newRecipeTitle: '✨ New Recipe', namePlaceholder: 'Smoothie or juice name...', aiCreating: '🤖 Dr. Smoothie creating recipe...', aiGenerate: '🤖 Generate with Dr. Smoothie AI',
    ingredientsPlaceholder: 'Ingredients (one per line):\nEg: 2 cups spinach\n1 banana', instructionsPlaceholder: 'Preparation instructions...',
    cancel: 'Cancel', saving: 'Saving...', saveRecipe: '💾 Save Recipe',
    myRecipesTitle: '🍽️ My Recipes', myRecipesSub: 'Created with Dr. Smoothie AI · Saved in your profile',
    tabRecipes: '🥤 Recipes', tabList: '🛒 List', tabDiscover: '✨ Discover', newRecipeBtn: '✨ New recipe with Dr. Smoothie AI',
    loadingRecipes: 'Loading recipes...', noRecipesCategory: 'No recipes in this category',
    ingredientsPending: (n) => `${n} ingredients pending`, clearList: 'Clear list', listEmpty: 'Your list is empty',
    addFromRecipes: 'Add ingredients from your recipes', viewRecipesBtn: 'View recipes →', tapToCheck: 'tap to ✓',
    myListShareTitle: 'My PureLife list', listCopied: '📋 List copied to clipboard', shareListBtn: '📤 Share shopping list',
    general: 'General',
  },
  es: {
    categoryLabel: { all: 'Todas', detox: 'Detox', energy: 'Energía', weight: 'Peso', immunity: 'Inmunidad', sleep: 'Sueño' },
    starter: {
      'starter-1': { name: 'Verde Renovación', ingredients: ['2 tazas espinaca fresca', '1 taza piña en trozos', '1 manzana verde', '1 cm jengibre', '1 taza agua de coco'], instructions: 'Licúa todos los ingredientes hasta obtener una mezcla suave. Sirve inmediatamente con hielo.', benefits: 'Depura el hígado, alcaliniza el cuerpo, mejora digestión' },
      'starter-2': { name: 'Poder Matutino', ingredients: ['1 plátano maduro', '1 taza mango', '1 naranja (jugo)', '1 cdta cúrcuma', '1 cdta miel', '½ taza leche de almendras'], instructions: 'Mezcla todos en licuadora. Añade hielo al gusto. Consume en los primeros 30 minutos del día.', benefits: 'Energía sostenida, antiinflamatorio, vitamina C natural' },
      'starter-3': { name: 'Escudo Morado', ingredients: ['1 taza arándanos', '½ taza frambuesas', '1 taza leche de coco', '1 cdta spirulina', '1 cdta miel de Manuka'], instructions: 'Licúa arándanos y frambuesas con leche de coco. Añade spirulina y miel. Mezcla bien.', benefits: 'Alto en antioxidantes, vitamina C, fortalece sistema inmune' },
    },
    starterBadge: 'STARTER', servingUnit: 'porción', viewRecipe: 'Ver receta →', addToList: '🛒 Añadir a lista',
    videoStartError: 'No se pudo iniciar el video', videoTimeout: 'El video está tardando más de lo normal — intentá de nuevo', videoGenError: 'Error generando el video',
    benefitsLabel: 'Beneficios:', ingredientsTitle: 'Ingredientes', instructionsTitle: 'Preparación', addIngredientsBtn: '🛒 Agregar ingredientes a mi lista',
    aiPromptTemplate: (name, category) => `Crea una receta de smoothie/jugo llamada "${name}" para la categoría ${category}. Responde SOLO en JSON con este formato exacto: {"ingredients":["ingrediente 1","ingrediente 2"],"instructions":"instrucciones en 2-3 pasos","benefits":"beneficios en 1 línea","emoji":"emoji relevante","calories":numero,"prep_time":numero}`,
    newRecipeTitle: '✨ Nueva Receta', namePlaceholder: 'Nombre del smoothie o jugo...', aiCreating: '🤖 Dr. Smoothie creando receta...', aiGenerate: '🤖 Generar con Dr. Smoothie AI',
    ingredientsPlaceholder: 'Ingredientes (uno por línea):\nEj: 2 tazas espinaca\n1 plátano', instructionsPlaceholder: 'Instrucciones de preparación...',
    cancel: 'Cancelar', saving: 'Guardando...', saveRecipe: '💾 Guardar Receta',
    myRecipesTitle: '🍽️ Mis Recetas', myRecipesSub: 'Creadas con Dr. Smoothie AI · Guardadas en tu perfil',
    tabRecipes: '🥤 Recetas', tabList: '🛒 Lista', tabDiscover: '✨ Descubrir', newRecipeBtn: '✨ Nueva receta con Dr. Smoothie AI',
    loadingRecipes: 'Cargando recetas...', noRecipesCategory: 'No hay recetas en esta categoría',
    ingredientsPending: (n) => `${n} ingredientes pendientes`, clearList: 'Limpiar lista', listEmpty: 'Tu lista está vacía',
    addFromRecipes: 'Añade ingredientes desde tus recetas', viewRecipesBtn: 'Ver recetas →', tapToCheck: 'tap para ✓',
    myListShareTitle: 'Mi lista PureLife', listCopied: '📋 Lista copiada al portapapeles', shareListBtn: '📤 Compartir lista de compra',
    general: 'General',
  },
  fr: {
    categoryLabel: { all: 'Toutes', detox: 'Détox', energy: 'Énergie', weight: 'Poids', immunity: 'Immunité', sleep: 'Sommeil' },
    starter: {
      'starter-1': { name: 'Renouveau Vert', ingredients: ['2 tasses d\'épinards frais', '1 tasse d\'ananas en morceaux', '1 pomme verte', '1 cm de gingembre', '1 tasse d\'eau de coco'], instructions: 'Mixez tous les ingrédients jusqu\'à obtenir un mélange lisse. Servez immédiatement avec de la glace.', benefits: 'Purifie le foie, alcalinise le corps, améliore la digestion' },
      'starter-2': { name: 'Puissance Matinale', ingredients: ['1 banane mûre', '1 tasse de mangue', '1 orange (jus)', '1 c.à.c curcuma', '1 c.à.c miel', '½ tasse de lait d\'amande'], instructions: 'Mixez le tout ensemble. Ajoutez de la glace selon votre goût. À consommer dans les 30 premières minutes de la journée.', benefits: 'Énergie durable, anti-inflammatoire, vitamine C naturelle' },
      'starter-3': { name: 'Bouclier Violet', ingredients: ['1 tasse de myrtilles', '½ tasse de framboises', '1 tasse de lait de coco', '1 c.à.c spiruline', '1 c.à.c miel de Manuka'], instructions: 'Mixez myrtilles et framboises avec le lait de coco. Ajoutez spiruline et miel. Bien mélanger.', benefits: 'Riche en antioxydants, vitamine C, renforce le système immunitaire' },
    },
    starterBadge: 'STARTER', servingUnit: 'portion', viewRecipe: 'Voir la recette →', addToList: '🛒 Ajouter à la liste',
    videoStartError: 'Impossible de démarrer la vidéo', videoTimeout: 'La vidéo prend plus de temps que prévu — réessayez', videoGenError: 'Erreur lors de la génération de la vidéo',
    benefitsLabel: 'Bienfaits :', ingredientsTitle: 'Ingrédients', instructionsTitle: 'Préparation', addIngredientsBtn: '🛒 Ajouter les ingrédients à ma liste',
    aiPromptTemplate: (name, category) => `Créez une recette de smoothie/jus appelée "${name}" pour la catégorie ${category}. Répondez UNIQUEMENT en JSON avec ce format exact : {"ingredients":["ingrédient 1","ingrédient 2"],"instructions":"instructions en 2-3 étapes","benefits":"bienfaits en 1 ligne","emoji":"emoji pertinent","calories":nombre,"prep_time":nombre}`,
    newRecipeTitle: '✨ Nouvelle Recette', namePlaceholder: 'Nom du smoothie ou jus...', aiCreating: '🤖 Dr. Smoothie crée la recette...', aiGenerate: '🤖 Générer avec Dr. Smoothie AI',
    ingredientsPlaceholder: 'Ingrédients (un par ligne) :\nEx : 2 tasses d\'épinards\n1 banane', instructionsPlaceholder: 'Instructions de préparation...',
    cancel: 'Annuler', saving: 'Enregistrement...', saveRecipe: '💾 Enregistrer la recette',
    myRecipesTitle: '🍽️ Mes Recettes', myRecipesSub: 'Créées avec Dr. Smoothie AI · Enregistrées dans votre profil',
    tabRecipes: '🥤 Recettes', tabList: '🛒 Liste', tabDiscover: '✨ Découvrir', newRecipeBtn: '✨ Nouvelle recette avec Dr. Smoothie AI',
    loadingRecipes: 'Chargement des recettes...', noRecipesCategory: 'Aucune recette dans cette catégorie',
    ingredientsPending: (n) => `${n} ingrédients en attente`, clearList: 'Vider la liste', listEmpty: 'Votre liste est vide',
    addFromRecipes: 'Ajoutez des ingrédients depuis vos recettes', viewRecipesBtn: 'Voir les recettes →', tapToCheck: 'toucher pour ✓',
    myListShareTitle: 'Ma liste PureLife', listCopied: '📋 Liste copiée dans le presse-papiers', shareListBtn: '📤 Partager la liste de courses',
    general: 'Général',
  },
  pt: {
    categoryLabel: { all: 'Todas', detox: 'Detox', energy: 'Energia', weight: 'Peso', immunity: 'Imunidade', sleep: 'Sono' },
    starter: {
      'starter-1': { name: 'Verde Renovação', ingredients: ['2 xícaras de espinafre fresco', '1 xícara de abacaxi em pedaços', '1 maçã verde', '1 cm de gengibre', '1 xícara de água de coco'], instructions: 'Bata todos os ingredientes até obter uma mistura homogênea. Sirva imediatamente com gelo.', benefits: 'Depura o fígado, alcaliniza o corpo, melhora a digestão' },
      'starter-2': { name: 'Poder Matinal', ingredients: ['1 banana madura', '1 xícara de manga', '1 laranja (suco)', '1 colher chá cúrcuma', '1 colher chá mel', '½ xícara de leite de amêndoas'], instructions: 'Misture tudo no liquidificador. Adicione gelo a gosto. Consuma nos primeiros 30 minutos do dia.', benefits: 'Energia sustentada, anti-inflamatório, vitamina C natural' },
      'starter-3': { name: 'Escudo Roxo', ingredients: ['1 xícara de mirtilos', '½ xícara de framboesas', '1 xícara de leite de coco', '1 colher chá spirulina', '1 colher chá mel de Manuka'], instructions: 'Bata mirtilos e framboesas com leite de coco. Adicione spirulina e mel. Misture bem.', benefits: 'Alto em antioxidantes, vitamina C, fortalece o sistema imunológico' },
    },
    starterBadge: 'STARTER', servingUnit: 'porção', viewRecipe: 'Ver receita →', addToList: '🛒 Adicionar à lista',
    videoStartError: 'Não foi possível iniciar o vídeo', videoTimeout: 'O vídeo está demorando mais que o normal — tente de novo', videoGenError: 'Erro ao gerar o vídeo',
    benefitsLabel: 'Benefícios:', ingredientsTitle: 'Ingredientes', instructionsTitle: 'Preparo', addIngredientsBtn: '🛒 Adicionar ingredientes à minha lista',
    aiPromptTemplate: (name, category) => `Crie uma receita de smoothie/suco chamada "${name}" para a categoria ${category}. Responda APENAS em JSON com este formato exato: {"ingredients":["ingrediente 1","ingrediente 2"],"instructions":"instruções em 2-3 passos","benefits":"benefícios em 1 linha","emoji":"emoji relevante","calories":numero,"prep_time":numero}`,
    newRecipeTitle: '✨ Nova Receita', namePlaceholder: 'Nome do smoothie ou suco...', aiCreating: '🤖 Dr. Smoothie criando receita...', aiGenerate: '🤖 Gerar com Dr. Smoothie AI',
    ingredientsPlaceholder: 'Ingredientes (um por linha):\nEx: 2 xícaras de espinafre\n1 banana', instructionsPlaceholder: 'Instruções de preparo...',
    cancel: 'Cancelar', saving: 'Salvando...', saveRecipe: '💾 Salvar Receita',
    myRecipesTitle: '🍽️ Minhas Receitas', myRecipesSub: 'Criadas com Dr. Smoothie AI · Salvas no seu perfil',
    tabRecipes: '🥤 Receitas', tabList: '🛒 Lista', tabDiscover: '✨ Descobrir', newRecipeBtn: '✨ Nova receita com Dr. Smoothie AI',
    loadingRecipes: 'Carregando receitas...', noRecipesCategory: 'Não há receitas nesta categoria',
    ingredientsPending: (n) => `${n} ingredientes pendentes`, clearList: 'Limpar lista', listEmpty: 'Sua lista está vazia',
    addFromRecipes: 'Adicione ingredientes das suas receitas', viewRecipesBtn: 'Ver receitas →', tapToCheck: 'toque para ✓',
    myListShareTitle: 'Minha lista PureLife', listCopied: '📋 Lista copiada para a área de transferência', shareListBtn: '📤 Compartilhar lista de compras',
    general: 'Geral',
  },
  it: {
    categoryLabel: { all: 'Tutte', detox: 'Detox', energy: 'Energia', weight: 'Peso', immunity: 'Immunità', sleep: 'Sonno' },
    starter: {
      'starter-1': { name: 'Verde Rinnovamento', ingredients: ['2 tazze di spinaci freschi', '1 tazza di ananas a pezzi', '1 mela verde', '1 cm di zenzero', '1 tazza di acqua di cocco'], instructions: 'Frulla tutti gli ingredienti fino a ottenere un composto liscio. Servi subito con ghiaccio.', benefits: 'Depura il fegato, alcalinizza il corpo, migliora la digestione' },
      'starter-2': { name: 'Potere Mattutino', ingredients: ['1 banana matura', '1 tazza di mango', '1 arancia (succo)', '1 cucchiaino di curcuma', '1 cucchiaino di miele', '½ tazza di latte di mandorla'], instructions: "Frulla il tutto insieme. Aggiungi ghiaccio a piacere. Consuma nei primi 30 minuti della giornata.", benefits: 'Energia prolungata, anti-infiammatorio, vitamina C naturale' },
      'starter-3': { name: 'Scudo Viola', ingredients: ['1 tazza di mirtilli', '½ tazza di lamponi', '1 tazza di latte di cocco', '1 cucchiaino di spirulina', '1 cucchiaino di miele di Manuka'], instructions: 'Frulla mirtilli e lamponi con il latte di cocco. Aggiungi spirulina e miele. Mescola bene.', benefits: 'Ricco di antiossidanti, vitamina C, rafforza il sistema immunitario' },
    },
    starterBadge: 'STARTER', servingUnit: 'porzione', viewRecipe: 'Vedi ricetta →', addToList: '🛒 Aggiungi alla lista',
    videoStartError: 'Impossibile avviare il video', videoTimeout: 'Il video sta impiegando più del solito — riprova', videoGenError: 'Errore nella generazione del video',
    benefitsLabel: 'Benefici:', ingredientsTitle: 'Ingredienti', instructionsTitle: 'Preparazione', addIngredientsBtn: '🛒 Aggiungi ingredienti alla mia lista',
    aiPromptTemplate: (name, category) => `Crea una ricetta di smoothie/succo chiamata "${name}" per la categoria ${category}. Rispondi SOLO in JSON con questo formato esatto: {"ingredients":["ingrediente 1","ingrediente 2"],"instructions":"istruzioni in 2-3 passi","benefits":"benefici in 1 riga","emoji":"emoji pertinente","calories":numero,"prep_time":numero}`,
    newRecipeTitle: '✨ Nuova Ricetta', namePlaceholder: 'Nome dello smoothie o succo...', aiCreating: '🤖 Dr. Smoothie sta creando la ricetta...', aiGenerate: '🤖 Genera con Dr. Smoothie AI',
    ingredientsPlaceholder: 'Ingredienti (uno per riga):\nEs: 2 tazze di spinaci\n1 banana', instructionsPlaceholder: 'Istruzioni di preparazione...',
    cancel: 'Annulla', saving: 'Salvataggio...', saveRecipe: '💾 Salva Ricetta',
    myRecipesTitle: '🍽️ Le Mie Ricette', myRecipesSub: 'Create con Dr. Smoothie AI · Salvate nel tuo profilo',
    tabRecipes: '🥤 Ricette', tabList: '🛒 Lista', tabDiscover: '✨ Scopri', newRecipeBtn: '✨ Nuova ricetta con Dr. Smoothie AI',
    loadingRecipes: 'Caricamento ricette...', noRecipesCategory: 'Nessuna ricetta in questa categoria',
    ingredientsPending: (n) => `${n} ingredienti in sospeso`, clearList: 'Svuota lista', listEmpty: 'La tua lista è vuota',
    addFromRecipes: 'Aggiungi ingredienti dalle tue ricette', viewRecipesBtn: 'Vedi ricette →', tapToCheck: 'tocca per ✓',
    myListShareTitle: 'La mia lista PureLife', listCopied: '📋 Lista copiata negli appunti', shareListBtn: '📤 Condividi lista della spesa',
    general: 'Generale',
  },
};
const rs = (lang) => RS[lang] || RS.en;
const getCategories = (lang='en') => CATEGORY_META.map(c => ({ ...c, label: rs(lang).categoryLabel[c.id] }));
const getStarterRecipes = (lang='en') => STARTER_META.map(s => ({ ...s, ...rs(lang).starter[s.id], is_starter: true }));

// Card de receta individual
function CatalogCard({ item, onAddToShopping, lang = 'en' }) {
  const t = rs(lang);
  const [open, setOpen] = useState(false);
  const [videoState, setVideoState] = useState('idle'); // idle | rendering | done | error
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoError, setVideoError] = useState('');

  const generateVideo = async () => {
    setVideoState('rendering'); setVideoError('');
    try {
      const startRes = await fetch('/api/render-recipe-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          ingredients: item.ingredients || [],
          benefits: item.benefits || item.description || '',
          category: item.category || '',
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || t.videoStartError);

      // Medido en producción: los renders pueden tardar 60-90s+
      // (esta composición tiene más elementos: vaso animado + íconos).
      // 40 intentos x 3s = 120s de margen.
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const pollRes = await fetch(`/api/render-recipe-video-status?renderId=${startData.renderId}&bucketName=${startData.bucketName}`);
        const pollData = await pollRes.json();
        if (pollData.error) throw new Error(pollData.error);
        if (pollData.done) {
          setVideoUrl(pollData.output_url);
          setVideoState('done');
          return;
        }
      }
      throw new Error(t.videoTimeout);
    } catch (e) {
      setVideoError(e.message || t.videoGenError);
      setVideoState('error');
    }
  };

  return (
    <div style={{
      background: C.glass, border: `1px solid ${C.glassBorder}`,
      borderRadius: 20, padding: '18px 20px', marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 36 }}>🌿</div>
        <div style={{ flex: 1 }}>
          <span style={{ color: C.cream, fontWeight: 700, fontSize: 16, fontFamily: FONT_HEAD }}>{item.name}</span>
          {item.description && (
            <p style={{ color: C.muted, fontSize: 12.5, margin: '4px 0 0' }}>{item.description}</p>
          )}
        </div>
      </div>
      {item.benefits && (
        <p style={{ color: C.light, fontSize: 12, margin: '0 0 12px', fontStyle: 'italic' }}>✨ {item.benefits}</p>
      )}
      {open && Array.isArray(item.ingredients) && (
        <ul style={{ margin: '0 0 12px', paddingLeft: 18, color: C.cream, fontSize: 13 }}>
          {item.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      )}
      {videoState === 'done' && videoUrl && (
        <video src={videoUrl} controls playsInline preload="auto" style={{ width: '100%', maxWidth: 260, borderRadius: 14, marginBottom: 12, display: 'block', background: '#000' }} />
      )}
      {videoState === 'error' && (
        <p style={{ color: '#FF6B6B', fontSize: 12, margin: '0 0 10px' }}>❌ {videoError}</p>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          padding: '8px 16px', borderRadius: 20,
          border: `1px solid ${C.glassBorder}`, background: C.glass,
          color: C.cream, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
        }}>{open ? '▲' : t.viewRecipe}</button>
        <button onClick={() => onAddToShopping(item)} style={{
          padding: '8px 16px', borderRadius: 20, border: 'none',
          background: C.mint, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
        }}>{t.addToList}</button>
        {videoState !== 'done' && (
          <button onClick={generateVideo} disabled={videoState === 'rendering'} style={{
            padding: '8px 16px', borderRadius: 20, border: 'none',
            background: videoState === 'rendering' ? C.muted : 'linear-gradient(135deg,#C9A84C,#B8935A)',
            color: '#000', fontSize: 12, fontWeight: 700,
            cursor: videoState === 'rendering' ? 'default' : 'pointer', fontFamily: FONT,
          }}>{videoState === 'rendering' ? '⏳ Generando…' : '🎬 Generar video'}</button>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onViewDetail, onAddToShopping, onDelete, isOwn, lang = 'en' }) {
  const t = rs(lang);
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
                {t.starterBadge}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <span style={{ color: C.muted, fontSize: 12 }}>⏱ {recipe.prep_time} min</span>
            <span style={{ color: C.muted, fontSize: 12 }}>🍽 {recipe.servings} {t.servingUnit}</span>
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
          {t.viewRecipe}
        </button>
        <button onClick={() => onAddToShopping(recipe)} style={{
          padding: '8px 16px', borderRadius: 20,
          border: `1px solid ${C.mint}44`, background: `${C.mint}14`,
          color: C.light, fontSize: 12, cursor: 'pointer', fontFamily: FONT, fontWeight: 600,
        }}>
          {t.addToList}
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
function RecipeDetail({ recipe, onClose, onAddToShopping, lang = 'en' }) {
  const t = rs(lang);
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
            <span style={{ color: C.muted, fontSize: 13 }}>🍽 {recipe.servings} {t.servingUnit}</span>
          </div>
        </div>

        {recipe.benefits && (
          <div style={{ background: `${C.mint}14`, border: `1px solid ${C.mint}33`, borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ color: C.light, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              ✨ <strong>{t.benefitsLabel}</strong> {recipe.benefits}
            </p>
          </div>
        )}

        <h3 style={{ color: C.goldL, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t.ingredientsTitle}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {(recipe.ingredients || []).map((ing, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.cream, fontSize: 14 }}>
              <span style={{ color: C.mint, fontWeight: 800, fontSize: 16 }}>·</span>
              {ing}
            </div>
          ))}
        </div>

        <h3 style={{ color: C.goldL, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{t.instructionsTitle}</h3>
        <p style={{ color: C.cream, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          {recipe.instructions}
        </p>

        <button onClick={() => { onAddToShopping(recipe); onClose(); }} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
        }}>
          {t.addIngredientsBtn}
        </button>
      </div>
    </div>
  );
}

// Formulario nueva receta con Claude AI
function NewRecipeForm({ user, onSave, onClose, lang = 'en' }) {
  const t = rs(lang);
  const CATEGORIES = getCategories(lang);
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
          message: t.aiPromptTemplate(name, category),
          history: [],
          userId: user?.id || 'anon',
          lang,
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
        <h2 style={{ fontFamily: FONT_HEAD, color: C.cream, fontSize: 22, margin: '0 0 20px' }}>{t.newRecipeTitle}</h2>

        <input value={name} onChange={e => setName(e.target.value)}
          placeholder={t.namePlaceholder} style={inputSt} />

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
          {loadingAI ? t.aiCreating : t.aiGenerate}
        </button>

        <textarea value={ingredients} onChange={e => setIngredients(e.target.value)}
          placeholder={t.ingredientsPlaceholder}
          rows={5} style={{ ...inputSt, borderRadius: 14 }} />

        <textarea value={instructions} onChange={e => setInstructions(e.target.value)}
          placeholder={t.instructionsPlaceholder}
          rows={3} style={{ ...inputSt, borderRadius: 14 }} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px', borderRadius: 12, border: `1px solid ${C.glassBorder}`,
            background: 'transparent', color: C.muted, fontSize: 14, cursor: 'pointer', fontFamily: FONT,
          }}>{t.cancel}</button>
          <button onClick={save} disabled={!name || !ingredients || loading} style={{
            flex: 2, padding: '13px', borderRadius: 12, border: 'none',
            background: `linear-gradient(135deg, ${C.mint}, ${C.green})`,
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
            opacity: (!name || !ingredients || loading) ? 0.6 : 1,
          }}>
            {loading ? t.saving : t.saveRecipe}
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
export default function RecipesScreen({ user, lang = 'en' }) {
  const t = rs(lang);
  const CATEGORIES = getCategories(lang);
  const STARTER_RECIPES = getStarterRecipes(lang);
  const [recipes, setRecipes] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
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

  // Cargar catálogo global (generado por el agente de IA), en el idioma actual
  const loadCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const data = await sbFetch(`smoothie_catalog?language=eq.${lang}&is_published=eq.true&order=created_at.desc&limit=50`, user?.token);
      setCatalog(Array.isArray(data) ? data : []);
    } catch {
      setCatalog([]);
    }
    setCatalogLoading(false);
  }, [lang, user]);

  useEffect(() => { loadRecipes(); loadShopping(); loadCatalog(); }, [loadRecipes, loadShopping, loadCatalog]);

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
          {t.myRecipesTitle}
        </h2>
        <p style={{ color: C.muted, fontSize: 13 }}>{t.myRecipesSub}</p>
      </div>

      {/* Tabs Recetas / Lista */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 14 }}>
        {[
          { id: 'recipes', label: t.tabRecipes, count: recipes.length },
          { id: 'discover', label: t.tabDiscover, count: catalog.length },
          { id: 'shopping', label: t.tabList, count: shopping.length },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: '10px', borderRadius: 10,
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
            {t.newRecipeBtn}
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>{t.loadingRecipes}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p>{t.noRecipesCategory}</p>
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
                lang={lang}
              />
            ))
          )}
        </>
      )}

      {/* ── PANEL DESCUBRIR (catálogo global, generado por IA) ── */}
      {activeTab === 'discover' && (
        <>
          {catalogLoading ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>{t.loadingRecipes}</div>
          ) : catalog.length === 0 ? (
            <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
              <p>{t.noRecipesCategory}</p>
            </div>
          ) : (
            catalog.map(item => (
              <CatalogCard key={item.id} item={item} onAddToShopping={addToShopping} lang={lang} />
            ))
          )}
        </>
      )}

      {/* ── PANEL LISTA DE COMPRA ── */}
      {activeTab === 'shopping' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              {t.ingredientsPending(shopping.length)}
            </p>
            {shopping.length > 0 && (
              <button onClick={clearShopping} style={{
                padding: '6px 14px', borderRadius: 20, border: `1px solid ${C.red}44`,
                background: 'transparent', color: C.red, fontSize: 12, cursor: 'pointer', fontFamily: FONT,
              }}>
                {t.clearList}
              </button>
            )}
          </div>

          {shopping.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ color: C.muted, fontSize: 14 }}>{t.listEmpty}</p>
              <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
                {t.addFromRecipes}
              </p>
              <button onClick={() => setActiveTab('recipes')} style={{
                marginTop: 16, padding: '10px 20px', borderRadius: 20,
                border: `1px solid ${C.mint}`, background: 'transparent',
                color: C.light, fontSize: 13, cursor: 'pointer', fontFamily: FONT,
              }}>
                {t.viewRecipesBtn}
              </button>
            </div>
          ) : (
            <>
              {/* Agrupar por receta */}
              {Object.entries(
                shopping.reduce((acc, item) => {
                  const key = item.recipe_name || t.general;
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
                      <span style={{ color: C.muted, fontSize: 11 }}>{t.tapToCheck}</span>
                    </div>
                  ))}
                </div>
              ))}

              <button onClick={() => {
                const text = shopping.map(s => `• ${s.ingredient} (${s.recipe_name})`).join('\n');
                if (navigator.share) {
                  navigator.share({ title: t.myListShareTitle, text });
                } else {
                  navigator.clipboard?.writeText(text);
                  toast(t.listCopied);
                }
              }} style={{
                width: '100%', padding: '13px', borderRadius: 14, border: 'none',
                background: `linear-gradient(135deg, ${C.goldL}, ${C.gold})`,
                color: C.dark, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
              }}>
                {t.shareListBtn}
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
          lang={lang}
        />
      )}
      {showNewForm && (
        <NewRecipeForm
          user={user}
          onSave={saveRecipe}
          onClose={() => setShowNewForm(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
