import axiosInstance from './config'
import { AxiosResponse, AxiosError } from 'axios'

// Generic API Response Type
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  statusCode: number
}

// Generic API Error Type
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// API Service Class
class ApiService {
  /**
   * GET Request
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * POST Request
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * PUT Request
   */
  async put<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * PATCH Request
   */
  async patch<T = any>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(url, data)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * DELETE Request
   */
  async delete<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(url, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Upload File
   */
  async upload<T = any>(url: string, file: File, onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response: AxiosResponse<T> = await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      })

      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Download File
   */
  async download(url: string, filename: string): Promise<void> {
    try {
      const response = await axiosInstance.get(url, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(link.href)
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  /**
   * Handle API Errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response
      return {
        message: (data as any)?.message || error.message || 'An error occurred',
        statusCode: status,
        errors: (data as any)?.errors,
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
      }
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred',
        statusCode: 0,
      }
    }
  }
}

// Export singleton instance
export const api = new ApiService()

// Export axios instance for direct use if needed
export { axiosInstance }
