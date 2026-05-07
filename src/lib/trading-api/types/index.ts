/**
 * Type definitions for Trading API Integration
 * 
 * This module defines all TypeScript interfaces and types used throughout
 * the trading symbols API integration feature.
 */

/**
 * Represents price data for a trading symbol
 * 
 * @property symbol - The trading symbol identifier (e.g., "EURUSD", "XAUUSD")
 * @property bid - The current bid price
 * @property ask - The current ask price
 * @property time - ISO 8601 timestamp of the price quote
 * @property accountCurrencyExchangeRate - Exchange rate to account currency
 */
export interface SymbolPrice {
  symbol: string
  bid: number
  ask: number
  time: string
  accountCurrencyExchangeRate: number
}

/**
 * Category filter type for trading symbols
 * 
 * Used to filter symbols by their asset class:
 * - 'all': Show all symbols
 * - 'metals': Precious metals (gold, silver, etc.)
 * - 'forex': Foreign exchange currency pairs
 * - 'indices': Stock market indices
 * - 'commodities': Commodities (oil, gas, agricultural products)
 */
export type CategoryFilter = 'all' | 'metals' | 'forex' | 'indices' | 'commodities'

/**
 * Redux state shape for trading feature
 * 
 * Manages all state related to trading symbols, prices, pagination,
 * filtering, and caching.
 */
export interface TradingState {
  // Symbol data
  /** Array of all available trading symbols */
  symbols: string[]
  /** Loading state for symbols fetch */
  symbolsLoading: boolean
  /** Error message if symbols fetch failed */
  symbolsError: string | null
  
  // Price data - keyed by symbol
  /** Map of symbol to its price data */
  prices: Record<string, SymbolPrice>
  /** Map of symbol to its price loading state */
  pricesLoading: Record<string, boolean>
  /** Map of symbol to its price error message */
  pricesError: Record<string, string>
  
  // Pagination
  /** Current page number (1-indexed) */
  currentPage: number
  /** Number of symbols to display per page */
  pageSize: number
  
  // Filtering
  /** Currently selected category filter */
  categoryFilter: CategoryFilter
  
  // Metadata
  /** Timestamp of last successful symbols fetch */
  lastFetchTimestamp: number | null
  /** Cache for price data with timestamps */
  priceCache: Record<string, { data: SymbolPrice; timestamp: number }>
}

/**
 * Combined symbol and price data for UI display
 * 
 * Represents a symbol with its associated price information,
 * loading state, error state, and category classification.
 */
export interface SymbolWithPrice {
  /** The trading symbol identifier */
  symbol: string
  /** Price data for the symbol (null if not yet loaded) */
  price: SymbolPrice | null
  /** Whether price data is currently being fetched */
  priceLoading: boolean
  /** Error message if price fetch failed */
  priceError: string | null
  /** Categorized asset class for the symbol */
  category: CategoryFilter
}

/**
 * Pagination metadata for UI controls
 * 
 * Provides all information needed to render pagination controls
 * and display pagination status to users.
 */
export interface PaginationMetadata {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Number of items per page */
  pageSize: number
  /** Total number of items across all pages */
  totalItems: number
  /** Total number of pages */
  totalPages: number
  /** Whether there is a next page available */
  hasNextPage: boolean
  /** Whether there is a previous page available */
  hasPreviousPage: boolean
}

/**
 * API Response Types
 */

/**
 * Response from GET /trading/accounts/:accountId/symbols
 * Returns an array of trading symbol strings
 */
export type SymbolsResponse = string[]

/**
 * Response from GET /trading/accounts/:accountId/symbols/:symbol/price
 * Returns price data for a specific symbol
 */
export interface PriceResponse {
  symbol: string
  bid: number
  ask: number
  time: string
  accountCurrencyExchangeRate: number
}
