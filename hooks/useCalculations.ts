import { useCalculationStore } from "@/store/calculation";

export function useCalculations() {
  const store = useCalculationStore();
  
  const {
    noOfBoxes,
    boxWeight,
    wastage,
    danda,
    dandaPercentage,
    pricePerKg,
    vendorCharge,
    coldStorage,
    localTransport,
    packingMaterial,
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    getTotalWeight,
    getTotalCost,
    getTotalCharges,
    getGrandTotal,
    resetCalculation,
  } = store;

  // Derived calculations
  const grossWeight = noOfBoxes * boxWeight;
  const netWeight = grossWeight + wastage;

  return {
    // Values
    noOfBoxes,
    boxWeight,
    wastage,
    danda,
    dandaPercentage,
    pricePerKg,
    vendorCharge,
    coldStorage,
    localTransport,
    packingMaterial,
    
    // Derived values
    grossWeight,
    netWeight,
    totalWeight: getTotalWeight(),
    totalCost: getTotalCost(),
    totalCharges: getTotalCharges(),
    grandTotal: getGrandTotal(),
    
    // Actions
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    resetCalculation,
  };
}
