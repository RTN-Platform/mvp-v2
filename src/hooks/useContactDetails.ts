
import { useState, useCallback } from 'react';
import { fetchContactDetails, markMessagesAsRead } from '@/services/messaging';

export const useContactDetails = (contactId: string | null) => {
  const [contactName, setContactName] = useState("");
  const [contactAvatar, setContactAvatar] = useState<string | null>(null);
  
  // Fetch contact details
  const fetchContactInfo = useCallback(async (id: string) => {
    try {
      const { contactName: name, contactAvatar: avatar } = await fetchContactDetails(id);
      setContactName(name);
      setContactAvatar(avatar);
      return { name, avatar };
    } catch (error) {
      console.error("Error fetching contact details:", error);
      return { name: "Unknown", avatar: null };
    }
  }, []);
  
  // Mark messages as read
  const markAsRead = useCallback(async (userId: string, id: string) => {
    try {
      await markMessagesAsRead(userId, id);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);
  
  return {
    contactName,
    contactAvatar,
    fetchContactInfo,
    markAsRead
  };
};
