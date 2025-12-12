import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface CategorySection {
  id: number;
  name: string;
  articles: Article[];
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroArticles, setHeroArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<CategorySection[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError('');

      if (selectedCategory) {
        // Obtener solo la categoría seleccionada
        const response = await api.get(`/articles?category=${selectedCategory}&limit=6`);
        const articles = response.data.data || response.data;

        setCategories([{
          id: 0,
          name: selectedCategory,
          articles: articles.slice(0, 6)
        }]);
        setHeroArticles([]);
      } else {
        // Obtener todas las categorías
        const categoriesData = [
          { id: 1, name: 'General' },
          { id: 2, name: 'Ciencia' },
          { id: 3, name: 'Deportes' },
          { id: 4, name: 'Entretenimiento' }
        ];

        // Obtener las 3 artículos más recientes
        const heroResponse = await api.get('/articles?limit=3');
        const allArticles = heroResponse.data.data || heroResponse.data;
        setHeroArticles(allArticles.slice(0, 3));

        // Obtener artículos para cada categoría
        const categoryPromises = categoriesData.map(async (cat) => {
          const response = await api.get(`/articles?category=${cat.name}&limit=6`);
          const articles = response.data.data || response.data;
          return {
            id: cat.id,
            name: cat.name,
            articles: articles.slice(0, 6)
          };
        });

        const categorySections = await Promise.all(categoryPromises);
        setCategories(categorySections);
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError('Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroArticles.length);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroArticles.length) % heroArticles.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">Error</h3>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Carousel - Only show when no category is selected */}
      {!selectedCategory && heroArticles.length > 0 && (
        <section className="relative h-96 rounded-xl overflow-hidden">
          {heroArticles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700">
                <div className="absolute inset-0 flex items-center justify-center text-white text-9xl opacity-10">
                  📰
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-semibold mb-3">
                  {article.category?.name || 'Noticias'}
                </span>
                <h2 className="text-4xl font-bold mb-3 line-clamp-2">{article.title}</h2>
                <p className="text-gray-200 text-lg mb-4 line-clamp-2">{article.content}</p>
                <div className="flex items-center text-sm text-gray-300">
                  <span>{article.source || 'Fuente desconocida'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.published_at).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          {heroArticles.length > 1 && (
            <>
              <button
                onClick={prevHero}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextHero}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {heroArticles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === currentHeroIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Category Tabs - Only show when no category is selected */}
      {!selectedCategory && (
        <div className="flex items-center space-x-4 border-b border-gray-200">
          <Link
            to="/?category=Noticias"
            className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600"
          >
            📰 Noticias
          </Link>
          <Link
            to="/?category=Ciencia"
            className="px-4 py-2 font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            🔬 Ciencia
          </Link>
          <Link
            to="/?category=Deportes"
            className="px-4 py-2 font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            ⚽ Deportes
          </Link>
          <Link
            to="/?category=Entretenimiento"
            className="px-4 py-2 font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            🎬 Entretenimiento
          </Link>
        </div>
      )}

      {/* Category Sections */}
      {categories.map((category) => (
        <section key={category.id} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? category.name : `Noticias Destacadas - ${category.name}`}
            </h2>
            {!selectedCategory && (
              <Link
                to={`/?category=${category.name}`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Ver todas →
              </Link>
            )}
          </div>

          {category.articles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No hay artículos disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      ))}

      {/* Back to Home link when viewing a category */}
      {selectedCategory && (
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Volver a todas las categorías
          </Link>
        </div>
      )}
    </div>
  );
}
