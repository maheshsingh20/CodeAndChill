export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL already ends with /api, don't add it again
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

export default API_BASE_URL;