
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageCircle, AlertCircle, Users, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "@/utils/roles";
import { Button } from "@/components/ui/button";
import HostApplicationReviewModal from "@/components/admin/HostApplicationReviewModal";
import ContactsList from "@/components/messaging/ContactsList";
import MessageThread from "@/components/messaging/MessageThread";
import MessageComposer from "@/components/messaging/MessageComposer";

interface Message {
  id: string;
  sender_id: string | null;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
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
  contact_phone?: string;
  verification_documents?: string[];
  status: 'pending' | 'approved' | 'declined';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  applicant?: {
    full_name: string;
    avatar_url: string | null;
  };
}

const Messages: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemMessages, setSystemMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const isAdminUser = profile ? isAdmin(profile) : false;
  const [hostApplication, setHostApplication] = useState<HostApplication | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // For messaging between members
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messagesUpdated, setMessagesUpdated] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch regular messages
      const { data: regularMessages, error: regularError } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(full_name, avatar_url)
        `)
        .eq("recipient_id", user.id)
        .eq("is_system", false)
        .order("created_at", { ascending: false });

      if (regularError) throw regularError;
      setMessages(regularMessages || []);

      // Fetch system messages
      const { data: systemMsgs, error: systemError } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(full_name, avatar_url)
        `)
        .eq("recipient_id", user.id)
        .eq("is_system", true)
        .order("created_at", { ascending: false });

      if (systemError) throw systemError;
      setSystemMessages(systemMsgs || []);

    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (message: Message) => {
    if (message.is_read) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", message.id);

      if (error) throw error;

      // Update the local state to mark the message as read
      if (message.is_system) {
        setSystemMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === message.id ? { ...msg, is_read: true } : msg
          )
        );
      } else {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === message.id ? { ...msg, is_read: true } : msg
          )
        );
      }

    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    await markAsRead(message);

    // If it's a host application message, fetch the application details
    if (message.related_entity_type === 'host_application' && message.related_entity_id) {
      try {
        const { data, error } = await supabase
          .from('host_applications')
          .select(`
            *,
            applicant:user_id(full_name, avatar_url)
          `)
          .eq('id', message.related_entity_id)
          .single();

        if (error) throw error;
        
        if (data) {
          setHostApplication(data);
          
          // Only open the modal automatically for admin users and pending applications
          if (isAdminUser && data.status === 'pending') {
            setIsReviewModalOpen(true);
          }
        }
      } catch (error) {
        console.error('Error fetching host application:', error);
      }
    }
  };

  const getMessageSender = (message: Message) => {
    if (!message.sender_id) return "System";
    return message.sender?.full_name || "Unknown User";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    // Refresh messages when the modal is closed
    fetchMessages();
  };

  const unreadCount = {
    inbox: messages.filter((msg) => !msg.is_read).length,
    system: systemMessages.filter((msg) => !msg.is_read).length,
  };

  const handleNewMessageSent = () => {
    // Increment the counter to trigger a refresh in MessageThread
    setMessagesUpdated(prev => prev + 1);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Stay connected with other members and receive important system notifications</p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          setSelectedContactId(null);
          setSelectedMessage(null);
        }}>
          <TabsList>
            <TabsTrigger value="inbox" className="flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" /> Messages
              {unreadCount.inbox > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount.inbox}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" /> System Notifications
              {unreadCount.system > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount.system}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center">
              <Users className="mr-2 h-4 w-4" /> Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">Inbox</h3>
                      </div>
                      <div className="divide-y max-h-[500px] overflow-y-auto">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedMessage?.id === message.id ? "bg-gray-100" : ""
                            } ${!message.is_read ? "bg-blue-50 hover:bg-blue-100" : ""}`}
                            onClick={() => handleMessageClick(message)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{getMessageSender(message)}</h4>
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 border rounded-md p-4">
                      {selectedMessage ? (
                        <div>
                          <div className="mb-4">
                            <h3 className="text-xl font-medium">{selectedMessage.subject}</h3>
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <div>From: {getMessageSender(selectedMessage)}</div>
                              <div>{formatDate(selectedMessage.created_at)}</div>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                          
                          {selectedMessage.related_entity_type === 'host_application' && hostApplication && isAdminUser && (
                            <div className="mt-6 pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Host Application: {hostApplication.venue_name}</h4>
                                  <p className="text-sm text-gray-600">Status: <span className="font-medium">{hostApplication.status.toUpperCase()}</span></p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="flex items-center gap-2"
                                  onClick={() => setIsReviewModalOpen(true)}
                                >
                                  <ClipboardList className="h-4 w-4" /> Review Application
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {selectedMessage.sender_id && (
                            <div className="mt-6">
                              <Button
                                onClick={() => {
                                  setActiveTab('contacts');
                                  setSelectedContactId(selectedMessage.sender_id!);
                                }}
                              >
                                Reply
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-12">
                          <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p>Select a message to view its contents</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Messages</h3>
                    <p className="text-gray-500">
                      You don't have any messages in your inbox.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">System Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : systemMessages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">Notifications</h3>
                      </div>
                      <div className="divide-y max-h-[500px] overflow-y-auto">
                        {systemMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                              selectedMessage?.id === message.id ? "bg-gray-100" : ""
                            } ${!message.is_read ? "bg-blue-50 hover:bg-blue-100" : ""}`}
                            onClick={() => handleMessageClick(message)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium truncate">
                                {message.subject}
                              </h4>
                              {!message.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(message.created_at)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 border rounded-md p-4">
                      {selectedMessage ? (
                        <div>
                          <div className="mb-4">
                            <h3 className="text-xl font-medium">{selectedMessage.subject}</h3>
                            <div className="text-sm text-gray-600 mt-1">
                              {formatDate(selectedMessage.created_at)}
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                          
                          {selectedMessage.related_entity_type === 'host_application' && hostApplication && isAdminUser && (
                            <div className="mt-6 pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">Host Application: {hostApplication.venue_name}</h4>
                                  <p className="text-sm text-gray-600">Status: <span className="font-medium">{hostApplication.status.toUpperCase()}</span></p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="flex items-center gap-2"
                                  onClick={() => setIsReviewModalOpen(true)}
                                >
                                  <ClipboardList className="h-4 w-4" /> Review Application
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-12">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p>Select a notification to view its contents</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">No Notifications</h3>
                    <p className="text-gray-500">
                      You don't have any system notifications.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Messages with Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">Contacts</h3>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      <ContactsList 
                        onContactSelect={contactId => setSelectedContactId(contactId)} 
                        selectedContactId={selectedContactId}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 border rounded-md p-4">
                    {selectedContactId ? (
                      <div className="space-y-6">
                        <MessageThread 
                          recipientId={selectedContactId} 
                          messagesUpdated={messagesUpdated}
                        />
                        <Separator />
                        <MessageComposer 
                          recipientId={selectedContactId} 
                          onMessageSent={handleNewMessageSent}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Select a contact to start messaging</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Host Application Review Modal */}
      {hostApplication && (
        <HostApplicationReviewModal
          isOpen={isReviewModalOpen}
          onClose={handleReviewModalClose}
          application={hostApplication}
        />
      )}
    </MainLayout>
  );
};

export default Messages;
