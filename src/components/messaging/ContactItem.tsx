
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@/types/message";

interface ContactItemProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (contactId: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ 
  contact, 
  isSelected, 
  onSelect 
}) => {
  return (
    <li 
      onClick={() => onSelect(contact.id)}
      className={`p-4 hover:bg-muted cursor-pointer border-b ${
        isSelected ? 'bg-muted' : ''
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
  );
};

export default ContactItem;
