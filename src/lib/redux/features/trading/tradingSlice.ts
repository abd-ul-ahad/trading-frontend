/**
 * Trading Redux Slice
 * 
 * Manages state for trading symbols, prices, pagination, and filtering.
 * This slice handles both synchronous state updates (pagination, filtering)
 * and asynchronous data fetching (symbols and prices from API).
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { TradingState, CategoryFilter, SymbolPrice } from '@/lib/trading-api/types'
import { TRADING_CONFIG } from '@/lib/trading-api/config/constants'
import { tradingService } from '@/lib/axios/services/tradingService'

/**
 * Async Thunks
 * 
 * These thunks handle asynchronous operations for fetching trading data from the API.
 */

/**
 * Fetch all trading symbols for the configured account
 * 
 * This thunk calls the trading API to retrieve the list of available symbols.
 * On success, it stores the symbols array and updates the fetch timestamp.
 * On failure, it stores the error message for display to the user.
 * 
 * @returns Promise resolving to array of symbol strings
 * @throws Error if the API request fails
 * 
 * @example
 * ```typescript
 * dispatch(fetchSymbols())
 * ```
 */
export const fetchSymbols = createAsyncThunk(
  'trading/fetchSymbols',
  async () => {
    const accountId = TRADING_CONFIG.DEFAULT_ACCOUNT_ID
    const symbols = await tradingService.getSymbols(accountId)
    return symbols
  }
)

/**
 * Fetch price data for a specific trading symbol
 * 
 * This thunk calls the trading API to retrieve price data for a single symbol.
 * It implements caching logic to avoid redundant API calls:
 * - Checks if price data exists in cache and is still valid (within TTL)
 * - If cached data is valid, returns it without making an API call
 * - If cache is stale or missing, fetches fresh data from API
 * 
 * On success, stores the price data and updates the cache with timestamp.
 * On failure, stores the error message for that specific symbol.
 * 
 * @param symbol - The trading symbol to fetch price for (e.g., "EURUSD")
 * @returns Promise resolving to symbol price data
 * @throws Error if the API request fails
 * 
 * @example
 * ```typescript
 * dispatch(fetchSymbolPrice({ symbol: 'EURUSD' }))
 * ```
 */
export const fetchSymbolPrice = createAsyncThunk(
  'trading/fetchSymbolPrice',
  async ({ symbol }: { symbol: string }, { getState }) => {
    const state = getState() as { trading: TradingState }
    const { priceCache } = state.trading
    
    // Check if we have cached data for this symbol
    const cachedData = priceCache[symbol]
    const now = Date.now()
    
    // If cache exists and is still valid (within TTL), return cached data
    if (cachedData && (now - cachedData.timestamp) < TRADING_CONFIG.PRICE_CACHE_TTL) {
      return cachedData.data
    }
    
    // Cache is stale or missing, fetch fresh data from API
    const accountId = TRADING_CONFIG.DEFAULT_ACCOUNT_ID
    const priceData = await tradingService.getSymbolPrice(accountId, symbol)
    return priceData
  }
)

/**
 * Fetch prices for multiple symbols concurrently with concurrency control
 * 
 * This thunk orchestrates fetching prices for multiple symbols at once while:
 * - Respecting the MAX_CONCURRENT_PRICE_REQUESTS limit to avoid overwhelming the server
 * - Checking cache before fetching each price to avoid redundant API calls
 * - Dispatching individual fetchSymbolPrice thunks for each uncached symbol
 * 
 * The concurrency control ensures that at most MAX_CONCURRENT_PRICE_REQUESTS
 * are in flight at any given time. As each request completes, the next one starts.
 * 
 * @param symbols - Array of trading symbols to fetch prices for
 * @returns Promise resolving when all price fetches complete (or fail)
 * 
 * @example
 * ```typescript
 * // Fetch prices for all visible symbols on current page
 * dispatch(fetchVisibleSymbolsPrices({ symbols: ['EURUSD', 'GBPUSD', 'XAUUSD'] }))
 * ```
 */
