// ── FLOW DE ONBOARDING — 5 idiomas (EN/ES/FR/PT/IT) ──────────────
export const FLOW_I18N = {
  en: {
    welcome: {
      msg: (name) => `Hi ${name}! 🌿 I'm Dr. Smoothie AI, your personal wellness guide at PureLife Wellness Club.\n\nI'm here to walk with you through your transformation. Where would you like to start?`,
      options: [
        { label: 'What can I do here?', next: 'features' },
        { label: 'How does the diagnosis work?', next: 'diagnosis' },
        { label: "I'm ready to start 🚀", next: 'start' },
      ],
    },
    features: {
      msg: () => `PureLife has 5 powerful modules for you:\n\n🧬 **Personalized diagnosis** — I analyze your symptoms and goals\n🥤 **Recipes & protocols** — A nutrition plan built just for you\n📍 **Store locator** — Find ingredients near you in real time\n🎬 **PureLife TV** — 4K videos with cinematic recipes\n🏆 **Progress system** — Personalized tracking and reminders\n\nWhich one interests you most?`,
      options: [
        { label: '🧬 The diagnosis', next: 'diagnosis' },
        { label: '🎬 The videos', next: 'videos' },
        { label: '📍 The locator', next: 'locator' },
        { label: 'Start diagnosis', next: 'start' },
      ],
    },
    diagnosis: {
      msg: () => `The initial diagnosis takes 3 minutes ⏱️\n\nI'll ask you about:\n• Your current energy and sleep quality\n• Health goals (weight, digestion, inflammation, etc.)\n• Allergies and intolerances\n• Your daily routine\n\nWith those answers I build a **100% personalized protocol** of smoothies and juices for you. We'll fine-tune the results every week.\n\nReady to get started?`,
      options: [
        { label: 'Yes, start diagnosis! 🎯', next: 'start' },
        { label: 'How long until I see results?', next: 'results' },
      ],
    },
    videos: {
      msg: () => `PureLife TV has exclusive content 🎬\n\n• 4K recipe videos made with AI\n• Weekly themed series (detox, energy, anti-inflammatory)\n• Dr. Smoothie avatar as your instructor\n• New videos every week\n\nDepending on your plan (Seed/Bloom/Canopy) you get access to different categories. Canopy videos include 1:1 video coaching.\n\nShall we continue?`,
      options: [
        { label: 'See my available videos', next: 'start' },
        { label: 'See the store locator', next: 'locator' },
      ],
    },
    locator: {
      msg: () => `The locator uses your real-time GPS location 📍\n\nIt finds natural product stores near you, shows which ingredients they have in stock, and connects your protocol's shopping list to the closest stores.\n\nYou'll never come home without the right ingredients again! 🌿`,
      options: [
        { label: 'Great! Start diagnosis', next: 'start' },
        { label: 'How do the reminders work?', next: 'reminders' },
      ],
    },
    reminders: {
      msg: () => `Personalized reminders keep you on track ⏰\n\nYou can set reminders for:\n• 🥤 "Time for your green smoothie"\n• 🛒 "Buy ingredients today"\n• 🎬 "New weekly video available"\n• 📊 "Log your progress"\n\nEvery reminder includes a motivational message from me with relevant nutrition facts. Like having a personal coach 24/7!`,
      options: [
        { label: 'Perfect, start now 🚀', next: 'start' },
        { label: 'What happens after 30 days?', next: 'exam' },
      ],
    },
    results: {
      msg: () => `Results are real and progressive 📈\n\n**Week 1-2:** More morning energy, better hydration\n**Week 3-4:** Better digestion, less inflammation\n**Month 2-3:** Visible changes in weight and skin tone\n**Month 3+:** Habits locked in, protocol optimized\n\nAt 30 days we do a **progress exam** where you measure your progress and can create a testimonial video to share. Many members see results from the first week!`,
      options: [
        { label: "I'm ready to start 🎯", next: 'start' },
        { label: "What's the 30-day exam?", next: 'exam' },
      ],
    },
    exam: {
      msg: () => `The progress exam is special ✨\n\nAt 30 days (or once you complete 20 actions), I'll invite you to:\n1. Answer progress questions (energy, sleep, digestion)\n2. Compare with your initial diagnosis\n3. Optionally upload lab results\n4. **Generate an AI testimonial video** you can share on social media\n\nIt's your moment to celebrate and inspire others. Testimonial videos go viral! 🎬`,
      options: [
        { label: "Amazing! Let's start 🚀", next: 'start' },
      ],
    },
    start: {
      msg: (name) => `Perfect, ${name}! 🌿 You're about to start your wellness journey.\n\nThe diagnosis takes 3 minutes and afterward your personalized protocol will be ready. Let's go!`,
      options: [],
      action: 'go_to_diagnosis',
    },
  },
  es: {
    welcome: {
      msg: (name) => `¡Hola ${name}! 🌿 Soy Dr. Smoothie AI, tu guía personal de bienestar en PureLife Wellness Club.\n\nEstoy aquí para acompañarte en tu transformación. ¿Por dónde quieres empezar?`,
      options: [
        { label: '¿Qué puedo hacer aquí?', next: 'features' },
        { label: '¿Cómo funciona el diagnóstico?', next: 'diagnosis' },
        { label: 'Quiero empezar ya 🚀', next: 'start' },
      ],
    },
    features: {
      msg: () => `PureLife tiene 5 módulos poderosos para ti:\n\n🧬 **Diagnóstico personalizado** — Analizo tus síntomas y objetivos\n🥤 **Recetas y protocolos** — Plan nutricional específico para ti\n📍 **Localizador de tiendas** — Ingredientes cerca de ti en tiempo real\n🎬 **PureLife TV** — Videos 4K con recetas cinematográficas\n🏆 **Sistema de progreso** — Seguimiento y alarmas personalizadas\n\n¿Cuál te interesa más?`,
      options: [
        { label: '🧬 El diagnóstico', next: 'diagnosis' },
        { label: '🎬 Los videos', next: 'videos' },
        { label: '📍 El localizador', next: 'locator' },
        { label: 'Comenzar diagnóstico', next: 'start' },
      ],
    },
    diagnosis: {
      msg: () => `El diagnóstico inicial toma 3 minutos ⏱️\n\nTe haré preguntas sobre:\n• Tu energía actual y calidad de sueño\n• Objetivos de salud (peso, digestión, inflamación, etc.)\n• Alergias e intolerancias\n• Tu rutina diaria\n\nCon esas respuestas creo un **protocolo 100% personalizado** de smoothies y jugos para ti. Los resultados los iremos ajustando cada semana.\n\n¿Estás listo para comenzar?`,
      options: [
        { label: '¡Sí, comenzar diagnóstico! 🎯', next: 'start' },
        { label: '¿Cuánto tiempo lleva ver resultados?', next: 'results' },
      ],
    },
    videos: {
      msg: () => `PureLife TV tiene contenido exclusivo 🎬\n\n• Videos 4K de recetas preparados con IA\n• Series semanales temáticas (detox, energía, anti-inflamatorio)\n• Avatar Dr. Smoothie como instructor\n• Nuevos videos cada semana\n\nSegún tu plan (Seed/Bloom/Canopy) tienes acceso a diferentes categorías. Los videos Canopy incluyen coaching 1:1 en video.\n\n¿Seguimos?`,
      options: [
        { label: 'Ver mis videos disponibles', next: 'start' },
        { label: 'Ver el localizador de tiendas', next: 'locator' },
      ],
    },
    locator: {
      msg: () => `El localizador usa tu ubicación GPS en tiempo real 📍\n\nBusca tiendas de productos naturales cerca de ti, muestra qué ingredientes tienen disponibles y conecta tu lista de compras del protocolo con las tiendas más cercanas.\n\n¡Nunca más llegarás a casa sin los ingredientes correctos! 🌿`,
      options: [
        { label: '¡Genial! Comenzar diagnóstico', next: 'start' },
        { label: '¿Cómo funcionan las alarmas?', next: 'reminders' },
      ],
    },
    reminders: {
      msg: () => `Las alarmas personalizadas te mantienen en ritmo ⏰\n\nPuedes configurar recordatorios para:\n• 🥤 "Hora de tu smoothie verde"\n• 🛒 "Comprar ingredientes hoy"\n• 🎬 "Nuevo video semanal disponible"\n• 📊 "Registrar tu progreso"\n\nCada alarma incluye un mensaje motivacional mío con datos nutricionales relevantes. ¡Como tener un coach personal 24/7!`,
      options: [
        { label: 'Perfecto, comenzar ahora 🚀', next: 'start' },
        { label: '¿Qué pasa a los 30 días?', next: 'exam' },
      ],
    },
    results: {
      msg: () => `Los resultados son progresivos y reales 📈\n\n**Semana 1-2:** Más energía matutina, mejor hidratación\n**Semana 3-4:** Mejora digestiva, menos inflamación\n**Mes 2-3:** Cambios visibles en peso y tono de piel\n**Mes 3+:** Hábitos consolidados, protocolo optimizado\n\nA los 30 días hacemos un **examen de progreso** donde mides tus avances y puedes crear un video testimonial para compartir. ¡Muchos miembros ven resultados desde la primera semana!`,
      options: [
        { label: 'Quiero empezar ya 🎯', next: 'start' },
        { label: '¿Qué es el examen de 30 días?', next: 'exam' },
      ],
    },
    exam: {
      msg: () => `El examen de progreso es especial ✨\n\nA los 30 días (o cuando completes 20 acciones), te invito a:\n1. Responder preguntas de progreso (energía, sueño, digestión)\n2. Comparar con tu diagnóstico inicial\n3. Opcionalmente subir análisis de laboratorio\n4. **Generar un video testimonial con IA** que puedes compartir en redes\n\nEs tu momento de celebrar y motivar a otros. ¡Los videos testimoniales son virales! 🎬`,
      options: [
        { label: '¡Increíble! Empecemos ya 🚀', next: 'start' },
      ],
    },
    start: {
      msg: (name) => `¡Perfecto ${name}! 🌿 Estás a punto de comenzar tu journey de bienestar.\n\nEl diagnóstico toma 3 minutos y después tendrás tu protocolo personalizado listo. ¡Vamos!`,
      options: [],
      action: 'go_to_diagnosis',
    },
  },
  fr: {
    welcome: {
      msg: (name) => `Bonjour ${name} ! 🌿 Je suis Dr. Smoothie AI, votre guide bien-être personnel chez PureLife Wellness Club.\n\nJe suis là pour vous accompagner dans votre transformation. Par où voulez-vous commencer ?`,
      options: [
        { label: 'Que puis-je faire ici ?', next: 'features' },
        { label: 'Comment fonctionne le diagnostic ?', next: 'diagnosis' },
        { label: 'Je veux commencer maintenant 🚀', next: 'start' },
      ],
    },
    features: {
      msg: () => `PureLife propose 5 modules puissants :\n\n🧬 **Diagnostic personnalisé** — J'analyse vos symptômes et objectifs\n🥤 **Recettes et protocoles** — Un plan nutritionnel rien que pour vous\n📍 **Localisateur de magasins** — Ingrédients près de chez vous en temps réel\n🎬 **PureLife TV** — Vidéos 4K avec recettes cinématographiques\n🏆 **Système de progression** — Suivi et rappels personnalisés\n\nLequel vous intéresse le plus ?`,
      options: [
        { label: '🧬 Le diagnostic', next: 'diagnosis' },
        { label: '🎬 Les vidéos', next: 'videos' },
        { label: '📍 Le localisateur', next: 'locator' },
        { label: 'Commencer le diagnostic', next: 'start' },
      ],
    },
    diagnosis: {
      msg: () => `Le diagnostic initial prend 3 minutes ⏱️\n\nJe vais vous poser des questions sur :\n• Votre énergie actuelle et la qualité de votre sommeil\n• Vos objectifs de santé (poids, digestion, inflammation, etc.)\n• Vos allergies et intolérances\n• Votre routine quotidienne\n\nAvec ces réponses, je crée un **protocole 100% personnalisé** de smoothies et jus pour vous. Nous ajusterons les résultats chaque semaine.\n\nPrêt à commencer ?`,
      options: [
        { label: 'Oui, commencer le diagnostic ! 🎯', next: 'start' },
        { label: 'Combien de temps avant de voir des résultats ?', next: 'results' },
      ],
    },
    videos: {
      msg: () => `PureLife TV propose du contenu exclusif 🎬\n\n• Vidéos de recettes en 4K créées avec l'IA\n• Séries thématiques hebdomadaires (détox, énergie, anti-inflammatoire)\n• Avatar Dr. Smoothie comme instructeur\n• Nouvelles vidéos chaque semaine\n\nSelon votre plan (Seed/Bloom/Canopy), vous accédez à différentes catégories. Les vidéos Canopy incluent du coaching vidéo 1:1.\n\nOn continue ?`,
      options: [
        { label: 'Voir mes vidéos disponibles', next: 'start' },
        { label: 'Voir le localisateur de magasins', next: 'locator' },
      ],
    },
    locator: {
      msg: () => `Le localisateur utilise votre position GPS en temps réel 📍\n\nIl trouve les magasins de produits naturels près de vous, indique les ingrédients disponibles et relie votre liste de courses du protocole aux magasins les plus proches.\n\nVous ne rentrerez plus jamais chez vous sans les bons ingrédients ! 🌿`,
      options: [
        { label: 'Super ! Commencer le diagnostic', next: 'start' },
        { label: 'Comment fonctionnent les rappels ?', next: 'reminders' },
      ],
    },
    reminders: {
      msg: () => `Les rappels personnalisés vous gardent sur la bonne voie ⏰\n\nVous pouvez configurer des rappels pour :\n• 🥤 « L'heure de votre smoothie vert »\n• 🛒 « Acheter des ingrédients aujourd'hui »\n• 🎬 « Nouvelle vidéo hebdomadaire disponible »\n• 📊 « Enregistrer vos progrès »\n\nChaque rappel inclut un message motivant de ma part avec des infos nutritionnelles pertinentes. Comme avoir un coach personnel 24/7 !`,
      options: [
        { label: 'Parfait, commencer maintenant 🚀', next: 'start' },
        { label: 'Que se passe-t-il après 30 jours ?', next: 'exam' },
      ],
    },
    results: {
      msg: () => `Les résultats sont progressifs et réels 📈\n\n**Semaine 1-2 :** Plus d'énergie le matin, meilleure hydratation\n**Semaine 3-4 :** Meilleure digestion, moins d'inflammation\n**Mois 2-3 :** Changements visibles au niveau du poids et du teint\n**Mois 3+ :** Habitudes ancrées, protocole optimisé\n\nÀ 30 jours, nous faisons un **bilan de progression** où vous mesurez vos avancées et pouvez créer une vidéo témoignage à partager. Beaucoup de membres voient des résultats dès la première semaine !`,
      options: [
        { label: 'Je veux commencer maintenant 🎯', next: 'start' },
        { label: "Qu'est-ce que le bilan à 30 jours ?", next: 'exam' },
      ],
    },
    exam: {
      msg: () => `Le bilan de progression est spécial ✨\n\nÀ 30 jours (ou après 20 actions complétées), je vous invite à :\n1. Répondre à des questions de progression (énergie, sommeil, digestion)\n2. Comparer avec votre diagnostic initial\n3. Téléverser (en option) des analyses de laboratoire\n4. **Générer une vidéo témoignage avec l'IA** à partager sur les réseaux\n\nC'est votre moment pour célébrer et inspirer les autres. Les vidéos témoignages deviennent virales ! 🎬`,
      options: [
        { label: 'Incroyable ! Commençons 🚀', next: 'start' },
      ],
    },
    start: {
      msg: (name) => `Parfait, ${name} ! 🌿 Vous êtes sur le point de commencer votre parcours bien-être.\n\nLe diagnostic prend 3 minutes et votre protocole personnalisé sera ensuite prêt. C'est parti !`,
      options: [],
      action: 'go_to_diagnosis',
    },
  },
  pt: {
    welcome: {
      msg: (name) => `Olá ${name}! 🌿 Sou o Dr. Smoothie AI, seu guia pessoal de bem-estar na PureLife Wellness Club.\n\nEstou aqui para acompanhar você na sua transformação. Por onde você quer começar?`,
      options: [
        { label: 'O que posso fazer aqui?', next: 'features' },
        { label: 'Como funciona o diagnóstico?', next: 'diagnosis' },
        { label: 'Quero começar agora 🚀', next: 'start' },
      ],
    },
    features: {
      msg: () => `A PureLife tem 5 módulos poderosos para você:\n\n🧬 **Diagnóstico personalizado** — Analiso seus sintomas e objetivos\n🥤 **Receitas e protocolos** — Plano nutricional feito para você\n📍 **Localizador de lojas** — Ingredientes perto de você em tempo real\n🎬 **PureLife TV** — Vídeos 4K com receitas cinematográficas\n🏆 **Sistema de progresso** — Acompanhamento e lembretes personalizados\n\nQual te interessa mais?`,
      options: [
        { label: '🧬 O diagnóstico', next: 'diagnosis' },
        { label: '🎬 Os vídeos', next: 'videos' },
        { label: '📍 O localizador', next: 'locator' },
        { label: 'Começar diagnóstico', next: 'start' },
      ],
    },
    diagnosis: {
      msg: () => `O diagnóstico inicial leva 3 minutos ⏱️\n\nVou te perguntar sobre:\n• Sua energia atual e qualidade do sono\n• Objetivos de saúde (peso, digestão, inflamação, etc.)\n• Alergias e intolerâncias\n• Sua rotina diária\n\nCom essas respostas, crio um **protocolo 100% personalizado** de smoothies e sucos para você. Vamos ajustando os resultados a cada semana.\n\nPronto para começar?`,
      options: [
        { label: 'Sim, começar diagnóstico! 🎯', next: 'start' },
        { label: 'Quanto tempo leva para ver resultados?', next: 'results' },
      ],
    },
    videos: {
      msg: () => `A PureLife TV tem conteúdo exclusivo 🎬\n\n• Vídeos 4K de receitas feitos com IA\n• Séries semanais temáticas (detox, energia, anti-inflamatório)\n• Avatar Dr. Smoothie como instrutor\n• Novos vídeos toda semana\n\nDependendo do seu plano (Seed/Bloom/Canopy) você tem acesso a diferentes categorias. Os vídeos Canopy incluem coaching 1:1 em vídeo.\n\nContinuamos?`,
      options: [
        { label: 'Ver meus vídeos disponíveis', next: 'start' },
        { label: 'Ver o localizador de lojas', next: 'locator' },
      ],
    },
    locator: {
      msg: () => `O localizador usa sua localização GPS em tempo real 📍\n\nEle busca lojas de produtos naturais perto de você, mostra quais ingredientes têm disponíveis e conecta sua lista de compras do protocolo às lojas mais próximas.\n\nVocê nunca mais vai chegar em casa sem os ingredientes certos! 🌿`,
      options: [
        { label: 'Ótimo! Começar diagnóstico', next: 'start' },
        { label: 'Como funcionam os lembretes?', next: 'reminders' },
      ],
    },
    reminders: {
      msg: () => `Os lembretes personalizados mantêm você no ritmo ⏰\n\nVocê pode configurar lembretes para:\n• 🥤 "Hora do seu smoothie verde"\n• 🛒 "Comprar ingredientes hoje"\n• 🎬 "Novo vídeo semanal disponível"\n• 📊 "Registrar seu progresso"\n\nCada lembrete inclui uma mensagem motivacional minha com dados nutricionais relevantes. Como ter um coach pessoal 24/7!`,
      options: [
        { label: 'Perfeito, começar agora 🚀', next: 'start' },
        { label: 'O que acontece depois de 30 dias?', next: 'exam' },
      ],
    },
    results: {
      msg: () => `Os resultados são progressivos e reais 📈\n\n**Semana 1-2:** Mais energia pela manhã, melhor hidratação\n**Semana 3-4:** Melhora digestiva, menos inflamação\n**Mês 2-3:** Mudanças visíveis no peso e no tom de pele\n**Mês 3+:** Hábitos consolidados, protocolo otimizado\n\nAos 30 dias fazemos um **exame de progresso** onde você mede seus avanços e pode criar um vídeo depoimento para compartilhar. Muitos membros veem resultados já na primeira semana!`,
      options: [
        { label: 'Quero começar agora 🎯', next: 'start' },
        { label: 'O que é o exame de 30 dias?', next: 'exam' },
      ],
    },
    exam: {
      msg: () => `O exame de progresso é especial ✨\n\nAos 30 dias (ou ao completar 20 ações), convido você a:\n1. Responder perguntas de progresso (energia, sono, digestão)\n2. Comparar com seu diagnóstico inicial\n3. Opcionalmente enviar exames laboratoriais\n4. **Gerar um vídeo depoimento com IA** que pode compartilhar nas redes\n\nÉ o seu momento de celebrar e motivar outras pessoas. Os vídeos depoimento viralizam! 🎬`,
      options: [
        { label: 'Incrível! Vamos começar 🚀', next: 'start' },
      ],
    },
    start: {
      msg: (name) => `Perfeito, ${name}! 🌿 Você está prestes a começar sua jornada de bem-estar.\n\nO diagnóstico leva 3 minutos e depois seu protocolo personalizado estará pronto. Vamos lá!`,
      options: [],
      action: 'go_to_diagnosis',
    },
  },
  it: {
    welcome: {
      msg: (name) => `Ciao ${name}! 🌿 Sono Dr. Smoothie AI, la tua guida personale al benessere in PureLife Wellness Club.\n\nSono qui per accompagnarti nella tua trasformazione. Da dove vuoi iniziare?`,
      options: [
        { label: 'Cosa posso fare qui?', next: 'features' },
        { label: 'Come funziona la diagnosi?', next: 'diagnosis' },
        { label: 'Voglio iniziare subito 🚀', next: 'start' },
      ],
    },
    features: {
      msg: () => `PureLife ha 5 moduli potenti per te:\n\n🧬 **Diagnosi personalizzata** — Analizzo i tuoi sintomi e obiettivi\n🥤 **Ricette e protocolli** — Piano nutrizionale su misura per te\n📍 **Localizzatore negozi** — Ingredienti vicino a te in tempo reale\n🎬 **PureLife TV** — Video 4K con ricette cinematografiche\n🏆 **Sistema di progresso** — Monitoraggio e promemoria personalizzati\n\nQuale ti interessa di più?`,
      options: [
        { label: '🧬 La diagnosi', next: 'diagnosis' },
        { label: '🎬 I video', next: 'videos' },
        { label: '📍 Il localizzatore', next: 'locator' },
        { label: 'Inizia diagnosi', next: 'start' },
      ],
    },
    diagnosis: {
      msg: () => `La diagnosi iniziale richiede 3 minuti ⏱️\n\nTi farò domande su:\n• La tua energia attuale e qualità del sonno\n• Obiettivi di salute (peso, digestione, infiammazione, ecc.)\n• Allergie e intolleranze\n• La tua routine quotidiana\n\nCon queste risposte creo un **protocollo 100% personalizzato** di smoothie e succhi per te. Aggiusteremo i risultati ogni settimana.\n\nPronto per iniziare?`,
      options: [
        { label: 'Sì, inizia diagnosi! 🎯', next: 'start' },
        { label: 'Quanto tempo ci vuole per vedere risultati?', next: 'results' },
      ],
    },
    videos: {
      msg: () => `PureLife TV ha contenuti esclusivi 🎬\n\n• Video 4K di ricette create con l'IA\n• Serie settimanali a tema (detox, energia, anti-infiammatorio)\n• Avatar Dr. Smoothie come istruttore\n• Nuovi video ogni settimana\n\nA seconda del tuo piano (Seed/Bloom/Canopy) hai accesso a diverse categorie. I video Canopy includono coaching video 1:1.\n\nContinuiamo?`,
      options: [
        { label: 'Vedi i miei video disponibili', next: 'start' },
        { label: 'Vedi il localizzatore negozi', next: 'locator' },
      ],
    },
    locator: {
      msg: () => `Il localizzatore usa la tua posizione GPS in tempo reale 📍\n\nCerca negozi di prodotti naturali vicino a te, mostra quali ingredienti hanno disponibili e collega la tua lista della spesa del protocollo ai negozi più vicini.\n\nNon tornerai mai più a casa senza gli ingredienti giusti! 🌿`,
      options: [
        { label: 'Fantastico! Inizia diagnosi', next: 'start' },
        { label: 'Come funzionano i promemoria?', next: 'reminders' },
      ],
    },
    reminders: {
      msg: () => `I promemoria personalizzati ti mantengono in ritmo ⏰\n\nPuoi impostare promemoria per:\n• 🥤 "Ora del tuo smoothie verde"\n• 🛒 "Compra ingredienti oggi"\n• 🎬 "Nuovo video settimanale disponibile"\n• 📊 "Registra i tuoi progressi"\n\nOgni promemoria include un messaggio motivazionale da parte mia con dati nutrizionali rilevanti. Come avere un coach personale 24/7!`,
      options: [
        { label: 'Perfetto, inizia ora 🚀', next: 'start' },
        { label: 'Cosa succede dopo 30 giorni?', next: 'exam' },
      ],
    },
    results: {
      msg: () => `I risultati sono progressivi e reali 📈\n\n**Settimana 1-2:** Più energia al mattino, migliore idratazione\n**Settimana 3-4:** Digestione migliore, meno infiammazione\n**Mese 2-3:** Cambiamenti visibili in peso e tono della pelle\n**Mese 3+:** Abitudini consolidate, protocollo ottimizzato\n\nA 30 giorni facciamo un **esame di progresso** dove misuri i tuoi avanzamenti e puoi creare un video testimonianza da condividere. Molti membri vedono risultati già dalla prima settimana!`,
      options: [
        { label: 'Voglio iniziare subito 🎯', next: 'start' },
        { label: "Cos'è l'esame dei 30 giorni?", next: 'exam' },
      ],
    },
    exam: {
      msg: () => `L'esame di progresso è speciale ✨\n\nA 30 giorni (o completando 20 azioni), ti invito a:\n1. Rispondere a domande di progresso (energia, sonno, digestione)\n2. Confrontare con la tua diagnosi iniziale\n3. Facoltativamente caricare analisi di laboratorio\n4. **Generare un video testimonianza con IA** da condividere sui social\n\nÈ il tuo momento per festeggiare e motivare gli altri. I video testimonianza diventano virali! 🎬`,
      options: [
        { label: 'Incredibile! Iniziamo 🚀', next: 'start' },
      ],
    },
    start: {
      msg: (name) => `Perfetto, ${name}! 🌿 Stai per iniziare il tuo percorso di benessere.\n\nLa diagnosi richiede 3 minuti e poi il tuo protocollo personalizzato sarà pronto. Andiamo!`,
      options: [],
      action: 'go_to_diagnosis',
    },
  },
};

