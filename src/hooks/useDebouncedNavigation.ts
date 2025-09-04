import { useNavigate } from 'react-router-dom';
import { useThrottle } from './useDebounce';

/**
 * Custom hook for debounced navigation
 * Prevents rapid navigation that could cause the app to become unresponsive
 */
export const useDebouncedNavigation = (delay: number = 500) => {
  const navigate = useNavigate();

  // Use throttle instead of debounce for navigation to ensure immediate response
  // but prevent rapid successive calls
  const debouncedNavigate = useThrottle(navigate, delay);

  return debouncedNavigate;
};
