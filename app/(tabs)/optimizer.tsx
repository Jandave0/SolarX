import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { useTiltSensor } from '@/hooks/useTiltSensor';

const TARGET_TILT = 35;
const TARGET_AZIMUTH = 180;
const TOLERANCE = 5;

export default function OptimizerScreen() {
  const { tilt, roll, azimuth } = useTiltSensor(50);
  
  // Shared values for animation
  const animatedTilt = useSharedValue(0);
  const animatedRoll = useSharedValue(0);
  const animatedAzimuth = useSharedValue(0);

  useEffect(() => {
    animatedTilt.value = withSpring(tilt);
    animatedRoll.value = withSpring(roll);
    animatedAzimuth.value = withSpring(azimuth);

    // Haptic feedback when near target
    const isAligned = 
      Math.abs(tilt - TARGET_TILT) < TOLERANCE && 
      Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE;
    
    if (isAligned) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [tilt, roll, azimuth]);

  const bubbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(animatedRoll.value, [-45, 45], [-80, 80], Extrapolate.CLAMP) },
        { translateY: interpolate(animatedTilt.value, [-45, 45], [80, -80], Extrapolate.CLAMP) },
      ],
    };
  });

  const isAligned = 
    Math.abs(tilt - TARGET_TILT) < TOLERANCE && 
    Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE;

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
          {/* Target Reticle */}
          <View 
            style={[
              styles.targetReticle, 
              { borderColor: isAligned ? '#FFB703' : 'rgba(255,255,255,0.1)' }
            ]} 
          />
          
          {/* Moving Bubble */}
          <Animated.View style={[styles.bubble, bubbleStyle]}>
            <View className="w-full h-full rounded-full bg-primary opacity-80" />
            <View className="absolute w-4 h-4 rounded-full bg-white opacity-40 top-2 left-2" />
          </Animated.View>

          {/* Compass Ring */}
          <View className="absolute bottom-4 flex-row gap-4">
             <EnergyChip 
              label={`${azimuth}°`} 
              icon="compass-outline" 
              status={Math.abs(azimuth - TARGET_AZIMUTH) < TOLERANCE ? 'success' : 'warning'} 
            />
          </View>
        </GlassPanel>

        {/* Readout Grid */}
        <View className="flex-row gap-4">
          <Card className="flex-1 p-4 gap-2">
            <Typography variant="label" className="text-text-muted">CURRENT TILT</Typography>
            <Typography variant="h2">{tilt}°</Typography>
            <Typography variant="caption" className="text-primary">Target: {TARGET_TILT}°</Typography>
          </Card>
          <Card className="flex-1 p-4 gap-2">
            <Typography variant="label" className="text-text-muted">ROLL (LEVEL)</Typography>
            <Typography variant="h2">{roll}°</Typography>
            <Typography variant="caption" className={Math.abs(roll) < 2 ? 'text-success' : 'text-text-muted'}>
              {Math.abs(roll) < 2 ? 'Level' : 'Adjust'}
            </Typography>
          </Card>
        </View>

        <Card className="p-5 gap-4">
          <View className="flex-row items-center justify-between">
            <Typography variant="h3">Alignment Guide</Typography>
            <View className={`w-3 h-3 rounded-full ${isAligned ? 'bg-success' : 'bg-warning'}`} />
          </View>
          <Typography variant="body" className="text-text-muted">
            {isAligned 
              ? "Perfect! Your device is aligned with the optimal solar harvesting angle."
              : "Tilt your device until the golden bubble stays within the center ring."}
          </Typography>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  targetReticle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    position: 'absolute',
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#FFB703',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  }
});
