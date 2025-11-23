import { API_BASE_URL, STORAGE_KEYS } from '@/constants';

/**
 * Validates if the current authentication token is valid
 * @returns Promise<boolean> - true if token is valid, false otherwise
 */
export async function validateAuthToken(): Promise<boolean> {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);

  // If no token or not marked as authenticated, return false
  if (!token || isAuthenticated !== 'true') {
    return false;
  }

  try {
    // Try to fetch user profile to validate token
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // If response is ok, token is valid
    if (response.ok) {
      return true;
    }

    // If unauthorized or forbidden, token is invalid
    if (response.status === 401 || response.status === 403) {
      // Clear invalid authentication data
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      localStorage.removeItem('user');
      localStorage.removeItem('userPreferences');
      return false;
    }

    // For other errors, assume token might still be valid
    // (could be network issues, server errors, etc.)
    return true;
  } catch (error) {
    console.error('Error validating auth token:', error);
    // On network error, don't invalidate the token
    // User might be offline
    return true;
  }
}

/**
 * Clears all authentication data from localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
  localStorage.removeItem('user');
  localStorage.removeItem('userPreferences');
}

/**
 * Checks if user has a valid session
 * @returns boolean - true if session exists (doesn't validate token)
 */
export function hasAuthSession(): boolean {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
  return !!(token && isAuthenticated === 'true');
}
