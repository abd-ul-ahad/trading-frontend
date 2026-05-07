/**
 * Unit tests for symbol categorization utility
 */

import { describe, it, expect } from 'vitest'
import { categorizeSymbol } from './categorization'

describe('categorizeSymbol', () => {
  describe('metals categorization', () => {
    it('should categorize XAU symbols as metals', () => {
      expect(categorizeSymbol('XAUUSD')).toBe('metals')
      expect(categorizeSymbol('xauusd')).toBe('metals')
    })

    it('should categorize XAG symbols as metals', () => {
      expect(categorizeSymbol('XAGUSD')).toBe('metals')
      expect(categorizeSymbol('xagusd')).toBe('metals')
    })

    it('should categorize GOLD symbols as metals', () => {
      expect(categorizeSymbol('GOLD')).toBe('metals')
      expect(categorizeSymbol('gold')).toBe('metals')
    })

    it('should categorize SILVER symbols as metals', () => {
      expect(categorizeSymbol('SILVER')).toBe('metals')
      expect(categorizeSymbol('silver')).toBe('metals')
    })

    it('should categorize PLATINUM symbols as metals', () => {
      expect(categorizeSymbol('PLATINUM')).toBe('metals')
      expect(categorizeSymbol('platinum')).toBe('metals')
    })

    it('should categorize PALLADIUM symbols as metals', () => {
      expect(categorizeSymbol('PALLADIUM')).toBe('metals')
      expect(categorizeSymbol('palladium')).toBe('metals')
    })
  })

  describe('indices categorization', () => {
    it('should categorize SPX symbols as indices', () => {
      expect(categorizeSymbol('SPX500')).toBe('indices')
      expect(categorizeSymbol('spx500')).toBe('indices')
    })

    it('should categorize NDX symbols as indices', () => {
      expect(categorizeSymbol('NDX100')).toBe('indices')
      expect(categorizeSymbol('ndx100')).toBe('indices')
    })

    it('should categorize DJI symbols as indices', () => {
      expect(categorizeSymbol('DJI30')).toBe('indices')
      expect(categorizeSymbol('dji30')).toBe('indices')
    })

    it('should categorize FTSE symbols as indices', () => {
      expect(categorizeSymbol('FTSE100')).toBe('indices')
      expect(categorizeSymbol('ftse100')).toBe('indices')
    })

    it('should categorize DAX symbols as indices', () => {
      expect(categorizeSymbol('DAX40')).toBe('indices')
      expect(categorizeSymbol('dax40')).toBe('indices')
    })

    it('should categorize NIKKEI symbols as indices', () => {
      expect(categorizeSymbol('NIKKEI225')).toBe('indices')
      expect(categorizeSymbol('nikkei225')).toBe('indices')
    })

    it('should categorize INDEX symbols as indices', () => {
      expect(categorizeSymbol('INDEX')).toBe('indices')
      expect(categorizeSymbol('index')).toBe('indices')
    })
  })

  describe('commodities categorization', () => {
    it('should categorize OIL symbols as commodities', () => {
      expect(categorizeSymbol('OILUSD')).toBe('commodities')
      expect(categorizeSymbol('oilusd')).toBe('commodities')
    })

    it('should categorize BRENT symbols as commodities', () => {
      expect(categorizeSymbol('BRENT')).toBe('commodities')
      expect(categorizeSymbol('brent')).toBe('commodities')
    })

    it('should categorize WTI symbols as commodities', () => {
      expect(categorizeSymbol('WTI')).toBe('commodities')
      expect(categorizeSymbol('wti')).toBe('commodities')
    })

    it('should categorize GAS symbols as commodities', () => {
      expect(categorizeSymbol('GASUSD')).toBe('commodities')
      expect(categorizeSymbol('gasusd')).toBe('commodities')
    })

    it('should categorize WHEAT symbols as commodities', () => {
      expect(categorizeSymbol('WHEAT')).toBe('commodities')
      expect(categorizeSymbol('wheat')).toBe('commodities')
    })

    it('should categorize CORN symbols as commodities', () => {
      expect(categorizeSymbol('CORN')).toBe('commodities')
      expect(categorizeSymbol('corn')).toBe('commodities')
    })

    it('should categorize SOYBEAN symbols as commodities', () => {
      expect(categorizeSymbol('SOYBEAN')).toBe('commodities')
      expect(categorizeSymbol('soybean')).toBe('commodities')
    })
  })

  describe('forex categorization (default)', () => {
    it('should categorize currency pairs as forex', () => {
      expect(categorizeSymbol('EURUSD')).toBe('forex')
      expect(categorizeSymbol('GBPUSD')).toBe('forex')
      expect(categorizeSymbol('USDJPY')).toBe('forex')
      expect(categorizeSymbol('AUDUSD')).toBe('forex')
    })

    it('should categorize unknown symbols as forex', () => {
      expect(categorizeSymbol('UNKNOWN')).toBe('forex')
      expect(categorizeSymbol('RANDOM123')).toBe('forex')
      expect(categorizeSymbol('TEST')).toBe('forex')
    })
  })

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(categorizeSymbol('')).toBe('forex')
    })

    it('should be case insensitive', () => {
      expect(categorizeSymbol('XAUUSD')).toBe('metals')
      expect(categorizeSymbol('xauusd')).toBe('metals')
      expect(categorizeSymbol('XaUuSd')).toBe('metals')
    })

    it('should handle special characters', () => {
      expect(categorizeSymbol('XAU-USD')).toBe('metals')
      expect(categorizeSymbol('SPX_500')).toBe('indices')
      expect(categorizeSymbol('OIL.USD')).toBe('commodities')
    })

    it('should handle symbols with multiple pattern matches (first match wins)', () => {
      // If a symbol somehow matches multiple patterns, the first pattern in the function wins
      // This is based on the order in the categorizeSymbol function
      expect(categorizeSymbol('XAUINDEX')).toBe('metals') // metals pattern checked first
    })
  })
})
