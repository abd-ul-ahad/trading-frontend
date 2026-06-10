/**
 * Axios Configuration - Main Export
 *
 * Usage:
 * import { api } from '@/lib/axios'
 */

// Core API
export { api, axiosInstance } from './api'
export type { ApiResponse, ApiError } from './api'

// Axios instance for direct use
export { default as axios } from './config'
