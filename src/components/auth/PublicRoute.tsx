import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../ui/Loading';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute component that redirects authenticated users away from auth pages
 * Used for login, signup, forgot-password pages that should not be accessible to logged-in users
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  // If user is authenticated, redirect them away from auth pages
  if (isAuthenticated) {
    // Check if there's a specific redirect path based on user role
    let redirectPath = redirectTo;
    
    // Smart redirect based on user role
    if (user?.role === 'candidate') {
      redirectPath = '/recommended-jobs';
    } else if (user?.role === 'employer') {
      redirectPath = '/employer/dashboard';
    } else if (user?.role === 'admin') {
      redirectPath = '/admin/recruiters';
    }

    // Check if there's a return URL from the location state
    const from = location.state?.from?.pathname;
    if (from && from !== '/login' && from !== '/signup' && from !== '/forgot-password') {
      redirectPath = from;
    }

    console.log(`🔒 Authenticated user trying to access ${location.pathname}, redirecting to ${redirectPath}`);
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, show the auth page
  return <>{children}</>;
};

export default PublicRoute;
