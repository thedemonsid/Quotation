import { useBillStore } from "@/store/bill";
import type { BillItem } from "@/types/bill";

export const useBill = () => {
  const store = useBillStore();

  // Format currency
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Quick add item helper
  const quickAddItem = (
    description: string,
    quantity: number,
    rate: number,
    unit: string = "Nos",
    hsn?: string
  ) => {
    const item: BillItem = {
      id: Date.now().toString() + Math.random(),
      description,
      hsn,
      quantity,
      unit,
      rate,
      amount: quantity * rate,
    };
    store.addItem(item);
  };

  // Set tax as a single percentage (calculates CGST + SGST or IGST)
  const setGST = (percentage: number, isInterState: boolean = false) => {
    const taxableAmount = store.subtotal - store.discount;

    if (isInterState) {
      // IGST for inter-state
      const igstAmount = (taxableAmount * percentage) / 100;
      store.setTax({
        igst: percentage,
        taxAmount: igstAmount,
      });
    } else {
      // CGST + SGST for intra-state (split equally)
      const halfPercent = percentage / 2;
      const cgstAmount = (taxableAmount * halfPercent) / 100;
      const sgstAmount = (taxableAmount * halfPercent) / 100;
      store.setTax({
        cgst: halfPercent,
        sgst: halfPercent,
        taxAmount: cgstAmount + sgstAmount,
      });
    }
  };

  // Populate from quotation data (if user wants to convert quotation to bill)
  const populateFromQuotation = (quotationData: any) => {
    // Update customer details
    store.updateCustomerDetails({
      name: quotationData.customerName,
      address: quotationData.customerAddress,
      phone: quotationData.customerPhone,
      email: quotationData.customerEmail,
    });

    // Clear existing items and add from quotation
    store.clearItems();
    if (quotationData.items && Array.isArray(quotationData.items)) {
      quotationData.items.forEach((item: any) => {
        quickAddItem(item.description, item.quantity, item.rate, item.unit);
      });
    }
  };

  return {
    ...store,
    formatINR,
    quickAddItem,
    setGST,
    populateFromQuotation,
  };
};
