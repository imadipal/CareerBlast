import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to prevent navigation issues and ensure proper route handling
 */
export const useNavigationGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lastLocationRef = useRef<string>('');
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Track location changes
    const currentPath = location.pathname + location.search;
    
    // If this is a duplicate navigation, handle it
    if (currentPath === lastLocationRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Navigation Guard] Duplicate navigation detected:', currentPath);
      }
      return;
    }

    lastLocationRef.current = currentPath;

    // Set a timeout to ensure the component has time to render
    navigationTimeoutRef.current = setTimeout(() => {
      // Force a re-render if needed
      if (document.body.style.pointerEvents === 'none') {
        document.body.style.pointerEvents = 'auto';
      }
    }, 100);

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentPath: location.pathname,
    isNavigating: false, // Could be enhanced with loading state
  };
};

export default useNavigationGuard;
