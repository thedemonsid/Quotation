"use client";
import { Header } from "@/components/billing";
import { InputSection } from "@/components/billing";
import { SummarySection } from "@/components/billing";
import { useCalculations } from "@/hooks/useCalculations";

export default function Home() {
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
    grossWeight,
    netWeight,
    totalWeight,
    totalCost,
    grandTotal,
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    setVendorCharge,
    setColdStorage,
    setLocalTransport,
    setPackingMaterial,
    resetCalculation,
  } = useCalculations();

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
            vendorCharge={vendorCharge}
            coldStorage={coldStorage}
            localTransport={localTransport}
            packingMaterial={packingMaterial}
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
