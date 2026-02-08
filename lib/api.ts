/**
 * Centralized API configuration
 * Base URL for all API calls
 * Default: https://api.musshk.com/api
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.musshk.com/api';

/** Origin for uploads (API base without /api) so /uploads/... resolves correctly */
export const UPLOADS_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '') || 'https://api.musshk.com';

/**
 * Build full URL for image paths (e.g. /uploads/xyz or full URLs).
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${UPLOADS_ORIGIN}${path}`;
}

/**
 * Helper function to build API endpoints
 * @param endpoint - API endpoint (e.g., 'products', 'cart/123', 'blogs?published=true')
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}/${cleanEndpoint}`;
}

