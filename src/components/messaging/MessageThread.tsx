
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  is_system: boolean;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface MessageThreadProps {
  recipientId: string;
  messagesUpdated: number; // This will be updated when a new message is sent
}

const MessageThread: React.FC<MessageThreadProps> = ({ recipientId, messagesUpdated }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Fetch messages between current user and recipient
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !recipientId) return;
      
      setLoading(true);
      
      try {
        // Get all messages between the two users
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data) {
          // Filter messages that are either from user to recipient or from recipient to user
          const filteredMessages = data.filter(msg => 
            (msg.sender_id === user.id && msg.recipient_id === recipientId) || 
            (msg.sender_id === recipientId && msg.recipient_id === user.id)
          );
          
          setMessages(filteredMessages);
          
          // Mark messages as read if they were sent to the current user
          const unreadMessageIds = filteredMessages
            .filter(msg => msg.recipient_id === user.id && !msg.is_read)
            .map(msg => msg.id);
          
          if (unreadMessageIds.length > 0) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .in('id', unreadMessageIds);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user?.id, recipientId, messagesUpdated]);

  // Fetch user profiles for sender and recipient
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user?.id || !recipientId) return;
      
      const userIds = [user.id, recipientId];
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
        
        if (error) throw error;
        
        if (data) {
          const profileMap: Record<string, Profile> = {};
          data.forEach(profile => {
            profileMap[profile.id] = profile;
          });
          setProfiles(profileMap);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    
    fetchProfiles();
  }, [user?.id, recipientId]);

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  // Get user name from profile data
  const getUserName = (userId: string) => {
    if (profiles[userId]) {
      return profiles[userId].full_name || 'Unknown User';
    }
    return 'Loading...';
  };

  // Get user avatar from profile data
  const getUserAvatar = (userId: string) => {
    if (profiles[userId]) {
      return profiles[userId].avatar_url;
    }
    return null;
  };

  // Get user initials for avatar fallback
  const getUserInitials = (userId: string) => {
    if (profiles[userId] && profiles[userId].full_name) {
      const nameParts = profiles[userId].full_name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profiles[userId].full_name[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No messages yet. Start the conversation by sending a message.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex gap-4 ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}`}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={getUserAvatar(message.sender_id) || undefined} />
            <AvatarFallback>{getUserInitials(message.sender_id)}</AvatarFallback>
          </Avatar>
          
          <div className={`space-y-1 max-w-[80%] ${message.sender_id === user?.id ? 'items-end' : ''}`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{getUserName(message.sender_id)}</span>
              <span className="text-gray-500 text-xs">{formatMessageTime(message.created_at)}</span>
            </div>
            
            <Card className={message.sender_id === user?.id ? 'bg-nature-50' : ''}>
              <CardContent className="p-3">
                <p className="font-semibold text-sm">{message.subject}</p>
                <p className="whitespace-pre-wrap mt-1">{message.content}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
