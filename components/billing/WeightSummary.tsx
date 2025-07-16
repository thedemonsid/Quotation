import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Weight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface WeightSummaryProps {
  grossWeight: number;
  wastage: number;
  netWeight: number;
  danda: number;
  dandaPercentage: number;
  totalWeight: number;
}

export function WeightSummary({
  grossWeight,
  wastage,
  netWeight,
  danda,
  dandaPercentage,
  totalWeight,
}: WeightSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Weight className="h-5 w-5 text-purple-600" />
            Weight Summary
          </div>
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          )}
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Gross Weight:</span>
              <span className="font-mono font-medium">
                {grossWeight.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Wastage:</span>
              <span className="font-mono font-medium">{wastage} kg</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Net Weight:</span>
              <span className="font-mono font-medium">
                {netWeight.toFixed(2)} kg
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">
                Danda ({dandaPercentage}%):
              </span>
              <span className="font-mono font-medium text-red-600">
                {danda.toFixed(2)} kg
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
              <span className="font-semibold">Total Weight:</span>
              <span className="font-mono font-bold text-lg text-blue-600">
                {totalWeight.toFixed(2)} kg
              </span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
