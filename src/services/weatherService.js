import api from './api';

/**
 * Service for fetching weather data
 */
const weatherService = {
  /**
   * Fetch weather forecast
   * @returns {Promise} Promise with weather data
   */
  getForecast: async () => {
    try {
      const response = await api.get('/weather?location=Madrid');
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },

  /**
   * Fetch weather by location
   * @param {string} location - Location name (e.g., "Madrid")
   * @returns {Promise} Promise with weather data
   */
  getWeatherByLocation: async (location) => {
    try {
      const response = await api.get(`/weather?location=${location}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching weather for location ${location}:`, error);
      throw error;
    }
  },
};

export default weatherService;