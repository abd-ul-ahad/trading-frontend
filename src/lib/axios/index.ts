/**
 * Axios Configuration - Main Export
 * 
 * Usage:
 * import { api, tradingService } from '@/lib/axios'
 */

// Core API
export { api, axiosInstance } from './api'
export type { ApiResponse, ApiError } from './api'

// Endpoints
export { API_ENDPOINTS } from './endpoints'

// Services
export { tradingService } from './services/tradingService'

// Axios instance for direct use
export { default as axios } from './config'
