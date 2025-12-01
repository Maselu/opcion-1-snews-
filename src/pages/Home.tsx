import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { HeroCarousel } from '../components/HeroCarousel';
import { ArticleCard } from '../components/ArticleCard';
import { supabase } from '../lib/supabase';
import { Article } from '../types/database';

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('News');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [activeCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', activeCategory)
        .maybeSingle();

      if (categoryData) {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('category_id', categoryData.id)
          .order('published_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        setArticles(data || []);

        if (data && data.length > 0) {
          setFeaturedArticles(data.slice(0, 3));
        }
      } else {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            category:categories(*)
          `)
          .order('published_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        setArticles(data || []);

        if (data && data.length > 0) {
          setFeaturedArticles(data.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'Breaking: Major technological breakthrough announced',
      content:
        'Scientists have made a groundbreaking discovery that could revolutionize the way we approach renewable energy. The new technology promises to make solar power more efficient and affordable than ever before.',
      source: 'Tech News Daily',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      category: { id: 1, name: 'News', created_at: new Date().toISOString() },
    },
    {
      id: 2,
      title: 'Championship finals set for this weekend',
      content:
        'The two top teams will face off in what promises to be an epic showdown. Both teams have shown exceptional performance throughout the season, and fans are eagerly anticipating this historic match.',
      source: 'Sports Network',
      published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      category: { id: 2, name: 'Sports', created_at: new Date().toISOString() },
    },
    {
      id: 3,
      title: 'Record-breaking box office weekend expected',
      content:
        'Multiple blockbuster releases are set to compete for audience attention this weekend. Industry experts predict this could be one of the highest-grossing weekends in cinema history.',
      source: 'Entertainment Weekly',
      published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      category: { id: 4, name: 'Entertainment', created_at: new Date().toISOString() },
    },
  ];

  const displayArticles = articles.length > 0 ? articles : mockArticles;
  const displayFeatured = featuredArticles.length > 0 ? featuredArticles : mockArticles.slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <HeroCarousel articles={displayFeatured} />
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Latest {activeCategory}</h2>
              <select className="px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Most Discussed</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="card p-5 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="h-4 bg-secondary-200 rounded w-20 mb-3" />
                    <div className="h-6 bg-secondary-200 rounded w-full mb-2" />
                    <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
                    <div className="h-4 bg-secondary-200 rounded w-5/6 mb-2" />
                    <div className="h-4 bg-secondary-200 rounded w-4/6" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayArticles.map((article, index) => (
                  <div key={article.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            )}

            {!loading && displayArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-secondary-600">No articles found in this category.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
