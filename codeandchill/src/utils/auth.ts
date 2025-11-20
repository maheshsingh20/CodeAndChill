import { STORAGE_KEYS } from "@/constants";

// Authentication utility functions
export const authUtils = {
  // Token management
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
  },

  // Authentication status
  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === "true";
  },

  // Login/Logout
  login: (token: string): void => {
    authUtils.setToken(token);
  },

  logout: (): void => {
    authUtils.removeToken();
    // Optionally redirect to login page
    window.location.href = "/auth";
  },

  // Token validation (basic check)
  isTokenValid: (): boolean => {
    const token = authUtils.getToken();
    if (!token) return false;

    try {
      // Basic JWT structure check
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp ? payload.exp > currentTime : true;
    } catch {
      return false;
    }
  },
};