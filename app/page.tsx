"use client";
import { useCalculationStore } from "@/store/calculation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  RotateCcw,
  Package,
  Weight,
  DollarSign,
  TrendingUp,
  Truck,
  Snowflake,
  PackageOpen,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isWeightSummaryCollapsed, setIsWeightSummaryCollapsed] =
    useState(true);
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
  } = useCalculationStore();

  const grossWeight = noOfBoxes * boxWeight;
  const netWeight = grossWeight + wastage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl px-6 py-2">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Import Export Billing Calculator
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Forms */}
          <div className="space-y-6">
            {/* Shipment Details */}
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
                      onChange={(e) =>
                        setNoOfBoxes(Number(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        setBoxWeight(Number(e.target.value) || 0)
                      }
                      placeholder="13.2"
                      step="0.1"
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="dandaPercentage"
                      className="text-sm font-medium"
                    >
                      Danda Percentage (%)
                    </Label>
                    <Input
                      id="dandaPercentage"
                      type="number"
                      value={dandaPercentage || ""}
                      onChange={(e) =>
                        setDandaPercentage(Number(e.target.value) || 0)
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
                      onChange={(e) =>
                        setPricePerKg(Number(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="text-right"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Charges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Additional Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vendorCharge"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Vendor Charge (₹)
                    </Label>
                    <Input
                      id="vendorCharge"
                      type="number"
                      value={vendorCharge || ""}
                      onChange={(e) =>
                        setVendorCharge(Number(e.target.value) || 0)
                      }
                      placeholder="60,000"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="coldStorage"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Snowflake className="h-4 w-4" />
                      Cold Storage (₹)
                    </Label>
                    <Input
                      id="coldStorage"
                      type="number"
                      value={coldStorage || ""}
                      onChange={(e) =>
                        setColdStorage(Number(e.target.value) || 0)
                      }
                      placeholder="20,000"
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="localTransport"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      Local Transport (₹)
                    </Label>
                    <Input
                      id="localTransport"
                      type="number"
                      value={localTransport || ""}
                      onChange={(e) =>
                        setLocalTransport(Number(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="packingMaterial"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <PackageOpen className="h-4 w-4" />
                      Packing Material (₹)
                    </Label>
                    <Input
                      id="packingMaterial"
                      type="number"
                      value={packingMaterial || ""}
                      onChange={(e) =>
                        setPackingMaterial(Number(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="text-right"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <Button
              onClick={resetCalculation}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Values
            </Button>
          </div>

          {/* Right Side - Calculations & Summary */}
          <div className="space-y-6">
            {/* Weight Summary */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setIsWeightSummaryCollapsed(!isWeightSummaryCollapsed)
                }
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Weight className="h-5 w-5 text-purple-600" />
                    Weight Summary
                  </div>
                  {isWeightSummaryCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  )}
                </CardTitle>
              </CardHeader>
              {!isWeightSummaryCollapsed && (
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">
                        Gross Weight:
                      </span>
                      <span className="font-mono font-medium">
                        {grossWeight.toFixed(2)} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Wastage:</span>
                      <span className="font-mono font-medium">
                        {wastage} kg
                      </span>
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
                        {getTotalWeight().toFixed(2)} kg
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Cost Summary */}
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
                      ₹{getTotalCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      Vendor Charge:
                    </span>
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
                    <span className="text-sm text-gray-600">
                      Local Transport:
                    </span>
                    <span className="font-mono font-medium">
                      ₹{localTransport.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      Packing Material:
                    </span>
                    <span className="font-mono font-medium">
                      ₹{packingMaterial.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                    <span className="font-semibold">Grand Total:</span>
                    <span className="font-mono font-bold text-xl text-green-600">
                      ₹{getGrandTotal().toFixed(2)}
                    </span>
                  </div>
                  {noOfBoxes > 0 && (
                    <div className="flex justify-between items-center py-2 bg-gray-50 px-4 rounded-lg">
                      <span className="text-sm font-medium">Cost per Box:</span>
                      <span className="font-mono font-semibold">
                        ₹{(getGrandTotal() / noOfBoxes).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
