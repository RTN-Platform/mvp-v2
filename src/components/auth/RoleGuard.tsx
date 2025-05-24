import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/utils/roles';
import { Spinner } from '@/components/ui/spinner';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const RoleGuard = ({ 
  children, 
  allowedRoles,
  redirectTo = '/auth'
}: RoleGuardProps) => {
  const { user, profile, loading, hasRole } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole = hasRole(allowedRoles);

  if (!hasRequiredRole) {
    // If user is authenticated but doesn't have the required role
    // Redirect to home page or unauthorized page
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected component
  return children;
};

export default RoleGuard;