/**
 * Centralized session management for cart
 * Ensures a single, consistent sessionId across the entire application
 */

const SESSION_ID_KEY = 'sessionId';

/**
 * Get or create a session ID
 * This ensures we only have one session ID per user session
 */
export function getSessionId(): string {
  // Check if sessionId already exists
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    // Create a new sessionId with consistent format
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Clear the session ID (useful for logout or testing)
 */
export function clearSessionId(): void {
  localStorage.removeItem(SESSION_ID_KEY);
}

/**
 * Check if a session ID exists
 */
export function hasSessionId(): boolean {
  return !!localStorage.getItem(SESSION_ID_KEY);
}
