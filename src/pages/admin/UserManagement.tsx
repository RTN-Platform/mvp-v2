
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserX, ShieldCheck, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";

// Fix: Add proper typing for profile data
type Profile = {
  id: string;
  full_name: string;
  username: string | null;
  role: string;
  created_at: string;
};

const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setProfiles(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data, error } = await supabase
        .rpc("update_user_role", {
          user_id: userId,
          new_role: newRole,
        });

      if (error) throw error;

      toast({
        title: "Role updated",
        description: "User role has been successfully updated.",
      });

      // Update the local state
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message,
      });
    }
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage and monitor platform users</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" /> Invite User
            </Button>
            <Button variant="destructive">
              <UserX className="mr-2 h-4 w-4" /> Suspend User
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 pl-4">Name</th>
                    <th className="text-left pb-3">Username</th>
                    <th className="text-left pb-3">Role</th>
                    <th className="text-left pb-3">Joined</th>
                    <th className="text-right pb-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                      <tr key={profile.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 pl-4">
                          <Link 
                            to={`/admin/users/${profile.id}`} 
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {profile.full_name || "Unnamed User"}
                          </Link>
                        </td>
                        <td className="py-3">@{profile.username || "no_username"}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profile.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : profile.role === "host"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {profile.role}
                          </span>
                        </td>
                        <td className="py-3">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right pr-4">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/users/${profile.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            {profile.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateUserRole(profile.id, "admin")}
                                title="Make admin"
                              >
                                <ShieldCheck className="h-4 w-4 text-purple-500" />
                              </Button>
                            )}
                            
                            {profile.role !== "host" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateUserRole(profile.id, "host")}
                                title="Make host"
                              >
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
