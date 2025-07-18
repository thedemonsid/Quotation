"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const QuotationPage: React.FC = () => {
  const router = useRouter();
  const { quotationData, calculationBreakdown, formatINR, formatUSD } =
    useQuotationData();
  const { getExchangeRateInfo, refreshExchangeRate, isLoading } = useCurrency();

  // Get exchange rate info for display
  const exchangeRateInfo = getExchangeRateInfo();

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
                        calculationBreakdown.costBreakdownINR.grandTotal
                      )}
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <div className="text-center">
                    <div className="text-gray-500">Total (USD)</div>
                    <div className="font-bold text-sm sm:text-lg text-green-600">
                      {formatUSD(
                        calculationBreakdown.costBreakdownUSD.grandTotal
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Template */}
          <div className="container mx-auto py-2 sm:py-8 px-2 sm:px-6">
            <QuotationTemplate data={quotationData} />
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default QuotationPage;
