// ═══════════════════════════════════════════════════════════
// PureLife — Coming Soon Page v4.1
// Multilenguaje via props (lang + onLangChange)
// Founding Members Counter + Globe Selector
// src/comingsoonpage.jsx
// ═══════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { LANGUAGES } from "./i18n";
import WellnessDiagnostic from "./components/WellnessDiagnostic";

const COLORS = {
  dark:   "#060D08",
  green:  "#1A5C3A",
  gold:   "#C9973A",
  goldL:  "#E8B84B",
  cream:  "#F5F0E8",
  muted:  "rgba(245,240,232,0.55)",
  dim:    "rgba(245,240,232,0.2)",
  borderGold: "rgba(201,151,58,0.35)",
};

const MOTION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;1,300&family=DM+Sans:wght@400;500;600;700&display=swap');
  @media (prefers-reduced-motion: reduce) {
    .pl-enter, .pl-float, .pl-pulse, .pl-bar-fill { animation: none !important; }
    .pl-btn { transition: none !important; }
  }
  @keyframes pl-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pl-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes pl-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26,92,58,0); }
    50%       { box-shadow: 0 0 0 10px rgba(26,92,58,0.2); }
  }
  @keyframes pl-bar {
    from { width: 0%; }
    to   { width: var(--bar-w); }
  }
  @keyframes pl-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pl-globe-float {
    0%   { transform: translateY(0px) rotate(0deg); }
    25%  { transform: translateY(-4px) rotate(3deg); }
    50%  { transform: translateY(-7px) rotate(0deg); }
    75%  { transform: translateY(-3px) rotate(-3deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes pl-globe-glow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(201,151,58,0.3)); }
    50%       { filter: drop-shadow(0 0 10px rgba(201,151,58,0.7)); }
  }
  @keyframes pl-globe-spin {
    from { transform: translateY(-4px) rotate(0deg); }
    to   { transform: translateY(-4px) rotate(360deg); }
  }
  .pl-globe-idle {
    display: inline-block;
    animation: pl-globe-float 4s ease-in-out infinite,
               pl-globe-glow 3s ease-in-out infinite;
    transform-origin: center;
    cursor: pointer;
    transition: filter 0.2s ease;
  }
  .pl-globe-spinning {
    display: inline-block;
    animation: pl-globe-spin 0.7s cubic-bezier(0.34,1.56,0.64,1),
               pl-globe-glow 3s ease-in-out infinite;
    transform-origin: center;
    cursor: pointer;
  }
  .pl-enter { animation: pl-fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
  .pl-d1 { animation-delay: 80ms; }
  .pl-d2 { animation-delay: 160ms; }
  .pl-d3 { animation-delay: 240ms; }
  .pl-d4 { animation-delay: 320ms; }
  .pl-d5 { animation-delay: 400ms; }
  .pl-float { animation: pl-float 3.2s ease-in-out infinite; }
  .pl-pulse { animation: pl-pulse 2s ease infinite; }
  .pl-bar-fill { animation: pl-bar 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.5s both; }
  .pl-btn {
    transition: transform 180ms cubic-bezier(0.34,1.56,0.64,1), opacity 180ms ease;
  }
  .pl-btn:hover  { transform: translateY(-1px); }
  .pl-btn:active { transform: scale(0.96); }
  .pl-input { transition: border-color 150ms ease, box-shadow 150ms ease; }
  .pl-input:focus {
    border-color: rgba(201,151,58,0.75) !important;
    box-shadow: 0 0 0 3px rgba(201,151,58,0.2);
    outline: none;
  }
  .pl-counter-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(201,151,58,0.15) 50%, transparent 100%);
    background-size: 400px 100%;
    animation: pl-shimmer 2.5s ease infinite;
  }
  .pl-lang-btn:hover { background: rgba(255,255,255,0.06) !important; }
