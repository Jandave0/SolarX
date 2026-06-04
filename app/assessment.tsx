import React, { useState } from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAssessmentStore } from '@/src/store/assessmentStore';
import { getHardwareRecommendation } from '@/src/lib/groq';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';
import { saveAssessment, useSQLiteContext } from '@/src/services/database';

import Markdown from 'react-native-markdown-display';

export default function AssessmentScreen() {
  const {
    currentStep,
    location,
    energyUsage,
    isCalculating,
    setStep,
    nextStep,
    prevStep,
    setLocation,
    setEnergyUsage,
    setIsCalculating,
    resetAssessment
  } = useAssessmentStore();

  const db = useSQLiteContext();

  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    nextStep(); // Move to result step

    try {
      // User Context for RAG
      const userContext = `The user is located at ${location.address}. 
      Their average monthly electricity bill is ₱${energyUsage.monthlyBill} 
      and they consume ${energyUsage.kwhPerMonth} kWh per month. 
      Recommend a tailored solar energy system including panel capacity, inverter type, and storage recommendations.`;

      // Technical Context (Reference data for the AI)
      const retrievedContext = `
      - Tier 1 Panels: SunForce 450W (Efficiency: 21.5%, Temp Coeff: -0.34%/C)
      - Inverters: VoltMaster Hybrid 5kW/10kW (Efficiency: 97.6%)
      - Batteries: PowerVault 10kWh Lithium Iron Phosphate
      - Sizing Guide: 
        * <500kWh/mo: 4kW System
        * 500-1000kWh/mo: 6.6kW - 8kW System
        * >1000kWh/mo: 10kW+ System with storage.
      `;

      const result = await getHardwareRecommendation(userContext, retrievedContext);
      setAiResult(result);

      // Save to local SQLite database
      await saveAssessment(db, {
        date: new Date().toISOString(),
        location: location.address,
        avg_usage: energyUsage.kwhPerMonth,
        roof_area: 0, // Could be added to UI later
        recommendation: result
      });
    } catch (error) {
      setAiResult("We encountered an error generating your recommendation. Please ensure your API key is configured and try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="gap-6 animate-in fade-in duration-500">
            <View>
              <Typography variant="h2">Site Location</Typography>
              <Typography variant="body" className="text-text-muted mt-1">
                Enter your property address to analyze local irradiance.
              </Typography>
            </View>

            <Card>
              <Typography variant="label" className="mb-3 text-primary-container">Property Address</Typography>
              <TextInput
                accessibilityLabel="Property Address"
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg font-['Plus Jakarta Sans']"
                placeholder="123 Solar Way, Sunshine State"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={location.address}
                onChangeText={(text) => setLocation({ address: text })}
              />
            </Card>

            <Button
              className="h-16"
              onPress={nextStep}
              disabled={!location.address}
            >
              Next: Energy Profile
            </Button>
          </View>
        );

      case 2:
        return (
          <View className="gap-6 animate-in fade-in duration-500">
            <View>
              <Typography variant="h2">Energy Profile</Typography>
              <Typography variant="body" className="text-text-muted mt-1">
                Help us size your system by sharing your usage habits.
              </Typography>
            </View>

            <Card className="gap-6">
              <View>
                <Typography variant="label" className="mb-3 text-primary-container">Monthly Bill (₱)</Typography>
                <TextInput
                  accessibilityLabel="Monthly Bill in Pesos"
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg font-['Plus Jakarta Sans']"
                  placeholder="e.g. 180"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType="numeric"
                  value={energyUsage.monthlyBill ? energyUsage.monthlyBill.toString() : ''}
                  onChangeText={(text) => setEnergyUsage({ monthlyBill: parseFloat(text) || 0 })}
                />
              </View>

              <View>
                <Typography variant="label" className="mb-3 text-primary-container">Consumption (kWh/mo)</Typography>
                <TextInput
                  accessibilityLabel="Monthly Consumption in Kilowatt Hours"
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-lg font-['Plus Jakarta Sans']"
                  placeholder="e.g. 750"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType="numeric"
                  value={energyUsage.kwhPerMonth ? energyUsage.kwhPerMonth.toString() : ''}
                  onChangeText={(text) => setEnergyUsage({ kwhPerMonth: parseFloat(text) || 0 })}
                />
              </View>
            </Card>

            <View className="flex-row gap-4">
              <Button
                variant="secondary"
                className="flex-1 h-16"
                onPress={prevStep}
              >
                Back
              </Button>
              <Button
                className="flex-[2] h-16"
                onPress={handleCalculate}
                disabled={!energyUsage.monthlyBill || !energyUsage.kwhPerMonth}
              >
                Generate AI Analysis
              </Button>
            </View>
          </View>
        );

      case 3:
        return (
          <View className="gap-6 animate-in fade-in duration-700">
            <View>
              <Typography variant="h2">AI Recommendation</Typography>
              <Typography variant="body" className="text-text-muted mt-1">
                Optimized hardware configuration for your site.
              </Typography>
            </View>

            <GlassPanel className="p-6 min-h-[350px]">
              {isCalculating ? (
                <View className="flex-1 items-center justify-center gap-6 py-12">
                  <ActivityIndicator size="large" color="#FFB703" />
                  <Typography className="text-center text-primary-container font-bold px-4">
                    SOLARX AI IS CALCULATING YOUR OPTIMAL HARDWARE MIX...
                  </Typography>
                </View>
              ) : (
                <ScrollView className="max-h-[500px]" showsVerticalScrollIndicator={false}>
                  {aiResult ? (
                    <Markdown
                      style={{
                        body: { color: 'rgba(255,255,255,0.9)', fontSize: 16, lineHeight: 24 },
                        strong: { color: '#FFB703', fontWeight: 'bold' },
                        bullet_list: { color: 'rgba(255,255,255,0.9)' },
                      }}
                    >
                      {aiResult}
                    </Markdown>
                  ) : (
                    <Typography variant="body" className="text-white/50 italic">
                      No recommendation could be generated at this time.
                    </Typography>
                  )}
                </ScrollView>
              )}
            </GlassPanel>

            {!isCalculating && (
              <View className="gap-4">
                <Button
                  className="h-16"
                  onPress={() => {
                    resetAssessment();
                    router.replace('/(tabs)');
                  }}
                >
                  Accept & Go to Dashboard
                </Button>
                <Button
                  variant="secondary"
                  className="h-14"
                  onPress={() => {
                    setAiResult(null);
                    setStep(1);
                  }}
                >
                  Start Over
                </Button>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 80, paddingBottom: 40 }}
      >
        <View className="mb-12 flex-row items-center justify-between">
          <View className="flex-row gap-2.5">
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                className={`h-2 w-14 rounded-full ${step <= currentStep ? 'bg-primary-container shadow-[0_0_8px_#FFB703]' : 'bg-white/10'
                  }`}
              />
            ))}
          </View>
          <Typography variant="label-caps" className="text-white/30 tracking-widest">
            PHASE 0{currentStep}
          </Typography>
        </View>

        {renderStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
