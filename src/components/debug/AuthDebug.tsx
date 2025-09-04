import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../ui/Card';

/**
 * Debug component to show authentication state
 * Only visible in development mode
 */
export const AuthDebug: React.FC = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</h3>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Loading:</span> 
          <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
            {isLoading ? 'true' : 'false'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Authenticated:</span> 
          <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
            {isAuthenticated ? 'true' : 'false'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">Token:</span> 
          <span className={token ? 'text-green-400' : 'text-red-400'}>
            {token ? `${token.substring(0, 10)}...` : 'null'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">User:</span> 
          {user ? (
            <div className="ml-2 text-green-400">
              <div>ID: {user.id}</div>
              <div>Email: {user.email}</div>
              <div>Role: {user.role}</div>
              <div>Name: {user.firstName} {user.lastName}</div>
            </div>
          ) : (
            <span className="text-red-400">null</span>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400">LocalStorage:</span>
          <div className="ml-2 text-xs">
            <div>isAuthenticated: {localStorage.getItem('isAuthenticated')}</div>
            <div>token: {localStorage.getItem('token') ? 'exists' : 'null'}</div>
            <div>authToken: {localStorage.getItem('authToken') ? 'exists' : 'null'}</div>
            <div>user: {localStorage.getItem('user') ? 'exists' : 'null'}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AuthDebug;
