import { useFetch } from '../hooks/useFetch';
import { WeatherData } from '../types';
import { Cloud, Sun, CloudRain, Loader2, MapPin, Droplets } from 'lucide-react';

export default function WeatherWidget() {
    const { data, loading, error } = useFetch<WeatherData>('/weather');

    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" />
        </div>
    );

    if (error || !data) return null;

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
            case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
            default: return <Sun className="h-8 w-8 text-yellow-500" />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-blue-100 flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" /> {data.location}
                    </h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-4xl font-bold">{Math.round(data.temp_c)}°</span>
                        <span className="ml-1 text-blue-100">{data.condition}</span>
                    </div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    {getWeatherIcon(data.condition)}
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-100">
                <Droplets className="h-4 w-4 mr-1" />
                <span>Humedad: {data.humidity}%</span>
            </div>
        </div>
    );
}
