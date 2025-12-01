import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import weatherService from '../services/weatherService';

const WeatherWidget = ({ location = '28079' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await weatherService.getWeatherByLocation(location);
        setWeather(data);
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

  // Mock data for development until backend is ready
  const mockWeather = weather || {
    location: 'Madrid',
    temperature: '22°C',
    condition: 'Sunny',
    humidity: '45%',
    wind: '10 km/h',
    forecast: [
      { day: 'Hoy', temp: '22°C', condition: 'Sunny' },
      { day: 'Mañana', temp: '24°C', condition: 'Partly Cloudy' },
      { day: 'Miércoles', temp: '20°C', condition: 'Rain' }
    ]
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">El Tiempo</h2>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getWeatherIcon(mockWeather.condition)}
          <span className="ml-2 text-2xl font-semibold">{mockWeather.temperature}</span>
        </div>
        <div className="text-right">
          <p className="font-medium">{mockWeather.location}</p>
          <p className="text-sm text-gray-500">{mockWeather.condition}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Humedad:</span> {mockWeather.humidity}
        </div>
        <div>
          <span className="text-gray-500">Viento:</span> {mockWeather.wind}
        </div>
      </div>
      
      <div className="mt-4 border-t pt-3">
        <h3 className="font-medium mb-2">Pronóstico</h3>
        <div className="grid grid-cols-3 gap-2">
          {mockWeather.forecast.map((day, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded">
              <p className="font-medium">{day.day}</p>
              <div className="my-1">{getWeatherIcon(day.condition)}</div>
              <p>{day.temp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;