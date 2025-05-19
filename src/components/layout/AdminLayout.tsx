
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users, Home, FileText, MessageSquare, FileBarChart } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const adminSections = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FileBarChart className="mr-2 h-4 w-4" />
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: <Users className="mr-2 h-4 w-4" />
    },
    {
      name: "Listing Management",
      path: "/admin/content",
      icon: <Home className="mr-2 h-4 w-4" />
    },
    {
      name: "Content Management",
      path: "/admin/content",
      icon: <FileText className="mr-2 h-4 w-4" />
    },
    {
      name: "System Messaging",
      path: "/admin/messaging",
      icon: <MessageSquare className="mr-2 h-4 w-4" />
    },
    {
      name: "Audit Logs",
      path: "/admin/audit-logs",
      icon: <FileBarChart className="mr-2 h-4 w-4" />
    }
  ];
  
  // Find the current active section
  const currentSection = adminSections.find(
    section => location.pathname === section.path || location.pathname.startsWith(`${section.path}/`)
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:px-6 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage and monitor the platform from a central location.</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {currentSection?.icon}
                  {currentSection?.name || "Select Section"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {adminSections.map((section) => (
                  <DropdownMenuItem key={section.path} onClick={() => navigate(section.path)}>
                    <div className="flex items-center">
                      {section.icon}
                      {section.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Breadcrumbs for better navigation context */}
        <div className="mb-6 flex items-center text-sm">
          <Link to="/admin" className="text-nature-600 hover:text-nature-800">
            Admin
          </Link>
          {currentSection && (
            <>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-600">{currentSection.name}</span>
            </>
          )}
        </div>
        
        {/* Main content area */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {children}
        </div>
      </div>
      
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

export default AdminLayout;
