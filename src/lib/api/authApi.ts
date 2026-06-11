import axios from 'axios';
import axiosInstance from '@/lib/axios/config';

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  display_name: string;
  role: string;
  status: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const BASE = '/api/v1/auth/auth';

class AuthApiService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>(
      `${BASE}/register`,
      data
    );
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      `${BASE}/login`,
      data
    );
    return response.data;
  }

  /** Uses raw axios so a 401 does not re-enter the axiosInstance interceptor. */
  async refresh(refresh_token: string): Promise<RefreshResponse> {
    const response = await axios.post<RefreshResponse>(
      `${API_BASE}${BASE}/refresh`,
      { refresh_token } satisfies RefreshRequest,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );
    return response.data;
  }
}

export const authApi = new AuthApiService();
