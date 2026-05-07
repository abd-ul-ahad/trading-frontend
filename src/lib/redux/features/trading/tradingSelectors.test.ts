/**
 * Unit tests for trading selectors
 * 
 * Tests both base selectors and derived memoized selectors to ensure
 * they correctly extract and compute data from the Redux state.
 */

import { describe, it, expect } from 'vitest'
import {
  selectSymbols,
  selectPrices,
  selectCategoryFilter,
  selectCurrentPage,
  selectPageSize,
  selectSymbolsLoading,
  selectSymbolsError,
  selectFilteredSymbols,
  selectTotalPages,
  selectPaginatedSymbols,
  selectVisibleSymbolsWithPrices,
  selectIsLoading,
  selectHasError,
  selectPaginationMetadata,
} from './tradingSelectors'
import type { RootState } from '@/lib/redux/store'
import type { TradingState, SymbolPrice } from '@/lib/trading-api/types'

/**
 * Helper function to create a mock RootState with trading state
 */
function createMockState(tradingState: Partial<TradingState>): RootState {
  const defaultTradingState: TradingState = {
    symbols: [],
    symbolsLoading: false,
    symbolsError: null,
    prices: {},
    pricesLoading: {},
    pricesError: {},
    currentPage: 1,
    pageSize: 20,
    categoryFilter: 'all',
    lastFetchTimestamp: null,
    priceCache: {},
  }

  return {
    trading: { ...defaultTradingState, ...tradingState },
    counter: { value: 0, status: 'idle' },
    navbar: { isSidebarOpen: false },
  } as RootState
}

describe('Base Selectors', () => {
  it('selectSymbols should return symbols array', () => {
    const state = createMockState({ symbols: ['EURUSD', 'GBPUSD'] })
    expect(selectSymbols(state)).toEqual(['EURUSD', 'GBPUSD'])
  })

  it('selectPrices should return prices object', () => {
    const prices: Record<string, SymbolPrice> = {
      EURUSD: {
        symbol: 'EURUSD',
        bid: 1.0845,
        ask: 1.0847,
        time: '2024-01-15T10:30:00Z',
        accountCurrencyExchangeRate: 1.0,
      },
    }
    const state = createMockState({ prices })
    expect(selectPrices(state)).toEqual(prices)
  })

  it('selectCategoryFilter should return category filter', () => {
    const state = createMockState({ categoryFilter: 'metals' })
    expect(selectCategoryFilter(state)).toBe('metals')
  })

  it('selectCurrentPage should return current page', () => {
    const state = createMockState({ currentPage: 3 })
    expect(selectCurrentPage(state)).toBe(3)
  })

  it('selectPageSize should return page size', () => {
    const state = createMockState({ pageSize: 50 })
    expect(selectPageSize(state)).toBe(50)
  })

  it('selectSymbolsLoading should return loading state', () => {
    const state = createMockState({ symbolsLoading: true })
    expect(selectSymbolsLoading(state)).toBe(true)
  })

  it('selectSymbolsError should return error message', () => {
    const state = createMockState({ symbolsError: 'Network error' })
    expect(selectSymbolsError(state)).toBe('Network error')
  })
})

describe('Derived Selectors - Filtering', () => {
  it('selectFilteredSymbols should return all symbols when filter is "all"', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'XAUUSD', 'SPX500'],
      categoryFilter: 'all',
    })
    expect(selectFilteredSymbols(state)).toEqual(['EURUSD', 'XAUUSD', 'SPX500'])
  })

  it('selectFilteredSymbols should filter metals symbols', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'XAUUSD', 'XAGUSD', 'SPX500'],
      categoryFilter: 'metals',
    })
    expect(selectFilteredSymbols(state)).toEqual(['XAUUSD', 'XAGUSD'])
  })

  it('selectFilteredSymbols should filter forex symbols', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'GBPUSD', 'XAUUSD', 'SPX500'],
      categoryFilter: 'forex',
    })
    expect(selectFilteredSymbols(state)).toEqual(['EURUSD', 'GBPUSD'])
  })

  it('selectFilteredSymbols should filter indices symbols', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'SPX500', 'NDX100', 'XAUUSD'],
      categoryFilter: 'indices',
    })
    expect(selectFilteredSymbols(state)).toEqual(['SPX500', 'NDX100'])
  })

  it('selectFilteredSymbols should filter commodities symbols', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'OILUSD', 'XAUUSD', 'GASUSD'],
      categoryFilter: 'commodities',
    })
    expect(selectFilteredSymbols(state)).toEqual(['OILUSD', 'GASUSD'])
  })

  it('selectFilteredSymbols should return empty array when no symbols match', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'GBPUSD'],
      categoryFilter: 'metals',
    })
    expect(selectFilteredSymbols(state)).toEqual([])
  })
})

