/**
 * API Endpoints Configuration
 * Centralized endpoint management for the application
 */

export const API_ENDPOINTS = {
  // Trading
  TRADING: {
    SYMBOLS: (accountId: string) => `/trading/accounts/${accountId}/symbols`,
    PRICE: (accountId: string, symbol: string) => `/trading/accounts/${accountId}/symbols/${symbol}/price`,
  },
} as const

// Type helper for endpoint paths
export type EndpointPath = string | ((param: string) => string)
