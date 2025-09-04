import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

/**
 * Custom hook to monitor component performance and detect potential issues
 */
export const usePerformanceMonitor = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  const renderStartTime = useRef<number>(performance.now());

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    const metrics = metricsRef.current;
    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;

    // Log warning if render time is too high (only in development)
    if (process.env.NODE_ENV === 'development' && renderTime > 100) {
      console.warn(
        `[Performance Warning] Component took ${renderTime.toFixed(2)}ms to render`
      );
    }

    // Log warning if too many renders in short time (only in development)
    if (process.env.NODE_ENV === 'development' && metrics.renderCount > 10 && metrics.averageRenderTime > 50) {
      console.warn(
        `[Performance Warning] Component has rendered ${metrics.renderCount} times with average time ${metrics.averageRenderTime.toFixed(2)}ms`
      );
    }

    renderStartTime.current = performance.now();
  });

  return metricsRef.current;
};

/**
 * Hook to detect and prevent rapid successive function calls
 */
export const useClickProtection = (delay: number = 1000) => {
  const lastClickTime = useRef<number>(0);

  const isClickAllowed = (): boolean => {
    const now = Date.now();
    if (now - lastClickTime.current < delay) {
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Click Protection] Rapid clicks detected, ignoring');
      }
      return false;
    }
    lastClickTime.current = now;
    return true;
  };

  return isClickAllowed;
};
