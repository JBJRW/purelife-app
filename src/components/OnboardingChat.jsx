// ================================================================
// PureLife — OnboardingChat.jsx
// Dr. Smoothie AI como guía post-registro
// Claude API + fallback predefinido + botones interactivos
// JRMB Food Network LLC · 2026
// ================================================================

import { useState, useEffect, useRef } from 'react';

const AVATAR = '/dr-smoothie-avatar.jpg';

const C = {
  obsidian: '#080B0A', deep: '#0D1210', surface: '#111815',
  surface2: '#162019', gold: '#C9A84C', gold2: '#E8C96A',
  cream: '#F4EFE6', cream2: '#E8E0D0', sage: '#4A7C59',
  emerald: '#00C97B', muted: '#6B7E74',
  border: 'rgba(201,168,76,0.15)', border2: 'rgba(201,168,76,0.08)',
};

const LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', pt: 'Português', it: 'Italiano' };

// ── UI STRINGS (labels ajenos al flujo conversacional) ───────────
const UI = {
  en: {
    guideLabel: 'Welcome guide · PureLife', step: 'Step 1 of 2',
    readyTitle: "Ready to start!", readyBody: "You finished the tour. Now let's go to your personalized diagnosis. It only takes 3 minutes.",
    startDiagnosisBtn: 'Start diagnosis 🎯', anotherQuestion: 'Have another question? Type it here →',
    inputPlaceholder: 'Type your question...',
  },
  es: {
    guideLabel: 'Guía de bienvenida · PureLife', step: 'Paso 1 de 2',
    readyTitle: '¡Listo para empezar!', readyBody: 'Completaste el tour. Ahora vamos a tu diagnóstico personalizado. Solo toma 3 minutos.',
    startDiagnosisBtn: 'Iniciar diagnóstico 🎯', anotherQuestion: '¿Tienes otra pregunta? Escríbela aquí →',
    inputPlaceholder: 'Escribe tu pregunta...',
  },
  fr: {
    guideLabel: 'Guide de bienvenue · PureLife', step: 'Étape 1 sur 2',
    readyTitle: 'Prêt à commencer !', readyBody: 'Vous avez terminé la visite. Passons maintenant à votre diagnostic personnalisé. Cela ne prend que 3 minutes.',
    startDiagnosisBtn: 'Commencer le diagnostic 🎯', anotherQuestion: 'Une autre question ? Écrivez-la ici →',
    inputPlaceholder: 'Écrivez votre question...',
  },
  pt: {
    guideLabel: 'Guia de boas-vindas · PureLife', step: 'Passo 1 de 2',
    readyTitle: 'Pronto para começar!', readyBody: 'Você concluiu o tour. Agora vamos ao seu diagnóstico personalizado. Leva apenas 3 minutos.',
    startDiagnosisBtn: 'Iniciar diagnóstico 🎯', anotherQuestion: 'Tem outra pergunta? Escreva aqui →',
    inputPlaceholder: 'Digite sua pergunta...',
  },
  it: {
    guideLabel: 'Guida di benvenuto · PureLife', step: 'Passo 1 di 2',
    readyTitle: 'Pronto per iniziare!', readyBody: "Hai completato il tour. Ora passiamo alla tua diagnosi personalizzata. Richiede solo 3 minuti.",
    startDiagnosisBtn: 'Inizia diagnosi 🎯', anotherQuestion: "Hai un'altra domanda? Scrivila qui →",
    inputPlaceholder: 'Scrivi la tua domanda...',
  },
};
const ui = (lang, key) => (UI[lang] || UI.en)[key] ?? UI.en[key];

// ── FALLBACK RESPUESTAS ──────────────────────────────────────────
const FALLBACK_REPLIES = {
  en: [
    "I understand your question. The most important thing right now is completing your diagnosis so I can give you personalized recommendations. Shall we continue?",
    "Great point. Based on what you're telling me, the initial diagnosis will help us define your protocol exactly. Shall we start?",
    "That's very important for your health. Once you complete the diagnosis, we can work on that specifically. Shall we continue?",
  ],
  es: [
    'Entiendo tu pregunta. Lo más importante ahora es completar tu diagnóstico para que pueda darte recomendaciones personalizadas. ¿Seguimos?',
    'Excelente punto. Basado en lo que me dices, el diagnóstico inicial nos ayudará a definir exactamente tu protocolo. ¿Empezamos?',
    'Eso es muy importante para tu salud. Una vez completes el diagnóstico, podremos trabajar específicamente en eso. ¿Continuamos?',
  ],
  fr: [
    "Je comprends votre question. Le plus important maintenant est de terminer votre diagnostic pour que je puisse vous donner des recommandations personnalisées. On continue ?",
    "Excellente remarque. D'après ce que vous me dites, le diagnostic initial nous aidera à définir exactement votre protocole. On commence ?",
    "C'est très important pour votre santé. Une fois le diagnostic terminé, nous pourrons travailler spécifiquement là-dessus. On continue ?",
  ],
  pt: [
    'Entendo sua pergunta. O mais importante agora é concluir seu diagnóstico para que eu possa te dar recomendações personalizadas. Vamos continuar?',
    'Ótimo ponto. Com base no que você me diz, o diagnóstico inicial nos ajudará a definir exatamente seu protocolo. Vamos começar?',
    'Isso é muito importante para sua saúde. Assim que você concluir o diagnóstico, poderemos trabalhar especificamente nisso. Vamos continuar?',
  ],
  it: [
    'Capisco la tua domanda. La cosa più importante ora è completare la tua diagnosi così posso darti raccomandazioni personalizzate. Continuiamo?',
    'Ottimo punto. In base a quello che mi dici, la diagnosi iniziale ci aiuterà a definire esattamente il tuo protocollo. Iniziamo?',
    'È molto importante per la tua salute. Una volta completata la diagnosi, potremo lavorare specificamente su questo. Continuiamo?',
  ],
};

