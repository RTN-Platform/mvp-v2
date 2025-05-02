
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map, Users, Heart, MessageSquare, Bell, User, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, to: string }> = ({ 
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
        "flex flex-col items-center justify-center text-gray-600 hover:text-nature-700 transition-colors relative",
        isActive && "text-nature-600"
      )}
    >
      <div className="h-6">{icon}</div>
      <span className="text-xs mt-1 font-medium">{label}</span>
      {isActive && (
        <div className="absolute -bottom-4 left-0 right-0 h-1 bg-nature-600 rounded-t-md" />
      )}
    </Link>
  );
};

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="border-b bg-white py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b024962f-3a9d-42e3-9da7-aaf03202e224.png" 
              alt="Resort to Nature" 
              className="h-12 md:h-14"
            />
          </Link>
        </div>

        {user && (
          <nav className="hidden md:flex items-center space-x-8 relative pb-4">
            <NavIcon icon={<Map size={24} />} label="EXPLORE" to="/experiences" />
            <NavIcon icon={<Users size={24} />} label="MY TRIBE" to="/tribe" />
            <NavIcon icon={<Heart size={24} />} label="FAVOURITES" to="/favourites" />
            <NavIcon icon={<MessageSquare size={24} />} label="MESSAGES" to="/messages" />
            <NavIcon icon={<Bell size={24} />} label="NOTIFICATIONS" to="/notifications" />
          </nav>
        )}

        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name} />
                    <AvatarFallback className="bg-nature-200 text-nature-700">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{profile?.full_name || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/edit-profile" className="w-full cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favourites" className="w-full cursor-pointer md:hidden">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favourites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messages" className="w-full cursor-pointer md:hidden">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/notifications" className="w-full cursor-pointer md:hidden">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="border-nature-600 text-nature-700 hover:text-nature-800 hover:bg-nature-50"
              onClick={() => window.location.href = "/auth"}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
