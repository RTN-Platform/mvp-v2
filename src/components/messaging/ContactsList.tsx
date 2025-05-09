
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Contact } from "@/types/message";
import ContactItem from "./ContactItem";
import ContactSearch from "./ContactSearch";
import NewConversationDialog from "./NewConversationDialog";
import EmptyContactsList from "./EmptyContactsList";

interface ContactsListProps {
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  selectedContactId, 
  onSelectContact 
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      // Get all users the current user has exchanged messages with
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('recipient_id')
        .eq('sender_id', user?.id);

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('recipient_id', user?.id);

      if (sentError) throw sentError;
      if (receivedError) throw receivedError;

      // Combine and deduplicate contact IDs
      const contactIds = new Set<string>();
      
      sentMessages?.forEach(msg => contactIds.add(msg.recipient_id));
      receivedMessages?.forEach(msg => contactIds.add(msg.sender_id));
      
      // Remove current user from the list if somehow included
      contactIds.delete(user?.id || '');
      
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
            .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
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
              (lastMessage.recipient_id === user?.id && !lastMessage.is_read) : 
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

  const openNewMessageDialog = async () => {
    try {
      // Get all connections (tribe members the user is connected to)
      const { data, error } = await supabase
        .from('connections')
        .select(`
          invitee_id,
          inviter_id
        `)
        .or(`invitee_id.eq.${user?.id},inviter_id.eq.${user?.id}`)
        .eq('status', 'connected');

      if (error) throw error;
      
      // Extract connected user IDs
      const connectedUserIds = data?.map(conn => 
        conn.invitee_id === user?.id ? conn.inviter_id : conn.invitee_id
      ) || [];
      
      // Filter out connections that already have a conversation
      const existingContactIds = contacts.map(contact => contact.id);
      const newConnectionIds = connectedUserIds.filter(id => !existingContactIds.includes(id));
      
      if (newConnectionIds.length > 0) {
        // Get profile details for these connections
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', newConnectionIds);
        
        if (profileError) throw profileError;
        
        // Format the connections for display
        const formattedConnections = profileData?.map(profile => ({
          connection_id: profile.id,
          connection: {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url
          }
        })) || [];
        
        setConnections(formattedConnections);
      } else {
        setConnections([]);
      }
      
      setShowNewMessageDialog(true);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleStartConversation = async (connectionId: string) => {
    if (!user?.id || !connectionId) return;
    
    try {
      // Create a new message to start the conversation
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
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
      onSelectContact(connectionId);
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openNewMessageDialog}
            title="New Message"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <ContactSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spinner size="md" />
          </div>
        ) : filteredContacts.length > 0 ? (
          <ul>
            {filteredContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isSelected={selectedContactId === contact.id}
                onSelect={onSelectContact}
              />
            ))}
          </ul>
        ) : (
          <EmptyContactsList searchQuery={searchQuery} />
        )}
      </div>

      <NewConversationDialog 
        isOpen={showNewMessageDialog}
        onClose={() => setShowNewMessageDialog(false)}
        connections={connections}
        onStartConversation={handleStartConversation}
      />
    </div>
  );
};

export default ContactsList;
