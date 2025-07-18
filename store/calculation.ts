import { create } from "zustand";

type State = {
  noOfBoxes: number;
  boxWeight: number;
  wastage: number;
  danda: number;
  dandaPercentage: number;
  pricePerKg: number;
  boxPrice: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
  companyCharges: number;
};

type Action = {
  setNoOfBoxes: (noOfBoxes: number) => void;
  setBoxWeight: (boxWeight: number) => void;
  setWastage: (wastage: number) => void;
  setDanda: (danda: number) => void;
  setDandaPercentage: (dandaPercentage: number) => void;
  setPricePerKg: (pricePerKg: number) => void;
  setBoxPrice: (boxPrice: number) => void;
  setVendorCharge: (vendorCharge: number) => void;
  setColdStorage: (coldStorage: number) => void;
  setLocalTransport: (localTransport: number) => void;
  setPackingMaterial: (packingMaterial: number) => void;
  setCompanyCharges: (companyCharges: number) => void;
  updateCalculation: (updates: Partial<State>) => void;
  resetCalculation: () => void;
  getTotalWeight: () => number;
  getTotalCost: () => number;
  getTotalCharges: () => number;
  getGrandTotal: () => number;
  calculateDanda: () => number;
};

// Helper function to calculate danda
const calculateDandaValue = (
  noOfBoxes: number,
  boxWeight: number,
  wastage: number,
  dandaPercentage: number
) => {
  return (
    (Number(noOfBoxes) * Number(boxWeight) + Number(wastage)) *
    (Number(dandaPercentage) / 100)
  );
};

const initialState: State = {
  noOfBoxes: 1540,
  boxWeight: 13.2,
  wastage: 1000,
  danda: 0, // Will be calculated after store creation
  dandaPercentage: 8,
  pricePerKg: 20,
  boxPrice: 90,
  vendorCharge: 60000, // Default 60,000 rs
  coldStorage: 20000, // Default 20,000 rs
  localTransport: 15000,
  packingMaterial: 38000,
  companyCharges: 100000, // Default 1 lakh rs
};

export const useCalculationStore = create<State & Action>((set, get) => {
  // Calculate initial danda
  const initialDanda = calculateDandaValue(
    initialState.noOfBoxes,
    initialState.boxWeight,
    initialState.wastage,
    initialState.dandaPercentage
  );

  return {
    ...initialState,
    danda: initialDanda, // Set calculated initial danda

    setNoOfBoxes: (noOfBoxes) => {
      const { boxWeight, wastage, dandaPercentage } = get();
      const calculatedDanda = calculateDandaValue(
        noOfBoxes,
        boxWeight,
        wastage,
        dandaPercentage
      );
      set({ noOfBoxes, danda: calculatedDanda });
    },

    setBoxWeight: (boxWeight) => {
      const { noOfBoxes, wastage, dandaPercentage } = get();
      const calculatedDanda = calculateDandaValue(
        noOfBoxes,
        boxWeight,
        wastage,
        dandaPercentage
      );
      set({ boxWeight, danda: calculatedDanda });
    },

    setWastage: (wastage) => {
      const { noOfBoxes, boxWeight, dandaPercentage } = get();
      const calculatedDanda = calculateDandaValue(
        noOfBoxes,
        boxWeight,
        wastage,
        dandaPercentage
      );
      set({ wastage, danda: calculatedDanda });
    },

    setDandaPercentage: (dandaPercentage) => {
      const { noOfBoxes, boxWeight, wastage } = get();
      const calculatedDanda = calculateDandaValue(
        noOfBoxes,
        boxWeight,
        wastage,
        dandaPercentage
      );
      set({ dandaPercentage, danda: calculatedDanda });
    },

    setDanda: (danda) => set({ danda }),
    setPricePerKg: (pricePerKg) => set({ pricePerKg }),
    setBoxPrice: (boxPrice) => set({ boxPrice }),
    setVendorCharge: (vendorCharge) => set({ vendorCharge }),
    setColdStorage: (coldStorage) => set({ coldStorage }),
    setLocalTransport: (localTransport) => set({ localTransport }),
    setPackingMaterial: (packingMaterial) => set({ packingMaterial }),
    setCompanyCharges: (companyCharges) => set({ companyCharges }),

    updateCalculation: (updates) => {
      set((state) => ({ ...state, ...updates }));
      const currentState = get();
      const calculatedDanda = calculateDandaValue(
        currentState.noOfBoxes,
        currentState.boxWeight,
        currentState.wastage,
        currentState.dandaPercentage
      );
      set({ danda: calculatedDanda });
    },

    resetCalculation: () => {
      const resetDanda = calculateDandaValue(
        initialState.noOfBoxes,
        initialState.boxWeight,
        initialState.wastage,
        initialState.dandaPercentage
      );
      set({ ...initialState, danda: resetDanda });
    },

    calculateDanda: () => {
      const { noOfBoxes, boxWeight, wastage, dandaPercentage } = get();
      return calculateDandaValue(
        noOfBoxes,
        boxWeight,
        wastage,
        dandaPercentage
      );
    },

    getTotalWeight: () => {
      const { noOfBoxes, boxWeight, wastage, danda } = get();
      return (
        Number(noOfBoxes) * Number(boxWeight) + Number(wastage) + Number(danda)
      );
    },

    getTotalCost: () => {
      const { getTotalWeight, pricePerKg } = get();
      return getTotalWeight() * Number(pricePerKg);
    },

    getTotalCharges: () => {
      const {
        vendorCharge,
        coldStorage,
        localTransport,
        packingMaterial,
        companyCharges,
        boxPrice,
        noOfBoxes,
      } = get();
      return (
        Number(vendorCharge) +
        Number(coldStorage) +
        Number(localTransport) +
        Number(packingMaterial) +
        Number(companyCharges) +
        Number(boxPrice * noOfBoxes)
      );
    },

    getGrandTotal: () => {
      const { getTotalCost, getTotalCharges } = get();
      return getTotalCost() + getTotalCharges();
    },
  };
});
