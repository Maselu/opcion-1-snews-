<?php

namespace App\Http\Controllers;

use App\Models\WeatherReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class WeatherController extends Controller
{
    // Spanish cities coordinates
    private static $cities = [
        'Madrid' => ['lat' => 40.4168, 'lon' => -3.7038],
        'Barcelona' => ['lat' => 41.3874, 'lon' => 2.1686],
        'Valencia' => ['lat' => 39.4699, 'lon' => -0.3763],
        'Sevilla' => ['lat' => 37.3891, 'lon' => -5.9845],
        'Zaragoza' => ['lat' => 41.6488, 'lon' => -0.8891],
        'Málaga' => ['lat' => 36.7213, 'lon' => -4.4214],
        'Murcia' => ['lat' => 37.9922, 'lon' => -1.1307],
        'Palma' => ['lat' => 39.5696, 'lon' => 2.6502],
        'Bilbao' => ['lat' => 43.2630, 'lon' => -2.9350],
        'Alicante' => ['lat' => 38.3452, 'lon' => -0.4810],
        'Córdoba' => ['lat' => 37.8882, 'lon' => -4.7794],
        'Valladolid' => ['lat' => 41.6523, 'lon' => -4.7245],
        'Vigo' => ['lat' => 42.2406, 'lon' => -8.7207],
        'Gijón' => ['lat' => 43.5322, 'lon' => -5.6611],
        'Toledo' => ['lat' => 39.8628, 'lon' => -4.0273],
    ];

    public function current(Request $request)
    {
        $location = $request->input('location', 'Madrid');

        // Check cache (valid for 1 hour)
        $cached = WeatherReport::where('location', $location)
            ->where('fetched_at', '>=', Carbon::now()->subHour())
            ->first();

        if ($cached) {
            return response()->json($cached->data);
        }

        // Get coordinates for the city
        $coords = self::$cities[$location] ?? self::$cities['Madrid'];

        try {
            $response = Http::get("https://api.open-meteo.com/v1/forecast", [
                'latitude' => $coords['lat'],
                'longitude' => $coords['lon'],
                'current' => 'temperature_2m,relative_humidity_2m,weather_code',
                'timezone' => 'auto'
            ]);

            if ($response->successful()) {
                $apiData = $response->json();
                $current = $apiData['current'];

                // Map WMO codes to conditions
                $condition = 'Sunny';
                $code = $current['weather_code'];
                if ($code > 0 && $code <= 3)
                    $condition = 'Cloudy';
                if ($code > 3 && $code <= 67)
                    $condition = 'Rainy';
                if ($code > 67)
                    $condition = 'Snowy';

                $data = [
                    'location' => $location,
                    'temp_c' => $current['temperature_2m'],
                    'condition' => $condition,
                    'humidity' => $current['relative_humidity_2m'],
                    'wind_kph' => 0,
                    'fetched_at' => Carbon::now()->toIso8601String(),
                ];

                WeatherReport::updateOrCreate(
                    ['location' => $location],
                    [
                        'data' => $data,
                        'fetched_at' => Carbon::now(),
                    ]
                );

                return response()->json($data);
            }
        } catch (\Exception $e) {
            // Fallback if API fails
        }

        // Fallback Mock Data
        $data = [
            'location' => $location,
            'temp_c' => 22,
            'condition' => 'Sunny',
            'humidity' => 45,
            'wind_kph' => 10,
            'mock' => true
        ];

        return response()->json($data);
    }

    public function detailed(Request $request)
    {
        $location = $request->input('location', 'Madrid');

        // Check cache (valid for 1 hour)
        $cacheKey = "weather_detailed_{$location}";
        $cached = WeatherReport::where('location', $cacheKey)
            ->where('fetched_at', '>=', Carbon::now()->subHour())
            ->first();

        if ($cached) {
            return response()->json($cached->data);
        }

        // Get coordinates for the city
        $coords = self::$cities[$location] ?? self::$cities['Madrid'];

        try {
            $response = Http::get("https://api.open-meteo.com/v1/forecast", [
                'latitude' => $coords['lat'],
                'longitude' => $coords['lon'],
                'current' => 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
                'hourly' => 'temperature_2m,precipitation_probability,weather_code',
                'daily' => 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                'timezone' => 'auto',
                'forecast_days' => 7
            ]);

            if ($response->successful()) {
                $apiData = $response->json();

                $data = [
                    'location' => $location,
                    'current' => $apiData['current'],
                    'hourly' => $apiData['hourly'],
                    'daily' => $apiData['daily'],
                    'timezone' => $apiData['timezone'],
                    'fetched_at' => Carbon::now()->toIso8601String(),
                ];

                WeatherReport::updateOrCreate(
                    ['location' => $cacheKey],
                    [
                        'data' => $data,
                        'fetched_at' => Carbon::now(),
                    ]
                );

                return response()->json($data);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['error' => 'Unable to fetch weather data'], 500);
    }

    public function cities()
    {
        return response()->json(array_keys(self::$cities));
    }
}
