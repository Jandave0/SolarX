import { View, ScrollView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FORECAST = [
  { day: 'Mon', temp: 28, condition: 'Sunny', irradiance: 950 },
  { day: 'Tue', temp: 26, condition: 'Cloudy', irradiance: 420 },
  { day: 'Wed', temp: 24, condition: 'Rain', irradiance: 150 },
  { day: 'Thu', temp: 29, condition: 'Sunny', irradiance: 980 },
  { day: 'Fri', temp: 30, condition: 'Clear', irradiance: 1020 },
];

export default function WeatherScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-6 pb-10">
        <View>
          <Typography variant="h1">Weather & Harvest</Typography>
          <Typography variant="body" className="text-text-muted">
            Solar irradiance forecasts and production limits.
          </Typography>
        </View>

        {/* Main Forecast Card */}
        <GlassPanel className="p-5 flex-row items-center justify-between">
          <View>
            <Typography variant="caption" className="text-primary font-bold">CURRENT CONDITIONS</Typography>
            <Typography variant="h1" className="text-5xl my-1">28°C</Typography>
            <Typography variant="body" className="text-text-muted">Sunny • High Irradiance</Typography>
          </View>
          <MaterialCommunityIcons name="weather-sunny" size={64} color="#FFB703" />
        </GlassPanel>

        {/* Harvest Potential Section */}
        <View className="gap-4">
          <Typography variant="h3" className="ml-1">Harvest Potential</Typography>
          <Card className="p-5 gap-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FFB703" />
                <Typography variant="h3">Optimal Window</Typography>
              </View>
              <Typography variant="caption" className="text-success">HIGH YIELD</Typography>
            </View>
            <Typography variant="body" className="text-text-muted leading-6">
              Maximum irradiance of <Typography variant="body" className="text-white font-bold">950 W/m²</Typography> is expected between 11:30 AM and 2:15 PM. Clean your panels for 4% more yield.
            </Typography>
            <View className="flex-row gap-2">
              <EnergyChip label="9.2 kWh" status="success" icon="lightning-bolt" />
              <EnergyChip label="Clear Sky" status="success" icon="weather-sunny" />
            </View>
          </Card>
        </View>

        {/* 5-Day Forecast */}
        <View className="gap-4">
          <Typography variant="h3" className="ml-1">5-Day Forecast</Typography>
          {FORECAST.map((item, index) => (
            <Card key={index} className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-10">
                  <Typography variant="body" className="font-bold">{item.day}</Typography>
                </View>
                <MaterialCommunityIcons 
                  name={item.condition === 'Sunny' || item.condition === 'Clear' ? 'weather-sunny' : item.condition === 'Rain' ? 'weather-rainy' : 'weather-cloudy'} 
                  size={24} 
                  color={item.condition === 'Sunny' ? '#FFB703' : '#94A3B8'} 
                />
                <Typography variant="body" className="text-text-muted">{item.condition}</Typography>
              </View>
              <View className="flex-row items-center gap-6">
                <View className="items-end">
                   <Typography variant="body" className="font-bold">{item.irradiance}</Typography>
                   <Typography variant="caption" className="text-text-muted">W/m²</Typography>
                </View>
                <Typography variant="body" className="w-8 text-right font-bold">{item.temp}°</Typography>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
