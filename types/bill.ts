export interface BoxWeightEntry {
  weight: number; // Weight per carton in kg (e.g., 4.0, 4.5, 5.0, 8.0, 8.2)
  numberOfBoxes: number;
  totalWeight: number; // numberOfBoxes * weight
  rate?: number; // Rate per KG or per Box
  rateType?: "kg" | "box"; // Whether rate is per KG or per Box
  amount?: number; // Calculated amount for this entry
}

export interface BillItem {
  id: string;
  description: string;
  hsn?: string; // HSN/SAC code
  quantity: number; // Total quantity in KG
  unit: string;
  rate: number; // Rate per KG
  amount: number; // Total amount in RS
  /** Optional per-line extra charges (added on top of amount) */
  extraChargeLabel?: string;
  extraChargeAmount?: number;
  // Box weight details for the nested table
  boxWeightEntries?: BoxWeightEntry[];
}

export interface TaxDetails {
  cgst?: number; // Central GST percentage
  sgst?: number; // State GST percentage
  igst?: number; // Integrated GST percentage
  taxAmount: number;
}

export interface ExtraCharge {
  id: string;
  label?: string;
  amount?: number;
}

export type BillRateCurrency = "INR" | "USD" | "EUR";

export interface BillData {
  billNumber: string;
  billDate: string;
  containerNumber?: string;
  dueDate?: string;
  purchaseOrderNumber?: string;
  purchaseOrderDate?: string;
  rateCurrency?: BillRateCurrency;

  // Customer details
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGSTIN?: string;

  // Items
  items: BillItem[];

  // Financial details
  subtotal: number;
  tax?: TaxDetails;
  discount?: number;
  discountPercentage?: number;
  shippingCharges?: number;
  otherCharges?: number;
  extraCharges?: ExtraCharge[];
  total: number;

  // Payment details
  paymentTerms?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };

  // Additional info
  notes?: string[];
  termsAndConditions?: string[];
}
