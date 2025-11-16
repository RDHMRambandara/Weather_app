
import React from 'react';
import type { WeatherData, WeatherDisplayInfo } from '../types';
import {
  SunIcon, CloudSunIcon, CloudIcon, CloudFogIcon, CloudDrizzleIcon,
  CloudRainIcon, CloudSnowIcon, CloudLightningIcon, ThermometerIcon,
  WindIcon, MapPinIcon, ClockIcon, LinkIcon, IconWrapper,
} from './icons';

const getWeatherDisplayInfo = (weathercode: number): WeatherDisplayInfo => {
  switch (weathercode) {
    case 0: return { icon: <SunIcon className="text-yellow-400" />, description: 'Clear sky' };
    case 1: return { icon: <CloudSunIcon className="text-gray-400" />, description: 'Mainly clear' };
    case 2: return { icon: <CloudSunIcon className="text-gray-500" />, description: 'Partly cloudy' };
    case 3: return { icon: <CloudIcon className="text-gray-600" />, description: 'Overcast' };
    case 45:
    case 48: return { icon: <CloudFogIcon className="text-gray-500" />, description: 'Fog' };
    case 51:
    case 53:
    case 55: return { icon: <CloudDrizzleIcon className="text-blue-400" />, description: 'Drizzle' };
    case 61:
    case 63:
    case 65: return { icon: <CloudRainIcon className="text-blue-500" />, description: 'Rain' };
    case 71:
    case 73:
    case 75: return { icon: <CloudSnowIcon className="text-blue-300" />, description: 'Snow fall' };
    case 80:
    case 81:
    case 82: return { icon: <CloudRainIcon className="text-blue-600" />, description: 'Rain showers' };
    case 95:
    case 96:
    case 99: return { icon: <CloudLightningIcon className="text-yellow-500" />, description: 'Thunderstorm' };
    default: return { icon: <CloudIcon className="text-gray-500" />, description: 'Unknown weather' };
  }
};

interface WeatherDisplayProps {
  data: WeatherData;
  isFromCache: boolean;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, isFromCache }) => {
  const { icon, description } = getWeatherDisplayInfo(data.weathercode);
  const formattedDate = new Date(data.lastUpdated).toLocaleString();

  // FIX: Use React.ReactElement instead of JSX.Element to fix missing namespace error.
  const InfoRow: React.FC<{ icon: React.ReactElement; label: string; value: string | React.ReactNode; className?: string }> = ({ icon, label, value, className }) => (
    <div className={`flex items-center space-x-3 text-sm ${className}`}>
      <IconWrapper className="text-slate-500">{icon}</IconWrapper>
      <span className="font-medium text-slate-600 w-28">{label}</span>
      <span className="text-slate-800 font-semibold">{value}</span>
    </div>
  );
  
  return (
    <div className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-200 pb-4">
            <div className="flex items-center">
                <div className="w-16 h-16">{React.cloneElement(icon, { width: '64', height: '64' })}</div>
                <div className="ml-4">
                    <h2 className="text-3xl font-bold text-slate-800">{data.temperature}°C</h2>
                    <p className="text-slate-600 capitalize">{description}</p>
                </div>
            </div>
            {isFromCache && (
                <span className="mt-2 sm:mt-0 text-xs font-semibold bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                    (cached)
                </span>
            )}
        </div>
      
        <div className="space-y-4">
            <InfoRow icon={<ThermometerIcon />} label="Temperature" value={`${data.temperature}°C`} />
            <InfoRow icon={<WindIcon />} label="Wind Speed" value={`${data.windspeed} km/h`} />
            <InfoRow icon={<MapPinIcon />} label="Coordinates" value={`Lat: ${data.latitude}, Lon: ${data.longitude}`} />
            <InfoRow icon={<ClockIcon />} label="Last Updated" value={formattedDate} />
            <InfoRow 
                icon={<LinkIcon />} 
                label="Request URL" 
                value={<a href={data.requestUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-xs">{data.requestUrl}</a>}
                className="items-start"
            />
        </div>
    </div>
  );
};

export default WeatherDisplay;