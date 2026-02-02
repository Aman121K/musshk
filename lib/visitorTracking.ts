import { getApiUrl } from './api';

/**
 * Generate or retrieve session ID
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('visitorSessionId');
  
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorSessionId', sessionId);
  }
  
  return sessionId;
};

/**
 * Track visitor on page load
 */
export const trackVisitor = async (page?: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionId = getSessionId();
    const referrer = document.referrer || '';
    const currentPage = page || window.location.pathname;
    
    const response = await fetch(getApiUrl('visitors'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        page: currentPage,
        referrer: referrer || undefined,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.visitor;
    }
  } catch (error) {
    // Silently fail - don't interrupt user experience
    console.error('Error tracking visitor:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = async (page: string) => {
  await trackVisitor(page);
};

