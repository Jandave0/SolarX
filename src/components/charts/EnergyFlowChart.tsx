import React from 'react';
import { View, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
} from 'victory-native';
import { Typography } from '@/components/ui/Typography';

const { width } = Dimensions.get('window');

const data = [
  { time: 1, production: 0, consumption: 2 },
  { time: 4, production: 0, consumption: 1.5 },
  { time: 7, production: 0.5, consumption: 3 },
  { time: 10, production: 4, consumption: 2 },
  { time: 13, production: 7, consumption: 1.5 },
  { time: 16, production: 5, consumption: 4 },
  { time: 19, production: 1, consumption: 5 },
  { time: 22, production: 0, consumption: 3 },
];

export const EnergyFlowChart = () => {
  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-4 px-2">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-primary" />
          <Typography variant="caption">Production (kW)</Typography>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-error" />
          <Typography variant="caption">Consumption (kW)</Typography>
        </View>
      </View>

      {/* 2. MOVED WIDTH AND HEIGHT DIRECTLY TO VICTORYCHART */}
      <VictoryChart
        width={width - 60}
        height={220}
        padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
        domainPadding={{ x: 10 }}
      >
        {/* Production Area */}
        <VictoryArea
          data={data}
          x="time"
          y="production"
          style={{
            data: {
              fill: '#FFB703',
              fillOpacity: 0.2,
              stroke: '#FFB703',
              strokeWidth: 3,
            },
          }}
          interpolation="natural"
        />

        {/* Consumption Line */}
        <VictoryLine
          data={data}
          x="time"
          y="consumption"
          style={{
            data: {
              stroke: '#EF4444',
              strokeWidth: 2,
              strokeDasharray: '5,5',
            },
          }}
          interpolation="natural"
        />

        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'rgba(255,255,255,0.1)' },
            tickLabels: { fill: 'rgba(255,255,255,0.5)', fontSize: 10 },
            grid: { stroke: 'rgba(255,255,255,0.05)' },
          }}
        />

        <VictoryAxis
          style={{
            axis: { stroke: 'rgba(255,255,255,0.1)' },
            tickLabels: { fill: 'rgba(255,255,255,0.5)', fontSize: 10 },
          }}
          tickValues={[1, 7, 13, 19]}
          tickFormat={(t: number) => `${t}:00`}
        />
      </VictoryChart>
    </View>
  );
};