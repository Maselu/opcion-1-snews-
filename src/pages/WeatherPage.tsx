import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    Wind,
    Droplets,
    Loader2
} from 'lucide-react';

interface WeatherData {
    location: string;
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        precipitation: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weather_code: number[];
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
    };
}

// WMO Weather interpretation codes
const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-full w-full" />;
    if (code >= 1 && code <= 3) return <Cloud className="h-full w-full" />;
    if (code >= 51 && code <= 67) return <CloudDrizzle className="h-full w-full" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="h-full w-full" />;
    if (code >= 80 && code <= 99) return <CloudRain className="h-full w-full" />;
    return <Cloud className="h-full w-full" />;
};

const getWeatherDescription = (code: number): string => {
    if (code === 0) return 'Despejado';
    if (code >= 1 && code <= 3) return 'Nublado';
    if (code >= 51 && code <= 67) return 'Lluvia';
    if (code >= 71 && code <= 77) return 'Nieve';
    if (code >= 80 && code <= 99) return 'Tormenta';
    return 'Nublado';
};

const getDayName = (dateString: string): string => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(dateString);
    return days[date.getDay()];
};

export default function WeatherPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Madrid');
    const [cities, setCities] = useState<string[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [selectedCity]);

    const fetchCities = async () => {
        try {
            const response = await api.get('/weather/cities');
            setCities(response.data);
        } catch (err) {
            console.error('Error fetching cities:', err);
        }
    };

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/weather/detailed?location=${selectedCity}`);
            setWeather(response.data);
        } catch (err: any) {
            console.error('Error fetching weather:', err);
            setError('Error al cargar los datos del clima');
        } finally {
            setLoading(false);
        }
    };

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        setSearchParams({ city });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                <p className="mt-2 text-gray-600">{error}</p>
            </div>
        );
    }

    // Get next 24 hours for hourly forecast
    const next24Hours = weather.hourly.time.slice(0, 24);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header with City Selector */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">El Tiempo</h1>
                <select
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {/* Current Weather Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    {/* Left: Temperature and Icon */}
                    <div className="flex items-center space-x-6">
                        <div className="text-blue-100">
                            {getWeatherIcon(weather.current.weather_code)}
                        </div>
                        <div>
                            <div className="text-7xl font-bold">
                                {Math.round(weather.current.temperature_2m)}°
                            </div>
                            <div className="text-2xl text-blue-100 mt-2">
                                {getWeatherDescription(weather.current.weather_code)}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="text-right space-y-3">
                        <div className="text-xl font-semibold">{selectedCity}</div>
                        <div className="text-sm text-blue-100">
                            {new Date().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center justify-end space-x-2">
                                <Droplets className="h-4 w-4" />
                                <span>Precipitación: {weather.current.precipitation}%</span>
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                                <Droplets className="h-4 w-4" />
                                <span>Humedad: {weather.current.relative_humidity_2m}%</span>
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                                <Wind className="h-4 w-4" />
                                <span>Viento: {Math.round(weather.current.wind_speed_10m)} km/h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pronóstico por horas</h2>
                <div className="overflow-x-auto">
                    <div className="flex space-x-4 pb-4">
                        {next24Hours.map((time, index) => {
                            const hour = new Date(time).getHours();
                            const temp = Math.round(weather.hourly.temperature_2m[index]);
                            const code = weather.hourly.weather_code[index];
                            const precip = weather.hourly.precipitation_probability[index];

                            return (
                                <div
                                    key={time}
                                    className="flex-shrink-0 w-20 text-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="text-sm font-medium text-gray-600 mb-2">
                                        {hour === 0 ? '00:00' : `${hour}:00`}
                                    </div>
                                    <div className="text-blue-600 mb-2 flex justify-center">
                                        <div className="h-8 w-8">
                                            {getWeatherIcon(code)}
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900">{temp}°</div>
                                    <div className="text-xs text-gray-500 mt-1">{precip}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pronóstico de 7 días</h2>
                <div className="space-y-3">
                    {weather.daily.time.map((date, index) => {
                        const dayName = index === 0 ? 'Hoy' : getDayName(date);
                        const code = weather.daily.weather_code[index];
                        const maxTemp = Math.round(weather.daily.temperature_2m_max[index]);
                        const minTemp = Math.round(weather.daily.temperature_2m_min[index]);
                        const precip = weather.daily.precipitation_probability_max[index];

                        return (
                            <div
                                key={date}
                                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-16 font-medium text-gray-900">{dayName}</div>
                                    <div className="text-blue-600 flex items-center">
                                        <div className="h-8 w-8">
                                            {getWeatherIcon(code)}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 flex-1">
                                        {getWeatherDescription(code)}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-sm text-gray-500">💧 {precip}%</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 text-sm">{minTemp}°</span>
                                        <div className="w-24 h-2 bg-gradient-to-r from-blue-300 to-orange-400 rounded-full"></div>
                                        <span className="text-gray-900 font-semibold">{maxTemp}°</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
