
import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/message';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMessages, fetchContactDetails, markMessagesAsRead, sendMessage } from '@/services/messaging';

export const useMessaging = (selectedContactId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactAvatar, setContactAvatar] = useState<string | null>(null);
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

  // Mark messages as read function
  const markAsRead = useCallback(async (userId: string, contactId: string) => {
    try {
      await markMessagesAsRead(userId, contactId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

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

  return {
    messages,
    isLoading,
    contactName,
    contactAvatar,
    handleSendMessage,
  };
};
