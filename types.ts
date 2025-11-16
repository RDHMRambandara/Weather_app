// FIX: Import React type definitions to make React types like React.ReactElement available.
import type React from 'react';

// From API response
export interface CurrentWeatherAPI {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeatherAPI;
}

// For app state and cache
export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  windspeed: number;
  weathercode: number;
  lastUpdated: string;
  requestUrl: string;
}

export interface WeatherDisplayInfo {
  // FIX: Use React.ReactElement instead of JSX.Element to fix missing namespace error.
  icon: React.ReactElement;
  description: string;
}

export interface Coordinates {
    lat: number;
    lon: number;
}