export const FALLBACK_REPLIES_I18N = {
  en: [
    "I understand your question. The most important thing now is completing your diagnosis so I can give you personalized recommendations. Shall we continue?",
    "Great point. Based on what you're telling me, the initial diagnosis will help us define your exact protocol. Shall we begin?",
    "That's very important for your health. Once you complete the diagnosis, we can work specifically on that. Shall we continue?",
  ],
  es: [
    'Entiendo tu pregunta. Lo más importante ahora es completar tu diagnóstico para que pueda darte recomendaciones personalizadas. ¿Seguimos?',
    'Excelente punto. Basado en lo que me dices, el diagnóstico inicial nos ayudará a definir exactamente tu protocolo. ¿Empezamos?',
    'Eso es muy importante para tu salud. Una vez completes el diagnóstico, podremos trabajar específicamente en eso. ¿Continuamos?',
  ],
  fr: [
    "Je comprends votre question. Le plus important maintenant est de terminer votre diagnostic pour que je puisse vous donner des recommandations personnalisées. On continue ?",
    "Excellente remarque. D'après ce que vous me dites, le diagnostic initial nous aidera à définir précisément votre protocole. On commence ?",
    "C'est très important pour votre santé. Une fois le diagnostic terminé, nous pourrons travailler spécifiquement là-dessus. On continue ?",
  ],
  pt: [
    'Entendo sua pergunta. O mais importante agora é completar seu diagnóstico para que eu possa te dar recomendações personalizadas. Continuamos?',
    'Ótimo ponto. Com base no que você me diz, o diagnóstico inicial vai nos ajudar a definir exatamente o seu protocolo. Vamos começar?',
    'Isso é muito importante para sua saúde. Assim que você completar o diagnóstico, poderemos trabalhar especificamente nisso. Continuamos?',
  ],
  it: [
    'Capisco la tua domanda. La cosa più importante ora è completare la tua diagnosi così posso darti raccomandazioni personalizzate. Continuiamo?',
    'Ottimo punto. In base a quello che mi dici, la diagnosi iniziale ci aiuterà a definire esattamente il tuo protocollo. Iniziamo?',
    'È molto importante per la tua salute. Una volta completata la diagnosi, potremo lavorare specificamente su questo. Continuiamo?',
  ],
};

