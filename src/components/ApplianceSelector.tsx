import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Typography } from './ui/Typography';
import { GlassPanel } from './ui/GlassPanel';
import { appliancePresets, Appliance } from '../data/appliancePresets';
import { useAssessmentStore } from '../store/assessmentStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ApplianceChipProps {
  appliance: Appliance;
  isSelected: boolean;
  onToggle: (appliance: Appliance) => void;
}

const ApplianceChip = ({ appliance, isSelected, onToggle }: ApplianceChipProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isSelected 
        ? 'rgba(255, 183, 3, 0.2)' 
        : 'rgba(255, 255, 255, 0.05)',
      borderColor: isSelected 
        ? '#FFB703' 
        : 'rgba(255, 255, 255, 0.1)',
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onToggle(appliance);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          width: '31%',
          aspectRatio: 1,
          borderRadius: 20,
          borderWidth: 1,
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }
      ]}
    >
      <MaterialCommunityIcons 
        name={appliance.icon as any} 
        size={28} 
        color={isSelected ? '#FFB703' : 'rgba(255,255,255,0.4)'} 
      />
      <Typography 
        variant="label" 
        className={`mt-2 text-center text-[10px] leading-[12px] ${isSelected ? 'text-primary-container' : 'text-white/40'}`}
        numberOfLines={2}
      >
        {appliance.name.split(' (')[0]}
      </Typography>
      
      {isSelected && (
        <View className="absolute top-1 right-1 bg-primary-container rounded-full p-0.5">
          <MaterialCommunityIcons name="check" size={10} color="#131317" />
        </View>
      )}
    </AnimatedPressable>
  );
};

export const ApplianceSelector = () => {
  const { selectedAppliances, toggleAppliance } = useAssessmentStore();

  return (
    <View className="flex-1">
      <View className="flex-row flex-wrap justify-between">
        {appliancePresets.map((appliance) => (
          <ApplianceChip
            key={appliance.id}
            appliance={appliance}
            isSelected={selectedAppliances.some((a) => a.id === appliance.id)}
            onToggle={toggleAppliance}
          />
        ))}
      </View>
      
      <View className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <Typography variant="label" className="text-white/30 text-center">
          {selectedAppliances.length} Appliances Selected
        </Typography>
      </View>
    </View>
  );
};
