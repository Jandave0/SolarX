import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchWeatherData, WeatherData } from '@/src/services/weatherService';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      const data = await fetchWeatherData();
      setWeather(data);
    } catch (error) {
      console.error('Weather load error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWeather();
  };
  return (
    <ScrollView 
      className="flex-1 bg-background" 
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB703" />
      }
    >
      <View className="gap-6 pb-10">
        <View>
          <Typography variant="h1">Weather & Harvest</Typography>
          <Typography variant="body" className="text-text-muted">
            Solar irradiance forecasts and production limits.
          </Typography>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFB703" className="py-20" />
        ) : weather ? (
          <>
            {/* Main Forecast Card */}
            <GlassPanel className="p-6 flex-row items-center justify-between border-white/5 shadow-xl">
              <View>
                <Typography variant="label-caps" className="text-primary-container font-bold tracking-widest">CURRENT CONDITIONS</Typography>
                <Typography variant="h1" className="text-6xl my-2">{weather.current.temp}°C</Typography>
                <Typography variant="body-md" className="text-on-surface-variant">{weather.current.condition} • {weather.current.irradiance} W/m²</Typography>
              </View>
              <View className="bg-primary-container/10 p-4 rounded-full border border-primary-container/20">
                <MaterialCommunityIcons 
                  name={weather.current.condition.includes('Rain') ? 'weather-rainy' : weather.current.condition.includes('Cloud') ? 'weather-cloudy' : 'weather-sunny'} 
                  size={56} 
                  color="#FFB703" 
                />
              </View>
            </GlassPanel>

            {/* Harvest Potential Section */}
            <View className="gap-5">
              <View className="flex-row justify-between items-end px-1">
                <Typography variant="h3">Harvest Potential</Typography>
                <Typography variant="caption" className="text-text-muted">Peak hours: 10AM - 2PM</Typography>
              </View>
              
              <GlassPanel className="p-6 gap-6 border-white/5 shadow-solar bg-surface-container/30">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-primary/20 p-2.5 rounded-xl">
                      <MaterialCommunityIcons name="timer-outline" size={22} color="#FFB703" />
                    </View>
                    <View>
                      <Typography variant="body-md" className="font-bold">Optimal Window</Typography>
                      <Typography variant="caption" className="text-text-muted">High yield duration: 4.5h</Typography>
                    </View>
                  </View>
                  <EnergyChip label={weather.current.irradiance > 600 ? "PEAK YIELD" : "STABLE"} status="Gold" />
                </View>

                {/* Yield Progress/Timeline visual placeholder */}
                <View className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex-row">
                  <View className="h-full w-[30%] bg-white/10" />
                  <View className="h-full w-[40%] bg-primary" />
                  <View className="h-full w-[30%] bg-white/10" />
                </View>

                <Typography variant="body" className="text-on-surface-variant leading-6">
                  Irradiance is peaking at <Typography variant="body" className="text-primary font-bold">{weather.current.irradiance} W/m²</Typography>. 
                  {weather.current.irradiance > 700 
                    ? " This is the ideal time for heavy appliance use (AC, Laundry)." 
                    : " Sufficient for base load and battery charging."}
                </Typography>

                <View className="flex-row gap-3">
                  <EnergyChip label={`${(weather.current.irradiance / 100).toFixed(1)} kWh/hr`} status="Gold" icon="lightning-bolt" />
                  <EnergyChip label="SOUTH FACING" status="Gold" icon="compass-outline" />
                </View>
              </GlassPanel>
            </View>

            {/* 5-Day Forecast */}
            <View className="gap-5">
              <Typography variant="h3" className="px-1">5-Day Forecast</Typography>
              {weather.forecast.map((item, index) => (
                <Card key={index} className="p-5 flex-row items-center justify-between border-white/5">
                  <View className="flex-row items-center gap-5">
                    <View className="w-12">
                      <Typography variant="body-md" className="font-bold">{item.day}</Typography>
                    </View>
                    <View className="bg-surface-container-high p-2 rounded-xl">
                      <MaterialCommunityIcons 
                        name={item.condition.includes('Sunny') || item.condition.includes('Clear') ? 'weather-sunny' : item.condition.includes('Rain') ? 'weather-rainy' : 'weather-cloudy'} 
                        size={24} 
                        color={item.condition.includes('Sunny') || item.condition.includes('Clear') ? '#FFB703' : '#8A8A9E'} 
                      />
                    </View>
                    <Typography variant="body-md" className="text-on-surface-variant">{item.condition}</Typography>
                  </View>
                  <View className="flex-row items-center gap-6">
                    <View className="items-end">
                       <Typography variant="body-md" className="font-bold text-primary-container">{item.irradiance}</Typography>
                       <Typography variant="caption" className="text-text-muted">W/m²</Typography>
                    </View>
                    <Typography variant="body-md" className="w-10 text-right font-bold">{item.temp}°</Typography>
                  </View>
                </Card>
              ))}
            </View>
          </>
        ) : (
          <View className="py-20 items-center">
            <Typography variant="body" className="text-text-muted">Unable to load weather data.</Typography>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
