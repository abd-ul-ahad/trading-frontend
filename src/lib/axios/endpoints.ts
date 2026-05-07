/**
 * API Endpoints Configuration
 * Centralized endpoint management for the application
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },

  // User Management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/account',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Example: Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },

  // Example: Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    USER_ORDERS: '/orders/user',
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    AVATAR: '/upload/avatar',
  },

  // Trading
  TRADING: {
    SYMBOLS: (accountId: string) => `/trading/accounts/${accountId}/symbols`,
    PRICE: (accountId: string, symbol: string) => `/trading/accounts/${accountId}/symbols/${symbol}/price`,
  },
} as const

// Type helper for endpoint paths
export type EndpointPath = string | ((param: string) => string)
