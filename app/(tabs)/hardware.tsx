import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { getHardwareRecommendation } from '@/src/lib/groq';

const MOCK_HARDWARE = [
  { id: '1', name: 'SunForce 450W', type: 'Panel', status: 'optimal', health: 98 },
  { id: '2', name: 'VoltMaster X10', type: 'Inverter', status: 'warning', health: 82 },
  { id: '3', name: 'PowerWall Gen 3', type: 'Battery', status: 'optimal', health: 95 },
];

export default function HardwareScreen() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setIsAnalyzing(true);
    try {
      // Simulated RAG Flow:
      // 1. User Context (Current site conditions)
      const userContext = "My inverter 'VoltMaster X10' is showing 82% health and slight clipping during peak sun. Is it time to upgrade or add more capacity?";
      
      // 2. Retrieved Context (Mocked retrieved technical specs for now)
      const retrievedContext = "VoltMaster X10: Max Input 10kW, Current Efficiency 96%, Peak Clipping at 9.8kW. SunForce 450W: Voc 49V, Isc 11A.";
      
      const result = await getHardwareRecommendation(userContext, retrievedContext);
      setRecommendation(result || "Analysis complete. System appears stable but nearing peak capacity.");
    } catch (error) {
      setRecommendation("Error connecting to AI service. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-6 pb-10">
        <View>
          <Typography variant="h1">Hardware Health</Typography>
          <Typography variant="body" className="text-text-muted">
            Inventory management and AI-driven diagnostics.
          </Typography>
        </View>

        {/* AI Diagnostic Section */}
        <GlassPanel className="p-5 gap-4 border-primary/20">
          <View className="flex-row items-center justify-between">
            <Typography variant="h3" className="text-primary">AI Diagnostic</Typography>
            <View className="bg-primary/20 px-2 py-1 rounded">
              <Typography variant="caption" className="text-primary">Llama 3.3</Typography>
            </View>
          </View>
          
          {recommendation ? (
            <View className="bg-background/40 p-4 rounded-xl border border-white/5">
              <Typography variant="body" className="leading-6 italic text-text-muted">
                "{recommendation}"
              </Typography>
              <TouchableOpacity className="mt-4" onPress={() => setRecommendation(null)}>
                <Typography variant="caption" className="text-primary font-bold">CLEAR ANALYSIS</Typography>
              </TouchableOpacity>
            </View>
          ) : (
            <Typography variant="body" className="text-text-muted">
              Run a system-wide diagnostic to identify efficiency bottlenecks or hardware degradation.
            </Typography>
          )}

          <Button 
            onPress={runDiagnostic} 
            loading={isAnalyzing}
            variant={recommendation ? 'secondary' : 'primary'}
          >
            {isAnalyzing ? 'Analyzing Site Data...' : 'Run Site Assessment'}
          </Button>
        </GlassPanel>

        {/* Inventory List */}
        <View className="gap-4">
          <Typography variant="h3" className="ml-1">System Inventory</Typography>
          {MOCK_HARDWARE.map((item) => (
            <Card key={item.id} className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-surface-variant rounded-xl items-center justify-center">
                   <View className={`w-2 h-2 rounded-full ${item.status === 'optimal' ? 'bg-success' : 'bg-warning'}`} />
                </View>
                <View>
                  <Typography variant="h3">{item.name}</Typography>
                  <Typography variant="caption" className="text-text-muted">{item.type} • S/N: {item.id}2024X</Typography>
                </View>
              </View>
              <View className="items-end">
                <Typography variant="h2" className={item.health > 90 ? 'text-success' : 'text-warning'}>
                  {item.health}%
                </Typography>
                <Typography variant="label" className="text-text-muted">HEALTH</Typography>
              </View>
            </Card>
          ))}
        </View>

        <TouchableOpacity className="items-center py-4">
          <Typography variant="body" className="text-primary font-bold">+ REGISTER NEW HARDWARE</Typography>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
