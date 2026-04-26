import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { getHardwareRecommendation } from '@/src/lib/groq';
import { getHardwareInventory, HardwareItem, registerHardware, deleteHardware } from '@/src/services/hardwareService';
import { supabase } from '@/src/lib/supabase';
import { useSQLiteContext } from '@/src/services/database';

export default function HardwareScreen() {
  const db = useSQLiteContext();
  const [inventory, setInventory] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();

    // Set up real-time subscription
    const subscription = supabase
      .channel('hardware_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hardware' },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getHardwareInventory(db);
      setInventory(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const handleRegister = async () => {
    // Simple mock registration for testing CRUD
    try {
      const newItem = {
        name: `SunForce ${Math.floor(Math.random() * 1000)}W`,
        type: 'Panel' as const,
        status: 'optimal' as const,
        health: 100,
        price: 15000,
      };
      await registerHardware(db, newItem);
      fetchInventory();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHardware(db, id);
      fetchInventory();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

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
    <ScrollView 
      className="flex-1 bg-background" 
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB703" />
      }
    >
      <View className="gap-6 pb-10">
        <View>
          <Typography variant="h1">Hardware Health</Typography>
          <Typography variant="body" className="text-text-muted">
            Inventory management and AI-driven diagnostics.
          </Typography>
        </View>

        {/* AI Diagnostic Section */}
        <GlassPanel className="p-6 gap-5 border-primary/10">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography variant="h3" className="text-primary-container">AI Diagnostic</Typography>
              <Typography variant="caption" className="text-text-muted">LLAMA 3.3 • SITE RAG</Typography>
            </View>
            <View className="bg-primary-container/10 px-3 py-1 rounded-full border border-primary-container/20">
              <Typography variant="label-caps" className="text-primary-container">ACTIVE</Typography>
            </View>
          </View>
          
          {recommendation ? (
            <View className="bg-surface-container/50 p-5 rounded-2xl border border-white/5">
              <Typography variant="body" className="leading-relaxed text-on-surface-variant italic">
                "{recommendation}"
              </Typography>
              <TouchableOpacity className="mt-5" onPress={() => setRecommendation(null)}>
                <Typography variant="label-caps" className="text-primary-container font-bold">RESET ANALYSIS</Typography>
              </TouchableOpacity>
            </View>
          ) : (
            <Typography variant="body-md" className="text-on-surface-variant leading-relaxed">
              Run a system-wide diagnostic to identify efficiency bottlenecks or hardware degradation across your current solar array.
            </Typography>
          )}

          <Button 
            onPress={runDiagnostic} 
            loading={isAnalyzing}
            variant={recommendation ? 'secondary' : 'primary'}
            className="rounded-full h-14"
          >
            {isAnalyzing ? 'Analyzing Site Data...' : 'Run Site Assessment'}
          </Button>
        </GlassPanel>

        {/* Inventory List */}
        <View className="gap-5">
          <View className="flex-row items-center justify-between px-1">
            <Typography variant="h3">System Inventory</Typography>
            <Typography variant="caption" className="text-primary-container">{inventory.length} ACTIVE</Typography>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FFB703" className="py-10" />
          ) : inventory.length === 0 ? (
            <Card className="p-10 items-center justify-center border-dashed border-white/10">
              <Typography variant="body" className="text-text-muted">No hardware registered yet.</Typography>
            </Card>
          ) : (
            inventory.map((item) => (
              <Card key={item.id} className="p-5 flex-row items-center justify-between border-white/5">
                <View className="flex-row items-center gap-5">
                  <View className="w-14 h-14 bg-surface-container-high rounded-2xl items-center justify-center border border-white/5">
                     <MaterialCommunityIcons 
                      name={item.type === 'Panel' ? 'solar-panel' : item.type === 'Inverter' ? 'power-plug' : 'battery-charging'} 
                      size={28} 
                      color={item.status === 'optimal' ? '#FFB703' : item.status === 'warning' ? '#FB8500' : '#FF4D6D'} 
                     />
                  </View>
                  <View>
                    <Typography variant="h3" className="mb-0.5">{item.name}</Typography>
                    <View className="flex-row gap-2">
                      <EnergyChip 
                        label={item.status.toUpperCase()} 
                        status={item.status === 'optimal' ? 'Gold' : item.status === 'warning' ? 'Gold' : 'Rose'} 
                      />
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Typography variant="h2" className={item.health > 90 ? 'text-primary-container' : 'text-tertiary-container'}>
                    {item.health}%
                  </Typography>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} className="mt-1">
                    <Typography variant="label" className="text-text-muted">DELETE</Typography>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </View>

        <TouchableOpacity className="items-center py-4" onPress={handleRegister}>
          <Typography variant="body" className="text-primary-container font-bold">+ REGISTER NEW HARDWARE</Typography>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
