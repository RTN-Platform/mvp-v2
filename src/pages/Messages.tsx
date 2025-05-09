
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, UserPlus, Check, X, RefreshCcw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import HostApplicationReviewModal from "@/components/admin/HostApplicationReviewModal";

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

interface Message {
  id: string;
  sender_id: string | null;
  subject: string;
  content: string;
  created_at: string;
  is_read: boolean;
  is_system: boolean;
  related_entity_type: string | null;
  related_entity_id: string | null;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface HostApplication {
  id: string;
  user_id: string;
  venue_name: string;
  venue_type: string;
  venue_location: string;
  venue_description: string;
  contact_email: string;
  contact_phone?: string | null;
  status: 'pending' | 'approved' | 'declined';
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  applicant_name?: string;
  verification_documents?: string[] | null;
}

const Messages: React.FC = () => {
  const [connectionRequests, setConnectionRequests] = useState<Connection[]>([]);
  const [systemMessages, setSystemMessages] = useState<Message[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<HostApplication | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isAdmin = profile?.role === 'admin';

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

  const fetchSystemMessages = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch system messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      
      // Get sender details for non-system messages
      const messagesWithSenders = await Promise.all(
        (messagesData || []).map(async (message) => {
          if (!message.sender_id || message.is_system) {
            return message;
          }
          
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', message.sender_id)
            .maybeSingle();
          
          return {
            ...message,
            sender: senderData || { full_name: 'Unknown User', avatar_url: null }
          };
        })
      );
      
      setSystemMessages(messagesWithSenders);
    } catch (error) {
      console.error('Error fetching system messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHostApplicationDetails = async (applicationId: string) => {
    try {
      // First get the application
      const { data: application, error } = await supabase
        .from('host_applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      if (!application) {
        toast({
          variant: "destructive",
          title: "Application not found",
          description: "The application you're trying to view could not be found."
        });
        return;
      }
      
      // Get the applicant's name
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', application.user_id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      // Open the modal with the application data
      setSelectedApplication({
        ...application,
        status: application.status as 'pending' | 'approved' | 'declined',
        applicant_name: profileData?.full_name || 'Unknown User'
      });
      setApplicationModalOpen(true);
      
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load application details. Please try again."
      });
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
    fetchSystemMessages();
    
    // Set up realtime subscriptions
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'connections',
          filter: `invitee_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('New connection request received:', payload);
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
          console.log('Connection request updated:', payload);
          fetchConnectionRequests();
        }
      )
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchSystemMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAcceptRequest = async (connectionId: string, inviterName: string) => {
    try {
      console.log(`Accepting connection request ${connectionId} from ${inviterName}`);
      
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);
      
      if (error) {
        console.error('Error accepting connection request:', error);
        throw error;
      }
      
      console.log(`Connection request ${connectionId} accepted successfully`);
      
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
      console.log(`Declining connection request ${connectionId}`);
      
      const { error } = await supabase
        .from('connections')
        .update({ status: 'declined' })
        .eq('id', connectionId);
      
      if (error) {
        console.error('Error declining connection request:', error);
        throw error;
      }
      
      console.log(`Connection request ${connectionId} declined successfully`);
      
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
  
  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Update UI optimistically
      setSystemMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, is_read: true } 
            : message
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMessageClick = async (message: Message) => {
    // Mark as read if not already read
    if (!message.is_read) {
      await markMessageAsRead(message.id);
    }
    
    // If this is a host application message, fetch and show the application
    if (message.related_entity_type === 'host_application' && message.related_entity_id) {
      fetchHostApplicationDetails(message.related_entity_id);
    }
  };
  
  // Count unread messages
  const unreadCount = systemMessages.filter(msg => !msg.is_read).length;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-nature-800">Messages</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              fetchConnectionRequests();
              fetchSystemMessages();
            }}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="connections" className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" /> 
              Connection Requests
              {connectionRequests.length > 0 && (
                <Badge className="ml-2 bg-nature-600" variant="secondary">{connectionRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" /> 
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-nature-600" variant="secondary">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            <Card className="mb-6 border-nature-200">
              <CardHeader className="border-b border-nature-100 bg-nature-50">
                <CardTitle className="text-xl text-nature-800">Connection Requests</CardTitle>
                <CardDescription>Accept or decline connection requests from other members</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-500"></div>
                  </div>
                ) : connectionRequests.length > 0 ? (
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <UserPlus className="h-16 w-16 text-nature-200 mb-4" />
                    <h3 className="text-lg font-medium text-nature-700 mb-2">No connection requests</h3>
                    <p className="text-gray-500 max-w-md">
                      You don't have any pending connection requests at the moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="mb-6 border-nature-200">
              <CardHeader className="border-b border-nature-100 bg-nature-50">
                <CardTitle className="text-xl text-nature-800">Notifications</CardTitle>
                <CardDescription>System notifications and messages</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-500"></div>
                  </div>
                ) : systemMessages.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {systemMessages.map((message) => (
                      <li 
                        key={message.id} 
                        className={`p-4 sm:p-6 cursor-pointer ${!message.is_read ? 'bg-blue-50' : ''}`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Avatar className="h-12 w-12">
                            {message.is_system ? (
                              <div className="bg-nature-600 text-white h-full w-full flex items-center justify-center">
                                <Bell size={24} />
                              </div>
                            ) : (
                              <>
                                <AvatarImage src={message.sender?.avatar_url || undefined} />
                                <AvatarFallback>
                                  {message.sender?.full_name?.split(' ').map(part => part[0]).join('') || 'SY'}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-base font-medium text-gray-900">
                                {message.subject}
                              </h4>
                              {!message.is_read && (
                                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                              {message.related_entity_type === 'host_application' && isAdmin && (
                                <span className="inline-flex items-center bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                                  Host Application
                                </span>
                              )}
                            </div>
                            
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {message.content}
                            </p>
                            
                            <div className="flex items-center mt-2 text-xs text-gray-400">
                              <span>
                                From: {message.is_system ? 'System' : message.sender?.full_name || 'Unknown User'}
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                {new Date(message.created_at).toLocaleDateString()} at {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            
                            {message.related_entity_type === 'host_application' && isAdmin && (
                              <div className="mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (message.related_entity_id) {
                                      fetchHostApplicationDetails(message.related_entity_id);
                                    }
                                  }}
                                >
                                  Review Application
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-16 w-16 text-nature-200 mb-4" />
                    <h3 className="text-lg font-medium text-nature-700 mb-2">No messages</h3>
                    <p className="text-gray-500 max-w-md">
                      You don't have any messages or notifications at the moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Host Application Review Modal */}
        <HostApplicationReviewModal
          application={selectedApplication}
          open={applicationModalOpen}
          onOpenChange={setApplicationModalOpen}
          onApplicationUpdated={() => {
            fetchSystemMessages();
          }}
        />
      </div>
    </MainLayout>
  );
};

export default Messages;
