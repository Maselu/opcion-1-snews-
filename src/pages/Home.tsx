import { useFetch } from '../hooks/useFetch';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { Loader2, TrendingUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const endpoint = category ? `/articles?category=${category}` : '/articles';
  const { data: response, loading, error } = useFetch<{ data: Article[] }>(endpoint);

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
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading articles</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  const articles = response?.data || [];
  const featured = articles.slice(0, 3);
  const remaining = articles.slice(3);

  return (
    <div className="space-y-12">
      {/* Hero Section - Featured Articles */}
      {!category && featured.length > 0 && (
        <section>
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Destacadas</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </section>
      )}

      {/* Main Articles Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? `${category}` : 'Todas las Noticias'}
          </h2>
          <span className="text-sm text-gray-500">{articles.length} artículos</span>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No hay artículos disponibles</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(category ? articles : remaining).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
