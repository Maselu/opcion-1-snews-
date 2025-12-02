import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Calendar } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {article.category?.name || 'News'}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(article.published_at).toLocaleDateString()}
          </div>
        </div>
        <Link to={`/articles/${article.id}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {article.title}
          </h3>
          <p className="mt-3 text-base text-gray-500 line-clamp-3">
            {article.content}
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Source: <span className="font-medium text-gray-900">{article.source || 'Unknown'}</span>
          </div>
          <Link
            to={`/articles/${article.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Read more &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
