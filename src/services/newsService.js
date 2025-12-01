import api, { endpoints } from './api';

/**
 * Service for fetching news from different categories
 */
const newsService = {
  /**
   * Fetch general news
   * @returns {Promise} Promise with news data
   */
  getGeneralNews: async () => {
    try {
      const response = await api.get(endpoints.news.general);
      return response.data;
    } catch (error) {
      console.error('Error fetching general news:', error);
      throw error;
    }
  },

  /**
   * Fetch science and technology news
   * @returns {Promise} Promise with news data
   */
  getScienceNews: async () => {
    try {
      const response = await api.get(endpoints.news.science);
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
  getSportsNews: async () => {
    try {
      const response = await api.get(endpoints.news.sports);
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
  getEntertainmentNews: async () => {
    try {
      const response = await api.get(endpoints.news.entertainment);
      return response.data;
    } catch (error) {
      console.error('Error fetching entertainment news:', error);
      throw error;
    }
  },
};

export default newsService;