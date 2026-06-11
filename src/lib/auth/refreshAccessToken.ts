import { authApi } from '@/lib/api/authApi';
import {
  clearSession,
  getRefreshToken,
  setSession,
} from '@/lib/auth/session';

let refreshPromise: Promise<string> | null = null;

export function logoutAndRedirect(): void {
  clearSession();
  if (
    typeof window !== 'undefined' &&
    !window.location.pathname.startsWith('/sign-in') &&
    !window.location.pathname.startsWith('/register')
  ) {
    window.location.href = '/sign-in';
  }
}

/**
 * Refresh the access token using the stored refresh token.
 * Deduplicates concurrent calls so only one refresh request is in flight.
 * Returns the new access token on success.
 */
export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      throw new Error('No refresh token available');
    }

    try {
      const response = await authApi.refresh(refreshToken);
      setSession({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });
      return response.access_token;
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
