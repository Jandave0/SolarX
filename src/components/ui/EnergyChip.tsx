import { View, ViewProps } from 'react-native';
import React from 'react';
import { Typography } from './Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EnergyChipProps extends ViewProps {
  status: 'Gold' | 'Blue' | 'Rose';
  label: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // optional icon name from MaterialCommunityIcons
}

// Wrapped in React.memo to prevent unnecessary re-renders when parent contexts
// (e.g. live data hooks using setInterval) update frequently.
export const EnergyChip = React.memo(function EnergyChip({ status, label, icon, className = '', ...props }: EnergyChipProps) {
  const bgColors = {
    Gold: 'bg-primary-container/15',
    Blue: 'bg-secondary-container/15',
    Rose: 'bg-tertiary-container/15',
  };
  
  const textColors = {
    Gold: 'text-primary-container',
    Blue: 'text-secondary-container',
    Rose: 'text-tertiary-container',
  };

  const borderColors = {
    Gold: 'border-primary/20',
    Blue: 'border-secondary/20',
    Rose: 'border-tertiary/20',
  };

  return (
    <View className={`rounded-full px-3 py-1 border flex flex-row items-center gap-1.5 ${bgColors[status]} ${borderColors[status]} ${className}`} {...props}>
      {icon && <MaterialCommunityIcons name={icon!} size={14} color={status === 'Gold' ? '#FFB703' : status === 'Blue' ? '#00E5FF' : '#FF4D6D'} />}
      <Typography variant="label-caps" className={`${textColors[status]} font-bold`}>
        {label}
      </Typography>
    </View>
  );
});
