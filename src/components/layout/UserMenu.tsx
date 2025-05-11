
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
import { 
  User, 
  LogOut, 
  Edit, 
  Settings, 
  Shield, 
  BarChart,
  Users as UsersIcon,
  MessageSquare,
  Map,
  Heart,
  ListFilter 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileType } from "@/contexts/AuthContext";
import { isAdmin, isHost } from "@/utils/roles";

interface UserMenuProps {
  user: any;
  profile: ProfileType | null;
  signOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, profile, signOut }) => {
  return (
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
        <DropdownMenuLabel>
          <div>
            {profile?.full_name || user.email}
            {profile?.role && (
              <span className={cn(
                "ml-2 text-xs px-1.5 py-0.5 rounded-full", 
                profile.role === 'admin' ? "bg-red-100 text-red-700" : 
                profile.role === 'host' ? "bg-blue-100 text-blue-700" : 
                "bg-green-100 text-green-700"
              )}>
                {profile.role}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Add Explore and My Tribe links for mobile */}
        <DropdownMenuItem asChild className="md:hidden">
          <Link to="/experiences" className="w-full cursor-pointer">
            <Map className="mr-2 h-4 w-4" />
            <span>Explore</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="md:hidden">
          <Link to="/tribe" className="w-full cursor-pointer">
            <UsersIcon className="mr-2 h-4 w-4" />
            <span>My Tribe</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Profile related items */}
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

        {/* Mobile-only navigation items */}
        <DropdownMenuItem asChild className="md:hidden">
          <Link to="/favourites" className="w-full cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Favourites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="md:hidden">
          <Link to="/messages" className="w-full cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>

        {/* Host-only menu item */}
        {isHost(profile) && (
          <DropdownMenuItem asChild className="md:hidden">
            <Link to="/my-listings" className="w-full cursor-pointer">
              <ListFilter className="mr-2 h-4 w-4" />
              <span>My Listings</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Admin-only dashboard link for mobile */}
        {isAdmin(profile) && (
          <DropdownMenuItem asChild className="md:hidden">
            <Link to="/admin/dashboard" className="w-full cursor-pointer">
              <BarChart className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {/* Admin-only menu items */}
        {isAdmin(profile) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="w-full cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard" className="w-full cursor-pointer">
                <BarChart className="mr-2 h-4 w-4" />
                <span>Analytics Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="w-full cursor-pointer">
                <UsersIcon className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/messaging" className="w-full cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Messaging</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/audit-logs" className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Audit Logs</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
