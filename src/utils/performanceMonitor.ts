/**
 * Performance monitoring utilities to detect infinite loops and performance issues
 */

export const performanceMonitor = {
  /**
   * Monitor for infinite re-renders
   */
  monitorRerenders: () => {
    let renderCount = 0;
    let lastRenderTime = Date.now();
    const renderTimes: number[] = [];

    const originalConsoleError = console.error;
    
    console.error = function(...args) {
      const errorMessage = args.join(' ');
      
      // Detect React infinite loop errors
      if (errorMessage.includes('Maximum update depth exceeded')) {
        console.warn('🚨 INFINITE LOOP DETECTED!');
        console.warn('- Error:', errorMessage);
        console.warn('- Render count in last second:', renderCount);
        console.warn('- Average render time:', renderTimes.length > 0 ? renderTimes.reduce((a, b) => a + b) / renderTimes.length : 0, 'ms');
        
        // Try to identify the problematic component
        const stack = new Error().stack;
        if (stack) {
          const componentMatch = stack.match(/at (\w+Context|use\w+)/g);
          if (componentMatch) {
            console.warn('- Likely problematic components:', componentMatch.slice(0, 3));
          }
        }
      }
      
      return originalConsoleError.apply(console, args);
    };

    // Monitor render frequency
    const checkRenderFrequency = () => {
      const now = Date.now();
      const timeSinceLastRender = now - lastRenderTime;
      
      if (timeSinceLastRender < 1000) {
        renderCount++;
        renderTimes.push(timeSinceLastRender);
        
        // Keep only last 10 render times
        if (renderTimes.length > 10) {
          renderTimes.shift();
        }
        
        // Warn if too many renders in short time
        if (renderCount > 50) {
          console.warn('⚠️ High render frequency detected:', renderCount, 'renders in last second');
          renderCount = 0; // Reset to avoid spam
        }
      } else {
        renderCount = 0;
        renderTimes.length = 0;
      }
      
      lastRenderTime = now;
    };

    // Hook into React DevTools if available
    if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const devTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      
      if (devTools.onCommitFiberRoot) {
        const originalOnCommit = devTools.onCommitFiberRoot;
        devTools.onCommitFiberRoot = function(...args: any[]) {
          checkRenderFrequency();
          return originalOnCommit.apply(this, args);
        };
      }
    }

    console.log('🔍 Performance monitoring started - watching for infinite loops');
    
    return () => {
      console.error = originalConsoleError;
      console.log('🔍 Performance monitoring stopped');
    };
  },

  /**
   * Check current performance metrics
   */
  checkPerformance: () => {
    const metrics = {
      memory: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
      } : null,
      timing: performance.timing ? {
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
      } : null,
      navigation: performance.navigation ? {
        type: performance.navigation.type,
        redirectCount: performance.navigation.redirectCount
      } : null
    };

    console.log('📊 Performance Metrics:', metrics);
    
    // Check for memory leaks
    if (metrics.memory && metrics.memory.used > 100) {
      console.warn('⚠️ High memory usage detected:', metrics.memory.used, 'MB');
    }
    
    return metrics;
  },

  /**
   * Monitor specific component for re-renders
   */
  monitorComponent: (componentName: string) => {
    let renderCount = 0;
    let lastRender = Date.now();
    
    return {
      onRender: () => {
        renderCount++;
        const now = Date.now();
        const timeSinceLastRender = now - lastRender;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 ${componentName} render #${renderCount} (${timeSinceLastRender}ms since last)`);
          
          if (timeSinceLastRender < 10 && renderCount > 5) {
            console.warn(`⚠️ ${componentName} is re-rendering very frequently!`);
          }
        }
        
        lastRender = now;
      },
      getRenderCount: () => renderCount,
      reset: () => {
        renderCount = 0;
        lastRender = Date.now();
      }
    };
  }
};

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        performanceMonitor.monitorRerenders();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      performanceMonitor.monitorRerenders();
    }, 1000);
  }
}

export default performanceMonitor;
