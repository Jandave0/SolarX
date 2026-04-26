import { create } from 'zustand';

// Define the types for our assessment data
export interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface EnergyUsageData {
  monthlyBill: number;
  kwhPerMonth: number;
}

// Define the state and actions for the store
export interface AssessmentState {
  // State
  currentStep: number;
  location: LocationData;
  energyUsage: EnergyUsageData;
  isCalculating: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLocation: (location: Partial<LocationData>) => void;
  setEnergyUsage: (usage: Partial<EnergyUsageData>) => void;
  setIsCalculating: (isCalculating: boolean) => void;
  resetAssessment: () => void;
}

// Define initial state separately so we can use it in resetAssessment
const initialState = {
  currentStep: 1,
  location: {
    address: '',
    latitude: null,
    longitude: null,
  },
  energyUsage: {
    monthlyBill: 0,
    kwhPerMonth: 0,
  },
  isCalculating: false,
};

// Create the Zustand store
export const useAssessmentStore = create<AssessmentState>()((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  setLocation: (locationUpdate) => 
    set((state) => ({ 
      location: { ...state.location, ...locationUpdate } 
    })),

  setEnergyUsage: (usageUpdate) => 
    set((state) => ({ 
      energyUsage: { ...state.energyUsage, ...usageUpdate } 
    })),

  setIsCalculating: (isCalculating) => set({ isCalculating }),

  resetAssessment: () => set(initialState),
}));
