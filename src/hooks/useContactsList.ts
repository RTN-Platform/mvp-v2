
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Contact } from "@/types/message";

export const useContactsList = (userId: string | undefined) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchContacts();
      fetchAllConnections();
    }
  }, [userId]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      // Get all users the current user has exchanged messages with
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('recipient_id')
        .eq('sender_id', userId);

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('recipient_id', userId);

      if (sentError) throw sentError;
      if (receivedError) throw receivedError;

      // Combine and deduplicate contact IDs
      const contactIds = new Set<string>();
      
      sentMessages?.forEach(msg => contactIds.add(msg.recipient_id));
      receivedMessages?.forEach(msg => contactIds.add(msg.sender_id));
      
      // Remove current user from the list if somehow included
      contactIds.delete(userId || '');
      
      if (contactIds.size > 0) {
        // Get profile information for each contact
        const { data: contactProfiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', Array.from(contactIds));

        if (profileError) throw profileError;

        // Get last message for each contact to show preview and sort by latest
        const contactsWithLastMessage = await Promise.all((contactProfiles || []).map(async (profile) => {
          // Get the latest message between current user and this contact
          const { data: lastMessage, error: messageError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
            .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (messageError && messageError.code !== 'PGRST116') {
            console.error('Error fetching last message:', messageError);
          }

          return {
            id: profile.id,
            name: profile.full_name || 'Unnamed User',
            avatar: profile.avatar_url,
            lastMessage: lastMessage?.content || '',
            lastMessageTime: lastMessage?.created_at || '',
            unread: lastMessage ? 
              (lastMessage.recipient_id === userId && !lastMessage.is_read) : 
              false
          };
        }));

        // Sort contacts by last message time
        const sortedContacts = contactsWithLastMessage.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

        setContacts(sortedContacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all tribe connections to display in contacts
  const fetchAllConnections = async () => {
    if (!userId) return;

    try {
      // Get all connected tribe members
      const { data, error } = await supabase
        .from('connections')
        .select(`
          invitee_id,
          inviter_id,
          status
        `)
        .or(`invitee_id.eq.${userId},inviter_id.eq.${userId}`)
        .eq('status', 'connected');

      if (error) throw error;
      
      // Extract connected user IDs
      const connectedUserIds = data?.map(conn => 
        conn.invitee_id === userId ? conn.inviter_id : conn.invitee_id
      ) || [];
      
      if (connectedUserIds.length > 0) {
        // Get profile details for these connections
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', connectedUserIds);
        
        if (profileError) throw profileError;
        
        // Format the connections for display
        const formattedConnections = profileData?.map(profile => ({
          connection_id: profile.id,
          connection: {
            id: profile.id,
            full_name: profile.full_name || 'Unnamed User',
            avatar_url: profile.avatar_url
          }
        })) || [];
        
        setConnections(formattedConnections);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleStartConversation = async (connectionId: string) => {
    if (!userId || !connectionId) return;
    
    try {
      // Create a new message to start the conversation
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: userId,
          recipient_id: connectionId,
          subject: 'New Conversation',
          content: 'Hello! I wanted to start a conversation with you.',
          is_read: false,
          is_system: false
        }]);

      if (error) throw error;
      
      // Close dialog and refresh contacts
      setShowNewMessageDialog(false);
      await fetchContacts();
      return connectionId;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    contacts: filteredContacts,
    isLoading,
    connections,
    searchQuery,
    setSearchQuery,
    showNewMessageDialog,
    setShowNewMessageDialog,
    handleStartConversation,
    openNewMessageDialog: () => setShowNewMessageDialog(true)
  };
};
