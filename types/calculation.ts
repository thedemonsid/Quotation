export interface CalculationData {
  noOfBoxes: number;
  boxWeight: number;
  wastage: number;
  danda: number;
  dandaPercentage: number;
  pricePerKg: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
}

export interface DerivedCalculations {
  grossWeight: number;
  netWeight: number;
  totalWeight: number;
  totalCost: number;
  totalCharges: number;
  grandTotal: number;
}

export interface CalculationActions {
  setNoOfBoxes: (value: number) => void;
  setBoxWeight: (value: number) => void;
  setDandaPercentage: (value: number) => void;
  setPricePerKg: (value: number) => void;
  setVendorCharge: (value: number) => void;
  setColdStorage: (value: number) => void;
  setLocalTransport: (value: number) => void;
  setPackingMaterial: (value: number) => void;
  resetCalculation: () => void;
}

export type CalculationStore = CalculationData &
  DerivedCalculations &
  CalculationActions;
