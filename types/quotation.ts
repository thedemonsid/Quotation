export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface QuotationData {
  quotationNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  items: QuotationItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  validityPeriod?: string;
  terms?: string[];
}
