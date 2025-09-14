import { WeightSummary } from './WeightSummary';
import { CostSummary } from './CostSummary';

interface SummarySectionProps {
  grossWeight: number;
  wastage: number;
  netWeight: number;
  danda: number;
  dandaPercentage: number;
  totalWeight: number;
  weightCost: number;
  boxPrice: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
  companyCharges: number;
  chaCharges: number;
  grandTotal: number;
  noOfBoxes: number;
}

export function SummarySection({
  grossWeight,
  wastage,
  netWeight,
  danda,
  dandaPercentage,
  totalWeight,
  weightCost,
  boxPrice,
  vendorCharge,
  coldStorage,
  localTransport,
  packingMaterial,
  companyCharges,
  chaCharges,
  grandTotal,
  noOfBoxes,
}: SummarySectionProps) {
  return (
    <div className="space-y-6">
      <WeightSummary
        grossWeight={grossWeight}
        wastage={wastage}
        netWeight={netWeight}
        danda={danda}
        dandaPercentage={dandaPercentage}
        totalWeight={totalWeight}
      />

      <CostSummary
        weightCost={weightCost}
        vendorCharge={vendorCharge}
        coldStorage={coldStorage}
        boxPrice={boxPrice}
        localTransport={localTransport}
        packingMaterial={packingMaterial}
        companyCharges={companyCharges}
        chaCharges={chaCharges}
        grandTotal={grandTotal}
        noOfBoxes={noOfBoxes}
      />
    </div>
  );
}
