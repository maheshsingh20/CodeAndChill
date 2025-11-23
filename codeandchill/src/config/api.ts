// Centralized API configuration
// All API calls should use these constants

// Get the base API URL from environment variable
// In production (Docker): /api (proxied by nginx)
// In development: http://localhost:5000/api (direct to backend)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to build API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL already ends with /api, don't add it again
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Export for backward compatibility
export default API_BASE_URL;
