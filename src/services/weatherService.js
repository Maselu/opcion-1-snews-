import api, { endpoints } from './api';

/**
 * Service for fetching weather data from AEMET API
 */
const weatherService = {
  /**
   * Fetch weather forecast
   * @returns {Promise} Promise with weather data
   */
  getForecast: async () => {
    try {
      const response = await api.get(endpoints.weather.forecast);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },

  /**
   * Fetch weather by location
   * @param {string} location - Location code
   * @returns {Promise} Promise with weather data
   */
  getWeatherByLocation: async (location) => {
    try {
      const response = await api.get(endpoints.weather.byLocation(location));
      return response.data;
    } catch (error) {
      console.error(`Error fetching weather for location ${location}:`, error);
      throw error;
    }
  },
};

export default weatherService;