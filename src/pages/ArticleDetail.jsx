import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CommentSection } from '../components/CommentSection';
import { Share, Clock, User, Tag } from 'lucide-react';
import { LikeButton } from '../components/LikeButton';

export function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This will be replaced with actual API calls when backend is ready
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Mock data for development
        const mockArticle = {
          id: parseInt(id),
          title: 'Nueva protesta en la calle contra Mazón a pesar de su dimisión',
          content: `
            <p>Los manifestantes exigen elecciones anticipadas tras la gestión de la DANA. Miles de personas han salido a las calles de Valencia para protestar contra la gestión de la catástrofe.</p>
            <p>A pesar de la dimisión del presidente de la Generalitat Valenciana, Carlos Mazón, los ciudadanos continúan reclamando responsabilidades políticas y una mejor gestión de la emergencia.</p>
            <h2>Reivindicaciones ciudadanas</h2>
            <p>Entre las principales demandas de los manifestantes se encuentran:</p>
            <ul>
              <li>Convocatoria de elecciones anticipadas</li>
              <li>Mayor transparencia en la gestión de la emergencia</li>
              <li>Aumento de los recursos destinados a los afectados</li>
              <li>Investigación independiente sobre lo ocurrido</li>
            </ul>
            <p>La manifestación ha transcurrido de forma pacífica, aunque con momentos de tensión frente a la sede de la Generalitat.</p>
          `,
          image: 'https://picsum.photos/1200/600?random=1',
          published_at: '2025-11-03T19:40:11Z',
          author: 'ABC',
          category: { name: 'News', id: 1 },
          source: 'https://news.google.com/rss/articles/CBMivAFBVV95cUxNZlVDVmd5cjhFLXlVY1c0VDlVc2pMMEhYVkVkRmRpOVNZbHN0aTNyUVg2bzhhS19xNHVxMk9ZQ1hYZWoyQTRWZnY0Q1FfQ2Q0Z3ZmUVVGbFFKX25hazc2RjhVQ0pOWlVYUHI3SXprYWpGQ3RacC1WLU9FYklIbnNNYmhxS3JoYzh3Ym5FemN4UGIzclIxbHdLb0wzbFNqVmNNcFE2V2hlUDZiZ3Z0bERDZDVPYkxVSDQzUDh6cA?oc=5'
        };
        
        setArticle(mockArticle);
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <h2 className="text-red-800 text-xl font-bold">Error</h2>
            <p className="text-red-600">{error || 'Article not found'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
          className="relative h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${article.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{article.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Tag size={16} className="mr-1" />
                  <span>{article.category.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {/* Article Metadata */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div className="flex items-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${article.author}&background=random`} 
                      alt={article.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{article.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(article.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <LikeButton />
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <Share size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Article Content */}
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                {/* Source Link */}
                <div className="mt-8 pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Fuente: <a 
                      href={article.source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {article.author}
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Comments Section */}
              <CommentSection articleId={article.id} />
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Artículos Relacionados</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <img 
                        src={`https://picsum.photos/100/100?random=${i+10}`}
                        alt="Related article"
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <h3 className="font-medium hover:text-blue-600 transition-colors">
                          <a href="#">Artículo relacionado {i}</a>
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Etiquetas</h2>
                <div className="flex flex-wrap gap-2">
                  {['Política', 'Valencia', 'DANA', 'Protestas', 'Mazón'].map((tag) => (
                    <a 
                      key={tag}
                      href="#" 
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ArticleDetail;