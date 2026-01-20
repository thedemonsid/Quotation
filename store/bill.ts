import { create } from "zustand";
import type { BillData, BillItem, TaxDetails } from "@/types/bill";

export interface BillCompanyDetails {
  name: string;
  tagline: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  panNumber?: string;
}

export interface BillCustomerDetails {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  gstin?: string;
}

export interface BillDetails {
  billNumber: string;
  billDate: string;
  containerNumber?: string;
  dueDate?: string;
  purchaseOrderNumber?: string;
  purchaseOrderDate?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

interface BillState {
  // Company details (editable)
  companyDetails: BillCompanyDetails;

  // Customer details (editable)
  customerDetails: BillCustomerDetails;

  // Bill details
  billDetails: BillDetails;

  // Items
  items: BillItem[];

  // Financial details
  subtotal: number;
  tax?: TaxDetails;
  discount: number;
  discountPercentage: number;
  shippingCharges: number;
  otherCharges: number;
  total: number;

  // Payment details (editable)
  paymentDetails: PaymentDetails;

  // Additional info
  notes: string[];
  termsAndConditions: string[];
}

interface BillActions {
  // Company actions
  updateCompanyDetails: (details: Partial<BillCompanyDetails>) => void;

  // Customer actions
  updateCustomerDetails: (details: Partial<BillCustomerDetails>) => void;

  // Bill actions
  updateBillDetails: (details: Partial<BillDetails>) => void;
  generateBillNumber: () => void;

