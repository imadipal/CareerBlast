/**
 * Navigation testing utilities for debugging navigation issues
 */

export const navigationTest = {
  /**
   * Test rapid navigation to detect issues
   */
  testRapidNavigation: () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Navigation tests should only be run in development');
      return;
    }

    console.log('🧪 Testing rapid navigation...');
    
    const testPaths = ['/jobs', '/about', '/contact', '/'];
    let clickCount = 0;
    
    const testInterval = setInterval(() => {
      if (clickCount >= 10) {
        clearInterval(testInterval);
        console.log('✅ Rapid navigation test completed');
        return;
      }
      
      const path = testPaths[clickCount % testPaths.length];
      console.log(`Click ${clickCount + 1}: Navigating to ${path}`);
      
      // Simulate rapid clicking
      const link = document.querySelector(`a[href="${path}"]`) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
      
      clickCount++;
    }, 100); // Very rapid - 100ms intervals
  },

  /**
   * Monitor navigation performance
   */
  monitorNavigation: () => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    let navigationCount = 0;
    let lastNavigationTime = 0;

    const observer = new MutationObserver(() => {
      const now = Date.now();
      navigationCount++;
      
      if (lastNavigationTime > 0) {
        const timeDiff = now - lastNavigationTime;
        console.log(`📊 Navigation ${navigationCount}: ${timeDiff}ms since last navigation`);
        
        if (timeDiff < 50) {
          console.warn('⚠️ Very rapid navigation detected!');
        }
      }
      
      lastNavigationTime = now;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('📊 Navigation monitoring started');
    
    return () => {
      observer.disconnect();
      console.log('📊 Navigation monitoring stopped');
    };
  },

  /**
   * Check for navigation issues
   */
  checkNavigationHealth: () => {
    const issues: string[] = [];
    
    // Check for duplicate links
    const links = document.querySelectorAll('a[href]');
    const linkMap = new Map<string, number>();
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        linkMap.set(href, (linkMap.get(href) || 0) + 1);
      }
    });
    
    linkMap.forEach((count, href) => {
      if (count > 3) {
        issues.push(`Multiple links to ${href} (${count} instances)`);
      }
    });
    
    // Check for disabled pointer events
    if (document.body.style.pointerEvents === 'none') {
      issues.push('Body has pointer-events disabled');
    }
    
    // Check for React Router issues
    const routerElements = document.querySelectorAll('[data-testid*="router"]');
    if (routerElements.length === 0) {
      issues.push('No router elements found');
    }
    
    if (issues.length > 0) {
      console.warn('🚨 Navigation issues detected:', issues);
    } else {
      console.log('✅ Navigation health check passed');
    }
    
    return issues;
  }
};

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        navigationTest.monitorNavigation();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      navigationTest.monitorNavigation();
    }, 1000);
  }
}

export default navigationTest;
