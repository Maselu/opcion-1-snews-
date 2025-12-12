import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import api from '../services/api';

const WeatherWidget = ({ location = 'Madrid' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/weather?location=${location}`);
        setWeather(response.data);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="text-yellow-500" size={24} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="text-gray-500" size={24} />;
      case 'rain':
      case 'rainy':
      case 'showers':
        return <CloudRain className="text-blue-500" size={24} />;
      default:
        return <Wind className="text-gray-400" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2">El Tiempo</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Link
      to="/weather"
      className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
    >
      <h2 className="text-xl font-bold mb-4">El Tiempo</h2>

      {weather && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getWeatherIcon(weather.condition)}
              <span className="ml-2 text-2xl font-semibold">{Math.round(weather.temp_c)}°C</span>
            </div>
            <div className="text-right">
              <p className="font-medium">{weather.location}</p>
              <p className="text-sm text-gray-500">{weather.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Humedad:</span> {weather.humidity}%
            </div>
            <div>
              <span className="text-gray-500">Viento:</span> {weather.wind_kph} km/h
            </div>
          </div>
        </>
      )}
    </Link>
  );
};

export default WeatherWidget;