import { ShipmentDetails } from "./ShipmentDetails";
import { AdditionalCharges } from "./AdditionalCharges";
import { ResetButton } from "./ResetButton";

interface InputSectionProps {
  noOfBoxes: number;
  boxWeight: number;
  dandaPercentage: number;
  pricePerKg: number;
  boxPrice: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
  companyCharges: number;
  onNoOfBoxesChange: (value: number) => void;
  onBoxWeightChange: (value: number) => void;
  onDandaPercentageChange: (value: number) => void;
  onPricePerKgChange: (value: number) => void;
  onBoxPriceChange: (value: number) => void;
  onVendorChargeChange: (value: number) => void;
  onColdStorageChange: (value: number) => void;
  onLocalTransportChange: (value: number) => void;
  onPackingMaterialChange: (value: number) => void;
  onCompanyChargesChange: (value: number) => void;
  onReset: () => void;
}

export function InputSection({
  noOfBoxes,
  boxWeight,
  dandaPercentage,
  pricePerKg,
  boxPrice,
  vendorCharge,
  coldStorage,
  localTransport,
  packingMaterial,
  companyCharges,
  onNoOfBoxesChange,
  onBoxWeightChange,
  onDandaPercentageChange,
  onPricePerKgChange,
  onBoxPriceChange,
  onVendorChargeChange,
  onColdStorageChange,
  onLocalTransportChange,
  onPackingMaterialChange,
  onCompanyChargesChange,
  onReset,
}: InputSectionProps) {
  return (
    <div className="space-y-6">
      <ShipmentDetails
        noOfBoxes={noOfBoxes}
        boxWeight={boxWeight}
        dandaPercentage={dandaPercentage}
        pricePerKg={pricePerKg}
        onNoOfBoxesChange={onNoOfBoxesChange}
        onBoxWeightChange={onBoxWeightChange}
        onDandaPercentageChange={onDandaPercentageChange}
        onPricePerKgChange={onPricePerKgChange}
      />

      <AdditionalCharges
        vendorCharge={vendorCharge}
        coldStorage={coldStorage}
        localTransport={localTransport}
        packingMaterial={packingMaterial}
        companyCharges={companyCharges}
        boxPrice={boxPrice}
        onBoxPriceChange={onBoxPriceChange}
        onVendorChargeChange={onVendorChargeChange}
        onColdStorageChange={onColdStorageChange}
        onLocalTransportChange={onLocalTransportChange}
        onPackingMaterialChange={onPackingMaterialChange}
        onCompanyChargesChange={onCompanyChargesChange}
      />

      <ResetButton onReset={onReset} />
    </div>
  );
}
