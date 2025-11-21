/**
 * Centralized Token Management Utility
 * Handles all token storage, retrieval, and validation
 */

import { STORAGE_KEYS } from '@/constants';

export class TokenManager {
  /**
   * Get the authentication token from localStorage
   * Checks multiple possible keys for backwards compatibility
   */
  static getToken(): string | null {
    // Primary key
    const primaryToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (primaryToken) return primaryToken;

    // Fallback keys for backwards compatibility
    const fallbackToken = localStorage.getItem('token');
    if (fallbackToken) {
      // Migrate to primary key
      this.setToken(fallbackToken);
      localStorage.removeItem('token');
      return fallbackToken;
    }

    return null;
  }

  /**
   * Set the authentication token in localStorage
   */
  static setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
  }

  /**
   * Remove the authentication token from localStorage
   */
  static removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem('token'); // Remove fallback key too
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    localStorage.removeItem('user'); // Remove cached user data
    localStorage.removeItem('userPreferences'); // Remove user preferences
  }

  /**
   * Check if a valid token exists
   */
  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Get authorization header for API requests
   */
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get headers object with auth token
   */
  static getHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...additionalHeaders
    };
  }

  /**
   * Validate token format (basic check)
   */
  static isValidTokenFormat(token: string): boolean {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Get token with validation
   */
  static getValidToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    if (!this.isValidTokenFormat(token)) {
      console.warn('Invalid token format detected, removing token');
      this.removeToken();
      return null;
    }
    
    return token;
  }

  /**
   * Debug: Log current token status
   */
  static debugTokenStatus(): void {
    const token = this.getToken();
    console.log('=== Token Status ===');
    console.log('Has Token:', this.hasToken());
    console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'None');
    console.log('Token Length:', token ? token.length : 0);
    console.log('Valid Format:', token ? this.isValidTokenFormat(token) : false);
    console.log('Is Authenticated:', localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED));
    console.log('==================');
  }
}

// Export convenience functions
export const getToken = () => TokenManager.getToken();
export const setToken = (token: string) => TokenManager.setToken(token);
export const removeToken = () => TokenManager.removeToken();
export const hasToken = () => TokenManager.hasToken();
export const getAuthHeader = () => TokenManager.getAuthHeader();
export const getHeaders = (headers?: Record<string, string>) => TokenManager.getHeaders(headers);
