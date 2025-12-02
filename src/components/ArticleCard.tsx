import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Calendar, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const relativeTime = formatDistanceToNow(new Date(article.published_at), {
    addSuffix: true,
    locale: es
  });

  const cardClass = featured
    ? "bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    : "bg-white overflow-hidden shadow-sm rounded-xl hover:shadow-md transition-all duration-300 border border-gray-100";

  return (
    <article className={cardClass}>
      {/* Placeholder Image */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-6xl opacity-20">📰</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-900">
            {article.category?.name || 'News'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <Link to={`/articles/${article.id}`} className="block group">
          <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${featured ? 'text-xl mb-3' : 'text-lg mb-2'
            }`}>
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {article.content}
          </p>
        </Link>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{relativeTime}</span>
            </div>
            {article.source && (
              <span className="font-medium text-gray-700">{article.source}</span>
            )}
          </div>
          <Link
            to={`/articles/${article.id}`}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            Leer
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
