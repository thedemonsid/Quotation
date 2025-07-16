import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

interface ShipmentDetailsProps {
  noOfBoxes: number;
  boxWeight: number;
  dandaPercentage: number;
  pricePerKg: number;
  onNoOfBoxesChange: (value: number) => void;
  onBoxWeightChange: (value: number) => void;
  onDandaPercentageChange: (value: number) => void;
  onPricePerKgChange: (value: number) => void;
}

export function ShipmentDetails({
  noOfBoxes,
  boxWeight,
  dandaPercentage,
  pricePerKg,
  onNoOfBoxesChange,
  onBoxWeightChange,
  onDandaPercentageChange,
  onPricePerKgChange,
}: ShipmentDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-blue-600" />
          Shipment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="boxes" className="text-sm font-medium">
              Number of Boxes
            </Label>
            <Input
              id="boxes"
              type="number"
              value={noOfBoxes || ""}
              onChange={(e) => onNoOfBoxesChange(Number(e.target.value) || 0)}
              placeholder="0"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">
              Weight per Box (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={boxWeight || ""}
              onChange={(e) => onBoxWeightChange(Number(e.target.value) || 0)}
              placeholder="13.2"
              step="0.1"
              className="text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dandaPercentage" className="text-sm font-medium">
              Danda Percentage (%)
            </Label>
            <Input
              id="dandaPercentage"
              type="number"
              value={dandaPercentage || ""}
              onChange={(e) =>
                onDandaPercentageChange(Number(e.target.value) || 0)
              }
              placeholder="8"
              step="0.1"
              min="0"
              max="100"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price per KG (₹)
            </Label>
            <Input
              id="price"
              type="number"
              value={pricePerKg || ""}
              onChange={(e) => onPricePerKgChange(Number(e.target.value) || 0)}
              placeholder="0.00"
              step="0.01"
              className="text-right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
