import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, Users, Heart, MessageSquare, ListFilter, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin, isHost } from "@/utils/roles";

interface NavIconProps {
  icon: React.ReactNode; 
  label: string; 
  to: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ 
  icon, 
  label, 
  to 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center text-gray-600 hover:text-nature-700 transition-colors relative py-2",
        isActive && "text-nature-600"
      )}
    >
      <div className="h-6">{icon}</div>
      <span className="text-xs mt-1 font-medium">{label}</span>
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-nature-600" />
      )}
    </Link>
  );
};

interface NavigationLinksProps {
  profile: any | null;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ profile }) => {
  const location = useLocation();
  
  // Don't render navigation links on admin routes - check for any path starting with /admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="hidden md:flex items-center space-x-8 relative">
      <NavIcon icon={<Map size={24} />} label="EXPLORE" to="/experiences" />
      <NavIcon icon={<Users size={24} />} label="MY TRIBE" to="/tribe" />
      <NavIcon icon={<Heart size={24} />} label="FAVOURITES" to="/favourites" />
      <NavIcon icon={<MessageSquare size={24} />} label="MESSAGES" to="/messages" />
      {isHost(profile) && (
        <NavIcon icon={<ListFilter size={24} />} label="MY LISTINGS" to="/my-listings" />
      )}
      {isAdmin(profile) && (
        <NavIcon icon={<BarChart size={24} />} label="DASHBOARD" to="/admin/dashboard" />
      )}
    </nav>
  );
};

export default NavigationLinks;