export const UI_I18N = {
  en: {
    welcomeBadge: 'Welcome guide · PureLife', step: 'Step 1 of 2', doneTitle: 'Ready to start!',
    doneSubtitle: "You've completed the tour. Now let's go to your personalized diagnosis. It only takes 3 minutes.",
    doneBtn: 'Start diagnosis 🎯', anotherQuestion: 'Have another question? Type it here →',
    inputPlaceholder: 'Type your question...', onboardingApiPrefix: 'User asks (respond briefly, max 3 lines, and guide them to complete the initial diagnosis):',
  },
  es: {
    welcomeBadge: 'Guía de bienvenida · PureLife', step: 'Paso 1 de 2', doneTitle: '¡Listo para empezar!',
    doneSubtitle: 'Completaste el tour. Ahora vamos a tu diagnóstico personalizado. Solo toma 3 minutos.',
    doneBtn: 'Iniciar diagnóstico 🎯', anotherQuestion: '¿Tienes otra pregunta? Escríbela aquí →',
    inputPlaceholder: 'Escribe tu pregunta...', onboardingApiPrefix: 'Usuario pregunta (responde brevemente, máx 3 líneas, y guíalo a completar el diagnóstico inicial):',
  },
  fr: {
    welcomeBadge: 'Guide de bienvenue · PureLife', step: 'Étape 1 sur 2', doneTitle: 'Prêt à commencer !',
    doneSubtitle: 'Vous avez terminé la visite. Passons maintenant à votre diagnostic personnalisé. Cela ne prend que 3 minutes.',
    doneBtn: 'Commencer le diagnostic 🎯', anotherQuestion: 'Une autre question ? Écrivez-la ici →',
    inputPlaceholder: 'Écrivez votre question...', onboardingApiPrefix: "L'utilisateur demande (répondez brièvement, max 3 lignes, et guidez-le pour compléter le diagnostic initial) :",
  },
  pt: {
    welcomeBadge: 'Guia de boas-vindas · PureLife', step: 'Etapa 1 de 2', doneTitle: 'Pronto para começar!',
    doneSubtitle: 'Você completou o tour. Agora vamos ao seu diagnóstico personalizado. Leva apenas 3 minutos.',
    doneBtn: 'Iniciar diagnóstico 🎯', anotherQuestion: 'Tem outra pergunta? Escreva aqui →',
    inputPlaceholder: 'Digite sua pergunta...', onboardingApiPrefix: 'Usuário pergunta (responda brevemente, máx 3 linhas, e guie-o para completar o diagnóstico inicial):',
  },
  it: {
    welcomeBadge: 'Guida di benvenuto · PureLife', step: 'Passo 1 di 2', doneTitle: 'Pronto per iniziare!',
    doneSubtitle: 'Hai completato il tour. Ora andiamo alla tua diagnosi personalizzata. Richiede solo 3 minuti.',
    doneBtn: 'Inizia diagnosi 🎯', anotherQuestion: "Hai un'altra domanda? Scrivila qui →",
    inputPlaceholder: 'Scrivi la tua domanda...', onboardingApiPrefix: "L'utente chiede (rispondi brevemente, max 3 righe, e guidalo a completare la diagnosi iniziale):",
  },
};
