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
    EUR?: number;
  };
  result?: string;
}

interface ExchangeRateApiFreeResponse {
  rates: {
    USD: number;
    EUR?: number;
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

export interface ExchangeRatesResponse {
  usd: number;
  eur: number;
  success: boolean;
  error?: string;
  source?: string;
}

interface CachedRates {
  usd: number;
  eur: number;
  timestamp: number;
}

class CurrencyService {
  private readonly CACHE_KEY = "exchange_rate_cache";
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  private readonly FALLBACK_EUR = 0.011; // Approximate INR to EUR (1 INR ≈ 0.011 EUR)

  /**
   * Get cached exchange rate if available and not expired (legacy single rate = USD)
   */
  private getCachedRate(): number | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const now = Date.now();
      const timestamp = parsed.timestamp ?? 0;

      if (now - timestamp >= this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      // New format: { usd, eur, timestamp }
      if (typeof parsed.usd === "number") return parsed.usd;
      // Legacy: { rate, timestamp }
      if (typeof parsed.rate === "number") return parsed.rate;
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get cached rates (USD and EUR) if available and not expired
   */
  private getCachedRates(): CachedRates | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const now = Date.now();
      const timestamp = parsed.timestamp ?? 0;

      if (now - timestamp >= this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      if (typeof parsed.usd === "number" && typeof parsed.eur === "number") {
        return { usd: parsed.usd, eur: parsed.eur, timestamp };
      }
      // Legacy single rate: treat as USD, use fallback for EUR
      if (typeof parsed.rate === "number") {
        return {
          usd: parsed.rate,
          eur: this.FALLBACK_EUR,
          timestamp,
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Cache exchange rate with timestamp (legacy: single rate = USD)
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
   * Cache both USD and EUR rates
   */
  private setCachedRates(rates: { usd: number; eur: number }): void {
    try {
      const cacheData: CachedRates = {
        ...rates,
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
   * Fetch USD and EUR rates from "latest/INR" endpoint (one call for both)
   */
  private async fetchRatesFromLatest(): Promise<{ usd: number; eur: number } | null> {
    const url =
      "https://v6.exchangerate-api.com/v6/517fbeddf382406933ac0aa3/latest/INR";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (
        !data.conversion_rates ||
        typeof data.conversion_rates.USD !== "number"
      ) {
        return null;
      }
      const usd = data.conversion_rates.USD;
      const eur =
        typeof data.conversion_rates.EUR === "number"
          ? data.conversion_rates.EUR
          : this.FALLBACK_EUR;
      return { usd, eur };
    } catch {
      return null;
    }
  }

  /**
   * Get current INR to USD exchange rate
   * Uses cache first, then tries multiple APIs with fallback
   */
  async getExchangeRate(): Promise<ExchangeRateResponse> {
    const cached = this.getCachedRates();
    if (cached) {
      return {
        rate: cached.usd,
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
   * Get INR to USD and INR to EUR exchange rates (one fetch, cached together)
   */
  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    const cached = this.getCachedRates();
    if (cached) {
      return {
        usd: cached.usd,
        eur: cached.eur,
        success: true,
        source: "cache",
      };
    }

    const rates = await this.fetchRatesFromLatest();
    if (rates) {
      this.setCachedRates(rates);
      return {
        usd: rates.usd,
        eur: rates.eur,
        success: true,
        source: "ExchangeRate-API Latest",
      };
    }

    // Fallback: try single-rate APIs for USD, use fallback for EUR
    const usdResponse = await this.getExchangeRate();
    const eur = this.getCachedRates()?.eur ?? this.FALLBACK_EUR;
    return {
      usd: usdResponse.rate,
      eur,
      success: usdResponse.success,
      error: usdResponse.error,
      source: usdResponse.source,
    };
  }

  /**
   * Convert amount in foreign currency to INR
   * exchangeRate is INR per 1 unit of foreign currency (e.g. 1 USD = rate INR)
   * Our stored rate is "INR per 1 USD" as in 1 INR = 0.012 USD, so 1 USD = 1/0.012 INR
   */
  convertToINR(
    amount: number,
    currency: "USD" | "EUR",
    rates: { usd: number; eur: number }
  ): number {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new Error("Invalid amount");
    }
    if (currency === "USD") {
      return this.convertUSDToINR(amount, rates.usd);
    }
    if (currency === "EUR") {
      return this.convertUSDToINR(amount, rates.eur); // same formula: amount/rate gives INR
    }
    throw new Error("Unsupported currency");
  }

  /** Convert INR to foreign currency (amount * rate, where 1 INR = rate) */
  private convertINRToForeign(amountINR: number, exchangeRate: number): number {
    if (typeof amountINR !== "number" || typeof exchangeRate !== "number") {
      throw new Error("Invalid amount or exchange rate");
    }
    return Math.round(amountINR * exchangeRate * 10000) / 10000;
  }

  convertINRToUSD(amountINR: number, exchangeRate: number): number {
    return this.convertINRToForeign(amountINR, exchangeRate);
  }

  convertINRToEUR(amountINR: number, exchangeRate: number): number {
    return this.convertINRToForeign(amountINR, exchangeRate);
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
  formatCurrency(
    amount: number,
    currency: "INR" | "USD" | "EUR" = "USD"
  ): string {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
    };
    const symbol = symbols[currency] ?? "$";
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