describe('Derived Selectors - Pagination', () => {
  it('selectTotalPages should calculate correct number of pages', () => {
    const state = createMockState({
      symbols: Array(45).fill('EURUSD'),
      pageSize: 20,
      categoryFilter: 'all',
    })
    expect(selectTotalPages(state)).toBe(3)
  })

  it('selectTotalPages should return 1 for empty symbols', () => {
    const state = createMockState({
      symbols: [],
      pageSize: 20,
      categoryFilter: 'all',
    })
    expect(selectTotalPages(state)).toBe(1)
  })

  it('selectTotalPages should handle exact page boundaries', () => {
    const state = createMockState({
      symbols: Array(40).fill('EURUSD'),
      pageSize: 20,
      categoryFilter: 'all',
    })
    expect(selectTotalPages(state)).toBe(2)
  })

  it('selectPaginatedSymbols should return correct page of symbols', () => {
    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    const state = createMockState({
      symbols,
      currentPage: 2,
      pageSize: 3,
      categoryFilter: 'all',
    })
    expect(selectPaginatedSymbols(state)).toEqual(['D', 'E', 'F'])
  })

  it('selectPaginatedSymbols should return first page correctly', () => {
    const symbols = ['A', 'B', 'C', 'D', 'E']
    const state = createMockState({
      symbols,
      currentPage: 1,
      pageSize: 3,
      categoryFilter: 'all',
    })
    expect(selectPaginatedSymbols(state)).toEqual(['A', 'B', 'C'])
  })

  it('selectPaginatedSymbols should handle last page with fewer items', () => {
    const symbols = ['A', 'B', 'C', 'D', 'E']
    const state = createMockState({
      symbols,
      currentPage: 2,
      pageSize: 3,
      categoryFilter: 'all',
    })
    expect(selectPaginatedSymbols(state)).toEqual(['D', 'E'])
  })

  it('selectPaginatedSymbols should work with filtering', () => {
    const symbols = ['EURUSD', 'XAUUSD', 'GBPUSD', 'XAGUSD', 'USDJPY']
    const state = createMockState({
      symbols,
      currentPage: 1,
      pageSize: 2,
      categoryFilter: 'metals',
    })
    // Should filter to ['XAUUSD', 'XAGUSD'] then paginate to first 2
    expect(selectPaginatedSymbols(state)).toEqual(['XAUUSD', 'XAGUSD'])
  })
})

describe('Derived Selectors - Combined Data', () => {
  it('selectVisibleSymbolsWithPrices should combine symbols with price data', () => {
    const prices: Record<string, SymbolPrice> = {
      EURUSD: {
        symbol: 'EURUSD',
        bid: 1.0845,
        ask: 1.0847,
        time: '2024-01-15T10:30:00Z',
        accountCurrencyExchangeRate: 1.0,
      },
    }
    const state = createMockState({
      symbols: ['EURUSD', 'GBPUSD'],
      prices,
      pricesLoading: { GBPUSD: true },
      pricesError: {},
      currentPage: 1,
      pageSize: 10,
      categoryFilter: 'all',
    })

    const result = selectVisibleSymbolsWithPrices(state)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      symbol: 'EURUSD',
      price: prices.EURUSD,
      priceLoading: false,
      priceError: null,
      category: 'forex',
    })
    expect(result[1]).toEqual({
      symbol: 'GBPUSD',
      price: null,
      priceLoading: true,
      priceError: null,
      category: 'forex',
    })
  })

  it('selectVisibleSymbolsWithPrices should handle price errors', () => {
    const state = createMockState({
      symbols: ['EURUSD'],
      prices: {},
      pricesLoading: {},
      pricesError: { EURUSD: 'Failed to fetch' },
      currentPage: 1,
      pageSize: 10,
      categoryFilter: 'all',
    })

    const result = selectVisibleSymbolsWithPrices(state)
    expect(result[0].priceError).toBe('Failed to fetch')
  })

  it('selectVisibleSymbolsWithPrices should categorize symbols correctly', () => {
    const state = createMockState({
      symbols: ['XAUUSD', 'SPX500', 'OILUSD'],
      prices: {},
      pricesLoading: {},
      pricesError: {},
      currentPage: 1,
      pageSize: 10,
      categoryFilter: 'all',
    })

    const result = selectVisibleSymbolsWithPrices(state)
    expect(result[0].category).toBe('metals')
    expect(result[1].category).toBe('indices')
    expect(result[2].category).toBe('commodities')
  })
})

