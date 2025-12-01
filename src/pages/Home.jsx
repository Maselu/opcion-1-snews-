import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { HeroCarousel } from '../components/HeroCarousel';
import { ArticleCard } from '../components/ArticleCard';
import NewsSection from '../components/NewsSection';
import WeatherWidget from '../components/WeatherWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Newspaper, Lightbulb, Trophy, Film, CloudSun } from 'lucide-react';

export function Home() {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will be replaced with actual API calls when backend is ready
    const mockArticles = [
      {
        id: 1,
        title: 'Nueva protesta en la calle contra Mazón a pesar de su dimisión',
        excerpt: 'Los manifestantes exigen elecciones anticipadas tras la gestión de la DANA',
        image: 'https://picsum.photos/800/400?random=1',
        published_at: '2025-11-03T19:40:11Z',
        author: 'ABC',
        category: { name: 'News' }
      },
      {
        id: 2,
        title: 'La Universidad de Cádiz celebra la Semana de la Ciencia y la Tecnología',
        excerpt: 'Actividades en sus cuatro campus para acercar la ciencia a la sociedad',
        image: 'https://picsum.photos/800/400?random=2',
        published_at: '2025-11-03T13:26:41Z',
        author: 'Universidad de Cádiz',
        category: { name: 'Science' }
      },
      {
        id: 3,
        title: 'Deportes Extremadura en la onda',
        excerpt: 'Resumen de la jornada deportiva en Extremadura',
        image: 'https://picsum.photos/800/400?random=3',
        published_at: '2025-11-03T13:15:11Z',
        author: 'Onda Cero',
        category: { name: 'Sports' }
      },
      {
        id: 4,
        title: 'Cine y economía: un tándem educativo y de entretenimiento',
        excerpt: 'Análisis de cómo el cine puede ser una herramienta para entender conceptos económicos',
        image: 'https://picsum.photos/800/400?random=4',
        published_at: '2025-11-03T18:46:24Z',
        author: 'Funds Society',
        category: { name: 'Entertainment' }
      }
    ];

    setArticles(mockArticles);
    setFeaturedArticles(mockArticles.slice(0, 3));
    setLoading(false);
  }, [activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Carousel */}
        <section className="mb-8">
          <HeroCarousel articles={featuredArticles} loading={loading} />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* News Sections - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general" onClick={() => setActiveCategory('general')}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  Noticias
                </TabsTrigger>
                <TabsTrigger value="science" onClick={() => setActiveCategory('science')}>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Ciencia
                </TabsTrigger>
                <TabsTrigger value="sports" onClick={() => setActiveCategory('sports')}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Deportes
                </TabsTrigger>
                <TabsTrigger value="entertainment" onClick={() => setActiveCategory('entertainment')}>
                  <Film className="mr-2 h-4 w-4" />
                  Entretenimiento
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <NewsSection category="general" title="Noticias Destacadas" limit={5} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="science" className="space-y-6">
                <NewsSection category="science" title="Ciencia y Tecnología" limit={5} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sports" className="space-y-6">
                <NewsSection category="sports" title="Deportes" limit={5} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="entertainment" className="space-y-6">
                <NewsSection category="entertainment" title="Entretenimiento" limit={5} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(0, 4).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-8">
            <WeatherWidget />
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;