import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    irradiance: number;
  };
  forecast: {
    day: string;
    temp: number;
    condition: string;
    irradiance: number;
  }[];
}

const CONDITION_MAP: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  61: 'Rain',
  71: 'Snow',
  80: 'Showers',
  95: 'Thunderstorm',
};

const CACHE_KEY_PREFIX = 'weather_data_';
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

// In-memory cache to avoid AsyncStorage overhead for repeated calls in same session
const memoryCache = new Map<string, { timestamp: number; data: WeatherData }>();

export const fetchWeatherData = async (lat = 14.5995, lon = 120.9842): Promise<WeatherData> => {
  const cacheKey = `${CACHE_KEY_PREFIX}${lat}_${lon}`;
  const now = Date.now();

  // 1. Check in-memory cache
  const memCached = memoryCache.get(cacheKey);
  if (memCached && now - memCached.timestamp < CACHE_EXPIRATION_MS) {
    return memCached.data;
  }

  // 2. Check persistent storage cache
  try {
    const stored = await AsyncStorage.getItem(cacheKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (now - parsed.timestamp < CACHE_EXPIRATION_MS) {
        // Hydrate memory cache
        memoryCache.set(cacheKey, parsed);
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn('Weather Cache Read Error:', err);
  }

  // 3. Fetch from API
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,shortwave_radiation&daily=weather_code,temperature_2m_max,shortwave_radiation_sum&timezone=auto`
    );

    const { current, daily } = response.data;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const count = Math.min(daily.time.length, 5);
    const forecast = new Array(count);

    if (count > 0) {
      const startDay = new Date(daily.time[0]).getDay();
      const INV_3_6 = 1 / 3.6;

      for (let i = 0; i < count; i++) {
        forecast[i] = {
          day: days[(startDay + i) % 7],
          temp: Math.round(daily.temperature_2m_max[i]),
          condition: CONDITION_MAP[daily.weather_code[i]] || 'Cloudy',
          irradiance: Math.round(daily.shortwave_radiation_sum[i] * INV_3_6),
        };
      }
    }

    const weatherData: WeatherData = {
      current: {
        temp: Math.round(current.temperature_2m),
        condition: CONDITION_MAP[current.weather_code] || 'Clear',
        irradiance: Math.round(current.shortwave_radiation),
      },
      forecast,
    };

    // Update caches
    const cacheObject = { timestamp: now, data: weatherData };
    memoryCache.set(cacheKey, cacheObject);

    AsyncStorage.setItem(cacheKey, JSON.stringify(cacheObject)).catch(err => {
      console.warn('Weather Cache Write Error:', err);
    });

    return weatherData;
  } catch (error) {
    console.error('Weather Fetch Error:', error);

    // Fallback: If API fails, try to return stale cache if available
    try {
      const stored = await AsyncStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.warn('Returning stale weather data due to API failure');
        return parsed.data;
      }
    } catch {
       // Ignore
    }

    throw error;
  }
};