export const fetchVisibleSymbolsPrices = createAsyncThunk(
  'trading/fetchVisibleSymbolsPrices',
  async ({ symbols }: { symbols: string[] }, { getState, dispatch }) => {
    const state = getState() as { trading: TradingState }
    const { priceCache } = state.trading
    const now = Date.now()
    
    // Filter out symbols that have valid cached data
    const symbolsToFetch = symbols.filter(symbol => {
      const cachedData = priceCache[symbol]
      // Only fetch if cache is missing or stale
      return !cachedData || (now - cachedData.timestamp) >= TRADING_CONFIG.PRICE_CACHE_TTL
    })
    
    // If all symbols are cached, return early
    if (symbolsToFetch.length === 0) {
      return { fetchedCount: 0, cachedCount: symbols.length }
    }
    
    // Implement concurrency control using a queue
    const maxConcurrent = TRADING_CONFIG.MAX_CONCURRENT_PRICE_REQUESTS
    const results: Array<{ symbol: string; success: boolean }> = []
    
    // Process symbols in batches respecting concurrency limit
    for (let i = 0; i < symbolsToFetch.length; i += maxConcurrent) {
      const batch = symbolsToFetch.slice(i, i + maxConcurrent)
      
      // Dispatch all fetches in this batch concurrently
      const batchPromises = batch.map(symbol =>
        dispatch(fetchSymbolPrice({ symbol }))
          .unwrap()
          .then(() => ({ symbol, success: true }))
          .catch(() => ({ symbol, success: false }))
      )
      
      // Wait for all fetches in this batch to complete before starting next batch
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }
    
    // Return summary of fetch operation
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    
    return {
      fetchedCount: symbolsToFetch.length,
      cachedCount: symbols.length - symbolsToFetch.length,
      successCount,
      failureCount,
    }
  }
)

/**
 * Initial state for the trading slice
 * 
 * Starts with empty data arrays, default pagination settings,
 * and 'all' category filter.
 */
const initialState: TradingState = {
  // Symbol data
  symbols: [],
  symbolsLoading: false,
  symbolsError: null,
  
  // Price data - keyed by symbol
  prices: {},
  pricesLoading: {},
  pricesError: {},
  
  // Pagination
  currentPage: 1,
  pageSize: TRADING_CONFIG.DEFAULT_PAGE_SIZE,
  
  // Filtering
  categoryFilter: 'all',
  
  // Metadata
  lastFetchTimestamp: null,
  priceCache: {},
}

/**
 * Trading slice with synchronous reducers
 * 
 * Provides actions for managing pagination and filtering state.
 * Async thunks for data fetching will be added in subsequent tasks.
 */
export const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    /**
     * Set the current page number
     * 
     * @param state - Current trading state
     * @param action - Payload containing the new page number (1-indexed)
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    
    /**
     * Set the page size (number of symbols per page)
     * 
     * @param state - Current trading state
     * @param action - Payload containing the new page size
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      // Reset to first page when page size changes
      state.currentPage = 1
    },
    
    /**
     * Set the category filter
     * 
     * @param state - Current trading state
     * @param action - Payload containing the new category filter
     */
    setCategoryFilter: (state, action: PayloadAction<CategoryFilter>) => {
      state.categoryFilter = action.payload
      // Reset to first page when filter changes
      state.currentPage = 1
    },
    
    /**
     * Reset pagination to initial state
     * 
     * Sets page back to 1 and page size to default.
     * Useful when applying new filters or resetting the view.
     * 
     * @param state - Current trading state
     */
    resetPagination: (state) => {
      state.currentPage = 1
      state.pageSize = TRADING_CONFIG.DEFAULT_PAGE_SIZE
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSymbols thunk lifecycle
    builder
      .addCase(fetchSymbols.pending, (state) => {
        state.symbolsLoading = true
        state.symbolsError = null
      })
      .addCase(fetchSymbols.fulfilled, (state, action) => {
        state.symbolsLoading = false
        state.symbols = action.payload
        state.lastFetchTimestamp = Date.now()
        state.symbolsError = null
      })
      .addCase(fetchSymbols.rejected, (state, action) => {
        state.symbolsLoading = false
        state.symbolsError = action.error.message || 'Failed to fetch symbols'
        // Keep existing symbols if available (graceful degradation)
      })
    
    // Handle fetchSymbolPrice thunk lifecycle
    builder
      .addCase(fetchSymbolPrice.pending, (state, action) => {
        const symbol = action.meta.arg.symbol
        state.pricesLoading[symbol] = true
        state.pricesError[symbol] = ''
      })
      .addCase(fetchSymbolPrice.fulfilled, (state, action) => {
        const symbol = action.payload.symbol
        state.pricesLoading[symbol] = false
        state.prices[symbol] = action.payload
        state.pricesError[symbol] = ''
        
        // Update cache with fresh data and timestamp
        state.priceCache[symbol] = {
          data: action.payload,
          timestamp: Date.now()
        }
      })
      .addCase(fetchSymbolPrice.rejected, (state, action) => {
        const symbol = action.meta.arg.symbol
        state.pricesLoading[symbol] = false
        state.pricesError[symbol] = action.error.message || 'Failed to fetch price'
        // Keep existing price data if available (graceful degradation)
      })
  },
})

// Export actions for use in components
export const {
  setPage,
  setPageSize,
  setCategoryFilter,
  resetPagination,
} = tradingSlice.actions

// Export reducer for store configuration
export default tradingSlice.reducer
