/**
 * Trading Redux Selectors
 * 
 * This module provides selector functions for accessing trading state from the Redux store.
 * Selectors are organized into two categories:
 * 
 * 1. Base Selectors: Simple functions that extract specific pieces of state
 * 2. Derived Selectors: Memoized selectors that compute derived data (implemented in task 3.4)
 * 
 * Base selectors are used as building blocks for derived selectors and can be
 * used directly in components when no computation is needed.
 */

import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/lib/redux/store'
import { SymbolPrice, CategoryFilter, SymbolWithPrice, PaginationMetadata } from '@/lib/trading-api/types'
import { categorizeSymbol } from '@/lib/trading-api/utils/categorization'

/**
 * Base Selectors
 * 
 * These selectors directly extract pieces of state without any computation.
 * They serve as building blocks for derived selectors and provide type-safe
 * access to the trading state.
 */

/**
 * Select the array of all trading symbols
 * 
 * @param state - The root Redux state
 * @returns Array of symbol strings
 * 
 * @example
 * ```typescript
 * const symbols = useAppSelector(selectSymbols)
 * // Returns: ['EURUSD', 'GBPUSD', 'XAUUSD', ...]
 * ```
 */
export const selectSymbols = (state: RootState): string[] => {
  return state.trading.symbols
}

/**
 * Select the map of symbol prices
 * 
 * @param state - The root Redux state
 * @returns Record mapping symbol strings to their price data
 * 
 * @example
 * ```typescript
 * const prices = useAppSelector(selectPrices)
 * // Returns: { 'EURUSD': { symbol: 'EURUSD', bid: 1.0845, ask: 1.0847, ... }, ... }
 * ```
 */
export const selectPrices = (state: RootState): Record<string, SymbolPrice> => {
  return state.trading.prices
}

/**
 * Select the current category filter
 * 
 * @param state - The root Redux state
 * @returns The currently selected category filter
 * 
 * @example
 * ```typescript
 * const filter = useAppSelector(selectCategoryFilter)
 * // Returns: 'all' | 'metals' | 'forex' | 'indices' | 'commodities'
 * ```
 */
export const selectCategoryFilter = (state: RootState): CategoryFilter => {
  return state.trading.categoryFilter
}

/**
 * Select the current page number
 * 
 * @param state - The root Redux state
 * @returns The current page number (1-indexed)
 * 
 * @example
 * ```typescript
 * const currentPage = useAppSelector(selectCurrentPage)
 * // Returns: 1, 2, 3, ...
 * ```
 */
export const selectCurrentPage = (state: RootState): number => {
  return state.trading.currentPage
}

/**
 * Select the page size
 * 
 * @param state - The root Redux state
 * @returns The number of symbols to display per page
 * 
 * @example
 * ```typescript
 * const pageSize = useAppSelector(selectPageSize)
 * // Returns: 20 (default) or user-configured value
 * ```
 */
export const selectPageSize = (state: RootState): number => {
  return state.trading.pageSize
}

/**
 * Select the symbols loading state
 * 
 * @param state - The root Redux state
 * @returns True if symbols are currently being fetched, false otherwise
 * 
 * @example
 * ```typescript
 * const isLoading = useAppSelector(selectSymbolsLoading)
 * if (isLoading) {
 *   return <LoadingSpinner />
 * }
 * ```
 */
export const selectSymbolsLoading = (state: RootState): boolean => {
  return state.trading.symbolsLoading
}

/**
 * Select the symbols error state
 * 
 * @param state - The root Redux state
 * @returns Error message if symbols fetch failed, null otherwise
 * 
 * @example
 * ```typescript
 * const error = useAppSelector(selectSymbolsError)
 * if (error) {
 *   return <ErrorMessage message={error} />
 * }
 * ```
 */
export const selectSymbolsError = (state: RootState): string | null => {
  return state.trading.symbolsError
}

/**
 * Derived Selectors (Memoized)
 * 
 * These selectors use createSelector from Redux Toolkit to compute derived data
 * with memoization. They only recompute when their input selectors return new values,
 * which optimizes performance by avoiding unnecessary recalculations.
 */

/**
 * Select symbols filtered by the current category filter
 * 
 * Applies categorization to each symbol and filters based on the selected category.
 * When 'all' is selected, returns all symbols. Otherwise, returns only symbols
 * matching the selected category.
 * 
 * This selector is memoized - it only recomputes when symbols or categoryFilter change.
 * 
 * @returns Array of filtered symbol strings
 * 
 * @example
 * ```typescript
 * const filteredSymbols = useAppSelector(selectFilteredSymbols)
 * // If categoryFilter is 'metals', returns only metal symbols like ['XAUUSD', 'XAGUSD']
 * // If categoryFilter is 'all', returns all symbols
 * ```
 */
export const selectFilteredSymbols = createSelector(
  [selectSymbols, selectCategoryFilter],
  (symbols, categoryFilter) => {
    // If 'all' is selected, return all symbols without filtering
    if (categoryFilter === 'all') {
      return symbols
    }
    
    // Filter symbols by matching category
    return symbols.filter(symbol => {
      const category = categorizeSymbol(symbol)
      return category === categoryFilter
    })
  }
)

/**
 * Select the total number of pages based on filtered symbols and page size
 * 
 * Calculates how many pages are needed to display all filtered symbols
 * given the current page size. Returns at least 1 page even if there are no symbols.
 * 
 * This selector is memoized - it only recomputes when filtered symbols or page size change.
 * 
 * @returns Total number of pages (minimum 1)
 * 
 * @example
 * ```typescript
 * const totalPages = useAppSelector(selectTotalPages)
 * // If there are 45 filtered symbols and page size is 20, returns 3
 * // If there are 0 symbols, returns 1
 * ```
 */
