import { create } from "zustand";

export interface CompanyDetails {
  name: string;
  tagline: string;
  ownerName: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface QuotationDetails {
  quotationNumber: string;
  date: string;
  validityPeriod: string;
  terms: string[];
}

export interface CurrencyState {
  exchangeRate: number; // INR to USD
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}

interface QuotationState {
  // Company details
  companyDetails: CompanyDetails;

  // Customer details
  customerDetails: CustomerDetails;

  // Quotation details
  quotationDetails: QuotationDetails;

  // Currency conversion
  currency: CurrencyState;
}

interface QuotationActions {
  // Company actions
  updateCompanyDetails: (details: Partial<CompanyDetails>) => void;

  // Customer actions
  updateCustomerDetails: (details: Partial<CustomerDetails>) => void;

  // Quotation actions
  updateQuotationDetails: (details: Partial<QuotationDetails>) => void;
  generateQuotationNumber: () => void;

  // Currency actions
  updateExchangeRate: (rate: number) => void;
  setExchangeRateLoading: (loading: boolean) => void;
  setExchangeRateError: (error: string | null) => void;

  // Utility functions
  convertINRToUSD: (amount: number) => number;
  resetQuotation: () => void;
}

const defaultCompanyDetails: CompanyDetails = {
  name: "BANANA VENTURES SHINDE'S",
  tagline: "Quality is our identity",
  ownerName: "Pruthviraj Shinde",
  address: "Jategaon, Karmala, Maharashtra India",
  phone: "+91 9169700222",
  email: "bananaventures.shindes@gmail.com",
  gstin: "27SYEPS7484G1ZC",
};

const defaultCustomerDetails: CustomerDetails = {
  name: "Green World International LLC",
  address: "Iran",
  phone: "+98 9122339891",
  email: "manager@greenworldintco.com",
};

const defaultQuotationDetails: QuotationDetails = {
  quotationNumber: "Quote-banana ventures shinde's",
  date: new Date().toISOString().split("T")[0],
  validityPeriod: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0], // 30 days from now
  terms: [
    "Terms & Conditions: CIF",
    "Payment Instructions: Banana Ventures Shinde's",
    "Account - 60521459884",
    "IFSC code - MAHB00011669",
    "GSTIN: 27SYEPS7484G1ZC",
  ],
};

const defaultCurrencyState: CurrencyState = {
  exchangeRate: 0.012, // Default fallback rate (1 INR = 0.012 USD approximately)
  lastUpdated: new Date().toISOString(),
  isLoading: false,
  error: null,
};

const initialState: QuotationState = {
  companyDetails: defaultCompanyDetails,
  customerDetails: defaultCustomerDetails,
  quotationDetails: defaultQuotationDetails,
  currency: defaultCurrencyState,
};

export const useQuotationStore = create<QuotationState & QuotationActions>(
  (set, get) => ({
    ...initialState,

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

    // Quotation actions
    updateQuotationDetails: (details) =>
      set((state) => ({
        quotationDetails: { ...state.quotationDetails, ...details },
      })),

    generateQuotationNumber: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const timestamp = Date.now().toString().slice(-4);

      const quotationNumber = `BVQS-${year}${month}${day}-${timestamp}`;

      set((state) => ({
        quotationDetails: { ...state.quotationDetails, quotationNumber },
      }));
    },

    // Currency actions
    updateExchangeRate: (rate) =>
      set((state) => ({
        currency: {
          ...state.currency,
          exchangeRate: rate,
          lastUpdated: new Date().toISOString(),
          error: null,
        },
      })),

    setExchangeRateLoading: (loading) =>
      set((state) => ({
        currency: { ...state.currency, isLoading: loading },
      })),

    setExchangeRateError: (error) =>
      set((state) => ({
        currency: { ...state.currency, error, isLoading: false },
      })),

    // Utility functions
    convertINRToUSD: (amount) => {
      const { exchangeRate } = get().currency;
      return amount * exchangeRate;
    },

    resetQuotation: () => set(initialState),
  })
);
