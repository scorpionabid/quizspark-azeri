import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isDataLoading, role, profile } = useAuth();
  const location = useLocation();

  // Show loader while either auth session OR role/profile data is loading
  if (isLoading || (isAuthenticated && isDataLoading && allowedRoles && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has one of them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    // Pending teachers cannot access teacher-only routes until approved by admin
    if (role === 'teacher' && profile?.status === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  return <>{children}</>;
}
