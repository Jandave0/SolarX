import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';
import { Typography } from './Typography';

interface CircularGaugeProps {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  color?: string;
  label?: string;
  subLabel?: string;
}

// ⚡ Bolt Optimization: Wrapped in React.memo() to prevent unnecessary re-renders
export const CircularGauge = React.memo(function CircularGauge({
  size = 180,
  strokeWidth = 12,
  percentage = 0,
  color = '#FFB703',
  label,
  subLabel,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Calculate marker position
  const angle = (percentage / 100) * 360 - 90; // -90 to start from top
  const markerX = size / 2 + radius * Math.cos((angle * Math.PI) / 180);
  const markerY = size / 2 + radius * Math.sin((angle * Math.PI) / 180);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gaugeGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </LinearGradient>
          
          <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="40%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Glowing Head Marker (Layered for cross-platform support) */}
        {/* Outer Glow */}
        <Circle
          cx={markerX}
          cy={markerY}
          r={strokeWidth + 4}
          fill="url(#glowGradient)"
          opacity={0.6}
        />
        {/* Inner Core */}
        <Circle
          cx={markerX}
          cy={markerY}
          r={strokeWidth / 2 + 1}
          fill={color}
        />
        {/* Shine Highlight */}
        <Circle
          cx={markerX - 1}
          cy={markerY - 1}
          r={strokeWidth / 4}
          fill="rgba(255,255,255,0.4)"
        />
      </Svg>
      
      <View className="absolute items-center">
        {label && <Typography variant="h2" className="text-white">{label}</Typography>}
        {subLabel && <Typography variant="caption" className="text-text-muted mt-[-4px]">{subLabel}</Typography>}
      </View>
    </View>
  );
});
