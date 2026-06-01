import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CircularGauge } from '@/components/ui/CircularGauge';
import { EnergyFlowChart } from '@/src/components/charts/EnergyFlowChart';
import { Button } from '@/components/ui/Button';
import { router, Href } from 'expo-router';
import { AssessmentHistory } from '@/components/AssessmentHistory';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSQLiteContext, AssessmentRecord } from '@/src/services/database';
import React, { useEffect, useState } from 'react';
import { useEnergySimulation } from '@/src/hooks/useEnergySimulation';

export default function DashboardScreen() {
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  const liveData = useEnergySimulation();

  const db = useSQLiteContext();

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const latest = await db.getFirstAsync<AssessmentRecord>('SELECT * FROM assessments ORDER BY date DESC LIMIT 1');
        setLatestAssessment(latest);
      } catch (e) {
        console.error(e);
      }
    };
    loadLatest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-6 pb-10">
        <View className="flex-row justify-between items-end">
          <View>
            <View className="flex-row items-center gap-3">
              <Typography variant="h1">SolarX Live</Typography>
              <TouchableOpacity onPress={() => router.push('/settings' as Href)} className="bg-surface-container/50 p-2 rounded-full border border-white/5">
                <MaterialCommunityIcons name="cog" size={20} color="#FFB703" />
              </TouchableOpacity>
            </View>
            <Typography variant="body" className="text-text-muted">
              Monitoring your energy ecosystem.
            </Typography>
          </View>
          <EnergyChip label="SYSTEM LIVE" status="Gold" />
        </View>

        {/* Solar Pulse Gauge Section */}
        <View className="items-center py-4">
          <CircularGauge 
            percentage={(liveData.solarProduction / 10) * 100} 
            label={liveData.solarProduction.toString()} 
            subLabel="kW PRODUCED" 
            color="#FFB703" 
            size={220}
            strokeWidth={16}
          />
        </View>

        {/* Current Status Row */}
        <View className="flex-row gap-3">
          <EnergyChip label={`${liveData.solarProduction} kW`} icon="sun-wireless" status="Gold" />
          <EnergyChip label={`${liveData.houseConsumption} kW`} icon="home-lightning-bolt" status="Blue" />
          <EnergyChip label={`${liveData.batteryLevel}%`} icon={liveData.batteryLevel > 50 ? "battery-80" : "battery-30"} status="Blue" />
        </View>

        {/* Main Production Chart */}
        <GlassPanel className="p-4 pt-6">
          <View className="flex-row items-center justify-between mb-4 px-2">
            <Typography variant="h3">Energy Flow</Typography>
            <Typography variant="caption" className="text-text-muted">LIVE (24H)</Typography>
          </View>
          <EnergyFlowChart liveData={liveData} />
        </GlassPanel>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-4">
          <Card className="flex-1 p-5 gap-2">
            <Typography variant="label" className="text-text-muted">TODAY&apos;S HARVEST</Typography>
            <View className="flex-row items-baseline gap-1">
              <Typography variant="h2">{liveData.dailyHarvest}</Typography>
              <Typography variant="caption" className="text-text-muted font-bold">kWh</Typography>
            </View>
            <Typography variant="caption" className="text-primary-container">+12% vs yesterday</Typography>
          </Card>
          <Card className="flex-1 p-5 gap-2">
            <Typography variant="label" className="text-text-muted">GRID SAVINGS</Typography>
            <Typography variant="h2">₱{liveData.gridSavings}</Typography>
            <Typography variant="caption" className="text-secondary-container">Monthly: ₱8,450.50</Typography>
          </Card>
        </View>

        <AssessmentHistory />

        {/* AI Insight Card */}
        <Card className="p-6 border-l-4 border-primary-container bg-primary-container/5 gap-4">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary-container/20 p-2 rounded-lg">
              <MaterialCommunityIcons name="brain" size={24} color="#FFB703" />
            </View>
            <Typography variant="h3" className="text-primary-container">
              {latestAssessment ? "Smart Recommendation" : "Action Required"}
            </Typography>
          </View>
          
          <Typography variant="body" className="text-on-surface-variant leading-6">
            {latestAssessment 
              ? latestAssessment.recommendation
              : "Peak production is expected soon. Run a full site assessment to optimize your hardware configuration for maximum grid independence."}
          </Typography>

          <Button 
            variant={latestAssessment ? "outline" : "solid"}
            onPress={() => router.push('/assessment' as Href)}
            className="mt-2"
          >
            {latestAssessment ? "RUN NEW ASSESSMENT" : "START ASSESSMENT"}
          </Button>
        </Card>
      </View>
    </ScrollView>
  );
}

