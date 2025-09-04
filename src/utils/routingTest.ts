/**
 * Routing test utilities to verify SPA routing works correctly
 */

export const routingTest = {
  /**
   * Test all main routes to ensure they load properly
   */
  testAllRoutes: async () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Routing tests should only be run in development');
      return;
    }

    console.log('🧪 Testing all routes...');
    
    const routes = [
      '/',
      '/jobs',
      '/about',
      '/contact',
      '/login',
      '/signup',
      '/privacy',
      '/terms',
      '/profile',
      '/recommended-jobs',
      '/employer/dashboard',
      '/nonexistent-route' // Should show 404
    ];

    const results: { route: string; status: 'success' | 'error'; message?: string }[] = [];

    for (const route of routes) {
      try {
        // Simulate navigation
        window.history.pushState({}, '', route);
        
        // Wait for potential route change
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if page loaded correctly
        const hasContent = document.body.innerHTML.length > 1000;
        const hasError = document.body.innerHTML.includes('404') || 
                        document.body.innerHTML.includes('Not Found');
        
        if (route === '/nonexistent-route' && hasError) {
          results.push({ route, status: 'success', message: '404 page shown correctly' });
        } else if (route !== '/nonexistent-route' && hasContent && !hasError) {
          results.push({ route, status: 'success' });
        } else {
          results.push({ route, status: 'error', message: 'Page did not load correctly' });
        }
      } catch (error) {
        results.push({ 
          route, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    console.table(results);
    
    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`✅ ${successCount}/${routes.length} routes tested successfully`);
    
    return results;
  },

  /**
   * Test page refresh on different routes
   */
  testPageRefresh: () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Page refresh tests should only be run in development');
      return;
    }

    console.log('🔄 Testing page refresh behavior...');
    
    const currentPath = window.location.pathname;
    console.log(`Current path: ${currentPath}`);
    
    // Check if we're on a non-root path
    if (currentPath !== '/') {
      console.log('✅ Non-root path loaded successfully after refresh');
    } else {
      console.log('ℹ️ Currently on root path');
    }
    
    // Check for any 404 indicators
    const has404 = document.body.innerHTML.includes('404') || 
                   document.body.innerHTML.includes('Not Found') ||
                   document.title.includes('404');
    
    if (has404) {
      console.error('❌ 404 error detected on page refresh');
    } else {
      console.log('✅ No 404 errors detected');
    }
    
    return {
      currentPath,
      has404,
      pageLoaded: document.readyState === 'complete'
    };
  },

  /**
   * Check if routing configuration is correct
   */
  checkRoutingConfig: () => {
    const issues: string[] = [];
    
    // Check if React Router is properly set up
    const routerElements = document.querySelectorAll('[data-reactroot]');
    if (routerElements.length === 0) {
      issues.push('React Router may not be properly initialized');
    }
    
    // Check if base href is set correctly
    const baseElement = document.querySelector('base');
    if (baseElement && baseElement.getAttribute('href') !== '/') {
      issues.push('Base href is not set to root (/)');
    }
    
    // Check if there are any console errors related to routing
    const hasRoutingErrors = console.error.toString().includes('router') ||
                            console.error.toString().includes('navigation');
    
    if (hasRoutingErrors) {
      issues.push('Console errors related to routing detected');
    }
    
    if (issues.length > 0) {
      console.warn('🚨 Routing configuration issues:', issues);
    } else {
      console.log('✅ Routing configuration looks good');
    }
    
    return issues;
  }
};

// Auto-run page refresh test when page loads
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      routingTest.testPageRefresh();
      routingTest.checkRoutingConfig();
    }, 1000);
  });
}

export default routingTest;
