
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";

export const fetchMessages = async (userId: string, contactId: string) => {
  try {
    // Get all messages between current user and selected contact
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender_id')
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // If we have messages, fetch the sender info for each message
    if (data && data.length > 0) {
      const messagesWithSenders = await Promise.all(
        data.map(async (msg) => {
          // Get sender profile information
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', msg.sender_id)
            .single();
          
          if (senderError) {
            console.error('Error fetching sender:', senderError);
            return {
              ...msg,
              sender: {
                id: msg.sender_id,
                full_name: 'Unknown User',
                avatar_url: null
              }
            };
          }
          
          return {
            ...msg,
            sender: {
              id: senderData.id,
              full_name: senderData.full_name || 'Unknown User',
              avatar_url: senderData.avatar_url
            }
          };
        })
      );
      
      return messagesWithSenders as Message[];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const fetchContactDetails = async (contactId: string) => {
  if (!contactId) return { contactName: '', contactAvatar: null };
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', contactId)
      .single();

    if (error) throw error;

    return { 
      contactName: data.full_name || 'Unnamed User', 
      contactAvatar: data.avatar_url 
    };
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return { contactName: 'Unnamed User', contactAvatar: null };
  }
};

export const markMessagesAsRead = async (userId: string, contactId: string) => {
  if (!userId || !contactId) return;
  
  try {
    // Mark all messages from the selected contact as read
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', contactId)
      .eq('recipient_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

export const sendMessage = async (
  userId: string, 
  recipientId: string, 
  content: string, 
  attachments?: File[]
) => {
  if (!userId || !recipientId || !content.trim()) return null;
  
  try {
    const attachmentUrls: string[] = [];
    
    // Upload attachments if any
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `message_attachments/${userId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('messages')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('messages')
          .getPublicUrl(filePath);
          
        attachmentUrls.push(data.publicUrl);
      }
    }
    
    const newMessage = {
      sender_id: userId,
      recipient_id: recipientId,
      subject: 'Message',
      content: content,
      is_read: false,
      is_system: false,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : null
    };
    
    const { data: messageData, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select()
      .single();

    if (error) throw error;
    
    // Fetch the sender info
    const { data: senderData, error: senderError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .single();
      
    if (senderError) throw senderError;
    
    // Add the new message to the state
    const typedMessage: Message = {
      ...messageData,
      sender: {
        id: senderData.id,
        full_name: senderData.full_name || 'Unknown User',
        avatar_url: senderData.avatar_url
      }
    };
    
    return typedMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};
