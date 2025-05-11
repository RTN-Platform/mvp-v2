
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/message';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMessages, fetchContactDetails, markMessagesAsRead, sendMessage } from '@/services/messaging';
import { supabase } from '@/integrations/supabase/client';

export const useMessaging = (selectedContactId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactAvatar, setContactAvatar] = useState<string | null>(null);
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const { user } = useAuth();

  // Fetch contact details function
  const fetchContactInfo = useCallback(async (contactId: string) => {
    try {
      const { contactName: name, contactAvatar: avatar } = await fetchContactDetails(contactId);
      setContactName(name);
      setContactAvatar(avatar);
      return { name, avatar };
    } catch (error) {
      console.error("Error fetching contact details:", error);
      return { name: "Unknown", avatar: null };
    }
  }, []);

  // Fetch messages function
  const fetchMessagesData = useCallback(async (userId: string, contactId: string) => {
    try {
      const messagesData = await fetchMessages(userId, contactId);
      setMessages(messagesData);
      return messagesData;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }, []);

  // Fetch connection requests function
  const fetchConnectionRequests = useCallback(async (userId: string) => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          id, 
          inviter_id,
          message, 
          created_at,
          profiles:inviter_id (id, full_name, avatar_url)
        `)
        .eq('invitee_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      return [];
    }
  }, []);

  // Mark messages as read function
  const markAsRead = useCallback(async (userId: string, contactId: string) => {
    try {
      await markMessagesAsRead(userId, contactId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  // Load connection requests
  useEffect(() => {
    if (user) {
      (async () => {
        const requests = await fetchConnectionRequests(user.id);
        setConnectionRequests(requests);
        
        // Add realtime subscription for new connection requests
        const channel = supabase
          .channel('connections-changes')
          .on('postgres_changes', 
            {
              event: '*', 
              schema: 'public',
              table: 'connections',
              filter: `invitee_id=eq.${user.id}`
            },
            () => {
              fetchConnectionRequests(user.id).then(setConnectionRequests);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      })();
    }
  }, [user, fetchConnectionRequests]);

  // Load all messaging data
  const loadMessages = useCallback(async () => {
    if (!user || !selectedContactId) return;
    
    setIsLoading(true);
    
    try {
      // Get contact details
      await fetchContactInfo(selectedContactId);
      
      // Get messages
      await fetchMessagesData(user.id, selectedContactId);
      
      // Mark messages as read
      await markAsRead(user.id, selectedContactId);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedContactId, fetchContactInfo, fetchMessagesData, markAsRead]);

  useEffect(() => {
    if (user && selectedContactId) {
      loadMessages();
    }
  }, [user, selectedContactId, loadMessages]);

  // Handle sending a new message
  const handleSendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!user || !selectedContactId) return;
    
    try {
      const newMessage = await sendMessage(user.id, selectedContactId, content, attachments);
      
      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }, [user, selectedContactId]);

  // Handle accepting a connection request
  const handleAcceptConnection = useCallback(async (connectionId: string) => {
    if (!user) return false;
    
    try {
      // Update the connection status
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .eq('invitee_id', user.id);
      
      if (error) throw error;

      // Remove from connection requests list
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      return true;
    } catch (error) {
      console.error("Error accepting connection:", error);
      return false;
    }
  }, [user]);

  // Handle declining a connection request
  const handleDeclineConnection = useCallback(async (connectionId: string) => {
    if (!user) return false;
    
    try {
      // Delete the connection
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId)
        .eq('invitee_id', user.id);
      
      if (error) throw error;

      // Remove from connection requests list
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      return true;
    } catch (error) {
      console.error("Error declining connection:", error);
      return false;
    }
  }, [user]);

  return {
    messages,
    isLoading,
    contactName,
    contactAvatar,
    connectionRequests,
    handleSendMessage,
    handleAcceptConnection,
    handleDeclineConnection
  };
};
