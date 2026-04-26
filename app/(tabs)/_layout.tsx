import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#16161A', // Base Background
        },
        headerTintColor: '#FFFFFF', // Text Color
        tabBarStyle: {
          backgroundColor: '#16161A',
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          ...Platform.select({
            ios: {
              height: 88,
              paddingBottom: 28,
            },
            android: {
              height: 60,
              paddingBottom: 8,
            },
          }),
        },
        tabBarActiveTintColor: '#FFB703', // Solar Gold
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)', // Muted Text
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hardware"
        options={{
          title: 'Hardware',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="solar-panel" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-partly-cloudy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="optimizer"
        options={{
          title: 'Optimizer',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="sun-compass" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
