
import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "./Header";
import { UserRole } from "@/utils/roles";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  allowedRoles = []
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Early return for admin routes - don't render MainLayout at all on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Handle authentication requirements
  if (requireAuth && !user && !loading) {
    navigate('/auth');
    return null;
  }

  // Handle role-based access
  if (allowedRoles.length > 0 && user && profile) {
    const hasRequiredRole = allowedRoles.includes(profile.role);
    if (!hasRequiredRole) {
      navigate('/');
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
