import { ScrollView, View } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { EnergyChip } from '@/components/ui/EnergyChip';
import { Stack } from 'expo-router';

export default function SandboxScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'UI Sandbox', headerStyle: { backgroundColor: '#16161A' }, headerTintColor: '#ffdba0' }} />
      <ScrollView className="flex-1 bg-background p-5">
        <Typography variant="h1" className="mb-6">UI Sandbox</Typography>

        <Typography variant="h2" className="mb-4">Typography</Typography>
        <Card className="mb-8">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body-lg" className="mt-2">Body Large: The quick brown fox jumps over the lazy dog.</Typography>
          <Typography variant="body-md">Body Medium: The quick brown fox jumps over the lazy dog.</Typography>
          <Typography variant="label-caps" className="mt-2">Label Caps</Typography>
        </Card>

        <Typography variant="h2" className="mb-4">Buttons</Typography>
        <Card className="mb-8 gap-4">
          <Button variant="primary" title="Primary Action" onPress={() => {}} />
          <Button variant="secondary" title="Secondary Action" onPress={() => {}} />
        </Card>

        <Typography variant="h2" className="mb-4">Energy Chips</Typography>
        <Card className="mb-8 flex-row flex-wrap gap-3">
          <EnergyChip status="Gold" label="LIVE" />
          <EnergyChip status="Blue" label="GRID TIED" />
          <EnergyChip status="Rose" label="OFFLINE" />
        </Card>

        <Typography variant="h2" className="mb-4">Glass Panel</Typography>
        <View className="h-40 rounded-[32px] overflow-hidden mb-12 relative bg-primary-container justify-center items-center">
            {/* Background element to see the blur effect */}
            <View className="absolute w-20 h-20 bg-tertiary-container rounded-full top-4 left-4" />
            <View className="absolute w-20 h-20 bg-secondary-container rounded-full bottom-4 right-4" />
            
            <GlassPanel className="absolute inset-0 p-6 justify-center items-center" intensity={40}>
                <Typography variant="h3">Glass Effect</Typography>
            </GlassPanel>
        </View>

      </ScrollView>
    </>
  );
}
