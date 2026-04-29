import axios from 'axios';

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

/**
 * Fetches weather and solar irradiance data.
 * Uses Weatherstack for current conditions (using the user's API key)
 * and Open-Meteo for forecast and precise solar data.
 */
export const fetchWeatherData = async (lat = 14.5995, lon = 120.9842): Promise<WeatherData> => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
    
    // 1. Fetch Current Weather from Weatherstack (requires API Key)
    const weatherstackPromise = apiKey 
      ? axios.get(`https://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}`)
          .catch(err => {
            console.warn('Weatherstack fetch failed:', err.message);
            return null;
          })
      : Promise.resolve(null);

    // 2. Fetch Forecast and Solar data from Open-Meteo (more accurate for irradiance)
    const openMeteoPromise = axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,shortwave_radiation&daily=weather_code,temperature_2m_max,shortwave_radiation_sum&timezone=auto`
    );

    const [wsResponse, omResponse] = await Promise.all([weatherstackPromise, openMeteoPromise]);

    const omData = omResponse.data;
    const omCurrent = omData.current;
    const omDaily = omData.daily;

    // Default values from Open-Meteo
    let temp = Math.round(omCurrent.temperature_2m);
    let condition = 'Clear';
    let irradiance = Math.round(omCurrent.shortwave_radiation);

    // If Weatherstack succeeded, use its current condition and temp for "official" feel
    if (wsResponse && wsResponse.data && !wsResponse.data.error) {
      const wsCurrent = wsResponse.data.current;
      temp = Math.round(wsCurrent.temperature);
      condition = wsCurrent.weather_descriptions[0] || 'Clear';
      // Supplement irradiance if it's missing or zero in Open-Meteo (e.g. night)
      if (irradiance === 0 && wsCurrent.uv_index > 0) {
        irradiance = Math.round(wsCurrent.uv_index * 100);
      }
    } else {
      // Fallback condition mapping for Open-Meteo
      const CONDITION_MAP: Record<number, string> = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain', 71: 'Snow',
        80: 'Showers', 95: 'Thunderstorm',
      };
      condition = CONDITION_MAP[omCurrent.weather_code] || 'Clear';
    }

    // Process Forecast from Open-Meteo (since Weatherstack free doesn't provide it)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = omDaily.time.slice(0, 5).map((time: string, i: number) => {
      const date = new Date(time);
      const CONDITION_MAP: Record<number, string> = {
        0: 'Sunny', 1: 'Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
        45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain', 71: 'Snow',
        80: 'Rain', 95: 'Storm',
      };
      
      return {
        day: days[date.getDay()],
        temp: Math.round(omDaily.temperature_2m_max[i]),
        condition: CONDITION_MAP[omDaily.weather_code[i]] || 'Cloudy',
        irradiance: Math.round(omDaily.shortwave_radiation_sum[i] / 3.6), // Convert MJ/m2 to avg W/m2
      };
    });

    return {
      current: {
        temp,
        condition,
        irradiance,
      },
      forecast,
    };
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    throw error;
  }
};

