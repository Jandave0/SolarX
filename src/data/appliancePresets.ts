export interface Appliance {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name
  powerWatts: number;
  avgHoursPerDay: number;
  category: 'cooling' | 'kitchen' | 'entertainment' | 'laundry' | 'lighting' | 'others';
}

export const appliancePresets: Appliance[] = [
  {
    id: 'ac_split',
    name: 'Air Conditioner (Split)',
    icon: 'air-conditioner',
    powerWatts: 1200,
    avgHoursPerDay: 8,
    category: 'cooling',
  },
  {
    id: 'ac_window',
    name: 'Air Conditioner (Window)',
    icon: 'window-open-variant',
    powerWatts: 800,
    avgHoursPerDay: 8,
    category: 'cooling',
  },
  {
    id: 'ref',
    name: 'Refrigerator',
    icon: 'fridge-outline',
    powerWatts: 150,
    avgHoursPerDay: 24,
    category: 'kitchen',
  },
  {
    id: 'washing_machine',
    name: 'Washing Machine',
    icon: 'washing-machine',
    powerWatts: 500,
    avgHoursPerDay: 1,
    category: 'laundry',
  },
  {
    id: 'tv',
    name: 'Television',
    icon: 'television',
    powerWatts: 100,
    avgHoursPerDay: 5,
    category: 'entertainment',
  },
  {
    id: 'fan',
    name: 'Electric Fan',
    icon: 'fan',
    powerWatts: 50,
    avgHoursPerDay: 12,
    category: 'cooling',
  },
  {
    id: 'lights',
    name: 'LED Lighting',
    icon: 'lightbulb-on-outline',
    powerWatts: 100, // Aggregate
    avgHoursPerDay: 6,
    category: 'lighting',
  },
  {
    id: 'rice_cooker',
    name: 'Rice Cooker',
    icon: 'rice',
    powerWatts: 600,
    avgHoursPerDay: 0.5,
    category: 'kitchen',
  },
  {
    id: 'laptop',
    name: 'Laptop/PC',
    icon: 'laptop',
    powerWatts: 65,
    avgHoursPerDay: 8,
    category: 'entertainment',
  },
  {
    id: 'water_heater',
    name: 'Water Heater',
    icon: 'water-boiler',
    powerWatts: 3000,
    avgHoursPerDay: 0.5,
    category: 'others',
  },
];

export const calculateDailyKwh = (appliances: Appliance[]): number => {
  return appliances.reduce((acc, curr) => {
    return acc + (curr.powerWatts * curr.avgHoursPerDay) / 1000;
  }, 0);
};
