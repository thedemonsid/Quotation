"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/billing";
import { InputSection } from "@/components/billing";
import { SummarySection } from "@/components/billing";
import { useCalculations } from "@/hooks/useCalculations";

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);

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
    grossWeight,
    netWeight,
    totalWeight,
    totalCost,
    grandTotal,
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    setBoxPrice,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    resetCalculation,
  } = useCalculations();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prevent hydration mismatch by showing loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputSection
            noOfBoxes={noOfBoxes}
            boxWeight={boxWeight}
            dandaPercentage={dandaPercentage}
            pricePerKg={pricePerKg}
            boxPrice={boxPrice}
            vendorCharge={vendorCharge}
            coldStorage={coldStorage}
            localTransport={localTransport}
            packingMaterial={packingMaterial}
            onBoxPriceChange={setBoxPrice}
            onNoOfBoxesChange={setNoOfBoxes}
            onBoxWeightChange={setBoxWeight}
            onDandaPercentageChange={setDandaPercentage}
            onPricePerKgChange={setPricePerKg}
            onVendorChargeChange={setVendorCharge}
            onColdStorageChange={setColdStorage}
            onLocalTransportChange={setLocalTransport}
            onPackingMaterialChange={setPackingMaterial}
            onReset={resetCalculation}
          />

          <SummarySection
            grossWeight={grossWeight}
            wastage={wastage}
            netWeight={netWeight}
            danda={danda}
            boxPrice={boxPrice}
            dandaPercentage={dandaPercentage}
            totalWeight={totalWeight}
            weightCost={totalCost}
            vendorCharge={vendorCharge}
            coldStorage={coldStorage}
            localTransport={localTransport}
            packingMaterial={packingMaterial}
            grandTotal={grandTotal}
            noOfBoxes={noOfBoxes}
          />
        </div>
      </div>
    </div>
  );
}
