
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, UserPlus, Check, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Connection {
  id: string;
  inviter_id: string;
  message: string;
  status: string;
  created_at: string;
  inviter: {
    full_name: string;
    avatar_url: string | null;
  };
}

const Messages: React.FC = () => {
  const [connectionRequests, setConnectionRequests] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnectionRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // First fetch the connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('connections')
        .select('id, inviter_id, message, status, created_at')
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (connectionsError) throw connectionsError;
      if (!connectionsData || connectionsData.length === 0) {
        setConnectionRequests([]);
        return;
      }
      
      // Then fetch profile data for each inviter
      const connectionWithProfiles = await Promise.all(
        connectionsData.map(async (connection) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', connection.inviter_id)
            .single();
          
          if (profileError || !profileData) {
            console.error('Error fetching profile:', profileError);
            // Return connection with fallback profile data
            return {
              ...connection,
              inviter: {
                full_name: 'Unknown User',
                avatar_url: null
              }
            };
          }
          
          return {
            ...connection,
            inviter: {
              full_name: profileData.full_name || 'Unknown User',
              avatar_url: profileData.avatar_url
            }
          };
        })
      );
      
      setConnectionRequests(connectionWithProfiles);
      
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
    
    // Set up realtime subscription for new connection requests
    const channel = supabase
      .channel('connections-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'connections',
          filter: `invitee_id=eq.${user?.id}`
        },
        (payload) => {
          fetchConnectionRequests();
        }
      )
      .on('postgres_changes', 
        {
          event: 'UPDATE', 
          schema: 'public',
          table: 'connections',
          filter: `invitee_id=eq.${user?.id}`
        },
        (payload) => {
          fetchConnectionRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAcceptRequest = async (connectionId: string, inviterName: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Update UI optimistically
      setConnectionRequests(prev => 
        prev.filter(request => request.id !== connectionId)
      );
      
      toast({
        title: "Connection Accepted",
        description: `You are now connected with ${inviterName}.`
      });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeclineRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({ status: 'declined' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Update UI optimistically
      setConnectionRequests(prev => 
        prev.filter(request => request.id !== connectionId)
      );
      
      toast({
        title: "Connection Declined",
        description: "The connection request has been declined."
      });
    } catch (error) {
      console.error('Error declining connection request:', error);
      toast({
        title: "Error",
        description: "Failed to decline connection request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-nature-800">Messages</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchConnectionRequests}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        
        {/* Unified Messages Interface with Integrated Connection Requests */}
        <Card className="mb-6 border-nature-200">
          <CardHeader className="border-b border-nature-100 bg-nature-50">
            <CardTitle className="text-xl text-nature-800">Messages & Requests</CardTitle>
            <CardDescription>Connect with community members and respond to invitations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Connection Requests Section */}
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-500"></div>
              </div>
            ) : connectionRequests.length > 0 ? (
              <>
                <div className="p-4 bg-nature-50 border-b border-nature-100">
                  <h3 className="text-sm font-medium text-nature-800">Connection Requests</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {connectionRequests.map((request) => (
                    <li key={request.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.inviter.avatar_url || undefined} alt={request.inviter.full_name} />
                          <AvatarFallback>
                            {request.inviter.full_name.split(' ').map(part => part[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-medium text-gray-900 truncate flex items-center gap-2">
                            {request.inviter.full_name}
                            <span className="inline-flex items-center bg-nature-100 text-nature-800 text-xs px-2 py-1 rounded-full">
                              <UserPlus size={12} className="mr-1" />
                              Wants to connect
                            </span>
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {request.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            onClick={() => handleDeclineRequest(request.id)}
                          >
                            <X size={16} className="mr-1" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-nature-600 hover:bg-nature-700 text-white"
                            onClick={() => handleAcceptRequest(request.id, request.inviter.full_name)}
                          >
                            <Check size={16} className="mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            
            {/* Regular Messages Section */}
            <div className={`${connectionRequests.length > 0 ? 'border-t border-nature-100' : ''} p-4`}>
              {!isLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-16 w-16 text-nature-200 mb-4" />
                  <h3 className="text-lg font-medium text-nature-700 mb-2">No messages yet</h3>
                  <p className="text-gray-500 max-w-md">
                    Connect with other members or hosts to start a conversation.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
