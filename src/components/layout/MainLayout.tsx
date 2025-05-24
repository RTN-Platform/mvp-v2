import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
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

  // Redirect from /notifications to /messages
  useEffect(() => {
    if (location.pathname === "/notifications") {
      navigate("/messages", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Check authentication if required
  useEffect(() => {
    if (requireAuth && !loading && !user) {
      navigate("/auth", { 
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [requireAuth, user, loading, navigate, location.pathname]);

  // Check role permissions
  useEffect(() => {
    if (
      requireAuth && 
      !loading && 
      user && 
      profile && 
      allowedRoles.length > 0 && 
      !allowedRoles.includes(profile.role)
    ) {
      navigate("/", { replace: true });
    }
  }, [requireAuth, allowedRoles, user, profile, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 md:px-6 max-w-4xl">
        {children}
      </main>

      {/* Nature-themed decorative elements */}
      <div className="fixed left-0 top-1/4 -z-10 hidden md:block">
        <div className="w-40 h-40 bg-nature-100 opacity-50 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed right-0 bottom-1/4 -z-10 hidden md:block">
        <div className="w-60 h-60 bg-nature-200 opacity-50 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default MainLayout;