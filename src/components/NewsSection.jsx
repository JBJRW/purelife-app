// /src/components/NewsSection.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { tui } from '../i18n';

const CATEGORIES = [
  { key: 'todas', labelKey: 'newsCatAll' },
  { key: 'nutricion', labelKey: 'newsCatNutrition' },
  { key: 'habitos_saludables', labelKey: 'newsCatHabits' },
  { key: 'estudios', labelKey: 'newsCatStudies' },
  { key: 'salud_preventiva', labelKey: 'newsCatPreventive' },
];

function relativeDate(dateStr, lang) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return tui(lang, 'newsDateToday');
  if (diffDays === 1) return tui(lang, 'newsDateYesterday');
  if (diffDays < 7) {
    const suffix = tui(lang, 'newsDateDaysAgo');
    if (lang === 'es') return `Hace ${diffDays} ${suffix}`;
    if (lang === 'fr') return `il y a ${diffDays} ${suffix}`;
    if (lang === 'pt') return `há ${diffDays} ${suffix}`;
    return `${diffDays} ${suffix}`; // en / it ya llevan el sufijo con el verbo incluido
  }
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${tui(lang, 'newsDateWeeksAgo')}`;
  const localeMap = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-PT', it: 'it-IT' };
  return date.toLocaleDateString(localeMap[lang] || 'en-US', { day: 'numeric', month: 'short' });
}

function sourceDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export default function NewsSection({ lang = 'en' }) {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 9;

  useEffect(() => {
    setPage(0);
    fetchArticles(0, activeCategory, lang);
  }, [activeCategory, lang]);

  async function fetchArticles(pageNum, category, currentLang) {
    setLoading(true);
    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('language', currentLang)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + PAGE_SIZE - 1);

    if (category !== 'todas') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (!error) setArticles(data || []);
    setLoading(false);
  }

  return (
    <section
      style={{
        background: '#0a1410',
        padding: '4rem 1.5rem',
        minHeight: '100vh'
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#e8c76a',
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}
        >
          {tui(lang, 'newsTitle')}
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: '#a8b5ad',
            textAlign: 'center',
            marginBottom: '2.5rem',
            fontSize: '0.95rem'
          }}
        >
          {tui(lang, 'newsSubtitle')}
        </p>

        {/* Tabs de categoría */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2.5rem'
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                padding: '0.5rem 1.1rem',
                borderRadius: '999px',
                border: `1px solid ${activeCategory === cat.key ? '#e8c76a' : '#2a342f'}`,
                background: activeCategory === cat.key ? '#e8c76a' : 'transparent',
                color: activeCategory === cat.key ? '#0a1410' : '#a8b5ad',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tui(lang, cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Feed de noticias — tarjetas grandes estilo feed inmersivo */}
        {loading ? (
          <p style={{ color: '#a8b5ad', textAlign: 'center' }}>{tui(lang, 'newsLoading')}</p>
        ) : articles.length === 0 ? (
          <p style={{ color: '#a8b5ad', textAlign: 'center' }}>
            {tui(lang, 'newsEmpty')}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 480, margin: '0 auto' }}>
            {articles.map(article => (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  minHeight: 280,
                  background: 'radial-gradient(circle at 20% 0%, rgba(232,201,106,0.10), transparent 55%), #101d17',
                  border: '1px solid #1f2b24',
                  borderRadius: '20px',
                  padding: '1.6rem',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8c76a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2b24'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#e8c76a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {(article.category || '').replace('_', ' ')}
                </span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#f3eee2',
                    fontSize: '1.7rem',
                    lineHeight: 1.15,
                    margin: '0 0 0.7rem',
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: 'rgba(243,238,226,0.85)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    lineHeight: '1.5',
                    marginBottom: '1.1rem',
                  }}
                >
                  {article.summary}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#8a978f',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '0.8rem',
                  }}
                >
                  <span>{sourceDomain(article.source_url)}</span>
                  <span>{relativeDate(article.published_at, lang)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
