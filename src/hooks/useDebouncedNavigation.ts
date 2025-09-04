import { useNavigate } from 'react-router-dom';
import { useCallback, useRef } from 'react';

/**
 * Custom hook for safe navigation
 * Prevents rapid navigation that could cause the app to become unresponsive
 */
export const useDebouncedNavigation = (delay: number = 300) => {
  const navigate = useNavigate();
  const lastNavigationRef = useRef<string>('');
  const lastNavigationTimeRef = useRef<number>(0);

  const safeNavigate = useCallback((to: string | number, options?: any) => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigationTimeRef.current;

    // If it's the same path and within delay, ignore
    if (typeof to === 'string' && to === lastNavigationRef.current && timeSinceLastNav < delay) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Navigation] Duplicate navigation prevented:', to);
      }
      return;
    }

    // If too rapid navigation (regardless of path), throttle
    if (timeSinceLastNav < 100) { // Minimum 100ms between any navigation
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Navigation] Rapid navigation throttled');
      }
      return;
    }

    // Update tracking
    if (typeof to === 'string') {
      lastNavigationRef.current = to;
    }
    lastNavigationTimeRef.current = now;

    // Perform navigation
    navigate(to, options);
  }, [navigate, delay]);

  return safeNavigate;
};
