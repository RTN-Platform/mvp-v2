
import React from "react";
import { Link } from "react-router-dom";
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
import { Search, User, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/profile"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Profile
          </Link>
          <Link
            to="/tribe"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Tribe
          </Link>
          <Link
            to="/experiences"
            className="font-medium text-gray-700 hover:text-nature-700"
          >
            Experiences
          </Link>
          <button className="text-gray-700 hover:text-nature-700">
            <Search size={20} />
          </button>
        </nav>

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
