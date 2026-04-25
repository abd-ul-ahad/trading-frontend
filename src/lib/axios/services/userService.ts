import { api } from '../api'
import { API_ENDPOINTS } from '../endpoints'

// Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * User Service
 * Handles all user-related API calls
 */
class UserService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return api.get<User>(API_ENDPOINTS.USERS.PROFILE)
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    return api.put<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data)
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return api.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data)
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return api.get<User>(API_ENDPOINTS.USERS.BY_ID(id))
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params?: { page?: number; limit?: number; search?: string }): Promise<{
    users: User[]
    total: number
    page: number
    totalPages: number
  }> {
    return api.get(API_ENDPOINTS.USERS.BASE, params)
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<{ message: string }> {
    return api.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT)
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> {
    return api.upload(API_ENDPOINTS.UPLOAD.AVATAR, file, (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    })
  }
}

export const userService = new UserService()