`;

// Todas las traducciones inline — sin dependencia externa
const CS = {
  en: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Your body responds",
    h2: "to what you give it.",
    sub: "Visible results in 21 days — or your money back.",
    founding: "Founding Members",
    counterLabel: (n) => `${n} / 100 spots taken`,
    slotsNormal: (n) => `First 100 members join FREE. ${n} spots remaining.`,
    spotsUrgent: (n) => `⚡ Only ${n} free spots left. Then $182/year.`,
    slotsFull: "🔴 Free spots are full",
    slotsFullMsg: "The 100 free spots are gone. Join the annual plan for $182/year.",
    placeholder: "your@email.com",
    ctaFree: "Claim my free spot →",
    ctaPaid: "Join for $182/year →",
    loading: "Saving your spot...",
    proofFree: "Free for first 100 · No card · No spam",
    proofPaid: "Annual plan · Cancel anytime",
    successTitle: (n) => `You're Founding Member #${n}!`,
    successMsg: (n) => `Free access confirmed. ${n} spots remaining.`,
    errorEmail: "Enter a valid email to continue.",
    errorGeneric: "Something went wrong. Try again.",
    memberBtn: "Already a member? Enter →",
    langLabel: "Language",
  },
  es: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Tu cuerpo responde",
    h2: "a lo que le das.",
    sub: "Resultados visibles en 21 días — o te devolvemos tu dinero.",
    founding: "Founding Members",
    counterLabel: (n) => `${n} / 100 cupos tomados`,
    slotsNormal: (n) => `Los primeros 100 entran GRATIS. Quedan ${n} cupos.`,
    spotsUrgent: (n) => `⚡ Solo quedan ${n} cupos gratuitos. Después $182/año.`,
    slotsFull: "🔴 Cupos cerrados",
    slotsFullMsg: "Los 100 cupos gratuitos se agotaron. Únete por $182/año.",
    placeholder: "tu@email.com",
    ctaFree: "Quiero mi lugar gratuito →",
    ctaPaid: "Unirme por $182/año →",
    loading: "Reservando tu lugar...",
    proofFree: "Gratis para los primeros 100 · Sin tarjeta · Sin spam",
    proofPaid: "Plan anual · Cancela cuando quieras",
    successTitle: (n) => `¡Eres el Founding Member #${n}!`,
    successMsg: (n) => `Acceso gratuito confirmado. Quedan ${n} cupos.`,
    errorEmail: "Ingresa un email válido para continuar.",
    errorGeneric: "Algo salió mal. Intenta de nuevo.",
    memberBtn: "Ya soy miembro → Entrar",
    langLabel: "Idioma",
  },
  fr: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Votre corps répond",
    h2: "à ce que vous lui donnez.",
    sub: "Résultats visibles en 21 jours — ou remboursé.",
    founding: "Membres Fondateurs",
    counterLabel: (n) => `${n} / 100 places prises`,
    slotsNormal: (n) => `Les 100 premiers entrent GRATUITEMENT. ${n} places restantes.`,
    spotsUrgent: (n) => `⚡ Seulement ${n} places gratuites. Puis $182/an.`,
    slotsFull: "🔴 Places épuisées",
    slotsFullMsg: "Les 100 places gratuites sont épuisées. Rejoignez pour $182/an.",
    placeholder: "votre@email.com",
    ctaFree: "Réclamer ma place gratuite →",
    ctaPaid: "Rejoindre pour $182/an →",
    loading: "Réservation en cours...",
    proofFree: "Gratuit pour les 100 premiers · Sans carte",
    proofPaid: "Plan annuel · Annulez quand vous voulez",
    successTitle: (n) => `Vous êtes le Membre Fondateur #${n} !`,
    successMsg: (n) => `Accès gratuit confirmé. ${n} places restantes.`,
    errorEmail: "Entrez un email valide.",
    errorGeneric: "Quelque chose s'est mal passé.",
    memberBtn: "Déjà membre ? Entrer →",
    langLabel: "Langue",
  },
  pt: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Seu corpo responde",
    h2: "ao que você oferece.",
    sub: "Resultados visíveis em 21 dias — ou seu dinheiro de volta.",
    founding: "Membros Fundadores",
    counterLabel: (n) => `${n} / 100 vagas ocupadas`,
    slotsNormal: (n) => `Os primeiros 100 entram DE GRAÇA. ${n} vagas restantes.`,
    spotsUrgent: (n) => `⚡ Apenas ${n} vagas gratuitas. Depois $182/ano.`,
    slotsFull: "🔴 Vagas esgotadas",
    slotsFullMsg: "As 100 vagas gratuitas acabaram. Junte-se por $182/ano.",
    placeholder: "seu@email.com",
    ctaFree: "Quero minha vaga gratuita →",
    ctaPaid: "Entrar por $182/ano →",
    loading: "Reservando sua vaga...",
    proofFree: "Gratuito para os primeiros 100 · Sem cartão",
    proofPaid: "Plano anual · Cancele quando quiser",
    successTitle: (n) => `Você é o Membro Fundador #${n}!`,
    successMsg: (n) => `Acesso gratuito confirmado. ${n} vagas restantes.`,
    errorEmail: "Digite um email válido.",
    errorGeneric: "Algo deu errado. Tente novamente.",
    memberBtn: "Já sou membro? Entrar →",
    langLabel: "Idioma",
  },
  de: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Ihr Körper reagiert",
    h2: "auf das, was Sie ihm geben.",
    sub: "Sichtbare Ergebnisse in 21 Tagen — oder Geld zurück.",
    founding: "Gründungsmitglieder",
    counterLabel: (n) => `${n} / 100 Plätze belegt`,
    slotsNormal: (n) => `Die ersten 100 Mitglieder kommen GRATIS. ${n} Plätze frei.`,
    spotsUrgent: (n) => `⚡ Nur noch ${n} kostenlose Plätze. Dann $182/Jahr.`,
    slotsFull: "🔴 Kostenlose Plätze voll",
    slotsFullMsg: "Die 100 kostenlosen Plätze sind vergeben. Beitreten für $182/Jahr.",
    placeholder: "ihre@email.com",
    ctaFree: "Meinen kostenlosen Platz sichern →",
    ctaPaid: "Beitreten für $182/Jahr →",
    loading: "Platz wird gesichert...",
    proofFree: "Kostenlos für die ersten 100 · Keine Karte",
    proofPaid: "Jahresplan · Jederzeit kündbar",
    successTitle: (n) => `Sie sind Gründungsmitglied #${n}!`,
    successMsg: (n) => `Kostenloser Zugang bestätigt. ${n} Plätze verbleibend.`,
    errorEmail: "Gültige E-Mail eingeben.",
    errorGeneric: "Etwas ist schiefgelaufen.",
    memberBtn: "Bereits Mitglied? Eintreten →",
    langLabel: "Sprache",
  },
  it: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Il tuo corpo risponde",
    h2: "a ciò che gli dai.",
    sub: "Risultati visibili in 21 giorni — o rimborso garantito.",
    founding: "Membri Fondatori",
    counterLabel: (n) => `${n} / 100 posti occupati`,
    slotsNormal: (n) => `I primi 100 entrano GRATIS. ${n} posti rimanenti.`,
    spotsUrgent: (n) => `⚡ Solo ${n} posti gratuiti rimasti. Poi $182/anno.`,
    slotsFull: "🔴 Posti esauriti",
    slotsFullMsg: "I 100 posti gratuiti sono esauriti. Unisciti per $182/anno.",
    placeholder: "tua@email.com",
    ctaFree: "Reclama il mio posto gratuito →",
    ctaPaid: "Unisciti per $182/anno →",
    loading: "Prenotazione in corso...",
    proofFree: "Gratuito per i primi 100 · Nessuna carta",
    proofPaid: "Piano annuale · Disdici quando vuoi",
    successTitle: (n) => `Sei il Membro Fondatore #${n}!`,
    successMsg: (n) => `Accesso gratuito confermato. ${n} posti rimasti.`,
    errorEmail: "Inserisci un'email valida.",
    errorGeneric: "Qualcosa è andato storto.",
    memberBtn: "Già membro? Entra →",
    langLabel: "Lingua",
  },
  ko: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "당신의 몸은 반응합니다",
    h2: "당신이 주는 것에.",
    sub: "21일 내 눈에 띄는 결과 — 아니면 환불 보장.",
    founding: "창립 멤버",
    counterLabel: (n) => `${n} / 100 자리 사용됨`,
    slotsNormal: (n) => `처음 100명은 무료입니다. ${n}자리 남음.`,
    spotsUrgent: (n) => `⚡ 무료 자리 ${n}개만 남았습니다. 이후 $182/년.`,
    slotsFull: "🔴 무료 자리 마감",
    slotsFullMsg: "100개 무료 자리가 마감되었습니다. $182/년으로 참여하세요.",
    placeholder: "이메일@주소.com",
    ctaFree: "내 무료 자리 확보 →",
    ctaPaid: "$182/년으로 참여 →",
    loading: "자리 예약 중...",
    proofFree: "처음 100명 무료 · 카드 불필요",
    proofPaid: "연간 플랜 · 언제든지 취소",
    successTitle: (n) => `창립 멤버 #${n}이 되셨습니다!`,
    successMsg: (n) => `무료 접근이 확인되었습니다. ${n}자리 남음.`,
    errorEmail: "유효한 이메일을 입력하세요.",
    errorGeneric: "문제가 발생했습니다. 다시 시도하세요.",
    memberBtn: "이미 회원이신가요? 입장 →",
    langLabel: "언어",
  },
  ja: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "あなたの体は反応します",
    h2: "あなたが与えるものに。",
    sub: "21日で見える結果 — または全額返金。",
    founding: "創立メンバー",
    counterLabel: (n) => `${n} / 100 席が埋まっています`,
    slotsNormal: (n) => `最初の100名は無料。残り${n}席。`,
    spotsUrgent: (n) => `⚡ 無料席残り${n}。その後$182/年。`,
    slotsFull: "🔴 無料席終了",
    slotsFullMsg: "100席の無料枠が終了しました。$182/年でご参加ください。",
    placeholder: "メール@アドレス.com",
    ctaFree: "無料席を確保する →",
    ctaPaid: "$182/年で参加 →",
    loading: "席を確保中...",
    proofFree: "最初の100名は無料 · カード不要",
    proofPaid: "年間プラン · いつでもキャンセル可",
    successTitle: (n) => `創立メンバー#${n}です！`,
    successMsg: (n) => `無料アクセスが確認されました。残り${n}席。`,
    errorEmail: "有効なメールを入力してください。",
    errorGeneric: "問題が発生しました。もう一度お試しください。",
    memberBtn: "既にメンバー？入場 →",
    langLabel: "言語",
  },
  zh: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "您的身体会做出反应",
    h2: "对您给予它的东西。",
    sub: "21天看到效果 — 否则全额退款。",
    founding: "创始会员",
    counterLabel: (n) => `${n} / 100 个名额已占用`,
    slotsNormal: (n) => `前100名成员免费加入。剩余${n}个名额。`,
    spotsUrgent: (n) => `⚡ 仅剩${n}个免费名额。之后$182/年。`,
    slotsFull: "🔴 免费名额已满",
    slotsFullMsg: "100个免费名额已用完。以$182/年加入。",
    placeholder: "您的@邮箱.com",
    ctaFree: "抢占我的免费名额 →",
    ctaPaid: "以$182/年加入 →",
    loading: "正在保存您的名额...",
    proofFree: "前100名免费 · 无需信用卡",
    proofPaid: "年度计划 · 随时取消",
    successTitle: (n) => `您是第${n}位创始会员！`,
    successMsg: (n) => `免费访问已确认。剩余${n}个名额。`,
    errorEmail: "请输入有效的电子邮件。",
    errorGeneric: "出了点问题。请重试。",
    memberBtn: "已是会员？进入 →",
    langLabel: "语言",
  },
  ar: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "جسمك يستجيب",
    h2: "لما تعطيه إياه.",
    sub: "نتائج مرئية في 21 يومًا — أو استرداد أموالك.",
    founding: "الأعضاء المؤسسون",
    counterLabel: (n) => `${n} / 100 مقعد مشغول`,
    slotsNormal: (n) => `أول 100 عضو يدخلون مجانًا. ${n} مقعد متبقي.`,
    spotsUrgent: (n) => `⚡ ${n} مقاعد مجانية فقط. ثم $182/سنة.`,
    slotsFull: "🔴 المقاعد المجانية ممتلئة",
    slotsFullMsg: "100 مقعد مجاني نفدت. انضم بـ$182/سنة.",
    placeholder: "بريدك@الإلكتروني.com",
    ctaFree: "احجز مقعدي المجاني →",
    ctaPaid: "انضم بـ$182/سنة →",
    loading: "جارٍ حجز مقعدك...",
    proofFree: "مجاني لأول 100 · بدون بطاقة",
    proofPaid: "خطة سنوية · إلغاء في أي وقت",
    successTitle: (n) => `أنت العضو المؤسس #${n}!`,
    successMsg: (n) => `تم تأكيد الوصول المجاني. ${n} مقعد متبقي.`,
    errorEmail: "أدخل بريداً إلكترونياً صحيحاً.",
    errorGeneric: "حدث خطأ ما. حاول مرة أخرى.",
    memberBtn: "عضو بالفعل؟ ادخل →",
    langLabel: "اللغة",
  },
  ru: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Ваше тело реагирует",
    h2: "на то, что вы ему даёте.",
    sub: "Видимые результаты за 21 день — или возврат денег.",
    founding: "Члены-основатели",
    counterLabel: (n) => `${n} / 100 мест занято`,
    slotsNormal: (n) => `Первые 100 участников входят БЕСПЛАТНО. Осталось ${n} мест.`,
    spotsUrgent: (n) => `⚡ Только ${n} бесплатных мест. Затем $182/год.`,
    slotsFull: "🔴 Бесплатные места закончились",
    slotsFullMsg: "100 бесплатных мест заняты. Присоединяйтесь за $182/год.",
    placeholder: "ваш@email.com",
    ctaFree: "Занять моё бесплатное место →",
    ctaPaid: "Присоединиться за $182/год →",
    loading: "Сохраняем ваше место...",
    proofFree: "Бесплатно для первых 100 · Без карты",
    proofPaid: "Годовой план · Отмена в любое время",
    successTitle: (n) => `Вы член-основатель #${n}!`,
    successMsg: (n) => `Бесплатный доступ подтверждён. Осталось ${n} мест.`,
    errorEmail: "Введите действительный email.",
    errorGeneric: "Что-то пошло не так. Попробуйте снова.",
    memberBtn: "Уже участник? Войти →",
    langLabel: "Язык",
  },
  hi: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "आपका शरीर प्रतिक्रिया करता है",
    h2: "उसे जो आप देते हैं।",
    sub: "21 दिनों में दृश्यमान परिणाम — या पूरा पैसा वापस।",
    founding: "संस्थापक सदस्य",
    counterLabel: (n) => `${n} / 100 सीटें भरी`,
    slotsNormal: (n) => `पहले 100 सदस्य मुफ्त। ${n} सीटें बाकी।`,
    spotsUrgent: (n) => `⚡ केवल ${n} मुफ्त सीटें बची हैं। फिर $182/वर्ष।`,
    slotsFull: "🔴 मुफ्त सीटें भर गईं",
    slotsFullMsg: "100 मुफ्त सीटें भर गई हैं। $182/वर्ष में शामिल हों।",
    placeholder: "आपका@ईमेल.com",
    ctaFree: "मेरी मुफ्त सीट लें →",
    ctaPaid: "$182/वर्ष में शामिल हों →",
    loading: "सीट सुरक्षित हो रही है...",
    proofFree: "पहले 100 के लिए मुफ्त · कार्ड नहीं",
    proofPaid: "वार्षिक योजना · कभी भी रद्द करें",
    successTitle: (n) => `आप संस्थापक सदस्य #${n} हैं!`,
    successMsg: (n) => `मुफ्त पहुंच की पुष्टि हुई। ${n} सीटें बाकी।`,
    errorEmail: "एक वैध ईमेल दर्ज करें।",
    errorGeneric: "कुछ गलत हुआ। फिर कोशिश करें।",
    memberBtn: "पहले से सदस्य? प्रवेश करें →",
    langLabel: "भाषा",
  },
  tr: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Vücudunuz yanıt verir",
    h2: "ona ne verdiğinize.",
    sub: "21 günde görünür sonuçlar — ya da para iadesi.",
    founding: "Kurucu Üyeler",
    counterLabel: (n) => `${n} / 100 yer dolu`,
    slotsNormal: (n) => `İlk 100 üye ÜCRETSİZ katılır. ${n} yer kaldı.`,
    spotsUrgent: (n) => `⚡ Sadece ${n} ücretsiz yer kaldı. Sonra $182/yıl.`,
    slotsFull: "🔴 Ücretsiz yerler doldu",
    slotsFullMsg: "100 ücretsiz yer doldu. $182/yıl ile katılın.",
    placeholder: "sizin@email.com",
    ctaFree: "Ücretsiz yerimi al →",
    ctaPaid: "$182/yıl ile katıl →",
    loading: "Yeriniz kaydediliyor...",
    proofFree: "İlk 100 için ücretsiz · Kart gerekmez",
    proofPaid: "Yıllık plan · İstediğinizde iptal edin",
    successTitle: (n) => `Kurucu Üye #${n} olduğunuz için tebrikler!`,
    successMsg: (n) => `Ücretsiz erişim onaylandı. ${n} yer kaldı.`,
    errorEmail: "Geçerli bir e-posta girin.",
    errorGeneric: "Bir şeyler ters gitti. Tekrar deneyin.",
    memberBtn: "Zaten üye misiniz? Girin →",
    langLabel: "Dil",
  },
  nl: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Uw lichaam reageert",
    h2: "op wat u het geeft.",
    sub: "Zichtbare resultaten in 21 dagen — of uw geld terug.",
    founding: "Stichtende Leden",
    counterLabel: (n) => `${n} / 100 plekken bezet`,
    slotsNormal: (n) => `De eerste 100 leden treden GRATIS toe. ${n} plekken over.`,
    spotsUrgent: (n) => `⚡ Nog maar ${n} gratis plekken. Daarna $182/jaar.`,
    slotsFull: "🔴 Gratis plekken vol",
    slotsFullMsg: "De 100 gratis plekken zijn op. Word lid voor $182/jaar.",
    placeholder: "uw@email.com",
    ctaFree: "Mijn gratis plek claimen →",
    ctaPaid: "Lid worden voor $182/jaar →",
    loading: "Uw plek wordt opgeslagen...",
    proofFree: "Gratis voor de eerste 100 · Geen kaart",
    proofPaid: "Jaarplan · Op elk moment opzeggen",
    successTitle: (n) => `U bent Stichtend Lid #${n}!`,
    successMsg: (n) => `Gratis toegang bevestigd. ${n} plekken over.`,
    errorEmail: "Voer een geldig e-mailadres in.",
    errorGeneric: "Er ging iets mis. Probeer het opnieuw.",
    memberBtn: "Al lid? Binnenkomen →",
    langLabel: "Taal",
  },
  pl: {
    eyebrow: "Dr. Smoothie · PureLife Wellness Club",
    h1: "Twoje ciało reaguje",
    h2: "na to, co mu dajesz.",
    sub: "Widoczne rezultaty w 21 dni — lub zwrot pieniędzy.",
    founding: "Członkowie Założyciele",
    counterLabel: (n) => `${n} / 100 miejsc zajętych`,
    slotsNormal: (n) => `Pierwsze 100 osób wchodzi ZA DARMO. Zostało ${n} miejsc.`,
    spotsUrgent: (n) => `⚡ Tylko ${n} bezpłatnych miejsc. Potem $182/rok.`,
    slotsFull: "🔴 Bezpłatne miejsca wyczerpane",
    slotsFullMsg: "100 bezpłatnych miejsc zostało zajętych. Dołącz za $182/rok.",
    placeholder: "twoj@email.com",
    ctaFree: "Zajmij moje darmowe miejsce →",
    ctaPaid: "Dołącz za $182/rok →",
    loading: "Zapisywanie miejsca...",
    proofFree: "Bezpłatne dla pierwszych 100 · Bez karty",
    proofPaid: "Plan roczny · Anuluj kiedy chcesz",
    successTitle: (n) => `Jesteś Członkiem Założycielem #${n}!`,
    successMsg: (n) => `Bezpłatny dostęp potwierdzony. Zostało ${n} miejsc.`,
    errorEmail: "Wprowadź prawidłowy adres e-mail.",
    errorGeneric: "Coś poszło nie tak. Spróbuj ponownie.",
    memberBtn: "Już jesteś członkiem? Wejdź →",
    langLabel: "Język",
  },
};

