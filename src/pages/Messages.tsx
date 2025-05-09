
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import ContactsList from "@/components/messaging/ContactsList";
import MessageThread from "@/components/messaging/MessageThread";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";

const Messages = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactAvatar, setContactAvatar] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user && selectedContactId) {
      fetchMessages();
      fetchContactDetails();
      markMessagesAsRead();
    }
  }, [user, selectedContactId]);

  const fetchMessages = async () => {
    if (!user || !selectedContactId) return;
    
    setIsLoading(true);
    try {
      // Get all messages between current user and selected contact
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedContactId}),and(sender_id.eq.${selectedContactId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Convert the data to the Message type by ensuring the sender field is properly shaped
      const typedMessages = data.map(msg => ({
        ...msg,
        sender: {
          id: msg.sender.id,
          full_name: msg.sender.full_name || 'Unknown User',
          avatar_url: msg.sender.avatar_url
        }
      })) as Message[];

      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContactDetails = async () => {
    if (!selectedContactId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', selectedContactId)
        .single();

      if (error) throw error;

      setContactName(data.full_name || 'Unnamed User');
      setContactAvatar(data.avatar_url);
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user || !selectedContactId) return;
    
    try {
      // Mark all messages from the selected contact as read
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', selectedContactId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!user || !selectedContactId || !content.trim()) return;
    
    try {
      const attachmentUrls: string[] = [];
      
      // Upload attachments if any
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `message_attachments/${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('messages')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('messages')
            .getPublicUrl(filePath);
            
          attachmentUrls.push(data.publicUrl);
        }
      }
      
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedContactId,
        subject: 'Message',
        content: content,
        is_read: false,
        is_system: false,
        attachments: attachmentUrls.length > 0 ? attachmentUrls : null
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select(`
          *,
          sender:sender_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      
      // Add the new message to the state
      const typedMessage = {
        ...data,
        sender: {
          id: data.sender.id,
          full_name: data.sender.full_name || 'Unknown User',
          avatar_url: data.sender.avatar_url
        }
      } as Message;
      
      setMessages(prevMessages => [...prevMessages, typedMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-6rem)] bg-white border rounded-lg overflow-hidden">
        <div className="w-1/3 border-r">
          <ContactsList 
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
          />
        </div>
        <div className="w-2/3">
          {selectedContactId ? (
            <MessageThread 
              messages={messages} 
              isLoading={isLoading}
              contactName={contactName}
              contactAvatar={contactAvatar}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a contact to start messaging
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
