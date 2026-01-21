/**
 * Centralized API configuration
 * Base URL for all API calls
 * Default: https://api.musshk.com/api
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.musshk.com/api';

/**
 * Helper function to build API endpoints
 * @param endpoint - API endpoint (e.g., 'products', 'cart/123', 'blogs?published=true')
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure API_BASE_URL doesn't end with / and cleanEndpoint doesn't start with /
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const finalUrl = `${baseUrl}/${cleanEndpoint}`;
  
  // Debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Building URL:', { baseUrl, endpoint: cleanEndpoint, finalUrl });
  }
  
  return finalUrl;
}

