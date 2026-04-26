import axios from 'axios';

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    irradiance: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    irradiance: number;
  }>;
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

export const fetchWeatherData = async (lat = 14.5995, lon = 120.9842): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,shortwave_radiation&daily=weather_code,temperature_2m_max,shortwave_radiation_sum&timezone=auto`
    );

    const { current, daily } = response.data;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const forecast = daily.time.slice(0, 5).map((time: string, i: number) => {
      const date = new Date(time);
      return {
        day: days[date.getDay()],
        temp: Math.round(daily.temperature_2m_max[i]),
        condition: CONDITION_MAP[daily.weather_code[i]] || 'Cloudy',
        irradiance: Math.round(daily.shortwave_radiation_sum[i] / 3.6), // Convert MJ/m2 to avg W/m2 (rough approx)
      };
    });

    return {
      current: {
        temp: Math.round(current.temperature_2m),
        condition: CONDITION_MAP[current.weather_code] || 'Clear',
        irradiance: Math.round(current.shortwave_radiation),
      },
      forecast,
    };
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    throw error;
  }
};
