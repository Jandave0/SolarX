import { useState, useEffect } from 'react';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface TiltData {
  tilt: number; // Pitch (up/down)
  roll: number; // Left/right tilt
  azimuth: number; // Compass heading
}

export const useTiltSensor = (updateInterval = 100) => {
  const [data, setData] = useState<TiltData>({ tilt: 0, roll: 0, azimuth: 0 });

  useEffect(() => {
    Accelerometer.setUpdateInterval(updateInterval);
    Magnetometer.setUpdateInterval(updateInterval);

    // ⚡ Bolt Optimization: Store subscriptions in local variables instead of React state.
    // This prevents a memory leak and bridge spam, as the cleanup function would otherwise
    // close over the initial null state due to the empty dependency array.
    const accelSub = Accelerometer.addListener(({ x, y, z }) => {
      // Calculate tilt (pitch) and roll from accelerometer data
      const pitch = Math.atan2(-x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);
      const roll = Math.atan2(y, z) * (180 / Math.PI);

      setData(prev => ({ ...prev, tilt: Math.round(pitch), roll: Math.round(roll) }));
    });

    const magSub = Magnetometer.addListener(({ x, y }) => {
      // Calculate azimuth (heading) from magnetometer data
      let heading = Math.atan2(y, x) * (180 / Math.PI);
      heading = heading < 0 ? heading + 360 : heading;

      setData(prev => ({ ...prev, azimuth: Math.round(heading) }));
    });

    return () => {
      accelSub.remove();
      magSub.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
};