function c(lang, key, arg) {
  const l = CS[lang] || CS['en'];
  const val = l[key] !== undefined ? l[key] : CS['en'][key];
  if (typeof val === 'function') return val(arg);
  return val ?? key;
}

// ── Globe Language Selector (self-contained) ──
function GlobeSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const ref = useState(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const handleGlobeHover = () => {
    if (!spinning) {
      setSpinning(true);
      setTimeout(() => setSpinning(false), 750);
    }
  };

  useEffect(() => {
    const close = (e) => {
      if (ref[0] && !ref[0].contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [ref[0]]);

  return (
    <div ref={el => ref[0] = el} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={c(lang, 'langLabel')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 20, padding: '6px 12px',
          cursor: 'pointer', color: '#F5F0E8',
          fontSize: 13, backdropFilter: 'blur(8px)',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'background 0.2s',
        }}
      >
        <span className={spinning ? "pl-globe-spinning" : "pl-globe-idle"} style={{ fontSize: 18, lineHeight: 1 }} onMouseEnter={handleGlobeHover}>🌐</span>
        <span style={{ fontSize: 16 }}>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{
          fontSize: 9, opacity: 0.5,
          display: 'inline-block',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#0D1F15',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12, padding: '6px',
          zIndex: 9999, minWidth: 190,
          boxShadow: '0 16px 40px rgba(0,0,0,0.7)',
          maxHeight: 360, overflowY: 'auto',
        }}>
          <div style={{
            padding: '6px 12px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 4,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>🌐</span>
            <span style={{
              fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#C9973A',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            }}>
              {c(lang, 'langLabel')}
            </span>
          </div>

          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className="pl-lang-btn"
              onClick={() => { onChange(l.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '8px 12px',
                background: l.code === lang ? 'rgba(45,134,83,0.15)' : 'transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                color: l.code === lang ? '#2D8653' : '#F5F0E8',
                fontSize: 13, textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ fontSize: 20, minWidth: 26, lineHeight: 1 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {l.code === lang && <span style={{ fontSize: 11, color: '#2D8653' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ──
export default function ComingSoonPage({ onEnterApp, lang = 'en', onLangChange }) {
  const [email, setEmail]           = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [freeResult, setFreeResult] = useState(null);
  const [counter, setCounter]       = useState({ total: 0, remaining: 100, percentFull: 0, isFull: false });
  const [counterLoaded, setCounterLoaded] = useState(false);
  const [diagnosticDone, setDiagnosticDone] = useState(
    () => localStorage.getItem('pl_diagnostic_done') === 'true'
  );

  useEffect(() => {
    const id = 'pl-cs-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = MOTION_CSS;
      document.head.appendChild(el);
    }
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  useEffect(() => {
    fetch('/api/subscriber-count')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setCounter(d); })
      .catch(() => {})
      .finally(() => setCounterLoaded(true));
  }, []);

  const handleSubmit = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(c(lang, 'errorEmail')); return;
    }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.free) {
        setFreeResult(data); setSubmitted(true);
        setCounter(p => ({ ...p, total: data.position, remaining: 100 - data.position, percentFull: Math.round((data.position / 100) * 100) }));
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || c(lang, 'errorGeneric'));
      }
    } catch { setError(c(lang, 'errorGeneric')); }
    finally { setLoading(false); }
  };

  const { total, remaining, percentFull, isFull } = counter;
  const handleLang = onLangChange || (() => {});

  if (!diagnosticDone) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.dark,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        fontFamily: "'DM Sans', sans-serif",
        color: COLORS.cream, textAlign: 'center',
      }}>
        <div className="pl-float pl-enter" style={{ marginBottom: '1.25rem' }}>
          <img src="/purelife-logo.png" alt="PureLife"
            style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${COLORS.borderGold}`, boxShadow: '0 0 24px rgba(201,151,58,0.15)', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div style={{ display: 'none', width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1A5C3A,#060D08)', border: `2px solid ${COLORS.borderGold}`, alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🌿</div>
        </div>
        <p className="pl-enter" style={{ fontSize: 11, letterSpacing: '0.14em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: 18, fontWeight: 600 }}>
          Dr. Smoothie · PureLife Wellness Club
        </p>
        <WellnessDiagnostic
          lang={lang}
          onJoin={() => {
            localStorage.setItem('pl_diagnostic_done', 'true');
            setDiagnosticDone(true);
          }}
        />
        <button
          onClick={() => {
            localStorage.setItem('pl_diagnostic_done', 'true');
            setDiagnosticDone(true);
          }}
          style={{
            marginTop: 24, background: 'transparent', color: COLORS.muted,
            border: 'none', fontSize: 12, textDecoration: 'underline',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Ya soy miembro, saltar diagnóstico →
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.dark,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.cream, textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Fondo ambiental */}
      <div style={{
        position: 'absolute', width: '70vw', height: '70vw',
        maxWidth: 600, maxHeight: 600, borderRadius: '50%',
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(26,92,58,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 🌐 Globe selector — top right */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 100 }}>
        <GlobeSelector lang={lang} onChange={handleLang} />
      </div>

      {/* Logo */}
      <div className="pl-float pl-enter" style={{ marginBottom: '1.75rem' }}>
        <img src="/purelife-logo.png" alt="PureLife"
          style={{ width: 76, height: 76, borderRadius: '50%', border: `2px solid ${COLORS.borderGold}`, boxShadow: '0 0 24px rgba(201,151,58,0.15)' }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        <div style={{ display: 'none', width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg,#1A5C3A,#060D08)', border: `2px solid ${COLORS.borderGold}`, alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>🌿</div>
      </div>

      {/* Eyebrow */}
      <p className="pl-enter pl-d1" style={{ fontSize: 11, letterSpacing: '0.14em', color: COLORS.gold, textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>
        {c(lang, 'eyebrow')}
      </p>

      {/* Headline */}
      <h1 className="pl-enter pl-d2" style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem,6vw,3.4rem)', fontWeight: 700, lineHeight: 1.15, color: COLORS.cream, marginBottom: '0.75rem', maxWidth: 520 }}>
        {c(lang, 'h1')}<br />
        <em style={{ color: COLORS.gold, fontStyle: 'italic', fontWeight: 300 }}>{c(lang, 'h2')}</em>
      </h1>

      {/* Sub */}
      <p className="pl-enter pl-d3" style={{ maxWidth: 400, fontSize: '0.95rem', lineHeight: 1.7, color: COLORS.muted, marginBottom: '2rem' }}>
        {c(lang, 'sub')}
      </p>

      {/* Counter banner */}
      {counterLoaded && (
        <div className="pl-enter pl-d4 pl-counter-shimmer" style={{ width: '100%', maxWidth: 370, background: 'rgba(201,151,58,0.06)', border: `1px solid ${COLORS.borderGold}`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.gold, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {isFull ? c(lang, 'slotsFull') : `🟢 ${c(lang, 'founding')}`}
            </span>
            <span style={{ fontSize: 12, color: COLORS.muted }}>{c(lang, 'counterLabel', total)}</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 10 }}>
            <div className="pl-bar-fill" style={{ '--bar-w': `${percentFull}%`, height: '100%', borderRadius: 99, background: isFull ? '#e05555' : `linear-gradient(90deg, ${COLORS.green}, ${COLORS.gold})` }} />
          </div>
          <p style={{ fontSize: 12, color: COLORS.muted, margin: 0 }}>
            {isFull ? c(lang, 'slotsFullMsg') : remaining <= 10 ? c(lang, 'spotsUrgent', remaining) : c(lang, 'slotsNormal', remaining)}
          </p>
        </div>
      )}

      {/* Form / Success */}
      {!submitted ? (
        <div className="pl-enter pl-d5" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%', maxWidth: 370, marginBottom: '1.5rem' }}>
          <input className="pl-input" type="email" placeholder={c(lang, 'placeholder')} value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ padding: '0.85rem 1.2rem', borderRadius: 10, border: `1px solid ${error ? 'rgba(255,100,100,0.5)' : COLORS.borderGold}`, background: 'rgba(255,255,255,0.04)', color: COLORS.cream, fontSize: '0.95rem', fontFamily: "'DM Sans', sans-serif" }}
          />
          {error && <p style={{ fontSize: 12, color: '#ff8080', textAlign: 'left', paddingLeft: 4 }}>{error}</p>}
          <button className="pl-btn" onClick={handleSubmit} disabled={loading}
            style={{ padding: '0.9rem', borderRadius: 10, background: loading ? 'rgba(201,151,58,0.5)' : `linear-gradient(135deg,${COLORS.gold},${COLORS.goldL})`, color: '#060D08', border: 'none', fontSize: '0.9rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? c(lang, 'loading') : isFull ? c(lang, 'ctaPaid') : c(lang, 'ctaFree')}
          </button>
          <p style={{ fontSize: 11, color: COLORS.dim, marginTop: 2 }}>
            {isFull ? c(lang, 'proofPaid') : c(lang, 'proofFree')}
          </p>
        </div>
      ) : (
        <div className="pl-pulse pl-enter" style={{ padding: '1.25rem 2rem', borderRadius: 12, background: 'rgba(26,92,58,0.15)', border: `1px solid ${COLORS.green}`, color: COLORS.cream, marginBottom: '1.5rem', maxWidth: 340, width: '100%' }}>
          <p style={{ fontSize: 22, marginBottom: 6 }}>✓</p>
          <p style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Fraunces', serif", marginBottom: 6 }}>
            {freeResult ? c(lang, 'successTitle', freeResult.position) : c(lang, 'successGeneric')}
          </p>
          <p style={{ fontSize: 13, color: COLORS.muted }}>
            {freeResult ? c(lang, 'successMsg', freeResult.remaining) : ''}
          </p>
        </div>
      )}

      {/* Member button */}
      <button className="pl-btn" onClick={onEnterApp}
        style={{ background: 'transparent', color: COLORS.muted, border: '1px solid rgba(255,255,255,0.12)', padding: '0.6rem 1.4rem', borderRadius: 8, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>
        {c(lang, 'memberBtn')}
      </button>

      <p style={{ position: 'absolute', bottom: '1.5rem', fontSize: '0.7rem', color: 'rgba(245,240,232,0.18)', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>
        © 2026 JRMB Food Network LLC · PureLife Wellness Club
      </p>
    </div>
  );
}
