import { Clock, MessageSquare, Heart, Bookmark } from 'lucide-react';
import { Article } from '../types/database';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

const categoryColors: Record<string, string> = {
  News: 'bg-blue-100 text-blue-700',
  Sports: 'bg-green-100 text-green-700',
  Weather: 'bg-sky-100 text-sky-700',
  Entertainment: 'bg-purple-100 text-purple-700',
};

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const categoryColor = categoryColors[article.category?.name || 'News'];

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <article
      onClick={onClick}
      className="card p-5 cursor-pointer group animate-fade-in overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${categoryColor}`}>{article.category?.name || 'News'}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary-100 rounded">
          <Bookmark className="w-4 h-4 text-secondary-400 hover:text-primary-600" />
        </button>
      </div>

      <h2 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {article.title}
      </h2>

      <p className="text-sm text-secondary-600 mb-4 line-clamp-3">{article.content}</p>

      <div className="flex items-center justify-between text-xs text-secondary-500">
        <div className="flex items-center space-x-4">
          {article.source && <span className="font-medium">{article.source}</span>}
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo(article.published_at)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>24</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5" />
            <span>42</span>
          </div>
        </div>
      </div>
    </article>
  );
}
