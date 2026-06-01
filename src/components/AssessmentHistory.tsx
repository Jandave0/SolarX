import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Typography } from './ui/Typography';
import { Card } from './ui/Card';
import { getAssessments, AssessmentRecord, useSQLiteContext } from '@/src/services/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ⚡ Bolt Optimization: Wrapped in React.memo() to prevent unnecessary re-renders
// every second when the parent dashboard component's live timer updates.
export const AssessmentHistory = React.memo(function AssessmentHistory() {
  const db = useSQLiteContext();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadHistory = async () => {
    try {
      const data = await getAssessments(db);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#FFB703" />;
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <View className="gap-4">
      <Typography variant="h3">Recent Assessments</Typography>
      {history.slice(0, 3).map((item) => (
        <Card key={item.id} className="p-4 flex-row items-center justify-between border-white/5">
          <View className="flex-row items-center gap-3">
            <View className="bg-primary-container/10 p-2 rounded-lg">
              <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#FFB703" />
            </View>
            <View>
              <Typography variant="body-md" className="font-bold">
                {item.location?.split(',')[0] || 'Unknown Site'}
              </Typography>
              <Typography variant="caption" className="text-text-muted">
                {new Date(item.date).toLocaleDateString()} • {item.avg_usage} kWh/mo
              </Typography>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#8A8A9E" />
        </Card>
      ))}
    </View>
  );
});
