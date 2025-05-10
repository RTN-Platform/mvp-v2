
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import ContactItem from "./ContactItem";
import EmptyContactsList from "./EmptyContactsList";
import NewConversationDialog from "./NewConversationDialog";
import { useContactsList } from "@/hooks/useContactsList";
import ContactsHeader from "./ContactsHeader";

interface ContactsListProps {
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  selectedContactId, 
  onSelectContact 
}) => {
  const { user } = useAuth();
  
  const {
    contacts,
    isLoading,
    connections,
    searchQuery,
    setSearchQuery,
    showNewMessageDialog,
    setShowNewMessageDialog,
    handleStartConversation,
    openNewMessageDialog
  } = useContactsList(user?.id);

  const handleStartNewConversation = async (connectionId: string) => {
    const newContactId = await handleStartConversation(connectionId);
    if (newContactId) {
      onSelectContact(newContactId);
    }
  };

  return (
    <div className="h-full flex flex-col border-r">
      <ContactsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewMessage={openNewMessageDialog}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spinner size="md" />
          </div>
        ) : contacts.length > 0 ? (
          <ul>
            {contacts.map((contact) => (
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
        onStartConversation={handleStartNewConversation}
      />
    </div>
  );
};

export default ContactsList;
