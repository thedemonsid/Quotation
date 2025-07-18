/**
 * Currency conversion service for real-time INR to USD exchange rates
 * Uses ExchangeRate-API with reliable CORS-friendly endpoints
 */

// Define types for API responses
interface ExchangeRateApiPairResponse {
  conversion_rate: number;
  result?: string;
}

interface ExchangeRateApiLatestResponse {
  conversion_rates: {
    USD: number;
  };
  result?: string;
}

interface ExchangeRateApiFreeResponse {
  rates: {
    USD: number;
  };
}

interface ApiErrorResponse {
  result: "error";
  "error-type": string;
}

type ApiResponse =
  | ExchangeRateApiPairResponse
  | ExchangeRateApiLatestResponse
  | ExchangeRateApiFreeResponse
  | ApiErrorResponse;

interface ApiConfig {
  name: string;
  url: string;
  extractRate: (data: ApiResponse) => number;
}

const EXCHANGE_RATE_APIS: ApiConfig[] = [
  {
    name: "ExchangeRate-API Pair",
    url: "https://v6.exchangerate-api.com/v6/517fbeddf382406933ac0aa3/pair/INR/USD",
    extractRate: (data: ApiResponse) => {
      if ("conversion_rate" in data) {
        return data.conversion_rate;
      }
      throw new Error("Invalid API response structure");
    },
  },
  {
    name: "ExchangeRate-API Latest",
    url: "https://v6.exchangerate-api.com/v6/517fbeddf382406933ac0aa3/latest/INR",
    extractRate: (data: ApiResponse) => {
      if ("conversion_rates" in data) {
        return data.conversion_rates.USD;
      }
      throw new Error("Invalid API response structure");
    },
  },
  {
    name: "ExchangeRate-API Free (Fallback)",
    url: "https://api.exchangerate-api.com/v4/latest/INR",
    extractRate: (data: ApiResponse) => {
      if ("rates" in data) {
        return data.rates.USD;
      }
      throw new Error("Invalid API response structure");
    },
  },
];

interface ExchangeRateResponse {
  rate: number;
  success: boolean;
  error?: string;
  source?: string;
}

class CurrencyService {
  private readonly CACHE_KEY = "exchange_rate_cache";
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get cached exchange rate if available and not expired
   */
  private getCachedRate(): number | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { rate, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < this.CACHE_DURATION) {
        return rate;
      }

      // Clear expired cache
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Cache exchange rate with timestamp
   */
  private setCachedRate(rate: number): void {
    try {
      const cacheData = {
        rate,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Fetch exchange rate from a specific API
   */
  private async fetchFromAPI(api: ApiConfig): Promise<number | null> {
    try {
      const response = await fetch(api.url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as ApiResponse;

      // Check for API error responses
      if ("result" in data && data.result === "error") {
        const errorData = data as ApiErrorResponse;
        throw new Error(`API Error: ${errorData["error-type"]}`);
      }

      const rate = api.extractRate(data);

      if (typeof rate !== "number" || isNaN(rate) || rate <= 0) {
        throw new Error("Invalid exchange rate received");
      }

      console.log(`Successfully fetched rate from ${api.name}: ${rate}`);
      return rate;
    } catch (error) {
      console.warn(`Failed to fetch from ${api.name}:`, error);
      return null;
    }
  }

  /**
   * Get current INR to USD exchange rate
   * Uses cache first, then tries multiple APIs with fallback
   */
  async getExchangeRate(): Promise<ExchangeRateResponse> {
    // Try cached rate first
    const cachedRate = this.getCachedRate();
    if (cachedRate) {
      return {
        rate: cachedRate,
        success: true,
        source: "cache",
      };
    }

    // Try each API in sequence
    for (const api of EXCHANGE_RATE_APIS) {
      const rate = await this.fetchFromAPI(api);
      if (rate) {
        this.setCachedRate(rate);
        return {
          rate,
          success: true,
          source: api.name,
        };
      }
    }

    // All APIs failed, use fallback rate
    const fallbackRate = 0.012; // Approximate fallback rate (July 2025: ~83 INR = 1 USD)
    console.warn(
      "All exchange rate APIs failed, using fallback rate:",
      fallbackRate
    );

    return {
      rate: fallbackRate,
      success: false,
      error: "All exchange rate APIs failed, using fallback rate",
      source: "fallback",
    };
  }

  /**
   * Convert INR amount to USD using provided exchange rate
   */
  convertINRToUSD(amountINR: number, exchangeRate: number): number {
    if (typeof amountINR !== "number" || typeof exchangeRate !== "number") {
      throw new Error("Invalid amount or exchange rate");
    }

    const converted = amountINR * exchangeRate;
    return Math.round(converted * 10000) / 10000; // Round to 4 decimal places for precision
  }

  /**
   * Convert USD amount to INR using provided exchange rate
   */
  convertUSDToINR(amountUSD: number, exchangeRate: number): number {
    if (typeof amountUSD !== "number" || typeof exchangeRate !== "number") {
      throw new Error("Invalid amount or exchange rate");
    }

    const converted = amountUSD / exchangeRate;
    return Math.round(converted * 100) / 100; // Round to 2 decimal places for INR
  }

  /**
   * Format currency amount with proper symbols and decimal places
   */
  formatCurrency(amount: number, currency: "INR" | "USD" = "USD"): string {
    const symbol = currency === "INR" ? "₹" : "$";
    const decimals = currency === "USD" ? 4 : 2; // More precision for USD

    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    return `${symbol}${formatted}`;
  }

  /**
   * Format exchange rate for display with high precision
   */
  formatExchangeRate(rate: number): string {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
    }).format(rate);
  }

  /**
   * Clear cached exchange rate (useful for testing or manual refresh)
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }
}

// Export singleton instance
export const currencyService = new CurrencyService();

// Export types for use in components
export type { ExchangeRateResponse };
