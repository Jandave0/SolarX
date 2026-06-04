import { useSQLiteContext, PanelConfigRecord } from '@/src/services/database';
import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  interpolateColor,
  Extrapolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { useTiltSensor } from '@/hooks/useTiltSensor';

const OPTIMAL_TILT_PH = 15; // Optimal tilt for Philippines (Latitude 14.6)
const TARGET_AZIMUTH = 180; // Facing South
const TOLERANCE = 4;

export default function OptimizerScreen() {
  const { tilt, roll, azimuth } = useTiltSensor(50);

  // Shared values for animation
  const animatedTilt = useSharedValue(0);
  const animatedRoll = useSharedValue(0);
  const animatedAzimuth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const db = useSQLiteContext();
  const [targetTilt, setTargetTilt] = React.useState(OPTIMAL_TILT_PH);
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    // Check if we have a saved calibration in the DB
    const checkSaved = async () => {
      try {
        const saved = await db.getFirstAsync<PanelConfigRecord>('SELECT * FROM panel_configs LIMIT 1');
        if (saved) {
          setTargetTilt(saved.target_tilt);
        }
      } catch (e) {
        console.log('No saved config');
      }
    };
    checkSaved();
  }, [db]);

  useEffect(() => {
    animatedTilt.value = withSpring(tilt);
    animatedRoll.value = withSpring(roll);
    animatedAzimuth.value = withSpring(azimuth);

    // Haptic feedback and glow when near target
    const isAlignedNow =
      Math.abs(tilt - targetTilt) < TOLERANCE &&
      Math.abs(roll) < 2 &&
      Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE;

    if (isAlignedNow) {
      if (glowOpacity.value === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      glowOpacity.value = withSpring(1);
    } else {
      glowOpacity.value = withSpring(0);
    }
  }, [tilt, roll, azimuth, targetTilt]);

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(animatedRoll.value, [-30, 30], [-100, 100], Extrapolate.CLAMP) },
        { translateY: interpolate(animatedTilt.value - targetTilt, [-30, 30], [100, -100], Extrapolate.CLAMP) },
      ],
      backgroundColor: interpolateColor(glowOpacity.value, [0, 1], ['#FFB703', '#FFD60A']), 
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: interpolate(glowOpacity.value, [0, 1], [0.8, 1.2]) }],
  }));

  const isAligned =
    Math.abs(tilt - targetTilt) < TOLERANCE &&
    Math.abs(roll) < 2 &&
    Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE;

  const handleSaveCalibration = async () => {
    setIsSaving(true);
    try {
      await db.runAsync('DELETE FROM panel_configs'); // Keep only one config for now
      await db.runAsync(
        'INSERT INTO panel_configs (target_tilt, target_azimuth, date) VALUES (?, ?, ?)',
        [tilt, azimuth, new Date().toISOString()]
      );
      setTargetTilt(tilt);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-6 pb-10">
        <View>
          <Typography variant="h1">Smart Tilt</Typography>
          <Typography variant="body" className="text-text-muted">
            Align your device with your solar panel surface for optimal harvest.
          </Typography>
        </View>

        {/* Real-time Level Indicator */}
        <GlassPanel className="h-80 items-center justify-center overflow-hidden">
          {/* Alignment Glow */}
          <Animated.View
            className="absolute w-[120px] h-[120px] rounded-full bg-primary-container"
            style={[
              {
                opacity: 0.2,
              },
              glowStyle
            ]}
          />

          {/* Target Reticle */}
          <View
            className={`w-[60px] h-[60px] rounded-full border-2 border-dashed absolute ${
              isAligned ? 'border-primary-container' : 'border-white/20'
            }`}
          />

          {/* Moving Bubble */}
          <Animated.View 
            className="w-[40px] h-[40px] rounded-full shadow-[0_0_10px_#FFB703] elevation-5" 
            style={[bubbleStyle]}
          >
            <View className="w-full h-full rounded-full bg-primary" />
            <View className="absolute w-4 h-4 rounded-full bg-white opacity-40 top-2 left-2" />
          </Animated.View>

          {/* Compass Ring */}
          <View className="absolute bottom-4 flex-row gap-4">
            <EnergyChip
              label={`${azimuth}°`}
              icon="compass-outline"
              status={Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE ? 'Gold' : 'Blue'}
            />
          </View>
        </GlassPanel>

        {/* Readout Grid */}
        <View className="flex-row gap-4">
          <Card className="flex-1 p-4 gap-2">
            <Typography variant="label" className="text-text-muted">CURRENT TILT</Typography>
            <Typography variant="h2">{tilt}°</Typography>
            <Typography variant="caption" className="text-primary-container">Target: {targetTilt}°</Typography>
          </Card>
          <Card className="flex-1 p-4 gap-2">
            <Typography variant="label" className="text-text-muted">ROLL (LEVEL)</Typography>
            <Typography variant="h2">{roll}°</Typography>
            <Typography variant="caption" className={Math.abs(roll) < 2 ? 'text-primary-container' : 'text-text-muted'}>
              {Math.abs(roll) < 2 ? 'CENTERED' : 'ADJUST ROLL'}
            </Typography>
          </Card>
        </View>

        <Card className="p-5 gap-4 bg-primary/5 border-primary/20">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Typography variant="h3">Optimal Harvest</Typography>
              <Typography variant="caption" className="text-text-muted">Target: {targetTilt}° Tilt • 180° South</Typography>
            </View>
            <View className={`w-4 h-4 rounded-full ${isAligned ? 'bg-primary' : 'bg-white/10'}`} />
          </View>

          <Typography variant="body" className="text-text-muted leading-6">
            {isAligned
              ? "Position maintained. Your panel is now in the high-yield sweet spot for Manila's latitude."
              : "Place your phone flat against your panel. Aim for the center circle to maximize irradiance."}
          </Typography>

          <View className="flex-row gap-3 pt-2">
            <Button
              className="flex-1 h-14"
              onPress={handleSaveCalibration}
              loading={isSaving}
            >
              SAVE CALIBRATION
            </Button>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

