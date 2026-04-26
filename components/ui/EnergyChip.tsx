import { View, ViewProps } from 'react-native';
import { Typography } from './Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EnergyChipProps extends ViewProps {
  status: 'Gold' | 'Blue' | 'Rose' | 'success' | 'warning';
  label: string;
  icon?: string; // optional icon name from MaterialCommunityIcons
}

export function EnergyChip({ status, label, icon, className = '', ...props }: EnergyChipProps) {
  const bgColors = {
    Gold: 'bg-primary-container/20',
    Blue: 'bg-secondary-container/20',
    Rose: 'bg-tertiary-container/20',
    success: 'bg-success/20',
    warning: 'bg-warning/20',
  };
  
  const textColors = {
    Gold: 'text-primary-container',
    Blue: 'text-secondary-container',
    Rose: 'text-tertiary-container',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <View className={`rounded-full px-3 py-1 border border-white/5 flex flex-row items-center gap-1 ${bgColors[status]} ${className}`} {...props}>
      {icon && <MaterialCommunityIcons name={icon as any} size={14} color="currentColor" />}
      <Typography variant="label-caps" className={textColors[status]}>
        {label}
      </Typography>
    </View>
  );
}