  // Item actions
  addItem: (item: BillItem) => void;
  updateItem: (id: string, item: Partial<BillItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;

  // Financial actions
  setSubtotal: (amount: number) => void;
  setTax: (tax: TaxDetails) => void;
  setDiscount: (amount: number) => void;
  setDiscountPercentage: (percentage: number) => void;
  setShippingCharges: (amount: number) => void;
  setOtherCharges: (amount: number) => void;
  calculateTotal: () => void;

  // Payment actions
  updatePaymentDetails: (details: Partial<PaymentDetails>) => void;

  // Notes & Terms actions
  addNote: (note: string) => void;
  removeNote: (index: number) => void;
  updateNotes: (notes: string[]) => void;
  addTerm: (term: string) => void;
  removeTerm: (index: number) => void;
  updateTerms: (terms: string[]) => void;

  // Utility functions
  resetBill: () => void;
  getBillData: () => BillData;
}

// Default values from your company info
const defaultCompanyDetails: BillCompanyDetails = {
  name: "BANANA VENTURES SHINDE'S",
  tagline: "Quality is our identity",
  ownerName: "Pruthviraj Shinde",
  address: "Jategaon, Karmala, Maharashtra India",
  phone: "+91 9169700222",
  email: "bananaventures.shindes@gmail.com",
  gstin: "27SYEPS7484G1ZC",
  panNumber: "",
};

const defaultCustomerDetails: BillCustomerDetails = {
  name: "",
  address: "",
  phone: "",
  email: "",
  gstin: "",
};

const defaultBillDetails: BillDetails = {
  billNumber: `BILL-${Date.now()}`,
  billDate: new Date().toISOString().split("T")[0],
  containerNumber: "",
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 15 days from now
  purchaseOrderNumber: "",
  purchaseOrderDate: "",
};

const defaultPaymentDetails: PaymentDetails = {
  bankName: "Bank of Maharashtra",
  accountNumber: "60521459884",
  ifscCode: "MAHB00011669",
  accountHolderName: "Banana Ventures Shinde's",
};

const defaultTermsAndConditions = [
  "Payment is due within 15 days of bill date",
  "Please make payment to the bank account mentioned above",
  "All disputes subject to local jurisdiction",
  "Goods once sold will not be taken back",
];

export const useBillStore = create<BillState & BillActions>((set, get) => ({
  // Initial state
  companyDetails: defaultCompanyDetails,
  customerDetails: defaultCustomerDetails,
  billDetails: defaultBillDetails,
  items: [],
  subtotal: 0,
  tax: undefined,
  discount: 0,
  discountPercentage: 0,
  shippingCharges: 0,
  otherCharges: 0,
  total: 0,
  paymentDetails: defaultPaymentDetails,
  notes: [],
  termsAndConditions: defaultTermsAndConditions,

  // Company actions
  updateCompanyDetails: (details) =>
    set((state) => ({
      companyDetails: { ...state.companyDetails, ...details },
    })),

  // Customer actions
  updateCustomerDetails: (details) =>
    set((state) => ({
      customerDetails: { ...state.customerDetails, ...details },
    })),

  // Bill actions
  updateBillDetails: (details) =>
    set((state) => ({
      billDetails: { ...state.billDetails, ...details },
    })),

  generateBillNumber: () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    set({
      billDetails: {
        ...get().billDetails,
        billNumber: `BILL-${timestamp}-${randomNum}`,
      },
    });
  },

  // Item actions
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
    get().calculateTotal();
  },

  updateItem: (id, itemUpdate) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...itemUpdate } : item,
      ),
    }));
    get().calculateTotal();
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
    get().calculateTotal();
  },

  clearItems: () => {
    set({ items: [] });
    get().calculateTotal();
  },

  // Financial actions
  setSubtotal: (amount) => {
    set({ subtotal: amount });
    get().calculateTotal();
  },

  setTax: (tax) => {
    set({ tax });
    get().calculateTotal();
  },

  setDiscount: (amount) => {
    set({ discount: amount, discountPercentage: 0 });
    get().calculateTotal();
  },

  setDiscountPercentage: (percentage) => {
    const subtotal = get().subtotal;
    const discountAmount = (subtotal * percentage) / 100;
    set({ discountPercentage: percentage, discount: discountAmount });
    get().calculateTotal();
  },

  setShippingCharges: (amount) => {
    set({ shippingCharges: amount });
    get().calculateTotal();
  },

  setOtherCharges: (amount) => {
    set({ otherCharges: amount });
    get().calculateTotal();
  },

  calculateTotal: () => {
    const state = get();
    const itemsTotal = state.items.reduce((sum, item) => sum + item.amount, 0);
    const subtotal = itemsTotal;
    const taxAmount = state.tax?.taxAmount || 0;
    const total =
      subtotal -
      state.discount +
      taxAmount +
      state.shippingCharges +
      state.otherCharges;

    set({ subtotal, total });
  },

  // Payment actions
  updatePaymentDetails: (details) =>
    set((state) => ({
      paymentDetails: { ...state.paymentDetails, ...details },
    })),

  // Notes & Terms actions
  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),

  removeNote: (index) =>
    set((state) => ({
      notes: state.notes.filter((_, i) => i !== index),
    })),

  updateNotes: (notes) => set({ notes }),

  addTerm: (term) =>
    set((state) => ({
      termsAndConditions: [...state.termsAndConditions, term],
    })),

  removeTerm: (index) =>
    set((state) => ({
      termsAndConditions: state.termsAndConditions.filter(
        (_, i) => i !== index,
      ),
    })),

  updateTerms: (terms) => set({ termsAndConditions: terms }),

  // Utility functions
  resetBill: () =>
    set({
      companyDetails: defaultCompanyDetails,
      customerDetails: defaultCustomerDetails,
      billDetails: {
        ...defaultBillDetails,
        billNumber: `BILL-${Date.now()}`,
        billDate: new Date().toISOString().split("T")[0],
      },
      items: [],
      subtotal: 0,
      tax: undefined,
      discount: 0,
      discountPercentage: 0,
      shippingCharges: 0,
      otherCharges: 0,
      total: 0,
      paymentDetails: defaultPaymentDetails,
      notes: [],
      termsAndConditions: defaultTermsAndConditions,
    }),

  getBillData: (): BillData => {
    const state = get();
    return {
      billNumber: state.billDetails.billNumber,
      billDate: state.billDetails.billDate,
      containerNumber: state.billDetails.containerNumber,
      dueDate: state.billDetails.dueDate,
      purchaseOrderNumber: state.billDetails.purchaseOrderNumber,
      purchaseOrderDate: state.billDetails.purchaseOrderDate,
      customerName: state.customerDetails.name,
      customerAddress: state.customerDetails.address,
      customerPhone: state.customerDetails.phone,
      customerEmail: state.customerDetails.email,
      customerGSTIN: state.customerDetails.gstin,
      items: state.items,
      subtotal: state.subtotal,
      tax: state.tax,
      discount: state.discount,
      discountPercentage: state.discountPercentage,
      shippingCharges: state.shippingCharges,
      otherCharges: state.otherCharges,
      total: state.total,
      paymentTerms: `Payment due by ${state.billDetails.dueDate}`,
      bankDetails: state.paymentDetails,
      notes: state.notes,
      termsAndConditions: state.termsAndConditions,
    };
  },
}));
