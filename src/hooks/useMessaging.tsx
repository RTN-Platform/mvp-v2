
import { useState, useEffect } from 'react';
import { Message } from '@/types/message';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMessages, fetchContactDetails, markMessagesAsRead, sendMessage } from '@/services/messaging';

export const useMessaging = (selectedContactId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactAvatar, setContactAvatar] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && selectedContactId) {
      loadMessages();
    }
  }, [user, selectedContactId]);

  const loadMessages = async () => {
    if (!user || !selectedContactId) return;
    
    setIsLoading(true);
    
    // Get contact details
    const { contactName: name, contactAvatar: avatar } = await fetchContactDetails(selectedContactId);
    setContactName(name);
    setContactAvatar(avatar);
    
    // Get messages
    const messagesData = await fetchMessages(user.id, selectedContactId);
    setMessages(messagesData);
    
    // Mark messages as read
    await markMessagesAsRead(user.id, selectedContactId);
    
    setIsLoading(false);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!user || !selectedContactId) return;
    
    const newMessage = await sendMessage(user.id, selectedContactId, content, attachments);
    
    if (newMessage) {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  return {
    messages,
    isLoading,
    contactName,
    contactAvatar,
    handleSendMessage,
  };
};