export const selectTotalPages = createSelector(
  [selectFilteredSymbols, selectPageSize],
  (filteredSymbols, pageSize) => {
    if (filteredSymbols.length === 0) {
      return 1
    }
    return Math.ceil(filteredSymbols.length / pageSize)
  }
)

/**
 * Select symbols for the current page (filtered then paginated)
 * 
 * First applies category filtering, then extracts the symbols for the current page
 * based on page number and page size. This implements the filter-then-paginate pattern.
 * 
 * This selector is memoized - it only recomputes when filtered symbols, current page,
 * or page size change.
 * 
 * @returns Array of symbol strings for the current page
 * 
 * @example
 * ```typescript
 * const paginatedSymbols = useAppSelector(selectPaginatedSymbols)
 * // If on page 2 with page size 20, returns symbols 21-40 from filtered list
 * ```
 */
export const selectPaginatedSymbols = createSelector(
  [selectFilteredSymbols, selectCurrentPage, selectPageSize],
  (filteredSymbols, currentPage, pageSize) => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredSymbols.slice(startIndex, endIndex)
  }
)

/**
 * Select visible symbols with their associated price data
 * 
 * Combines paginated symbols with their price information, loading states,
 * error states, and category classification. This provides all the data needed
 * to render symbol cards in the UI.
 * 
 * This selector is memoized - it only recomputes when paginated symbols, prices,
 * price loading states, or price error states change.
 * 
 * @returns Array of SymbolWithPrice objects containing symbol and price data
 * 
 * @example
 * ```typescript
 * const visibleSymbols = useAppSelector(selectVisibleSymbolsWithPrices)
 * // Returns: [
 * //   {
 * //     symbol: 'EURUSD',
 * //     price: { bid: 1.0845, ask: 1.0847, ... },
 * //     priceLoading: false,
 * //     priceError: null,
 * //     category: 'forex'
 * //   },
 * //   ...
 * // ]
 * ```
 */
export const selectVisibleSymbolsWithPrices = createSelector(
  [
    selectPaginatedSymbols,
    selectPrices,
    (state: RootState) => state.trading.pricesLoading,
    (state: RootState) => state.trading.pricesError,
  ],
  (paginatedSymbols, prices, pricesLoading, pricesError): SymbolWithPrice[] => {
    return paginatedSymbols.map((symbol: string) => ({
      symbol,
      price: prices[symbol] || null,
      priceLoading: pricesLoading[symbol] || false,
      priceError: pricesError[symbol] || null,
      category: categorizeSymbol(symbol),
    }))
  }
)

/**
 * Select whether any data is currently loading
 * 
 * Returns true if either symbols are being fetched or any prices are being fetched.
 * Useful for displaying a global loading indicator.
 * 
 * This selector is memoized - it only recomputes when symbols loading state
 * or prices loading states change.
 * 
 * @returns True if any data is loading, false otherwise
 * 
 * @example
 * ```typescript
 * const isLoading = useAppSelector(selectIsLoading)
 * if (isLoading) {
 *   return <LoadingSpinner />
 * }
 * ```
 */
export const selectIsLoading = createSelector(
  [
    selectSymbolsLoading,
    (state: RootState) => state.trading.pricesLoading,
  ],
  (symbolsLoading, pricesLoading) => {
    // Check if symbols are loading
    if (symbolsLoading) {
      return true
    }
    
    // Check if any prices are loading
    return Object.values(pricesLoading).some(loading => loading === true)
  }
)

/**
 * Select whether there are any errors
 * 
 * Returns true if there's a symbols fetch error or any price fetch errors.
 * Useful for displaying a global error indicator.
 * 
 * This selector is memoized - it only recomputes when symbols error state
 * or prices error states change.
 * 
 * @returns True if any errors exist, false otherwise
 * 
 * @example
 * ```typescript
 * const hasError = useAppSelector(selectHasError)
 * if (hasError) {
 *   return <ErrorBanner />
 * }
 * ```
 */
export const selectHasError = createSelector(
  [
    selectSymbolsError,
    (state: RootState) => state.trading.pricesError,
  ],
  (symbolsError, pricesError) => {
    // Check if there's a symbols error
    if (symbolsError) {
      return true
    }
    
    // Check if any prices have errors
    return Object.values(pricesError).some(error => error !== '' && error !== null)
  }
)

/**
 * Select pagination metadata for UI controls
 * 
 * Provides all information needed to render pagination controls including
 * current page, total pages, total items, and navigation availability.
 * 
 * This selector is memoized - it only recomputes when current page, page size,
 * filtered symbols, or total pages change.
 * 
 * @returns PaginationMetadata object with pagination information
 * 
 * @example
 * ```typescript
 * const pagination = useAppSelector(selectPaginationMetadata)
 * // Returns: {
 * //   currentPage: 2,
 * //   pageSize: 20,
 * //   totalItems: 45,
 * //   totalPages: 3,
 * //   hasNextPage: true,
 * //   hasPreviousPage: true
 * // }
 * ```
 */
export const selectPaginationMetadata = createSelector(
  [
    selectCurrentPage,
    selectPageSize,
    selectFilteredSymbols,
    selectTotalPages,
  ],
  (currentPage, pageSize, filteredSymbols, totalPages): PaginationMetadata => {
    return {
      currentPage,
      pageSize,
      totalItems: filteredSymbols.length,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    }
  }
)
