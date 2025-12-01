import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroCarousel({ articles = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-advance carousel
  useEffect(() => {
    if (articles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [articles.length]);
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % articles.length
    );
  };

  // If no articles, show placeholder
  if (!articles || articles.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando artículos destacados...</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 overflow-hidden rounded-lg">
      {/* Carousel Items */}
      <div className="h-full">
        {articles.map((article, index) => (
          <div 
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${article.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
              <div className="animate-fadeIn">
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded mb-3">
                  {article.category?.name || 'Destacado'}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  <Link to={`/article/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-200 mb-4 line-clamp-2">
                  {article.excerpt || 'Haz clic para leer más sobre esta noticia destacada.'}
                </p>
                <div className="flex items-center text-sm">
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Indicators */}
      {articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroCarousel;