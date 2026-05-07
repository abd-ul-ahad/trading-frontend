/**
 * Tests for fetchVisibleSymbolsPrices thunk
 * 
 * Verifies that the thunk correctly:
 * - Fetches prices for multiple symbols concurrently
 * - Respects the MAX_CONCURRENT_PRICE_REQUESTS limit
 * - Checks cache before fetching
 * - Dispatches fetchSymbolPrice for uncached symbols
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import type { AppDispatch } from '@/lib/redux/store'
import tradingReducer, { fetchVisibleSymbolsPrices, fetchSymbolPrice } from './tradingSlice'
import { tradingService } from '@/lib/axios/services/tradingService'
import { TRADING_CONFIG } from '@/lib/trading-api/config/constants'

// Mock the trading service
vi.mock('@/lib/axios/services/tradingService', () => ({
  tradingService: {
    getSymbolPrice: vi.fn(),
  },
}))

describe('fetchVisibleSymbolsPrices', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        trading: tradingReducer,
      },
    })
    
    // Reset mocks
    vi.clearAllMocks()
  })

  it('should fetch prices for multiple symbols', async () => {
    // Mock the service to return price data
    const mockPrice = {
      symbol: 'EURUSD',
      bid: 1.0845,
      ask: 1.0847,
      time: '2024-01-15T10:30:00Z',
      accountCurrencyExchangeRate: 1.0,
    }
    
    vi.mocked(tradingService.getSymbolPrice).mockResolvedValue(mockPrice)

    // Dispatch the thunk with 3 symbols
    const symbols = ['EURUSD', 'GBPUSD', 'XAUUSD']
    const result = await store.dispatch(fetchVisibleSymbolsPrices({ symbols }) as any)

    // Verify the thunk completed successfully
    expect(result.type).toBe('trading/fetchVisibleSymbolsPrices/fulfilled')
    
    // Verify the result payload
    expect(result.payload).toEqual({
      fetchedCount: 3,
      cachedCount: 0,
      successCount: 3,
      failureCount: 0,
    })

    // Verify the service was called for each symbol
    expect(tradingService.getSymbolPrice).toHaveBeenCalledTimes(3)
  })

  it('should skip cached symbols', async () => {
    // Pre-populate cache with one symbol
    const cachedSymbol = 'EURUSD'
    const mockPrice = {
      symbol: cachedSymbol,
      bid: 1.0845,
      ask: 1.0847,
      time: '2024-01-15T10:30:00Z',
      accountCurrencyExchangeRate: 1.0,
    }

    // First, fetch the symbol to populate cache
    vi.mocked(tradingService.getSymbolPrice).mockResolvedValue(mockPrice)
    await store.dispatch(fetchSymbolPrice({ symbol: cachedSymbol }) as any)

    // Clear the mock call count
    vi.clearAllMocks()

    // Now fetch multiple symbols including the cached one
    const symbols = ['EURUSD', 'GBPUSD', 'XAUUSD']
    const result = await store.dispatch(fetchVisibleSymbolsPrices({ symbols }) as any)

    // Verify only uncached symbols were fetched
    expect(result.payload).toEqual({
      fetchedCount: 2, // Only GBPUSD and XAUUSD
      cachedCount: 1,  // EURUSD was cached
      successCount: 2,
      failureCount: 0,
    })

    // Verify the service was called only for uncached symbols
    expect(tradingService.getSymbolPrice).toHaveBeenCalledTimes(2)
    expect(tradingService.getSymbolPrice).not.toHaveBeenCalledWith(
      TRADING_CONFIG.DEFAULT_ACCOUNT_ID,
      cachedSymbol
    )
  })

  it('should return early if all symbols are cached', async () => {
    // Pre-populate cache with all symbols
    const symbols = ['EURUSD', 'GBPUSD']

    vi.mocked(tradingService.getSymbolPrice).mockImplementation((accountId, symbol) => {
      return Promise.resolve({
        symbol,
        bid: 1.0845,
        ask: 1.0847,
        time: '2024-01-15T10:30:00Z',
        accountCurrencyExchangeRate: 1.0,
      })
    })

    // Fetch all symbols to populate cache
    for (const symbol of symbols) {
      await store.dispatch(fetchSymbolPrice({ symbol }) as any)
    }

    // Clear the mock call count
    vi.clearAllMocks()

    // Now fetch the same symbols again immediately (cache should still be valid)
    const result = await store.dispatch(fetchVisibleSymbolsPrices({ symbols }) as any)

    // Verify no API calls were made
    expect(result.payload).toEqual({
      fetchedCount: 0,
      cachedCount: 2,
    })

    expect(tradingService.getSymbolPrice).not.toHaveBeenCalled()
  })

  it('should handle fetch failures gracefully', async () => {
    // Mock the service to fail for some symbols
    vi.mocked(tradingService.getSymbolPrice).mockImplementation((accountId, symbol) => {
      if (symbol === 'GBPUSD') {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve({
        symbol,
        bid: 1.0845,
        ask: 1.0847,
        time: '2024-01-15T10:30:00Z',
        accountCurrencyExchangeRate: 1.0,
      })
    })

    // Dispatch the thunk with 3 symbols
    const symbols = ['EURUSD', 'GBPUSD', 'XAUUSD']
    const result = await store.dispatch(fetchVisibleSymbolsPrices({ symbols }) as any)

    // Verify the thunk completed successfully even with failures
    expect(result.type).toBe('trading/fetchVisibleSymbolsPrices/fulfilled')
    
    // Verify the result payload shows mixed results
    expect(result.payload).toEqual({
      fetchedCount: 3,
      cachedCount: 0,
      successCount: 2,
      failureCount: 1,
    })
  })

  it('should respect concurrency limit', async () => {
    // Track concurrent calls
    let currentConcurrent = 0
    let maxConcurrent = 0

    vi.mocked(tradingService.getSymbolPrice).mockImplementation(async (accountId, symbol) => {
      currentConcurrent++
      maxConcurrent = Math.max(maxConcurrent, currentConcurrent)
      
      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 10))
      
      currentConcurrent--
      
      return {
        symbol,
        bid: 1.0845,
        ask: 1.0847,
        time: '2024-01-15T10:30:00Z',
        accountCurrencyExchangeRate: 1.0,
      }
    })

    // Dispatch with more symbols than the concurrency limit
    const symbols = Array.from({ length: 15 }, (_, i) => `SYMBOL${i}`)
    await store.dispatch(fetchVisibleSymbolsPrices({ symbols }) as any)

    // Verify we never exceeded the concurrency limit
    expect(maxConcurrent).toBeLessThanOrEqual(TRADING_CONFIG.MAX_CONCURRENT_PRICE_REQUESTS)
  })
})
