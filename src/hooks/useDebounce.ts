import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * Prevents rapid successive calls that could cause performance issues
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
};

/**
 * Custom hook for throttling function calls
 * Ensures function is called at most once per specified interval
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): T => {
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
};
