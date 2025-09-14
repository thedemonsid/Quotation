import { useCalculationStore } from '@/store/calculation';

export function useCalculations() {
  const store = useCalculationStore();

  const {
    noOfBoxes,
    boxWeight,
    wastage,
    danda,
    dandaPercentage,
    pricePerKg,
    boxPrice,
    vendorCharge,
    coldStorage,
    localTransport,
    packingMaterial,
    companyCharges,
    chaCharges,
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    setBoxPrice,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    setCompanyCharges,
    setChaCharges,
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
    boxPrice,
    vendorCharge,
    coldStorage,
    localTransport,
    packingMaterial,
    companyCharges,
    chaCharges,

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
    setBoxPrice,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    setCompanyCharges,
    setChaCharges,
    resetCalculation,
  };
}
