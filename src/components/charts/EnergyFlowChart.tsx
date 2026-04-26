import React from 'react';
import { View, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryScatter,
} from 'victory-native';
import { Svg, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Typography } from '@/components/ui/Typography';

const { width } = Dimensions.get('window');

const data = [
  { time: 1, production: 0, consumption: 2.2 },
  { time: 4, production: 0, consumption: 1.8 },
  { time: 7, production: 0.8, consumption: 3.2 },
  { time: 10, production: 4.5, consumption: 2.5 },
  { time: 13, production: 8.2, consumption: 1.8 },
  { time: 16, production: 5.4, consumption: 4.2 },
  { time: 19, production: 1.2, consumption: 5.8 },
  { time: 22, production: 0, consumption: 3.5 },
];

const lastPoint = data[data.length - 1];

export const EnergyFlowChart = () => {
  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-6 px-4">
        <View className="flex-row items-center gap-2">
          <View className="w-2.5 h-2.5 rounded-full bg-[#FFB703]" style={{ shadowColor: '#FFB703', shadowRadius: 4, shadowOpacity: 0.5 }} />
          <Typography variant="label-caps" className="text-on-surface-variant">PRODUCTION</Typography>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" style={{ shadowColor: '#00E5FF', shadowRadius: 4, shadowOpacity: 0.5 }} />
          <Typography variant="label-caps" className="text-on-surface-variant">CONSUMPTION</Typography>
        </View>
      </View>

      <View style={{ height: 240 }}>
        <Svg style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFB703" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#FFB703" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
        </Svg>

        <VictoryChart
          width={width - 40}
          height={240}
          padding={{ top: 10, bottom: 40, left: 45, right: 25 }}
          domainPadding={{ x: 15 }}
        >
          {/* Production Area */}
          <VictoryArea
            data={data}
            x="time"
            y="production"
            style={{
              data: {
                fill: 'url(#productionGradient)',
                stroke: '#FFB703',
                strokeWidth: 3,
              },
            }}
            interpolation="natural"
          />

          {/* Consumption Area (Subtle) */}
          <VictoryArea
            data={data}
            x="time"
            y="consumption"
            style={{
              data: {
                fill: 'url(#consumptionGradient)',
                stroke: '#00E5FF',
                strokeWidth: 2,
                strokeDasharray: '4,4',
              },
            }}
            interpolation="natural"
          />

          {/* Glowing Head: Production */}
          <VictoryScatter
            data={[lastPoint]}
            x="time"
            y="production"
            size={4}
            style={{
              data: {
                fill: '#FFB703',
                stroke: '#FFB703',
                strokeWidth: 8,
                strokeOpacity: 0.3,
              },
            }}
          />

          {/* Glowing Head: Consumption */}
          <VictoryScatter
            data={[lastPoint]}
            x="time"
            y="consumption"
            size={4}
            style={{
              data: {
                fill: '#00E5FF',
                stroke: '#00E5FF',
                strokeWidth: 8,
                strokeOpacity: 0.3,
              },
            }}
          />

          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fill: '#8A8A9E', fontSize: 10, fontFamily: 'Plus Jakarta Sans' },
              grid: { stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '4,4' },
            }}
            tickFormat={(x: number) => `${x}kW`}
          />

          <VictoryAxis
            style={{
              axis: { stroke: 'rgba(255,255,255,0.05)' },
              tickLabels: { fill: '#8A8A9E', fontSize: 10, fontFamily: 'Plus Jakarta Sans' },
            }}
            tickValues={[1, 7, 13, 19, 22]}
            tickFormat={(t: number) => `${t}:00`}
          />
        </VictoryChart>
      </View>
    </View>
  );
};