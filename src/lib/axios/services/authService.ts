import { api } from '../api'
import { API_ENDPOINTS } from '../endpoints'

// Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
  }
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    }
    
    return response
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
    }
    
    return response
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Clear tokens regardless of API response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post<{ accessToken: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    })

    // Update access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken)
    }

    return response
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('accessToken')
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }
}

export const authService = new AuthService()
