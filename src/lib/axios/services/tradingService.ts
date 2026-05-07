import { api } from '../api'
import { API_ENDPOINTS } from '../endpoints'
import type { SymbolPrice } from '@/lib/trading-api/types'

/**
 * Trading Service
 * Handles all trading-related API calls for symbols and prices
 */
class TradingService {
  /**
   * Get all trading symbols for an account
   * 
   * @param accountId - The trading account identifier
   * @returns Promise resolving to array of symbol strings
   * @throws ApiError if the request fails
   * 
   * @example
   * ```typescript
   * const symbols = await tradingService.getSymbols('demo-account')
   * // Returns: ["EURUSD", "GBPUSD", "XAUUSD", ...]
   * ```
   */
  async getSymbols(accountId: string): Promise<string[]> {
    return api.get<string[]>(API_ENDPOINTS.TRADING.SYMBOLS(accountId))
  }

  /**
   * Get price data for a specific trading symbol
   * 
   * @param accountId - The trading account identifier
   * @param symbol - The trading symbol (e.g., "EURUSD", "XAUUSD")
   * @returns Promise resolving to symbol price data
   * @throws ApiError if the request fails
   * 
   * @example
   * ```typescript
   * const price = await tradingService.getSymbolPrice('demo-account', 'EURUSD')
   * // Returns: {
   * //   symbol: "EURUSD",
   * //   bid: 1.0845,
   * //   ask: 1.0847,
   * //   time: "2024-01-15T10:30:00Z",
   * //   accountCurrencyExchangeRate: 1.0
   * // }
   * ```
   */
  async getSymbolPrice(accountId: string, symbol: string): Promise<SymbolPrice> {
    return api.get<SymbolPrice>(API_ENDPOINTS.TRADING.PRICE(accountId, symbol))
  }
}

export const tradingService = new TradingService()
