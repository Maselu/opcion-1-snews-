import { useFetch } from '../hooks/useFetch';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: articles, loading, error } = useFetch<{ data: Article[] }>('/articles');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Latest News
        </h1>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Stay updated with the latest stories from around the world.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles?.data?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
