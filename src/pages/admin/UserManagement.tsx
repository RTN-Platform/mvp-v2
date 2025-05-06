
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/utils/roles";
import { Spinner } from "@/components/ui/spinner";

type UserWithProfile = {
  id: string;
  email: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
  };
};

const UserManagement: React.FC = () => {
  const { profile, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // This assumes we've set up a view or function in Supabase to join users and profiles
      // In a real app, you'd create a stored procedure or view for this
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role');

      if (error) throw error;

      // For now we'll simulate the join with auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        // If admin API fails (as it likely will in most cases), just use profiles
        setUsers(
          data.map(profile => ({
            id: profile.id,
            email: "email@hidden.com", // Placeholder
            profile: {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              role: profile.role
            }
          }))
        );
      } else {
        // Join profiles with auth users if we have access
        const joinedUsers = data.map(profile => {
          const authUser = authUsers.users.find(u => u.id === profile.id);
          return {
            id: profile.id,
            email: authUser?.email || "email@hidden.com",
            profile: {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              role: profile.role
            }
          };
        });
        setUsers(joinedUsers);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!updateUserRole) return;

    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, profile: { ...user.profile, role: newRole } } 
          : user
      ));
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.profile.full_name || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Button variant="outline" onClick={fetchUsers}>
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <div className="mt-4">
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-3 px-4 font-medium">User</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Role</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profile.avatar_url || ""} />
                              <AvatarFallback className="bg-nature-200 text-nature-700">
                                {user.profile.full_name?.charAt(0) || user.email.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {user.profile.full_name || "No name"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            user.profile.role === 'admin' 
                              ? 'bg-red-100 text-red-700' 
                              : user.profile.role === 'host'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.profile.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Select 
                            defaultValue={user.profile.role} 
                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                            disabled={user.id === profile?.id} // Can't change own role
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visitor">Visitor</SelectItem>
                              <SelectItem value="tribe">Tribe</SelectItem>
                              <SelectItem value="host">Host</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
