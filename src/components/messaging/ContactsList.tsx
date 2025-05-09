
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Connection {
  id: string;
  inviter_id: string;
  invitee_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface UnreadCount {
  [key: string]: number;
}

interface ContactsListProps {
  onContactSelect: (contactId: string) => void;
  selectedContactId: string | null;
}

const ContactsList: React.FC<ContactsListProps> = ({ onContactSelect, selectedContactId }) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount>({});
  const [loading, setLoading] = useState(true);

  // Fetch connections (accepted only)
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('connections')
          .select('*')
          .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
          .eq('status', 'accepted');
        
        if (error) throw error;
        
        if (data) {
          setConnections(data);
          
          // Get all contact user IDs
          const contactIds = data.map(connection => 
            connection.inviter_id === user.id ? connection.invitee_id : connection.inviter_id
          );
          
          // Fetch profiles for all contacts
          if (contactIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .in('id', contactIds);
            
            if (profilesError) throw profilesError;
            
            if (profilesData) {
              const profileMap: Record<string, Profile> = {};
              profilesData.forEach(profile => {
                profileMap[profile.id] = profile;
              });
              setProfiles(profileMap);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user?.id]);

  // Fetch unread message counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('sender_id, count')
          .eq('recipient_id', user.id)
          .eq('is_read', false)
          .group('sender_id');
        
        if (error) throw error;
        
        if (data) {
          const counts: UnreadCount = {};
          data.forEach(item => {
            counts[item.sender_id] = parseInt(item.count);
          });
          setUnreadCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching unread counts:', error);
      }
    };
    
    fetchUnreadCounts();

    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${user?.id}` 
        }, 
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  // Get the other user ID in a connection
  const getContactId = (connection: Connection) => {
    return connection.inviter_id === user?.id ? connection.invitee_id : connection.inviter_id;
  };

  // Get user initials for avatar fallback
  const getUserInitials = (profile: Profile | undefined) => {
    if (profile && profile.full_name) {
      const nameParts = profile.full_name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profile.full_name[0].toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You don't have any connections yet.</p>
        <p className="text-sm mt-2">Connect with other members to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {connections.map((connection) => {
        const contactId = getContactId(connection);
        const profile = profiles[contactId];
        const unreadCount = unreadCounts[contactId] || 0;
        
        return (
          <div 
            key={connection.id}
            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors
              ${selectedContactId === contactId ? 'bg-gray-100' : ''}`}
            onClick={() => onContactSelect(contactId)}
          >
            <Avatar>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile ? getUserInitials(profile) : 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">
                {profile?.full_name || 'Unknown User'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactsList;
