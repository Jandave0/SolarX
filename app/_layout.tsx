import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';



// Import the specific font objects
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { PlusJakartaSans_400Regular, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import '../global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { migrateDbIfNeeded } from '@/src/services/database';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Outfit': Outfit_400Regular,
    'Outfit-Bold': Outfit_700Bold,
    'Plus Jakarta Sans': PlusJakartaSans_400Regular,
    'Plus Jakarta Sans-Bold': PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="solarx.db" onInit={migrateDbIfNeeded}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="assessment" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
