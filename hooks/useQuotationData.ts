import { useMemo } from "react";
import { useCalculations } from "@/hooks/useCalculations";
import { useQuotationStore } from "@/store/quotation";
import { useCurrency } from "@/hooks/useCurrency";
import type { QuotationData } from "@/types/quotation";

/**
 * Hook to map calculation data to quotation format
 * Handles currency conversion and data transformation
 */
export function useQuotationData() {
  const calculations = useCalculations();
  const { companyDetails, customerDetails, quotationDetails } =
    useQuotationStore();
  const { convertToUSD, formatCurrency } = useCurrency();

  const quotationData: QuotationData = useMemo(() => {
    // Convert total amount from INR to USD
    const totalAmountUSD = convertToUSD(calculations.grandTotal);

    // Calculate correct rate per box (total cost / number of boxes)
    const ratePerBoxUSD = totalAmountUSD / calculations.noOfBoxes;

    // Total amount is the same as grand total in USD
    const itemAmount = totalAmountUSD;

    // Create quotation item
    const quotationItem = {
      id: "1",
      description: `Banana box ${calculations.boxWeight} kg NW`,
      quantity: calculations.noOfBoxes,
      unit: "box",
      rate: ratePerBoxUSD,
      amount: itemAmount,
    };

    // Calculate totals
    const subtotal = itemAmount;
    const discount = 0; // No discount for now
    const finalTotal = subtotal - discount;

    return {
      quotationNumber: quotationDetails.quotationNumber,
      date: quotationDetails.date,
      validityPeriod: quotationDetails.validityPeriod,
      customerName: customerDetails.name,
      customerAddress: customerDetails.address,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email,
      items: [quotationItem],
      subtotal,
      discount: discount > 0 ? discount : undefined,
      tax: undefined, // No tax for international trade
      total: finalTotal,
      terms: quotationDetails.terms,
    };
  }, [calculations, customerDetails, quotationDetails, convertToUSD]);

  // Additional calculation details for display
  const calculationBreakdown = useMemo(() => {
    return {
      // Weight calculations
      grossWeight: calculations.grossWeight,
      netWeight: calculations.netWeight,
      totalWeight: calculations.totalWeight,
      wastage: calculations.wastage,
      danda: calculations.danda,

      // Cost breakdown in INR
      costBreakdownINR: {
        weightCost: calculations.totalCost,
        boxCost: calculations.boxPrice * calculations.noOfBoxes,
        vendorCharge: calculations.vendorCharge,
        coldStorage: calculations.coldStorage,
        localTransport: calculations.localTransport,
        packingMaterial: calculations.packingMaterial,
        grandTotal: calculations.grandTotal,
      },

      // Cost breakdown in USD
      costBreakdownUSD: {
        weightCost: convertToUSD(calculations.totalCost),
        boxCost: convertToUSD(calculations.boxPrice * calculations.noOfBoxes),
        vendorCharge: convertToUSD(calculations.vendorCharge),
        coldStorage: convertToUSD(calculations.coldStorage),
        localTransport: convertToUSD(calculations.localTransport),
        packingMaterial: convertToUSD(calculations.packingMaterial),
        grandTotal: convertToUSD(calculations.grandTotal),
      },
    };
  }, [calculations, convertToUSD]);

  return {
    quotationData,
    calculationBreakdown,
    // Helper functions
    formatINR: (amount: number) => formatCurrency(amount, "INR"),
    formatUSD: (amount: number) => formatCurrency(amount, "USD"),
  };
}
