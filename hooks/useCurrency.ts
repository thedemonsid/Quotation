import { useEffect, useCallback } from "react";
import { useQuotationStore } from "@/store/quotation";
import { currencyService } from "@/lib/currency";

/**
 * Hook for managing currency conversion and exchange rates
 * Provides automatic rate fetching and manual refresh capabilities
 */
export function useCurrency() {
  const {
    currency,
    updateExchangeRate,
    setExchangeRateLoading,
    setExchangeRateError,
    convertINRToUSD,
  } = useQuotationStore();

  /**
   * Fetch exchange rate from API
   */
  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);
    setExchangeRateError(null);

    try {
      const response = await currencyService.getExchangeRate();

      if (response.success) {
        updateExchangeRate(response.rate);
      } else {
        // Still update with fallback rate but show error
        updateExchangeRate(response.rate);
        setExchangeRateError(response.error || "Failed to fetch exchange rate");
      }
    } catch (error) {
      const fallbackRate = 0.012;
      updateExchangeRate(fallbackRate);
      setExchangeRateError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setExchangeRateLoading(false);
    }
  }, [updateExchangeRate, setExchangeRateLoading, setExchangeRateError]);

  /**
   * Initialize exchange rate on mount
   */
  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  /**
   * Convert INR to USD with current exchange rate
   */
  const convertToUSD = useCallback(
    (amountINR: number) => {
      return currencyService.convertINRToUSD(amountINR, currency.exchangeRate);
    },
    [currency.exchangeRate]
  );

  /**
   * Convert USD to INR with current exchange rate
   */
  const convertToINR = useCallback(
    (amountUSD: number) => {
      return currencyService.convertUSDToINR(amountUSD, currency.exchangeRate);
    },
    [currency.exchangeRate]
  );

  /**
   * Format currency with proper symbols
   */
  const formatCurrency = useCallback(
    (amount: number, currencyType: "INR" | "USD" = "USD") => {
      return currencyService.formatCurrency(amount, currencyType);
    },
    []
  );

  /**
   * Get exchange rate info for display
   */
  const getExchangeRateInfo = useCallback(() => {
    return {
      rate: currency.exchangeRate,
      lastUpdated: currency.lastUpdated,
      isLoading: currency.isLoading,
      error: currency.error,
      formattedRate: `1 INR = $${currencyService.formatExchangeRate(
        currency.exchangeRate
      )}`,
      preciseRate: currencyService.formatExchangeRate(currency.exchangeRate),
      inverseRate: `1 USD = ₹${currencyService.formatExchangeRate(
        1 / currency.exchangeRate
      )}`,
    };
  }, [currency]);

  /**
   * Clear cache and refresh rate
   */
  const refreshExchangeRate = useCallback(() => {
    currencyService.clearCache();
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  return {
    // Current state
    exchangeRate: currency.exchangeRate,
    isLoading: currency.isLoading,
    error: currency.error,
    lastUpdated: currency.lastUpdated,

    // Conversion functions
    convertToUSD,
    convertToINR,
    formatCurrency,

    // Utility functions
    fetchExchangeRate,
    refreshExchangeRate,
    getExchangeRateInfo,
  };
}
