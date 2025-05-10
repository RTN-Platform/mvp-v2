
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactSearch from "./ContactSearch";

interface ContactsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewMessage: () => void;
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onNewMessage
}) => {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNewMessage}
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
  );
};

export default ContactsHeader;
