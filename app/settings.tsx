import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { saveSecureItem, getSecureItem, deleteSecureItem } from '@/src/utils/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [keys, setKeys] = useState({
    GROQ_API_KEY: '',
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    const groq = await getSecureItem('GROQ_API_KEY');
    const sUrl = await getSecureItem('SUPABASE_URL');
    const sKey = await getSecureItem('SUPABASE_ANON_KEY');
    
    setKeys({
      GROQ_API_KEY: groq || '',
      SUPABASE_URL: sUrl || '',
      SUPABASE_ANON_KEY: sKey || '',
    });
  };

  const handleSave = async () => {
    try {
      if (keys.GROQ_API_KEY) await saveSecureItem('GROQ_API_KEY', keys.GROQ_API_KEY);
      if (keys.SUPABASE_URL) await saveSecureItem('SUPABASE_URL', keys.SUPABASE_URL);
      if (keys.SUPABASE_ANON_KEY) await saveSecureItem('SUPABASE_ANON_KEY', keys.SUPABASE_ANON_KEY);
      
      Alert.alert('Success', 'Settings saved securely. Some changes may require app restart.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to clear all custom API keys and return to defaults?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await deleteSecureItem('GROQ_API_KEY');
            await deleteSecureItem('SUPABASE_URL');
            await deleteSecureItem('SUPABASE_ANON_KEY');
            setKeys({ GROQ_API_KEY: '', SUPABASE_URL: '', SUPABASE_ANON_KEY: '' });
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-8 pb-10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Typography variant="h1">Security</Typography>
        </View>

        <View className="gap-6">
          <Typography variant="h3">API Configuration</Typography>
          <Typography variant="body" className="text-text-muted">
            Customize your service connections. These keys are stored locally in the device&apos;s secure enclave and take priority over environment defaults.
          </Typography>

          <GlassPanel className="p-5 gap-6">
            <View className="gap-2">
              <Typography variant="label" className="text-primary-container">GROQ API KEY</Typography>
              <TextInput 
                accessibilityLabel="Groq API Key"
                value={keys.GROQ_API_KEY}
                onChangeText={(v) => setKeys(prev => ({ ...prev, GROQ_API_KEY: v }))}
                placeholder="gsk_..."
                placeholderTextColor="#666"
                secureTextEntry
                className="bg-surface-container/50 p-4 rounded-xl border border-white/5 text-white"
              />
            </View>

            <View className="gap-2">
              <Typography variant="label" className="text-primary-container">SUPABASE URL</Typography>
              <TextInput 
                accessibilityLabel="Supabase URL"
                value={keys.SUPABASE_URL}
                onChangeText={(v) => setKeys(prev => ({ ...prev, SUPABASE_URL: v }))}
                placeholder="https://your-project.supabase.co"
                placeholderTextColor="#666"
                className="bg-surface-container/50 p-4 rounded-xl border border-white/5 text-white"
              />
            </View>

            <View className="gap-2">
              <Typography variant="label" className="text-primary-container">SUPABASE ANON KEY</Typography>
              <TextInput 
                accessibilityLabel="Supabase Anon Key"
                value={keys.SUPABASE_ANON_KEY}
                onChangeText={(v) => setKeys(prev => ({ ...prev, SUPABASE_ANON_KEY: v }))}
                placeholder="eyJhbG..."
                placeholderTextColor="#666"
                secureTextEntry
                className="bg-surface-container/50 p-4 rounded-xl border border-white/5 text-white"
              />
            </View>

            <Button onPress={handleSave} className="h-14 rounded-full mt-2">
              SAVE CONFIGURATION
            </Button>
          </GlassPanel>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleReset}
            className="items-center py-4"
          >
            <Typography variant="label" className="text-tertiary-container font-bold">RESET TO DEFAULTS</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
