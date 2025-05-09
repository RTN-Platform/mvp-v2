
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@/types/message";

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
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
        .eq('sender_id', user?.id)
        .distinct();

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('recipient_id', user?.id)
        .distinct();

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
      const { data: tribeConnections, error } = await supabase
        .from('tribe_connections')
        .select(`
          connection_id,
          connection:connection_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'connected');

      if (error) throw error;
      
      // Filter out connections that already have a conversation
      const existingContactIds = contacts.map(contact => contact.id);
      const filteredConnections = tribeConnections?.filter(
        conn => conn.connection && !existingContactIds.includes(conn.connection.id)
      ) || [];
      
      setConnections(filteredConnections);
      setShowNewMessageDialog(true);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedConnection) return;
    
    try {
      // Create a new message to start the conversation
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user?.id,
          recipient_id: selectedConnection,
          subject: 'New Conversation',
          content: 'Hello! I wanted to start a conversation with you.',
          is_read: false,
          is_system: false
        }]);

      if (error) throw error;
      
      // Close dialog and refresh contacts
      setShowNewMessageDialog(false);
      setSelectedConnection(null);
      fetchContacts();
      onSelectContact(selectedConnection);
    } catch (error) {
      console.error('Error starting conversation:', error);
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
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spinner size="md" />
          </div>
        ) : filteredContacts.length > 0 ? (
          <ul>
            {filteredContacts.map((contact) => (
              <li 
                key={contact.id} 
                onClick={() => onSelectContact(contact.id)}
                className={`p-4 hover:bg-muted cursor-pointer border-b ${
                  selectedContactId === contact.id ? 'bg-muted' : ''
                } ${contact.unread ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={contact.avatar || ''} alt={contact.name} />
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${contact.unread ? 'font-bold' : ''}`}>
                        {contact.name}
                      </p>
                      {contact.lastMessageTime && (
                        <p className="text-xs text-gray-500">
                          {new Date(contact.lastMessageTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>
                  {contact.unread && (
                    <div className="w-2 h-2 bg-nature-600 rounded-full"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? (
              <p>No contacts match your search.</p>
            ) : (
              <div>
                <p className="mb-2">No messages yet.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/tribe')}
                  className="text-xs"
                >
                  Connect with members
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a New Conversation</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {connections.length > 0 ? (
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {connections.map((conn) => (
                  <li 
                    key={conn.connection_id}
                    onClick={() => setSelectedConnection(conn.connection.id)}
                    className={`p-3 rounded-md hover:bg-muted cursor-pointer flex items-center space-x-3 ${
                      selectedConnection === conn.connection.id ? 'bg-muted' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage 
                        src={conn.connection.avatar_url || ''} 
                        alt={conn.connection.full_name} 
                      />
                      <AvatarFallback>
                        {conn.connection.full_name?.substring(0, 2) || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{conn.connection.full_name || 'Unnamed User'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">
                  No connections found. Connect with members first.
                </p>
                <Button onClick={() => navigate('/tribe')} size="sm">
                  Go to Tribe
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewMessageDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation} 
              disabled={!selectedConnection}
            >
              Start Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsList;
