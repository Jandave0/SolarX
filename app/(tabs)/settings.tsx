import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from '@/src/services/database';
import { exportToJSON, importFromJSON, generatePDFReport } from '@/src/services/dataService';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const db = useSQLiteContext();

  const handleExportJSON = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await exportToJSON(db);
    } catch (error) {
      Alert.alert('Export Failed', 'An error occurred while generating the backup.');
    }
  };

  const handleImportJSON = async () => {
    try {
      const success = await importFromJSON(db);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Import Successful', 'Your data has been restored. Please restart the app to see all changes.');
      }
    } catch (error) {
      Alert.alert('Import Failed', 'The selected file is invalid or corrupted.');
    }
  };

  const handleExportPDF = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await generatePDFReport(db);
    } catch (error) {
      Alert.alert('PDF Failed', 'Could not generate the PDF report.');
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingTop: 20 }}
    >
      <View className="mb-8">
        <Typography variant="h1" className="text-primary-container">Settings</Typography>
        <Typography variant="body" className="text-text-muted">
          Manage your data and application preferences.
        </Typography>
      </View>

      <GlassPanel className="mb-6 p-6">
        <Typography variant="label-caps" className="text-primary-container mb-4">Data Portability</Typography>
        
        <View className="gap-4">
          <Card className="flex-row items-center justify-between p-4 bg-white/5 border-white/5">
            <View className="flex-1 mr-4">
              <Typography variant="h3" className="text-white text-lg">Backup Data</Typography>
              <Typography variant="body" className="text-white/40 text-sm">Export all assessments and hardware to JSON.</Typography>
            </View>
            <Button 
              onPress={handleExportJSON}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
            >
              <MaterialCommunityIcons name="export-variant" size={20} color="#131317" />
            </Button>
          </Card>

          <Card className="flex-row items-center justify-between p-4 bg-white/5 border-white/5">
            <View className="flex-1 mr-4">
              <Typography variant="h3" className="text-white text-lg">Restore Data</Typography>
              <Typography variant="body" className="text-white/40 text-sm">Import assessments from a JSON backup file.</Typography>
            </View>
            <Button 
              variant="secondary"
              onPress={handleImportJSON}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
            >
              <MaterialCommunityIcons name="import" size={20} color="#FFB703" />
            </Button>
          </Card>

          <Card className="flex-row items-center justify-between p-4 bg-white/5 border-white/5">
            <View className="flex-1 mr-4">
              <Typography variant="h3" className="text-white text-lg">Intelligence Report</Typography>
              <Typography variant="body" className="text-white/40 text-sm">Generate a PDF summary of your site assessments.</Typography>
            </View>
            <Button 
              onPress={handleExportPDF}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-accent"
            >
              <MaterialCommunityIcons name="file-pdf-box" size={20} color="#FFFFFF" />
            </Button>
          </Card>
        </View>
      </GlassPanel>

      <GlassPanel className="p-6">
        <Typography variant="label-caps" className="text-primary-container mb-4">About SolarX</Typography>
        <Typography variant="body" className="text-white/60 mb-2">Version 1.0.0 (Alpha)</Typography>
        <Typography variant="body" className="text-white/40 italic">
          Designed for high-performance solar monitoring and intelligence-driven energy transition.
        </Typography>
      </GlassPanel>
      
      <View className="py-10 items-center">
        <Typography variant="label" className="text-white/20">© 2026 SolarX Intelligence Systems</Typography>
      </View>
    </ScrollView>
  );
}
