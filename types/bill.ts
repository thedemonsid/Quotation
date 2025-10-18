export interface BillItem {
  id: string;
  description: string;
  hsn?: string; // HSN/SAC code
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface TaxDetails {
  cgst?: number; // Central GST percentage
  sgst?: number; // State GST percentage
  igst?: number; // Integrated GST percentage
  taxAmount: number;
}

export interface BillData {
  billNumber: string;
  billDate: string;
  dueDate?: string;
  purchaseOrderNumber?: string;
  purchaseOrderDate?: string;

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
