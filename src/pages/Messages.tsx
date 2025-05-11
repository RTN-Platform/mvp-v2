
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ContactsList from "@/components/messaging/ContactsList";
import MessageContainer from "@/components/messaging/MessageContainer";
import ConnectionRequests from "@/components/messaging/ConnectionRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/hooks/useMessaging";

const Messages = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    messages, 
    isLoading, 
    contactName, 
    contactAvatar, 
    connectionRequests,
    handleSendMessage,
    handleAcceptConnection,
    handleDeclineConnection
  } = useMessaging(selectedContactId);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access messages",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-6rem)] bg-white border rounded-lg overflow-hidden">
        <div className="w-1/3 border-r flex flex-col">
          {connectionRequests && connectionRequests.length > 0 && (
            <ConnectionRequests 
              requests={connectionRequests}
              onAccept={handleAcceptConnection}
              onDecline={handleDeclineConnection}
            />
          )}
          <ContactsList 
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        </div>
        <div className="w-2/3">
          <MessageContainer
            selectedContactId={selectedContactId}
            messages={messages}
            isLoading={isLoading}
            contactName={contactName}
            contactAvatar={contactAvatar}
            onSendMessage={handleSendMessage}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
