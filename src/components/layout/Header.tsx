import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import NavigationLinks from "@/components/layout/NavigationLinks";
import UserMenu from "@/components/layout/UserMenu";
const Header: React.FC = () => {
  const {
    user,
    profile,
    signOut
  } = useAuth();
  const location = useLocation();

  // Check if currently on an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');
  return <header className="border-b bg-white sticky top-0 z-10 py-0">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/b024962f-3a9d-42e3-9da7-aaf03202e224.png" alt="Resort to Nature" className="h-11 md:h-13" />
          </Link>
        </div>

        {user && !isAdminRoute && <NavigationLinks profile={profile} />}

        <div>
          {user ? <UserMenu user={user} profile={profile} signOut={signOut} /> : <Button variant="outline" className="border-nature-600 text-nature-700 hover:text-nature-800 hover:bg-nature-50" onClick={() => window.location.href = "/auth"}>
              Sign In
            </Button>}
        </div>
      </div>
    </header>;
};
export default Header;