describe('Derived Selectors - Loading and Error States', () => {
  it('selectIsLoading should return true when symbols are loading', () => {
    const state = createMockState({ symbolsLoading: true })
    expect(selectIsLoading(state)).toBe(true)
  })

  it('selectIsLoading should return true when any price is loading', () => {
    const state = createMockState({
      symbolsLoading: false,
      pricesLoading: { EURUSD: true, GBPUSD: false },
    })
    expect(selectIsLoading(state)).toBe(true)
  })

  it('selectIsLoading should return false when nothing is loading', () => {
    const state = createMockState({
      symbolsLoading: false,
      pricesLoading: { EURUSD: false, GBPUSD: false },
    })
    expect(selectIsLoading(state)).toBe(false)
  })

  it('selectHasError should return true when symbols error exists', () => {
    const state = createMockState({ symbolsError: 'Network error' })
    expect(selectHasError(state)).toBe(true)
  })

  it('selectHasError should return true when any price error exists', () => {
    const state = createMockState({
      symbolsError: null,
      pricesError: { EURUSD: 'Failed', GBPUSD: '' },
    })
    expect(selectHasError(state)).toBe(true)
  })

  it('selectHasError should return false when no errors exist', () => {
    const state = createMockState({
      symbolsError: null,
      pricesError: { EURUSD: '', GBPUSD: '' },
    })
    expect(selectHasError(state)).toBe(false)
  })
})

describe('Derived Selectors - Pagination Metadata', () => {
  it('selectPaginationMetadata should return correct metadata', () => {
    const symbols = Array(45).fill('EURUSD')
    const state = createMockState({
      symbols,
      currentPage: 2,
      pageSize: 20,
      categoryFilter: 'all',
    })

    const metadata = selectPaginationMetadata(state)
    expect(metadata).toEqual({
      currentPage: 2,
      pageSize: 20,
      totalItems: 45,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    })
  })

  it('selectPaginationMetadata should handle first page', () => {
    const state = createMockState({
      symbols: Array(30).fill('EURUSD'),
      currentPage: 1,
      pageSize: 20,
      categoryFilter: 'all',
    })

    const metadata = selectPaginationMetadata(state)
    expect(metadata.hasPreviousPage).toBe(false)
    expect(metadata.hasNextPage).toBe(true)
  })

  it('selectPaginationMetadata should handle last page', () => {
    const state = createMockState({
      symbols: Array(30).fill('EURUSD'),
      currentPage: 2,
      pageSize: 20,
      categoryFilter: 'all',
    })

    const metadata = selectPaginationMetadata(state)
    expect(metadata.hasPreviousPage).toBe(true)
    expect(metadata.hasNextPage).toBe(false)
  })

  it('selectPaginationMetadata should work with filtered symbols', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'XAUUSD', 'GBPUSD', 'XAGUSD', 'USDJPY'],
      currentPage: 1,
      pageSize: 2,
      categoryFilter: 'metals',
    })

    const metadata = selectPaginationMetadata(state)
    expect(metadata.totalItems).toBe(2) // Only 2 metals symbols
    expect(metadata.totalPages).toBe(1)
  })
})

describe('Selector Memoization', () => {
  it('selectFilteredSymbols should return same reference for same inputs', () => {
    const state = createMockState({
      symbols: ['EURUSD', 'GBPUSD'],
      categoryFilter: 'all',
    })

    const result1 = selectFilteredSymbols(state)
    const result2 = selectFilteredSymbols(state)
    expect(result1).toBe(result2) // Same reference
  })

  it('selectPaginatedSymbols should return same reference for same inputs', () => {
    const state = createMockState({
      symbols: ['A', 'B', 'C', 'D'],
      currentPage: 1,
      pageSize: 2,
      categoryFilter: 'all',
    })

    const result1 = selectPaginatedSymbols(state)
    const result2 = selectPaginatedSymbols(state)
    expect(result1).toBe(result2) // Same reference
  })
})
