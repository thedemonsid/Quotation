"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QuotationTemplate from "@/templates/quotationHtmlTemplate";
import {
  CompanyDetailsDialog,
  CustomerDetailsDialog,
  QuotationDetailsDialog,
} from "@/components/quotation/QuotationDialogs";
import { useQuotationData } from "@/hooks/useQuotationData";
import { useCurrency } from "@/hooks/useCurrency";
import {
  ArrowLeft,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Lock,
  Edit3,
} from "lucide-react";

const QuotationPage: React.FC = () => {
  const router = useRouter();
  const { quotationData, calculationBreakdown, formatINR, formatUSD } =
    useQuotationData();
  const { getExchangeRateInfo, refreshExchangeRate, isLoading, convertToINR } =
    useCurrency();

  // State for manual price per box override (in USD)
  const [userInputPrice, setUserInputPrice] = useState<string>("");

  // Get exchange rate info for display
  const exchangeRateInfo = getExchangeRateInfo();

  // Calculate the original price per box in USD
  const originalPricePerBoxUSD = quotationData.items[0]?.rate || 0;

  // Create modified quotation data with user input price
  const modifiedQuotationData = useMemo(() => {
    if (!userInputPrice || isNaN(parseFloat(userInputPrice))) {
      return quotationData;
    }

    const newRate = parseFloat(userInputPrice);
    const newAmount = newRate * quotationData.items[0].quantity;

    return {
      ...quotationData,
      items: [
        {
          ...quotationData.items[0],
          rate: newRate,
          amount: newAmount,
        },
      ],
      subtotal: newAmount,
      total: newAmount,
    };
  }, [quotationData, userInputPrice]);

  // Calculate modified breakdown for display
  const modifiedCalculationBreakdown = useMemo(() => {
    if (!userInputPrice || isNaN(parseFloat(userInputPrice))) {
      return calculationBreakdown;
    }

    const newPriceUSD = parseFloat(userInputPrice);
    const totalBoxes = quotationData.items[0].quantity;
    const newTotalUSD = newPriceUSD * totalBoxes;
    const newTotalINR = convertToINR(newTotalUSD);

    return {
      ...calculationBreakdown,
      costBreakdownUSD: {
        ...calculationBreakdown.costBreakdownUSD,
        grandTotal: newTotalUSD,
      },
      costBreakdownINR: {
        ...calculationBreakdown.costBreakdownINR,
        grandTotal: newTotalINR,
      },
    };
  }, [calculationBreakdown, userInputPrice, quotationData, convertToINR]);

  const handlePriceChange = (value: string) => {
    setUserInputPrice(value);
  };

  const resetToCalculatedPrice = () => {
    setUserInputPrice("");
  };

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
            <div className="mb-6">
              <Lock className="w-16 h-16 mx-auto text-cyan-600 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Restricted
              </h1>
              <p className="text-gray-600">
                Please sign in to access the quotation template
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
        <div className="min-h-screen bg-gray-50">
          {/* Header with Navigation and Controls */}
          <div className="bg-white shadow-sm border-b">
            <div className="container px-2 py-2 sm:px-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-1 sm:gap-4 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1 text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Back to Calculator</span>
                    <span className="xs:hidden">Back</span>
                  </Button>
                  <h1 className="text-base sm:text-2xl font-bold text-gray-800 truncate">
                    Quotation Generator
                  </h1>
                </div>

                {/* Exchange Rate Display */}
                <div className="flex items-center gap-1 sm:gap-4 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">
                      {exchangeRateInfo.formattedRate}
                    </span>
                    <Badge
                      variant={
                        exchangeRateInfo.error ? "destructive" : "secondary"
                      }
                      className="text-xs px-1 py-0.5"
                    >
                      {exchangeRateInfo.error ? "Fallback" : "Live"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshExchangeRate}
                      disabled={isLoading}
                      className="ml-1 p-1"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-700 whitespace-nowrap">
                    Quotation Details
                  </h2>
                  <div className="flex flex-wrap gap-1 sm:gap-3">
                    <CompanyDetailsDialog />
                    <CustomerDetailsDialog />
                    <QuotationDetailsDialog />
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-center">
                    <div className="text-gray-500">Total (INR)</div>
                    <div className="font-bold text-sm sm:text-lg">
                      {formatINR(
                        modifiedCalculationBreakdown.costBreakdownINR.grandTotal
                      )}
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <div className="text-center">
                    <div className="text-gray-500">Total (USD)</div>
                    <div className="font-bold text-sm sm:text-lg text-green-600">
                      {formatUSD(
                        modifiedCalculationBreakdown.costBreakdownUSD.grandTotal
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Override Section */}
          <div className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-2 py-3 sm:px-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Price per Box Override
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="priceOverride"
                      className="text-xs text-gray-600 whitespace-nowrap"
                    >
                      Price (USD):
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="priceOverride"
                        type="number"
                        step="0.01"
                        min="0"
                        value={userInputPrice}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder={originalPricePerBoxUSD.toFixed(2)}
                        className="w-24 sm:w-32 text-xs sm:text-sm h-8"
                      />
                      {userInputPrice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetToCalculatedPrice}
                          className="text-xs px-2 py-1 h-8"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {userInputPrice && !isNaN(parseFloat(userInputPrice)) ? (
                      <span className="text-orange-600 font-medium">
                        Using manual price: $
                        {parseFloat(userInputPrice).toFixed(2)}
                      </span>
                    ) : (
                      <span>
                        Calculated price: ${originalPricePerBoxUSD.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Template */}
          <div className="container mx-auto py-2 sm:py-8 px-2 sm:px-6">
            <QuotationTemplate data={modifiedQuotationData} />
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default QuotationPage;
