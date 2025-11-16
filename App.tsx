
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { OpenMeteoResponse, WeatherData, Coordinates } from './types';
import WeatherDisplay from './components/WeatherDisplay';

const App: React.FC = () => {
    const [studentIndex, setStudentIndex] = useState<string>('224159X');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isFromCache, setIsFromCache] = useState<boolean>(false);

    const coords: Coordinates | null = useMemo(() => {
        if (studentIndex.length < 4) return null;
        const firstTwo = parseInt(studentIndex.substring(0, 2), 10);
        const nextTwo = parseInt(studentIndex.substring(2, 4), 10);

        if (isNaN(firstTwo) || isNaN(nextTwo)) return null;

        const lat = 5 + (firstTwo / 10.0);
        const lon = 79 + (nextTwo / 10.0);

        return {
            lat: parseFloat(lat.toFixed(2)),
            lon: parseFloat(lon.toFixed(2)),
        };
    }, [studentIndex]);

    useEffect(() => {
        const cachedData = localStorage.getItem('weatherCache');
        if (cachedData) {
            try {
                const parsedData: WeatherData = JSON.parse(cachedData);
                setWeatherData(parsedData);
                setIsFromCache(true);
            } catch (e) {
                console.error("Failed to parse cached weather data", e);
                localStorage.removeItem('weatherCache');
            }
        }
    }, []);

    const fetchWeather = useCallback(async () => {
        if (!coords) {
            setError("Invalid student index. Please enter at least 4 digits.");
            return;
        }
        setIsLoading(true);
        setError(null);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data: OpenMeteoResponse = await response.json();

            const newWeatherData: WeatherData = {
                latitude: data.latitude,
                longitude: data.longitude,
                temperature: data.current_weather.temperature,
                windspeed: data.current_weather.windspeed,
                weathercode: data.current_weather.weathercode,
                lastUpdated: new Date().toISOString(),
                requestUrl: url,
            };

            setWeatherData(newWeatherData);
            setIsFromCache(false);
            localStorage.setItem('weatherCache', JSON.stringify(newWeatherData));

        } catch (err) {
            console.error(err);
            setError("Failed to fetch live weather data. Please check your network connection. Displaying cached result if available.");
            if(weatherData){
                setIsFromCache(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [coords, weatherData]);

    const handleFetchClick = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWeather();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 font-sans text-slate-800 p-4 sm:p-6">
            <main className="max-w-lg mx-auto flex flex-col items-center space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Personalized Weather Dashboard</h1>
                    <p className="text-slate-600 mt-2">Weather data based on your student index.</p>
                </header>

                <div className="w-full p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
                    <form onSubmit={handleFetchClick} className="space-y-4">
                        <div>
                            <label htmlFor="studentIndex" className="block text-sm font-medium text-slate-700 mb-1">
                                Student Index
                            </label>
                            <input
                                type="text"
                                id="studentIndex"
                                value={studentIndex}
                                onChange={(e) => setStudentIndex(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-slate-400"
                                placeholder="e.g., 224159X"
                            />
                        </div>
                        <div className="text-sm text-slate-600 h-5">
                            {coords && `Computed Coords: Lat ${coords.lat}, Lon ${coords.lon}`}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !coords}
                            className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Fetching...
                                </>
                            ) : "Fetch Weather"}
                        </button>
                    </form>
                </div>
                
                <div className="w-full">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    {!isLoading && weatherData && (
                        <WeatherDisplay data={weatherData} isFromCache={isFromCache} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;