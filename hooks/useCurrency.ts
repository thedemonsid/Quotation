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
    updateExchangeRates,
    setExchangeRateLoading,
    setExchangeRateError,
    convertINRToUSD,
  } = useQuotationStore();

  /**
   * Fetch exchange rates (USD and EUR) from API
   */
  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);
    setExchangeRateError(null);

    try {
      const response = await currencyService.getExchangeRates();

      if (response.success) {
        updateExchangeRates({ usd: response.usd, eur: response.eur });
      } else {
        updateExchangeRates({
          usd: response.usd,
          eur: response.eur,
        });
        setExchangeRateError(response.error || "Failed to fetch exchange rate");
      }
    } catch (error) {
      const fallbackUsd = 0.012;
      const fallbackEur = 0.011;
      updateExchangeRates({ usd: fallbackUsd, eur: fallbackEur });
      setExchangeRateError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setExchangeRateLoading(false);
    }
  }, [
    updateExchangeRate,
    updateExchangeRates,
    setExchangeRateLoading,
    setExchangeRateError,
  ]);

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
   * Convert foreign currency to INR. With one arg: treats amount as USD.
   * With two args: uses the given currency (USD or EUR).
   */
  const convertToINR = useCallback(
    (amount: number, currencyType: "USD" | "EUR" = "USD") => {
      const rate =
        currencyType === "EUR" ? currency.exchangeRateEUR : currency.exchangeRate;
      return currencyService.convertUSDToINR(amount, rate);
    },
    [currency.exchangeRate, currency.exchangeRateEUR]
  );

  /**
   * Convert INR to selected currency for display (when bill is in USD/EUR)
   */
  const convertFromINR = useCallback(
    (amountINR: number, currencyType: "USD" | "EUR") => {
      const rate =
        currencyType === "EUR" ? currency.exchangeRateEUR : currency.exchangeRate;
      return currencyService.convertINRToUSD(amountINR, rate); // same formula: amount * rate
    },
    [currency.exchangeRate, currency.exchangeRateEUR]
  );

  /**
   * Format currency with proper symbols (INR, USD, EUR)
   */
  const formatCurrency = useCallback(
    (amount: number, currencyType: "INR" | "USD" | "EUR" = "USD") => {
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
    convertFromINR,
    formatCurrency,

    // Utility functions
    fetchExchangeRate,
    refreshExchangeRate,
    getExchangeRateInfo,
  };
}
