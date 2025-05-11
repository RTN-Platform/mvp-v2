
import { useState, useCallback } from 'react';
import { Message } from '@/types/message';
import { fetchMessages, sendMessage } from '@/services/messaging';

export const useMessagingContent = (userId: string | null, contactId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages
  const fetchMessagesData = useCallback(async (currentUserId: string, selectedContactId: string) => {
    try {
      const messagesData = await fetchMessages(currentUserId, selectedContactId);
      setMessages(messagesData);
      return messagesData;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }, []);

  // Send a new message
  const handleSendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!userId || !contactId) return null;
    
    try {
      const newMessage = await sendMessage(userId, contactId, content, attachments);
      
      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }, [userId, contactId]);

  return {
    messages,
    isLoading,
    setIsLoading,
    fetchMessagesData,
    handleSendMessage
  };
};
