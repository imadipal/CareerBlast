import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'candidate' | 'employer' | 'admin';
  requireApproval?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireApproval = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to unauthorized page or home
    return <Navigate to="/" replace />;
  }

  if (requireApproval && user?.role === 'employer' && !user?.isApproved) {
    // Redirect to recruiter application page if not approved
    return <Navigate to="/recruiter/apply" replace />;
  }

  return <>{children}</>;
};
