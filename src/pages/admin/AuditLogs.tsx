
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
  user_email?: string;
  user_name?: string;
};

const AuditLogs: React.FC = () => {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userDetails, setUserDetails] = useState<Record<string, { email?: string, name?: string }>>({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setLogs(data);

      // Extract unique user IDs to fetch their details
      const userIds = [...new Set(data.filter(log => log.user_id).map(log => log.user_id))];
      if (userIds.length > 0) {
        fetchUserDetails(userIds as string[]);
      }
    } catch (error: any) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (userIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (error) throw error;

      const userDetailsMap: Record<string, { name?: string }> = {};
      data.forEach(user => {
        userDetailsMap[user.id] = { name: user.full_name || 'Unknown User' };
      });
      
      setUserDetails(userDetailsMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const getActionColor = (action: string): string => {
    if (action.includes('create') || action.includes('insert')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete') || action.includes('remove')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const userName = log.user_id ? userDetails[log.user_id]?.name || 'Unknown User' : 'System';
    
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.entity_type.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower) ||
      (log.details ? JSON.stringify(log.details).toLowerCase().includes(searchLower) : false)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <div className="mt-4">
              <Input
                placeholder="Search logs..."
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
                      <th className="py-3 px-4 font-medium">Timestamp</th>
                      <th className="py-3 px-4 font-medium">User</th>
                      <th className="py-3 px-4 font-medium">Action</th>
                      <th className="py-3 px-4 font-medium">Entity</th>
                      <th className="py-3 px-4 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-3 px-4 whitespace-nowrap">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          {log.user_id ? (
                            userDetails[log.user_id]?.name || 'Loading...'
                          ) : (
                            <span className="text-gray-500">System</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {log.entity_type}
                          {log.entity_id && (
                            <span className="text-gray-500 text-xs ml-1">
                              (ID: {log.entity_id.substring(0, 8)}...)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {log.details ? (
                            <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-w-md max-h-20">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-gray-500">No details</span>
                          )}
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
    </AdminLayout>
  );
};

export default AuditLogs;
