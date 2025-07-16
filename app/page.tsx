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
  Percent,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const {
    noOfBoxes,
    boxWeight,
    wastage,
    danda,
    dandaPercentage,
    pricePerKg,
    setNoOfBoxes,
    setBoxWeight,
    setDandaPercentage,
    setPricePerKg,
    getTotalWeight,
    getTotalCost,
    resetCalculation,
  } = useCalculationStore();

  const grossWeight = noOfBoxes * boxWeight;
  const netWeight = grossWeight + wastage;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Import Export Billing Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            Calculate weights and costs for your shipments
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* Left Column - Input Parameters */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                  Input Parameters
                </CardTitle>
                <CardDescription>Enter your shipment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="boxes"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Number of Boxes
                  </Label>
                  <Input
                    id="boxes"
                    type="number"
                    value={noOfBoxes || ""}
                    onChange={(e) => setNoOfBoxes(Number(e.target.value) || 0)}
                    placeholder="Enter number of boxes"
                    className="text-right h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    Box Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={boxWeight || ""}
                    onChange={(e) => setBoxWeight(Number(e.target.value) || 0)}
                    placeholder="Default: 13.2 kg"
                    step="0.1"
                    className="text-right h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Default weight: 13.2 kg per box
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="dandaPercentage"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    Danda Percentage (%)
                  </Label>
                  <Input
                    id="dandaPercentage"
                    type="number"
                    value={dandaPercentage || ""}
                    onChange={(e) =>
                      setDandaPercentage(Number(e.target.value) || 0)
                    }
                    placeholder="Enter danda percentage"
                    step="0.1"
                    min="0"
                    max="100"
                    className="text-right h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Default: 8% of net weight
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Price per KG (₹)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerKg || ""}
                    onChange={(e) => setPricePerKg(Number(e.target.value) || 0)}
                    placeholder="Enter price per kg"
                    step="0.01"
                    className="text-right h-10"
                  />
                </div>

                <Button
                  onClick={resetCalculation}
                  variant="outline"
                  className="w-full mt-6"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Weight Calculations */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Weight className="h-5 w-5 text-primary" />
                  Weight Calculations
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of all weights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Boxes × Weight:</span>
                    <Badge variant="secondary" className="font-mono">
                      {noOfBoxes} × {boxWeight} = {grossWeight.toFixed(2)} kg
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">
                      Wastage (Fixed):
                    </span>
                    <Badge variant="secondary" className="font-mono">
                      {wastage} kg
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border">
                    <span className="text-sm font-medium">Net Weight:</span>
                    <Badge variant="outline" className="font-mono">
                      {grossWeight.toFixed(2)} + {wastage} ={" "}
                      {netWeight.toFixed(2)} kg
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <span className="text-sm font-medium">
                      Danda ({dandaPercentage}%):
                    </span>
                    <Badge variant="destructive" className="font-mono">
                      {netWeight.toFixed(2)} ×{" "}
                      {(dandaPercentage / 100).toFixed(3)} = {danda.toFixed(2)}{" "}
                      kg
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <span className="font-semibold">Total Weight:</span>
                    <Badge
                      variant="default"
                      className="text-base px-3 py-1 font-mono"
                    >
                      {getTotalWeight().toFixed(2)} kg
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cost Calculations */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Cost Breakdown
                </CardTitle>
                <CardDescription>
                  Financial calculations based on total weight
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg border">
                    <div className="text-2xl font-bold text-foreground font-mono">
                      {getTotalWeight().toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Total Weight (kg)
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg border">
                    <div className="text-2xl font-bold text-foreground font-mono">
                      ₹{pricePerKg.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      Price per KG
                    </div>
                  </div>

                  <div className="text-center p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="text-4xl font-bold text-primary font-mono">
                      ₹{getTotalCost().toFixed(2)}
                    </div>
                    <div className="text-sm text-primary font-semibold mt-1">
                      Total Cost
                    </div>
                  </div>
                </div>

                {pricePerKg > 0 && (
                  <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-accent">
                    <p className="text-sm text-center text-foreground font-medium">
                      <span className="font-mono">
                        {getTotalWeight().toFixed(2)} kg × ₹
                        {pricePerKg.toFixed(2)} = ₹{getTotalCost().toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

                {getTotalCost() > 0 && (
                  <div className="mt-4 p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Cost per Box:
                      </span>
                      <span className="font-mono font-medium">
                        ₹
                        {noOfBoxes > 0
                          ? (getTotalCost() / noOfBoxes).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
