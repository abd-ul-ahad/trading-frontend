import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create(API_CONFIG)

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp
    config.metadata = { startTime: new Date().getTime() }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Calculate request duration
    const duration = new Date().getTime() - (response.config.metadata?.startTime || 0)

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Handle 401 Unauthorized - Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken } = response.data

          // Update tokens
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken)
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions')
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found')
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error - please try again later')
    }

    // Handle Network Error
    if (!error.response) {
      console.error('Network error - please check your connection')
    }

    return Promise.reject(error)
  }
)

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

export default axiosInstance
