                                                        /**
 * Trading API Configuration Constants
 * 
 * Centralized configuration for trading API integration.
 * These constants are used throughout the trading API services and Redux state management.
 */

export const TRADING_CONFIG = {
  /**
   * Default trading account ID
   * Can be overridden via NEXT_PUBLIC_TRADING_ACCOUNT_ID environment variable
   */
  DEFAULT_ACCOUNT_ID: process.env.NEXT_PUBLIC_TRADING_ACCOUNT_ID || 'demo-account',
  
  /**
   * Price cache time-to-live in milliseconds (30 seconds)
   * Cached price data is considered valid for this duration
   */
  PRICE_CACHE_TTL: 30000,
  
  /**
   * Maximum number of concurrent price fetch requests
   * Limits parallel API calls to prevent overwhelming the server
   */
  MAX_CONCURRENT_PRICE_REQUESTS: 5,
  
  /**
   * Default number of symbols to display per page
   */
  DEFAULT_PAGE_SIZE: 20,
  
  /**
   * API request timeout in milliseconds (30 seconds)
   * Applies to all trading API requests
   */
  API_TIMEOUT: 30000,
} as const

/**
 * Type for the trading configuration object
 * Ensures type safety when accessing configuration values
 */
export type TradingConfig = typeof TRADING_CONFIG
