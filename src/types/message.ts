
export interface MessageSender {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  created_at: string;
  is_read: boolean;
  is_system: boolean;
  related_entity_id?: string | null;
  related_entity_type?: string | null;
  sender: MessageSender;
  attachments?: string[]; // Add attachments field
}

export interface Contact {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}
