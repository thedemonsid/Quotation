import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from "lucide-react";

interface CostSummaryProps {
  weightCost: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
  boxPrice?: number;
  grandTotal: number;
  noOfBoxes: number;
}

export function CostSummary({
  weightCost,
  vendorCharge,
  coldStorage,
  localTransport,
  packingMaterial,
  boxPrice,
  grandTotal,
  noOfBoxes,
}: CostSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Cost Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Weight Cost:</span>
            <span className="font-mono font-medium">
              ₹{weightCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Vendor Charge:</span>
            <span className="font-mono font-medium">
              ₹{vendorCharge.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Cold Storage:</span>
            <span className="font-mono font-medium">
              ₹{coldStorage.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Local Transport:</span>
            <span className="font-mono font-medium">
              ₹{localTransport.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Packing Material:</span>
            <span className="font-mono font-medium">
              ₹{packingMaterial.toLocaleString()}
            </span>
          </div>
          {boxPrice && boxPrice > 0 && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Box Cost ({noOfBoxes} × ₹{boxPrice}):
              </span>
              <span className="font-mono font-medium">
                ₹{(boxPrice * noOfBoxes).toLocaleString()}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
            <span className="font-semibold">Grand Total:</span>
            <span className="font-mono font-bold text-xl text-green-600">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
          {noOfBoxes > 0 && (
            <div className="flex justify-between items-center py-2 bg-gray-50 px-4 rounded-lg">
              <span className="text-sm font-medium">Cost per Box:</span>
              <span className="font-mono font-semibold">
                ₹{(grandTotal / noOfBoxes).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
