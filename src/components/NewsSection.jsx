import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import newsService from '../services/newsService';

const NewsSection = ({ category, title, limit = 5 }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let data;
        
        switch (category) {
          case 'general':
            data = await newsService.getGeneralNews();
            break;
          case 'science':
            data = await newsService.getScienceNews();
            break;
          case 'sports':
            data = await newsService.getSportsNews();
            break;
          case 'entertainment':
            data = await newsService.getEntertainmentNews();
            break;
          default:
            data = await newsService.getGeneralNews();
        }
        
        setNews(data.slice(0, limit));
      } catch (err) {
        setError('Failed to load news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, limit]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link 
          to={`/category/${category}`} 
          className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-300"
        >
          Ver más <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div 
            key={index} 
            className="border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 transition-colors duration-300 rounded p-2"
          >
            <Link to={`/article/${item.id}`} className="block">
              <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock size={14} className="mr-1" />
                <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{item.source}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;