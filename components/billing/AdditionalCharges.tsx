import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Users,
  Snowflake,
  Truck,
  PackageOpen,
  Package,
  Building2,
} from "lucide-react";

interface AdditionalChargesProps {
  boxPrice: number;
  vendorCharge: number;
  coldStorage: number;
  localTransport: number;
  packingMaterial: number;
  companyCharges: number;
  onBoxPriceChange: (value: number) => void;
  onVendorChargeChange: (value: number) => void;
  onColdStorageChange: (value: number) => void;
  onLocalTransportChange: (value: number) => void;
  onPackingMaterialChange: (value: number) => void;
  onCompanyChargesChange: (value: number) => void;
}

export function AdditionalCharges({
  boxPrice,
  vendorCharge,
  coldStorage,
  localTransport,
  packingMaterial,
  companyCharges,
  onBoxPriceChange,
  onVendorChargeChange,
  onColdStorageChange,
  onLocalTransportChange,
  onPackingMaterialChange,
  onCompanyChargesChange,
}: AdditionalChargesProps) {
  return (
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
              htmlFor="boxPrice"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Box Price (₹)
            </Label>
            <Input
              id="boxPrice"
              type="number"
              value={boxPrice || ""}
              onChange={(e) => onBoxPriceChange(Number(e.target.value) || 0)}
              placeholder="Ex. 90"
              className="text-right"
            />
          </div>
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
                onVendorChargeChange(Number(e.target.value) || 0)
              }
              placeholder="Ex. 60000"
              className="text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Ex. 20000"
              onChange={(e) => onColdStorageChange(Number(e.target.value) || 0)}
              className="text-right"
            />
          </div>
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
                onLocalTransportChange(Number(e.target.value) || 0)
              }
              placeholder="Ex. 15000"
              className="text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onPackingMaterialChange(Number(e.target.value) || 0)
              }
              placeholder="Ex. 38000"
              className="text-right"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="companyCharges"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Company Charges (₹)
            </Label>
            <Input
              id="companyCharges"
              type="number"
              value={companyCharges || ""}
              onChange={(e) =>
                onCompanyChargesChange(Number(e.target.value) || 0)
              }
              placeholder="Ex. 100000"
              className="text-right"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
