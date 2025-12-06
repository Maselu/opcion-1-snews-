import api from './api';

/**
 * Service for fetching news articles
 */
const newsService = {
  /**
   * Fetch general news
   * @returns {Promise} Promise with news data
   */
  getGeneral: async () => {
    try {
      const response = await api.get('/articles?category=General&limit=6');
      return response.data;
    } catch (error) {
      console.error('Error fetching general news:', error);
      throw error;
    }
  },

  /**
   * Fetch science news
   * @returns {Promise} Promise with news data
   */
  getScience: async () => {
    try {
      const response = await api.get('/articles?category=Ciencia&limit=6');
      return response.data;
    } catch (error) {
      console.error('Error fetching science news:', error);
      throw error;
    }
  },

  /**
   * Fetch sports news
   * @returns {Promise} Promise with news data
   */
  getSports: async () => {
    try {
      const response = await api.get('/articles?category=Deportes&limit=6');
      return response.data;
    } catch (error) {
      console.error('Error fetching sports news:', error);
      throw error;
    }
  },

  /**
   * Fetch entertainment news
   * @returns {Promise} Promise with news data
   */
  getEntertainment: async () => {
    try {
      const response = await api.get('/articles?category=Entretenimiento&limit=6');
      return response.data;
    } catch (error) {
      console.error('Error fetching entertainment news:', error);
      throw error;
    }
  },
};

export default newsService;