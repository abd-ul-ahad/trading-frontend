/**
 * Symbol Categorization Utility
 * 
 * Provides functionality to categorize trading symbols based on naming patterns.
 * Used for filtering symbols by category in the discover page.
 */

import type { CategoryFilter } from '../types'

/**
 * Categorizes a trading symbol based on its naming pattern
 * 
 * @param symbol - The trading symbol to categorize (e.g., "EURUSD", "XAUUSD", "SPX500")
 * @returns The category of the symbol: 'metals', 'indices', 'commodities', or 'forex' (default)
 * 
 * @example
 * categorizeSymbol('XAUUSD') // returns 'metals'
 * categorizeSymbol('SPX500') // returns 'indices'
 * categorizeSymbol('EURUSD') // returns 'forex'
 * categorizeSymbol('OILUSD') // returns 'commodities'
 */
export function categorizeSymbol(symbol: string): CategoryFilter {
  const upper = symbol.toUpperCase()
  
  // Check for metals patterns
  if (/XAU|XAG|GOLD|SILVER|PLATINUM|PALLADIUM/.test(upper)) {
    return 'metals'
  }
  
  // Check for indices patterns
  if (/SPX|NDX|DJI|FTSE|DAX|NIKKEI|INDEX/.test(upper)) {
    return 'indices'
  }
  
  // Check for commodities patterns
  if (/OIL|BRENT|WTI|GAS|WHEAT|CORN|SOYBEAN/.test(upper)) {
    return 'commodities'
  }
  
  // Default to forex for currency pairs and unknown symbols
  return 'forex'
}
