
import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConnectionRequests } from './useConnectionRequests';
import { useContactDetails } from './useContactDetails';
import { useMessagingContent } from './useMessagingContent';

export const useMessaging = (selectedContactId: string | null) => {
  const { user } = useAuth();
  
  // Use our specialized hooks
  const { 
    connectionRequests, 
    handleAcceptConnection, 
    handleDeclineConnection 
  } = useConnectionRequests();
  
  const {
    contactName,
    contactAvatar,
    fetchContactInfo,
    markAsRead
  } = useContactDetails(selectedContactId);
  
  const {
    messages,
    isLoading,
    setIsLoading,
    fetchMessagesData,
    handleSendMessage
  } = useMessagingContent(user?.id || null, selectedContactId);

  // Combined load messages function
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
  }, [user, selectedContactId, fetchContactInfo, fetchMessagesData, markAsRead, setIsLoading]);

  // Load all data when contact is selected
  useEffect(() => {
    if (user && selectedContactId) {
      loadMessages();
    }
  }, [user, selectedContactId, loadMessages]);

  return {
    messages,
    isLoading,
    contactName,
    contactAvatar,
    connectionRequests,
    handleSendMessage,
    handleAcceptConnection,
    handleDeclineConnection
  };
};
