// /src/components/NewsSection.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // ajustar path según tu proyecto

const CATEGORIES = [
  { key: 'todas', label: 'Todas' },
  { key: 'frutas', label: 'Frutas' },
  { key: 'vegetales', label: 'Vegetales' },
  { key: 'estudios', label: 'Estudios' },
  { key: 'tendencias', label: 'Tendencias' },
  { key: 'salud_preventiva', label: 'Salud Preventiva' }
];

function relativeDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semana(s)`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function NewsSection() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 9;

  useEffect(() => {
    setPage(0);
    fetchArticles(0, activeCategory);
  }, [activeCategory]);

  async function fetchArticles(pageNum, category) {
    setLoading(true);
    let query = supabase
      .from('news_articles')
      .select('*')
      .order('published_date', { ascending: false, nullsFirst: false })
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
          Noticias Wellness
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
          Frutas, vegetales y estudios — actualizado a diario
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
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de noticias */}
        {loading ? (
          <p style={{ color: '#a8b5ad', textAlign: 'center' }}>Cargando noticias...</p>
        ) : articles.length === 0 ? (
          <p style={{ color: '#a8b5ad', textAlign: 'center' }}>
            Aún no hay noticias en esta categoría. Vuelve pronto.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {articles.map(article => (
              <a
                key={article.id}
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: '#101d17',
                  border: '1px solid #1f2b24',
                  borderRadius: '14px',
                  padding: '1.4rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e8c76a')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1f2b24')}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.7rem',
                    color: '#e8c76a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {article.category.replace('_', ' ')}
                </span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#f3eee2',
                    fontSize: '1.25rem',
                    margin: '0.5rem 0 0.6rem'
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#a8b5ad',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    marginBottom: '0.9rem'
                  }}
                >
                  {article.summary}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6b7a72'
                  }}
                >
                  <span>{article.source_name}</span>
                  <span>{relativeDate(article.published_date)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
