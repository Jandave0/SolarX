import { View, ScrollView } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyFlowChart } from '@/src/components/charts/EnergyFlowChart';

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      <View className="gap-6 pb-10">
        <View className="flex-row justify-between items-end">
          <View>
            <Typography variant="h1">SolarX Live</Typography>
            <Typography variant="body" className="text-text-muted">
              Monitoring your energy ecosystem.
            </Typography>
          </View>
          <View className="bg-success/20 px-3 py-1 rounded-full border border-success/30">
            <Typography variant="caption" className="text-success">System Online</Typography>
          </View>
        </View>

        {/* Current Status Row */}
        <View className="flex-row gap-3">
          <EnergyChip label="6.4 kW" icon="sun-wireless" status="success" />
          <EnergyChip label="2.1 kW" icon="home-lightning-bolt" status="warning" />
          <EnergyChip label="88%" icon="battery-80" status="success" />
        </View>

        {/* Main Production Chart */}
        <GlassPanel className="p-4 pt-6">
          <Typography variant="h3" className="mb-4 ml-2">Energy Flow (24h)</Typography>
          <EnergyFlowChart />
        </GlassPanel>

        {/* Quick Stats Grid */}
        <View className="flex-row gap-4">
          <Card className="flex-1 p-5 gap-2">
            <Typography variant="label" className="text-text-muted">TODAY'S HARVEST</Typography>
            <Typography variant="h2">32.4</Typography>
            <Typography variant="caption" className="text-success">+12% vs yesterday</Typography>
          </Card>
          <Card className="flex-1 p-5 gap-2">
            <Typography variant="label" className="text-text-muted">GRID SAVINGS</Typography>
            <Typography variant="h2">$4.12</Typography>
            <Typography variant="caption" className="text-primary">Monthly: $84.50</Typography>
          </Card>
        </View>

        {/* AI Insight Card */}
        <Card className="p-5 border-l-4 border-primary">
          <View className="flex-row items-center gap-2 mb-2">
            <Typography variant="h3" className="text-primary">AI Recommendation</Typography>
          </View>
          <Typography variant="body" className="text-text-muted leading-6">
            Peak production is expected at 1:30 PM. We recommend scheduling heavy loads (like washing machines) during this window to maximize your grid independence.
          </Typography>
        </Card>
      </View>
    </ScrollView>
  );
}
