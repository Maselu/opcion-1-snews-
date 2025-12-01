import { useState, useEffect } from 'react';
import { Share2, Bookmark, Clock, Eye } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CommentSection } from '../components/CommentSection';
import { Article, Comment } from '../types/database';

interface ArticleDetailProps {
  articleId: number;
}

export function ArticleDetail({ articleId }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const mockArticle: Article = {
      id: articleId,
      title: 'Breaking: Major technological breakthrough announced',
      content: `Scientists have made a groundbreaking discovery that could revolutionize the way we approach renewable energy. The new technology promises to make solar power more efficient and affordable than ever before.

In a press conference held earlier today, lead researcher Dr. Sarah Chen announced that her team has developed a new type of solar cell that can convert sunlight into electricity with unprecedented efficiency. The breakthrough involves a novel material composition that allows the cells to capture a broader spectrum of light wavelengths.

"This is a game-changer for renewable energy," Dr. Chen explained. "Our new solar cells can achieve efficiency rates of up to 45%, compared to the current industry standard of around 20%. This means that solar panels using this technology could generate more than twice as much power from the same amount of sunlight."

The research team spent five years developing the new technology, overcoming numerous technical challenges along the way. The key innovation lies in the use of a multi-layered structure that can simultaneously capture different wavelengths of light, maximizing energy conversion across the entire solar spectrum.

Industry experts are already hailing the discovery as a potential turning point in the global transition to renewable energy. With higher efficiency rates, solar power could become more cost-effective and practical for a wider range of applications, from residential rooftops to large-scale power plants.

The technology is expected to enter commercial production within the next two years, pending final testing and regulatory approvals. Several major energy companies have already expressed interest in licensing the technology for their own solar panel products.`,
      source: 'Tech News Daily',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      category: { id: 1, name: 'News', created_at: new Date().toISOString() },
    };

    const mockComments: Comment[] = [
      {
        id: 1,
        user_id: '1',
        article_id: articleId,
        content: 'This is incredible news! Solar energy has needed a breakthrough like this for years.',
        is_edited: false,
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        user: {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          created_at: new Date().toISOString(),
        },
        likes_count: 24,
        is_liked: false,
      },
      {
        id: 2,
        user_id: '2',
        article_id: articleId,
        content: 'I wonder how this will affect the cost of residential solar panels. Could make them much more accessible!',
        is_edited: false,
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          created_at: new Date().toISOString(),
        },
        likes_count: 18,
        is_liked: false,
      },
    ];

    setArticle(mockArticle);
    setComments(mockComments);
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>;
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
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
    <div className="min-h-screen bg-secondary-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="badge bg-primary-100 text-primary-700">
            {article.category?.name || 'News'}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight animate-fade-in">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-secondary-200">
          <div className="flex items-center space-x-6 text-sm text-secondary-600">
            {article.source && (
              <span className="font-medium text-secondary-900">{article.source}</span>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{timeAgo(article.published_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>1.2k views</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-lg transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card p-8 mb-8 animate-fade-in">
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-secondary-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
            <h3 className="font-semibold text-secondary-900 mb-2">Start a discussion</h3>
            <p className="text-sm text-secondary-600 mb-4">
              Want to discuss this article in depth? Create a topic and invite the community to join.
            </p>
            <button className="btn-primary">Create Topic</button>
          </div>
        </div>

        <CommentSection comments={comments} />
      </article>

      <Footer />
    </div>
  );
}
