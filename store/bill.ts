import { create } from "zustand";
import type {
  BillData,
  BillItem,
  BillRateCurrency,
  ExtraCharge,
  NotifyPartyEntry,
  TaxDetails,
} from "@/types/bill";

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

// NotifyPartyDetails is now imported as NotifyPartyEntry from types

export interface BillDetails {
  billNumber: string;
  billDate: string;
  containerNumber?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  finalDestination?: string;
  dueDate?: string;
  purchaseOrderNumber?: string;
  purchaseOrderDate?: string;
  rateCurrency: BillRateCurrency;
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
  extraCharges: ExtraCharge[];
  total: number;

  // Payment details (editable)
  paymentDetails: PaymentDetails;

  // Notify Parties
  notifyParties: NotifyPartyEntry[];

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
  addExtraCharge: () => void;
  updateExtraCharge: (id: string, charge: Partial<ExtraCharge>) => void;
  removeExtraCharge: (id: string) => void;
  clearExtraCharges: () => void;
  calculateTotal: () => void;

  // Notify Party actions
  addNotifyParty: () => void;
  updateNotifyParty: (id: string, details: Partial<NotifyPartyEntry>) => void;
  removeNotifyParty: (id: string) => void;

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
  billNumber: "", // Will be auto-generated on client side
  billDate: new Date().toISOString().split("T")[0],
  containerNumber: "",
  portOfLoading: "",
  portOfDischarge: "",
  finalDestination: "",
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 15 days from now
  purchaseOrderNumber: "",
  purchaseOrderDate: "",
  rateCurrency: "INR",
};

// No more single defaultNotifyPartyDetails — we use an empty array

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
  extraCharges: [],
  total: 0,
  paymentDetails: defaultPaymentDetails,
  notifyParties: [],
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
    // Only run on client side where localStorage is available
    if (typeof window === "undefined") return;

    try {
      const currentYear = new Date().getFullYear();
      const storageKey = "bvs_last_invoice_sequence";
      let nextSequence = 1;

      const lastSequenceData = localStorage.getItem(storageKey);
      
      if (lastSequenceData) {
        const parsed = JSON.parse(lastSequenceData);
        // If it's the same year, increment the sequence. If new year, start fresh at 1.
        if (parsed.year === currentYear) {
          nextSequence = parsed.sequence + 1;
        }
      }

      // Save the new sequence
      localStorage.setItem(storageKey, JSON.stringify({
        year: currentYear,
        sequence: nextSequence
      }));

      // Format as BVS-2026-01
      const paddedSequence = nextSequence.toString().padStart(2, "0");
      const newBillNumber = `BVS-${currentYear}-${paddedSequence}`;

      set({
        billDetails: {
          ...get().billDetails,
          billNumber: newBillNumber,
        },
      });
    } catch (e) {
      console.error("Error generating invoice number:", e);
      // Fallback
      set({
        billDetails: {
          ...get().billDetails,
          billNumber: `BVS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        },
      });
    }
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

  addExtraCharge: () => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    set((state) => ({
      extraCharges: [
        ...state.extraCharges,
        { id, label: "", amount: undefined },
      ],
    }));
    get().calculateTotal();
  },

  updateExtraCharge: (id, chargeUpdate) => {
    set((state) => ({
      extraCharges: state.extraCharges.map((c) =>
        c.id === id ? { ...c, ...chargeUpdate } : c,
      ),
    }));
    get().calculateTotal();
  },

  removeExtraCharge: (id) => {
    set((state) => ({
      extraCharges: state.extraCharges.filter((c) => c.id !== id),
    }));
    get().calculateTotal();
  },

  clearExtraCharges: () => {
    set({ extraCharges: [] });
    get().calculateTotal();
  },

  calculateTotal: () => {
    const state = get();
    const itemsTotal = state.items.reduce((sum, item) => sum + item.amount, 0);

    const extraChargesTotal = state.extraCharges.reduce((sum, c) => {
      const label = (c.label ?? "").trim();
      const amount =
        typeof c.amount === "number" && isFinite(c.amount) ? c.amount : 0;
      const isFilled = label.length > 0 || amount !== 0;
      return sum + (isFilled ? amount : 0);
    }, 0);

    const subtotal = itemsTotal + extraChargesTotal;
    const taxAmount = state.tax?.taxAmount || 0;
    const total =
      subtotal -
      state.discount +
      taxAmount +
      state.shippingCharges +
      state.otherCharges;

    set({ subtotal, total });
  },

  // Notify Party actions
  addNotifyParty: () => {
    const id = `np-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    set((state) => ({
      notifyParties: [
        ...state.notifyParties,
        { id, companyName: "", address: "", phone: "", email: "", gstin: "" },
      ],
    }));
  },

  updateNotifyParty: (id, details) =>
    set((state) => ({
      notifyParties: state.notifyParties.map((p) =>
        p.id === id ? { ...p, ...details } : p,
      ),
    })),

  removeNotifyParty: (id) =>
    set((state) => ({
      notifyParties: state.notifyParties.filter((p) => p.id !== id),
    })),

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
  resetBill: () => {
    set({
      companyDetails: defaultCompanyDetails,
      customerDetails: defaultCustomerDetails,
      billDetails: {
        ...defaultBillDetails,
        billNumber: "",
        billDate: new Date().toISOString().split("T")[0],
        rateCurrency: "INR",
      },
      items: [],
      subtotal: 0,
      tax: undefined,
      discount: 0,
      discountPercentage: 0,
      shippingCharges: 0,
      otherCharges: 0,
      extraCharges: [],
      total: 0,
      paymentDetails: defaultPaymentDetails,
      notifyParties: [],
      notes: [],
      termsAndConditions: defaultTermsAndConditions,
    });
    // Auto-generate the new sequence immediately after reset
    get().generateBillNumber();
  },

  getBillData: (): BillData => {
    const state = get();
    return {
      billNumber: state.billDetails.billNumber,
      billDate: state.billDetails.billDate,
      containerNumber: state.billDetails.containerNumber,
      portOfLoading: state.billDetails.portOfLoading,
      portOfDischarge: state.billDetails.portOfDischarge,
      finalDestination: state.billDetails.finalDestination,
      dueDate: state.billDetails.dueDate,
      purchaseOrderNumber: state.billDetails.purchaseOrderNumber,
      purchaseOrderDate: state.billDetails.purchaseOrderDate,
      rateCurrency: state.billDetails.rateCurrency,
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
      extraCharges: state.extraCharges,
      total: state.total,
      paymentTerms: `Payment due by ${state.billDetails.dueDate}`,
      bankDetails: state.paymentDetails,
      notifyParties:
        state.notifyParties.length > 0
          ? state.notifyParties.filter((p) => p.companyName || p.address)
          : undefined,
      notes: state.notes,
      termsAndConditions: state.termsAndConditions,
    };
  },
}));
