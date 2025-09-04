/**
 * Debugging utilities for React Router issues
 */

export const routingDebug = {
  /**
   * Log current routing state
   */
  logRoutingState: () => {
    console.log('🔍 Current Routing State:');
    console.log('- URL:', window.location.href);
    console.log('- Pathname:', window.location.pathname);
    console.log('- Search:', window.location.search);
    console.log('- Hash:', window.location.hash);
    
    // Check for React Router elements
    const routerElements = document.querySelectorAll('[data-reactroot]');
    console.log('- React Root Elements:', routerElements.length);
    
    // Check for navigation elements
    const navLinks = document.querySelectorAll('a[href]');
    console.log('- Navigation Links:', navLinks.length);
    
    // Check for main content
    const mainElement = document.querySelector('main');
    console.log('- Main Element:', mainElement ? 'Found' : 'Not Found');
    console.log('- Main Content Length:', mainElement?.innerHTML.length || 0);
    
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      hasReactRoot: routerElements.length > 0,
      hasNavLinks: navLinks.length > 0,
      hasMainContent: (mainElement?.innerHTML.length || 0) > 100
    };
  },

  /**
   * Monitor navigation events
   */
  monitorNavigation: () => {
    let navigationCount = 0;
    
    // Monitor popstate events (back/forward)
    window.addEventListener('popstate', (event) => {
      navigationCount++;
      console.log(`📍 Navigation ${navigationCount} (popstate):`, {
        pathname: window.location.pathname,
        state: event.state,
        timestamp: new Date().toISOString()
      });
      
      // Check if content updates
      setTimeout(() => {
        const mainElement = document.querySelector('main');
        console.log('- Content after navigation:', mainElement?.innerHTML.length || 0, 'chars');
      }, 100);
    });

    // Monitor pushstate/replacestate
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      navigationCount++;
      console.log(`📍 Navigation ${navigationCount} (pushState):`, {
        pathname: args[2] || window.location.pathname,
        state: args[0],
        timestamp: new Date().toISOString()
      });
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      navigationCount++;
      console.log(`📍 Navigation ${navigationCount} (replaceState):`, {
        pathname: args[2] || window.location.pathname,
        state: args[0],
        timestamp: new Date().toISOString()
      });
      return originalReplaceState.apply(this, args);
    };

    console.log('🔍 Navigation monitoring started');
    
    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      console.log('🔍 Navigation monitoring stopped');
    };
  },

  /**
   * Test navigation programmatically
   */
  testNavigation: (path: string) => {
    console.log(`🧪 Testing navigation to: ${path}`);
    
    const beforeState = routingDebug.logRoutingState();
    
    // Try to navigate
    window.history.pushState({}, '', path);
    
    // Check after navigation
    setTimeout(() => {
      const afterState = routingDebug.logRoutingState();
      
      console.log('📊 Navigation Test Results:');
      console.log('- URL Changed:', beforeState.pathname !== afterState.pathname);
      console.log('- Content Updated:', beforeState.hasMainContent !== afterState.hasMainContent);
      
      if (beforeState.pathname !== afterState.pathname && beforeState.hasMainContent === afterState.hasMainContent) {
        console.warn('⚠️ URL changed but content did not update - React Router issue detected!');
      }
    }, 200);
  },

  /**
   * Force React Router to re-render
   */
  forceReRender: () => {
    console.log('🔄 Forcing React Router re-render...');
    
    // Trigger a popstate event
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    
    // Also try triggering a hashchange
    const currentHash = window.location.hash;
    window.location.hash = '#temp';
    setTimeout(() => {
      window.location.hash = currentHash;
    }, 10);
  }
};

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        routingDebug.monitorNavigation();
        routingDebug.logRoutingState();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      routingDebug.monitorNavigation();
      routingDebug.logRoutingState();
    }, 1000);
  }
}

export default routingDebug;
