/**
 * Axios Configuration - Main Export
 * 
 * Usage:
 * import { api, authService, userService } from '@/lib/axios'
 */

// Core API
export { api, axiosInstance } from './api'
export type { ApiResponse, ApiError } from './api'

// Endpoints
export { API_ENDPOINTS } from './endpoints'

// Services
export { authService } from './services/authService'
export type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData 
} from './services/authService'

export { userService } from './services/userService'
export type { 
  User, 
  UpdateProfileData, 
  ChangePasswordData 
} from './services/userService'

// Axios instance for direct use
export { default as axios } from './config'
