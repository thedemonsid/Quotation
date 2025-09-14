'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Header } from '@/components/billing';
import { InputSection } from '@/components/billing';
import { SummarySection } from '@/components/billing';
import { Button } from '@/components/ui/button';
import { useCalculations } from '@/hooks/useCalculations';
import { FileText, DollarSign, Lock } from 'lucide-react';

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

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
    companyCharges,
    chaCharges,
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
    setCompanyCharges,
    setChaCharges,
    resetCalculation,
  } = useCalculations();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCreateQuotation = () => {
    // Navigate to quotation template page
    router.push('/quotation-template');
  };

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
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 mx-auto text-cyan-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Import Export Billing
              </h1>
              <p className="text-gray-600">
                Please sign in to access the billing and quotation system
              </p>
            </div>
            <SignInButton>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                Sign In to Continue
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Header />

        <div className="container mx-auto max-w-6xl px-6 py-8">
          {/* Create Quotation Button */}
          <div className="mb-8 text-center">
            <Button
              onClick={handleCreateQuotation}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-2" />
              Create Quotation
              <DollarSign className="w-5 h-5 ml-2" />
            </Button>
            <p className="mt-2 text-sm text-gray-600">
              Generate a professional quotation with automatic INR to USD
              conversion
            </p>
          </div>

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
              companyCharges={companyCharges}
              chaCharges={chaCharges}
              onBoxPriceChange={setBoxPrice}
              onNoOfBoxesChange={setNoOfBoxes}
              onBoxWeightChange={setBoxWeight}
              onDandaPercentageChange={setDandaPercentage}
              onPricePerKgChange={setPricePerKg}
              onVendorChargeChange={setVendorCharge}
              onColdStorageChange={setColdStorage}
              onLocalTransportChange={setLocalTransport}
              onPackingMaterialChange={setPackingMaterial}
              onCompanyChargesChange={setCompanyCharges}
              onChaChargesChange={setChaCharges}
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
              companyCharges={companyCharges}
              chaCharges={chaCharges}
              grandTotal={grandTotal}
              noOfBoxes={noOfBoxes}
            />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
