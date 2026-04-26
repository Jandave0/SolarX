import { useState, useEffect, useMemo } from 'react';

export interface EnergyData {
  solarProduction: number;
  houseConsumption: number;
  batteryLevel: number;
  gridSavings: number;
  dailyHarvest: number;
  timestamp: Date;
}

export function useEnergySimulation() {
  const [data, setData] = useState<EnergyData>({
    solarProduction: 6.4,
    houseConsumption: 2.1,
    batteryLevel: 88,
    gridSavings: 15420.50,
    dailyHarvest: 32.4,
    timestamp: new Date(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        // Simulate minor fluctuations (±0.05kW)
        const prodNoise = (Math.random() - 0.5) * 0.1;
        const consNoise = (Math.random() - 0.5) * 0.1;
        
        // Ensure values stay within reasonable bounds
        const newProd = Math.max(0, Math.min(10, prev.solarProduction + prodNoise));
        const newCons = Math.max(0.5, Math.min(8, prev.houseConsumption + consNoise));
        
        // Battery level changes slowly based on net flow
        const netFlow = (newProd - newCons) / 600; // Simplified charge/discharge rate per sec
        const newBattery = Math.max(0, Math.min(100, prev.batteryLevel + netFlow));
        
        // Daily harvest accumulates
        const newHarvest = prev.dailyHarvest + (newProd / 3600); // kW per sec to kWh
        
        // Grid savings accumulates (₱12 per kWh)
        const newSavings = prev.gridSavings + ((newProd - newCons) > 0 ? (newProd - newCons) / 3600 * 12 : 0);

        return {
          solarProduction: parseFloat(newProd.toFixed(2)),
          houseConsumption: parseFloat(newCons.toFixed(2)),
          batteryLevel: parseFloat(newBattery.toFixed(1)),
          gridSavings: parseFloat(newSavings.toFixed(2)),
          dailyHarvest: parseFloat(newHarvest.toFixed(2)),
          timestamp: new Date(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