// ── FLOW DE ONBOARDING (por idioma) ───────────────────────────────
const FLOWS = {
  en: [
    { id: 'welcome', msg: (name) => `Hi ${name}! 🌿 I'm Dr. Smoothie AI, your personal wellness guide at PureLife Wellness Club.\n\nI'm here to walk with you through your transformation. Where would you like to start?`,
      options: [ { label: 'What can I do here?', next: 'features' }, { label: 'How does the diagnosis work?', next: 'diagnosis' }, { label: "I want to start now 🚀", next: 'start' } ] },
    { id: 'features', msg: () => `PureLife has 5 powerful modules for you:\n\n🧬 **Personalized diagnosis** — I analyze your symptoms and goals\n🥤 **Recipes and protocols** — A nutrition plan specific to you\n📍 **Store locator** — Ingredients near you in real time\n🎬 **PureLife TV** — 4K videos with cinematic recipes\n🏆 **Progress system** — Tracking and personalized reminders\n\nWhich one interests you most?`,
      options: [ { label: '🧬 The diagnosis', next: 'diagnosis' }, { label: '🎬 The videos', next: 'videos' }, { label: '📍 The locator', next: 'locator' }, { label: 'Start diagnosis', next: 'start' } ] },
    { id: 'diagnosis', msg: () => `The initial diagnosis takes 3 minutes ⏱️\n\nI'll ask you about:\n• Your current energy and sleep quality\n• Health goals (weight, digestion, inflammation, etc.)\n• Allergies and intolerances\n• Your daily routine\n\nWith those answers I create a **100% personalized protocol** of smoothies and juices for you. We'll adjust results every week.\n\nReady to start?`,
      options: [ { label: 'Yes, start diagnosis! 🎯', next: 'start' }, { label: 'How long until I see results?', next: 'results' } ] },
    { id: 'videos', msg: () => `PureLife TV has exclusive content 🎬\n\n• 4K recipe videos made with AI\n• Weekly themed series (detox, energy, anti-inflammatory)\n• Dr. Smoothie avatar as instructor\n• New videos every week\n\nDepending on your plan (Seed/Bloom/Canopy) you get access to different categories. Canopy videos include 1:1 video coaching.\n\nShall we continue?`,
      options: [ { label: 'See my available videos', next: 'start' }, { label: 'See the store locator', next: 'locator' } ] },
    { id: 'locator', msg: () => `The locator uses your real-time GPS location 📍\n\nIt finds natural product stores near you, shows which ingredients they have available, and connects your protocol's shopping list with the closest stores.\n\nYou'll never come home without the right ingredients again! 🌿`,
      options: [ { label: 'Great! Start diagnosis', next: 'start' }, { label: 'How do reminders work?', next: 'reminders' } ] },
    { id: 'reminders', msg: () => `Personalized reminders keep you on rhythm ⏰\n\nYou can set reminders for:\n• 🥤 "Time for your green smoothie"\n• 🛒 "Buy ingredients today"\n• 🎬 "New weekly video available"\n• 📊 "Log your progress"\n\nEach reminder includes a motivational message from me with relevant nutritional facts. Like having a personal coach 24/7!`,
      options: [ { label: 'Perfect, start now 🚀', next: 'start' }, { label: 'What happens at 30 days?', next: 'exam' } ] },
    { id: 'results', msg: () => `Results are progressive and real 📈\n\n**Week 1-2:** More morning energy, better hydration\n**Week 3-4:** Improved digestion, less inflammation\n**Month 2-3:** Visible changes in weight and skin tone\n**Month 3+:** Consolidated habits, optimized protocol\n\nAt 30 days we do a **progress exam** where you measure your progress and can create a testimonial video to share. Many members see results from the first week!`,
      options: [ { label: 'I want to start now 🎯', next: 'start' }, { label: 'What is the 30-day exam?', next: 'exam' } ] },
    { id: 'exam', msg: () => `The progress exam is special ✨\n\nAt 30 days (or once you complete 20 actions), I'll invite you to:\n1. Answer progress questions (energy, sleep, digestion)\n2. Compare with your initial diagnosis\n3. Optionally upload lab results\n4. **Generate an AI testimonial video** you can share on social media\n\nIt's your moment to celebrate and inspire others. Testimonial videos go viral! 🎬`,
      options: [ { label: "Amazing! Let's start now 🚀", next: 'start' } ] },
    { id: 'start', msg: (name) => `Perfect, ${name}! 🌿 You're about to start your wellness journey.\n\nThe diagnosis takes 3 minutes and then your personalized protocol will be ready. Let's go!`,
      options: [], action: 'go_to_diagnosis' },
  ],
  es: [
    { id: 'welcome', msg: (name) => `¡Hola ${name}! 🌿 Soy Dr. Smoothie AI, tu guía personal de bienestar en PureLife Wellness Club.\n\nEstoy aquí para acompañarte en tu transformación. ¿Por dónde quieres empezar?`,
      options: [ { label: '¿Qué puedo hacer aquí?', next: 'features' }, { label: '¿Cómo funciona el diagnóstico?', next: 'diagnosis' }, { label: 'Quiero empezar ya 🚀', next: 'start' } ] },
    { id: 'features', msg: () => `PureLife tiene 5 módulos poderosos para ti:\n\n🧬 **Diagnóstico personalizado** — Analizo tus síntomas y objetivos\n🥤 **Recetas y protocolos** — Plan nutricional específico para ti\n📍 **Localizador de tiendas** — Ingredientes cerca de ti en tiempo real\n🎬 **PureLife TV** — Videos 4K con recetas cinematográficas\n🏆 **Sistema de progreso** — Seguimiento y alarmas personalizadas\n\n¿Cuál te interesa más?`,
      options: [ { label: '🧬 El diagnóstico', next: 'diagnosis' }, { label: '🎬 Los videos', next: 'videos' }, { label: '📍 El localizador', next: 'locator' }, { label: 'Comenzar diagnóstico', next: 'start' } ] },
    { id: 'diagnosis', msg: () => `El diagnóstico inicial toma 3 minutos ⏱️\n\nTe haré preguntas sobre:\n• Tu energía actual y calidad de sueño\n• Objetivos de salud (peso, digestión, inflamación, etc.)\n• Alergias e intolerancias\n• Tu rutina diaria\n\nCon esas respuestas creo un **protocolo 100% personalizado** de smoothies y jugos para ti. Los resultados los iremos ajustando cada semana.\n\n¿Estás listo para comenzar?`,
      options: [ { label: '¡Sí, comenzar diagnóstico! 🎯', next: 'start' }, { label: '¿Cuánto tiempo lleva ver resultados?', next: 'results' } ] },
    { id: 'videos', msg: () => `PureLife TV tiene contenido exclusivo 🎬\n\n• Videos 4K de recetas preparados con IA\n• Series semanales temáticas (detox, energía, anti-inflamatorio)\n• Avatar Dr. Smoothie como instructor\n• Nuevos videos cada semana\n\nSegún tu plan (Seed/Bloom/Canopy) tienes acceso a diferentes categorías. Los videos Canopy incluyen coaching 1:1 en video.\n\n¿Seguimos?`,
      options: [ { label: 'Ver mis videos disponibles', next: 'start' }, { label: 'Ver el localizador de tiendas', next: 'locator' } ] },
    { id: 'locator', msg: () => `El localizador usa tu ubicación GPS en tiempo real 📍\n\nBusca tiendas de productos naturales cerca de ti, muestra qué ingredientes tienen disponibles y conecta tu lista de compras del protocolo con las tiendas más cercanas.\n\n¡Nunca más llegarás a casa sin los ingredientes correctos! 🌿`,
      options: [ { label: '¡Genial! Comenzar diagnóstico', next: 'start' }, { label: '¿Cómo funcionan las alarmas?', next: 'reminders' } ] },
    { id: 'reminders', msg: () => `Las alarmas personalizadas te mantienen en ritmo ⏰\n\nPuedes configurar recordatorios para:\n• 🥤 "Hora de tu smoothie verde"\n• 🛒 "Comprar ingredientes hoy"\n• 🎬 "Nuevo video semanal disponible"\n• 📊 "Registrar tu progreso"\n\nCada alarma incluye un mensaje motivacional mío con datos nutricionales relevantes. ¡Como tener un coach personal 24/7!`,
      options: [ { label: 'Perfecto, comenzar ahora 🚀', next: 'start' }, { label: '¿Qué pasa a los 30 días?', next: 'exam' } ] },
    { id: 'results', msg: () => `Los resultados son progresivos y reales 📈\n\n**Semana 1-2:** Más energía matutina, mejor hidratación\n**Semana 3-4:** Mejora digestiva, menos inflamación\n**Mes 2-3:** Cambios visibles en peso y tono de piel\n**Mes 3+:** Hábitos consolidados, protocolo optimizado\n\nA los 30 días hacemos un **examen de progreso** donde mides tus avances y puedes crear un video testimonial para compartir. ¡Muchos miembros ven resultados desde la primera semana!`,
      options: [ { label: 'Quiero empezar ya 🎯', next: 'start' }, { label: '¿Qué es el examen de 30 días?', next: 'exam' } ] },
    { id: 'exam', msg: () => `El examen de progreso es especial ✨\n\nA los 30 días (o cuando completes 20 acciones), te invito a:\n1. Responder preguntas de progreso (energía, sueño, digestión)\n2. Comparar con tu diagnóstico inicial\n3. Opcionalmente subir análisis de laboratorio\n4. **Generar un video testimonial con IA** que puedes compartir en redes\n\nEs tu momento de celebrar y motivar a otros. ¡Los videos testimoniales son virales! 🎬`,
      options: [ { label: '¡Increíble! Empecemos ya 🚀', next: 'start' } ] },
    { id: 'start', msg: (name) => `¡Perfecto ${name}! 🌿 Estás a punto de comenzar tu journey de bienestar.\n\nEl diagnóstico toma 3 minutos y después tendrás tu protocolo personalizado listo. ¡Vamos!`,
      options: [], action: 'go_to_diagnosis' },
  ],
  fr: [
    { id: 'welcome', msg: (name) => `Bonjour ${name} ! 🌿 Je suis Dr. Smoothie AI, votre guide bien-être personnel chez PureLife Wellness Club.\n\nJe suis là pour vous accompagner dans votre transformation. Par où voulez-vous commencer ?`,
      options: [ { label: 'Que puis-je faire ici ?', next: 'features' }, { label: 'Comment fonctionne le diagnostic ?', next: 'diagnosis' }, { label: 'Je veux commencer maintenant 🚀', next: 'start' } ] },
    { id: 'features', msg: () => `PureLife propose 5 modules puissants pour vous :\n\n🧬 **Diagnostic personnalisé** — J'analyse vos symptômes et objectifs\n🥤 **Recettes et protocoles** — Un plan nutritionnel qui vous est propre\n📍 **Localisateur de magasins** — Ingrédients près de vous en temps réel\n🎬 **PureLife TV** — Vidéos 4K avec recettes cinématographiques\n🏆 **Système de progression** — Suivi et rappels personnalisés\n\nLequel vous intéresse le plus ?`,
      options: [ { label: '🧬 Le diagnostic', next: 'diagnosis' }, { label: '🎬 Les vidéos', next: 'videos' }, { label: '📍 Le localisateur', next: 'locator' }, { label: 'Commencer le diagnostic', next: 'start' } ] },
    { id: 'diagnosis', msg: () => `Le diagnostic initial prend 3 minutes ⏱️\n\nJe vais vous poser des questions sur :\n• Votre énergie actuelle et la qualité de votre sommeil\n• Vos objectifs de santé (poids, digestion, inflammation, etc.)\n• Allergies et intolérances\n• Votre routine quotidienne\n\nAvec ces réponses, je crée un **protocole 100% personnalisé** de smoothies et jus pour vous. Nous ajusterons les résultats chaque semaine.\n\nPrêt à commencer ?`,
      options: [ { label: 'Oui, commencer le diagnostic ! 🎯', next: 'start' }, { label: 'Combien de temps avant de voir des résultats ?', next: 'results' } ] },
    { id: 'videos', msg: () => `PureLife TV propose du contenu exclusif 🎬\n\n• Vidéos de recettes 4K créées avec l'IA\n• Séries hebdomadaires thématiques (détox, énergie, anti-inflammatoire)\n• Avatar Dr. Smoothie comme instructeur\n• Nouvelles vidéos chaque semaine\n\nSelon votre plan (Seed/Bloom/Canopy), vous avez accès à différentes catégories. Les vidéos Canopy incluent un coaching vidéo 1:1.\n\nOn continue ?`,
      options: [ { label: 'Voir mes vidéos disponibles', next: 'start' }, { label: 'Voir le localisateur de magasins', next: 'locator' } ] },
    { id: 'locator', msg: () => `Le localisateur utilise votre position GPS en temps réel 📍\n\nIl trouve les magasins de produits naturels près de chez vous, indique quels ingrédients sont disponibles et relie votre liste de courses du protocole aux magasins les plus proches.\n\nVous ne rentrerez plus jamais chez vous sans les bons ingrédients ! 🌿`,
      options: [ { label: 'Super ! Commencer le diagnostic', next: 'start' }, { label: 'Comment fonctionnent les rappels ?', next: 'reminders' } ] },
    { id: 'reminders', msg: () => `Les rappels personnalisés vous gardent dans le rythme ⏰\n\nVous pouvez configurer des rappels pour :\n• 🥤 « C'est l'heure de votre smoothie vert »\n• 🛒 « Acheter des ingrédients aujourd'hui »\n• 🎬 « Nouvelle vidéo hebdomadaire disponible »\n• 📊 « Enregistrer vos progrès »\n\nChaque rappel inclut un message motivant de ma part avec des informations nutritionnelles pertinentes. Comme avoir un coach personnel 24/7 !`,
      options: [ { label: 'Parfait, commencer maintenant 🚀', next: 'start' }, { label: "Que se passe-t-il à 30 jours ?", next: 'exam' } ] },
    { id: 'results', msg: () => `Les résultats sont progressifs et réels 📈\n\n**Semaine 1-2 :** Plus d'énergie le matin, meilleure hydratation\n**Semaine 3-4 :** Digestion améliorée, moins d'inflammation\n**Mois 2-3 :** Changements visibles de poids et de teint\n**Mois 3+ :** Habitudes consolidées, protocole optimisé\n\nÀ 30 jours, nous faisons un **examen de progression** où vous mesurez vos avancées et pouvez créer une vidéo témoignage à partager. De nombreux membres voient des résultats dès la première semaine !`,
      options: [ { label: 'Je veux commencer maintenant 🎯', next: 'start' }, { label: "Qu'est-ce que l'examen de 30 jours ?", next: 'exam' } ] },
    { id: 'exam', msg: () => `L'examen de progression est spécial ✨\n\nÀ 30 jours (ou une fois 20 actions complétées), je vous invite à :\n1. Répondre à des questions de progression (énergie, sommeil, digestion)\n2. Comparer avec votre diagnostic initial\n3. Optionnellement, télécharger des analyses de laboratoire\n4. **Générer une vidéo témoignage avec l'IA** à partager sur les réseaux\n\nC'est votre moment pour célébrer et motiver les autres. Les vidéos témoignages deviennent virales ! 🎬`,
      options: [ { label: "Incroyable ! Commençons maintenant 🚀", next: 'start' } ] },
    { id: 'start', msg: (name) => `Parfait ${name} ! 🌿 Vous êtes sur le point de commencer votre parcours bien-être.\n\nLe diagnostic prend 3 minutes et ensuite votre protocole personnalisé sera prêt. Allons-y !`,
      options: [], action: 'go_to_diagnosis' },
  ],
  pt: [
    { id: 'welcome', msg: (name) => `Olá ${name}! 🌿 Sou Dr. Smoothie AI, seu guia pessoal de bem-estar no PureLife Wellness Club.\n\nEstou aqui para te acompanhar na sua transformação. Por onde você quer começar?`,
      options: [ { label: 'O que posso fazer aqui?', next: 'features' }, { label: 'Como funciona o diagnóstico?', next: 'diagnosis' }, { label: 'Quero começar agora 🚀', next: 'start' } ] },
    { id: 'features', msg: () => `O PureLife tem 5 módulos poderosos para você:\n\n🧬 **Diagnóstico personalizado** — Analiso seus sintomas e objetivos\n🥤 **Receitas e protocolos** — Plano nutricional específico para você\n📍 **Localizador de lojas** — Ingredientes perto de você em tempo real\n🎬 **PureLife TV** — Vídeos 4K com receitas cinematográficas\n🏆 **Sistema de progresso** — Acompanhamento e lembretes personalizados\n\nQual te interessa mais?`,
      options: [ { label: '🧬 O diagnóstico', next: 'diagnosis' }, { label: '🎬 Os vídeos', next: 'videos' }, { label: '📍 O localizador', next: 'locator' }, { label: 'Começar diagnóstico', next: 'start' } ] },
    { id: 'diagnosis', msg: () => `O diagnóstico inicial leva 3 minutos ⏱️\n\nVou te perguntar sobre:\n• Sua energia atual e qualidade do sono\n• Objetivos de saúde (peso, digestão, inflamação, etc.)\n• Alergias e intolerâncias\n• Sua rotina diária\n\nCom essas respostas, crio um **protocolo 100% personalizado** de smoothies e sucos para você. Ajustaremos os resultados a cada semana.\n\nPronto para começar?`,
      options: [ { label: 'Sim, começar diagnóstico! 🎯', next: 'start' }, { label: 'Quanto tempo até ver resultados?', next: 'results' } ] },
    { id: 'videos', msg: () => `O PureLife TV tem conteúdo exclusivo 🎬\n\n• Vídeos de receitas em 4K feitos com IA\n• Séries semanais temáticas (detox, energia, anti-inflamatório)\n• Avatar Dr. Smoothie como instrutor\n• Novos vídeos toda semana\n\nDependendo do seu plano (Seed/Bloom/Canopy) você tem acesso a diferentes categorias. Os vídeos Canopy incluem coaching 1:1 em vídeo.\n\nVamos continuar?`,
      options: [ { label: 'Ver meus vídeos disponíveis', next: 'start' }, { label: 'Ver o localizador de lojas', next: 'locator' } ] },
    { id: 'locator', msg: () => `O localizador usa sua localização GPS em tempo real 📍\n\nEle busca lojas de produtos naturais perto de você, mostra quais ingredientes têm disponíveis e conecta sua lista de compras do protocolo com as lojas mais próximas.\n\nVocê nunca mais chegará em casa sem os ingredientes certos! 🌿`,
      options: [ { label: 'Ótimo! Começar diagnóstico', next: 'start' }, { label: 'Como funcionam os lembretes?', next: 'reminders' } ] },
    { id: 'reminders', msg: () => `Os lembretes personalizados te mantêm no ritmo ⏰\n\nVocê pode configurar lembretes para:\n• 🥤 "Hora do seu smoothie verde"\n• 🛒 "Comprar ingredientes hoje"\n• 🎬 "Novo vídeo semanal disponível"\n• 📊 "Registrar seu progresso"\n\nCada lembrete inclui uma mensagem motivacional minha com dados nutricionais relevantes. Como ter um coach pessoal 24/7!`,
      options: [ { label: 'Perfeito, começar agora 🚀', next: 'start' }, { label: 'O que acontece aos 30 dias?', next: 'exam' } ] },
    { id: 'results', msg: () => `Os resultados são progressivos e reais 📈\n\n**Semana 1-2:** Mais energia matinal, melhor hidratação\n**Semana 3-4:** Digestão melhorada, menos inflamação\n**Mês 2-3:** Mudanças visíveis no peso e tom de pele\n**Mês 3+:** Hábitos consolidados, protocolo otimizado\n\nAos 30 dias fazemos um **exame de progresso** onde você mede seus avanços e pode criar um vídeo depoimento para compartilhar. Muitos membros veem resultados desde a primeira semana!`,
      options: [ { label: 'Quero começar agora 🎯', next: 'start' }, { label: 'O que é o exame de 30 dias?', next: 'exam' } ] },
    { id: 'exam', msg: () => `O exame de progresso é especial ✨\n\nAos 30 dias (ou ao completar 20 ações), te convido a:\n1. Responder perguntas de progresso (energia, sono, digestão)\n2. Comparar com seu diagnóstico inicial\n3. Opcionalmente enviar exames laboratoriais\n4. **Gerar um vídeo depoimento com IA** que você pode compartilhar nas redes\n\nÉ o seu momento de celebrar e motivar outras pessoas. Os vídeos depoimento viralizam! 🎬`,
      options: [ { label: 'Incrível! Vamos começar agora 🚀', next: 'start' } ] },
    { id: 'start', msg: (name) => `Perfeito, ${name}! 🌿 Você está prestes a começar sua jornada de bem-estar.\n\nO diagnóstico leva 3 minutos e depois seu protocolo personalizado estará pronto. Vamos!`,
      options: [], action: 'go_to_diagnosis' },
  ],
  it: [
    { id: 'welcome', msg: (name) => `Ciao ${name}! 🌿 Sono Dr. Smoothie AI, la tua guida personale al benessere in PureLife Wellness Club.\n\nSono qui per accompagnarti nella tua trasformazione. Da dove vuoi iniziare?`,
      options: [ { label: 'Cosa posso fare qui?', next: 'features' }, { label: 'Come funziona la diagnosi?', next: 'diagnosis' }, { label: 'Voglio iniziare subito 🚀', next: 'start' } ] },
    { id: 'features', msg: () => `PureLife ha 5 moduli potenti per te:\n\n🧬 **Diagnosi personalizzata** — Analizzo i tuoi sintomi e obiettivi\n🥤 **Ricette e protocolli** — Piano nutrizionale specifico per te\n📍 **Localizzatore negozi** — Ingredienti vicino a te in tempo reale\n🎬 **PureLife TV** — Video 4K con ricette cinematografiche\n🏆 **Sistema di progresso** — Monitoraggio e promemoria personalizzati\n\nQuale ti interessa di più?`,
      options: [ { label: '🧬 La diagnosi', next: 'diagnosis' }, { label: '🎬 I video', next: 'videos' }, { label: '📍 Il localizzatore', next: 'locator' }, { label: 'Inizia diagnosi', next: 'start' } ] },
    { id: 'diagnosis', msg: () => `La diagnosi iniziale richiede 3 minuti ⏱️\n\nTi farò domande su:\n• La tua energia attuale e qualità del sonno\n• Obiettivi di salute (peso, digestione, infiammazione, ecc.)\n• Allergie e intolleranze\n• La tua routine quotidiana\n\nCon queste risposte creo un **protocollo 100% personalizzato** di smoothie e succhi per te. Aggiusteremo i risultati ogni settimana.\n\nPronto per iniziare?`,
      options: [ { label: 'Sì, inizia diagnosi! 🎯', next: 'start' }, { label: 'Quanto tempo per vedere risultati?', next: 'results' } ] },
    { id: 'videos', msg: () => `PureLife TV ha contenuti esclusivi 🎬\n\n• Video ricette 4K creati con l'IA\n• Serie tematiche settimanali (detox, energia, anti-infiammatorio)\n• Avatar Dr. Smoothie come istruttore\n• Nuovi video ogni settimana\n\nA seconda del tuo piano (Seed/Bloom/Canopy) hai accesso a diverse categorie. I video Canopy includono coaching video 1:1.\n\nContinuiamo?`,
      options: [ { label: 'Vedi i miei video disponibili', next: 'start' }, { label: 'Vedi il localizzatore negozi', next: 'locator' } ] },
    { id: 'locator', msg: () => `Il localizzatore usa la tua posizione GPS in tempo reale 📍\n\nTrova negozi di prodotti naturali vicino a te, mostra quali ingredienti hanno disponibili e collega la tua lista della spesa del protocollo ai negozi più vicini.\n\nNon tornerai mai più a casa senza gli ingredienti giusti! 🌿`,
      options: [ { label: 'Ottimo! Inizia diagnosi', next: 'start' }, { label: 'Come funzionano i promemoria?', next: 'reminders' } ] },
    { id: 'reminders', msg: () => `I promemoria personalizzati ti mantengono in ritmo ⏰\n\nPuoi impostare promemoria per:\n• 🥤 "È ora del tuo smoothie verde"\n• 🛒 "Compra ingredienti oggi"\n• 🎬 "Nuovo video settimanale disponibile"\n• 📊 "Registra i tuoi progressi"\n\nOgni promemoria include un messaggio motivazionale da parte mia con dati nutrizionali rilevanti. Come avere un coach personale 24/7!`,
      options: [ { label: 'Perfetto, inizia ora 🚀', next: 'start' }, { label: 'Cosa succede a 30 giorni?', next: 'exam' } ] },
    { id: 'results', msg: () => `I risultati sono progressivi e reali 📈\n\n**Settimana 1-2:** Più energia mattutina, migliore idratazione\n**Settimana 3-4:** Digestione migliorata, meno infiammazione\n**Mese 2-3:** Cambiamenti visibili nel peso e tono della pelle\n**Mese 3+:** Abitudini consolidate, protocollo ottimizzato\n\nA 30 giorni facciamo un **esame di progresso** dove misuri i tuoi progressi e puoi creare un video testimonianza da condividere. Molti membri vedono risultati dalla prima settimana!`,
      options: [ { label: 'Voglio iniziare subito 🎯', next: 'start' }, { label: "Cos'è l'esame dei 30 giorni?", next: 'exam' } ] },
    { id: 'exam', msg: () => `L'esame di progresso è speciale ✨\n\nA 30 giorni (o al completamento di 20 azioni), ti invito a:\n1. Rispondere a domande sui progressi (energia, sonno, digestione)\n2. Confrontare con la tua diagnosi iniziale\n3. Facoltativamente caricare analisi di laboratorio\n4. **Generare un video testimonianza con IA** da condividere sui social\n\nÈ il tuo momento per festeggiare e motivare gli altri. I video testimonianza diventano virali! 🎬`,
      options: [ { label: 'Incredibile! Iniziamo subito 🚀', next: 'start' } ] },
    { id: 'start', msg: (name) => `Perfetto ${name}! 🌿 Stai per iniziare il tuo percorso di benessere.\n\nLa diagnosi richiede 3 minuti e poi il tuo protocollo personalizzato sarà pronto. Andiamo!`,
      options: [], action: 'go_to_diagnosis' },
  ],
};
const getFlow = (lang) => FLOWS[lang] || FLOWS.en;
const LANG_INSTRUCTION = { en: 'Respond in English.', es: 'Responde en español.', fr: 'Réponds en français.', pt: 'Responda em português.', it: 'Rispondi in italiano.' };

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────
export default function OnboardingChat({ user, onComplete, lang = 'en' }) {
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || (lang === 'es' ? 'amigo' : 'friend');
  const FLOW = getFlow(lang);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [done, setDone] = useState(false);
  const bodyRef = useRef(null);
  const fallbackIdx = useRef(0);

  useEffect(() => {
    // Mensaje inicial con delay cinematográfico
    setTimeout(() => {
      const first = FLOW.find(f => f.id === 'welcome');
      addMessage('ai', first.msg(name));
    }, 600);
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type, text, options = []) => {
    setMessages(prev => [...prev.filter(m => m.type !== 'typing'), { type, text, options, id: Date.now() }]);
  };

  const addTyping = () => {
    setMessages(prev => [...prev, { type: 'typing', id: 'typing' }]);
  };

  const handleOption = async (option) => {
    // Mensaje del usuario
    addMessage('user', option.label);
    setLoading(true);
    addTyping();

    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const step = FLOW.find(f => f.id === option.next);
    if (step) {
      setCurrentStep(step.id);
      addMessage('ai', step.msg(name), step.options);
      if (step.action === 'go_to_diagnosis') {
        setTimeout(() => setDone(true), 1400);
      }
    }
    setLoading(false);
  };

  const handleFreeText = async () => {
    const question = inputVal.trim();
    if (!question || loading) return;
    setInputVal('');
    addMessage('user', question);
    setLoading(true);
    addTyping();

    try {
      // Intentar Claude API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[ONBOARDING] User asks: "${question}". ${LANG_INSTRUCTION[lang] || LANG_INSTRUCTION.en} Answer briefly (max 3 lines) and guide them to complete the initial diagnosis.`,
          userId: user?.id,
          accessToken: user?.access_token,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const fb = FALLBACK_REPLIES[lang] || FALLBACK_REPLIES.en;
        const reply = data.reply || data.content || fb[fallbackIdx.current % fb.length];
        const step = FLOW.find(f => f.id === currentStep);
        addMessage('ai', reply, step?.options || []);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback predefinido
      const fb = FALLBACK_REPLIES[lang] || FALLBACK_REPLIES.en;
      const reply = fb[fallbackIdx.current % fb.length];
      fallbackIdx.current++;
      const step = FLOW.find(f => f.id === currentStep);
      addMessage('ai', reply, step?.options || []);
    }
    setLoading(false);
  };

  // ── PANTALLA DE DIAGNÓSTICO ──────────────────────────────────
  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <img src={AVATAR} alt="Dr. Smoothie" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${C.emerald}`, marginBottom: 24, boxShadow: `0 0 40px rgba(0,201,123,0.4)` }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: C.cream, marginBottom: 12 }}>{ui(lang,'readyTitle')}</h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>{ui(lang,'readyBody')}</p>
          <button
            onClick={onComplete}
            style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, border: 'none', padding: '16px 40px', borderRadius: 50, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: `0 8px 32px rgba(201,168,76,0.4)` }}
          >
            {ui(lang,'startDiagnosisBtn')}
          </button>
        </div>
      </div>
    );
  }

  const currentOptions = FLOW.find(f => f.id === currentStep)?.options || [];

  return (
    <div style={{ minHeight: '100vh', background: C.obsidian, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: C.deep, borderBottom: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <img src={AVATAR} alt="Dr. Smoothie" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.emerald}` }} />
        <div>
          <div style={{ fontWeight: 700, color: C.cream, fontSize: 15 }}>Dr. Smoothie AI</div>
          <div style={{ fontSize: 11, color: C.emerald, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            {ui(lang,'guideLabel')}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>{ui(lang,'step')}</div>
      </div>

      {/* Messages */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto', width: '100%' }}>
        {messages.map(msg => {
          if (msg.type === 'typing') return (
            <div key="typing" style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <img src={AVATAR} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: '4px 20px 20px 20px', padding: '12px 18px' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.muted, animation: `bounce 1.2s ${d}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          );

          if (msg.type === 'ai') return (
            <div key={msg.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
              <img src={AVATAR} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ background: C.surface, border: `1px solid ${C.border2}`, borderRadius: '4px 20px 20px 20px', padding: '14px 18px', fontSize: 14, color: C.cream, lineHeight: 1.7, maxWidth: '85%', whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
                {/* Options */}
                {msg.options && msg.options.length > 0 && !loading && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                    {msg.options.map((opt, i) => (
                      <button key={i} onClick={() => handleOption(opt)} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 40, padding: '8px 16px', color: C.gold2, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.target.style.background = `rgba(201,168,76,0.1)`; e.target.style.borderColor = C.gold; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = C.border; }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );

          if (msg.type === 'user') return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', animation: 'fadeUp 0.3s ease' }}>
              <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, color: C.obsidian, borderRadius: '20px 20px 4px 20px', padding: '12px 18px', fontSize: 14, fontWeight: 500, maxWidth: '75%' }}>
                {msg.text}
              </div>
            </div>
          );
          return null;
        })}
      </div>

      {/* Input libre */}
      <div style={{ background: C.deep, borderTop: `1px solid ${C.border2}`, padding: '12px 20px', maxWidth: 600, margin: '0 auto', width: '100%' }}>
        {!showInput ? (
          <button onClick={() => setShowInput(true)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
            {ui(lang,'anotherQuestion')}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleFreeText()}
              placeholder={ui(lang,'inputPlaceholder')}
              style={{ flex: 1, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 24, padding: '10px 16px', color: C.cream, fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
            />
            <button onClick={handleFreeText} disabled={loading} style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.gold2})`, border: 'none', color: C.obsidian, cursor: 'pointer', fontSize: 16 }}>➤</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}
