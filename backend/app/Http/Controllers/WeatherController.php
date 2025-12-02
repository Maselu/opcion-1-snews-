<?php

namespace App\Http\Controllers;

use App\Models\WeatherReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class WeatherController extends Controller
{
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

        // Fetch from Open-Meteo (Free, No Key)
        // Madrid Coordinates: 40.4168, -3.7038
        // We could add a geocoding step, but for now we'll default to Madrid if location is Madrid
        $lat = 40.4168;
        $lon = -3.7038;

        try {
            $response = Http::get("https://api.open-meteo.com/v1/forecast", [
                'latitude' => $lat,
                'longitude' => $lon,
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
                    'wind_kph' => 0, // Open-Meteo basic doesn't give wind in this query unless requested, simplifying
                    'fetched_at' => Carbon::now()->toIso8601String(),
                ];

                WeatherReport::create([
                    'location' => $location,
                    'data' => $data,
                    'fetched_at' => Carbon::now(),
                ]);

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
}
