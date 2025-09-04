import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { routingDebug } from '../utils/routingDebug';

export const RoutingTestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routingState, setRoutingState] = useState<any>(null);

  useEffect(() => {
    // Log routing state when component mounts
    const state = routingDebug.logRoutingState();
    setRoutingState(state);
  }, [location]);

  const testRoutes = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
    { path: '/signup', label: 'Signup' }
  ];

  const handleProgrammaticNavigation = (path: string) => {
    console.log(`🧪 Testing programmatic navigation to: ${path}`);
    navigate(path);
  };

  const handleTestAllRoutes = () => {
    testRoutes.forEach((route, index) => {
      setTimeout(() => {
        routingDebug.testNavigation(route.path);
      }, index * 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            React Router Testing Page
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Current Path:</strong> {location.pathname}</p>
              <p><strong>Search:</strong> {location.search || 'None'}</p>
              <p><strong>Hash:</strong> {location.hash || 'None'}</p>
              {routingState && (
                <div className="mt-2">
                  <p><strong>Has React Root:</strong> {routingState.hasReactRoot ? 'Yes' : 'No'}</p>
                  <p><strong>Has Nav Links:</strong> {routingState.hasNavLinks ? 'Yes' : 'No'}</p>
                  <p><strong>Has Main Content:</strong> {routingState.hasMainContent ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Navigation Tests</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Link Navigation</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {testRoutes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="block p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-center transition-colors"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Programmatic Navigation</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {testRoutes.map((route) => (
                  <Button
                    key={`prog-${route.path}`}
                    variant="outline"
                    onClick={() => handleProgrammaticNavigation(route.path)}
                    className="w-full"
                  >
                    Go to {route.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Debug Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => routingDebug.logRoutingState()}>
                  Log Routing State
                </Button>
                <Button onClick={() => routingDebug.forceReRender()}>
                  Force Re-render
                </Button>
                <Button onClick={handleTestAllRoutes}>
                  Test All Routes
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              How to Test Navigation Issues
            </h3>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Click on the Link Navigation buttons above</li>
              <li>Check if the URL changes AND the page content updates</li>
              <li>Try the Programmatic Navigation buttons</li>
              <li>Open browser console to see debug logs</li>
              <li>If URL changes but content doesn't update, there's a routing issue</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoutingTestPage;
