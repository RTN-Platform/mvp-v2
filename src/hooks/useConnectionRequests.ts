
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionRequest {
  id: string;
  inviter_id: string;
  message: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useConnectionRequests = () => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const { user } = useAuth();

  // Fetch connection requests
  const fetchConnectionRequests = useCallback(async (userId: string) => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('connections')
        .select(`
          id, 
          inviter_id,
          message, 
          created_at,
          profiles:inviter_id (id, full_name, avatar_url)
        `)
        .eq('invitee_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      
      return data as ConnectionRequest[] || [];
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      return [];
    }
  }, []);

  // Accept a connection request
  const handleAcceptConnection = useCallback(async (connectionId: string) => {
    if (!user) return false;
    
    try {
      // Update the connection status
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId)
        .eq('invitee_id', user.id);
      
      if (error) throw error;

      // Remove from connection requests list
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      return true;
    } catch (error) {
      console.error("Error accepting connection:", error);
      return false;
    }
  }, [user]);

  // Decline a connection request
  const handleDeclineConnection = useCallback(async (connectionId: string) => {
    if (!user) return false;
    
    try {
      // Delete the connection
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId)
        .eq('invitee_id', user.id);
      
      if (error) throw error;

      // Remove from connection requests list
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      return true;
    } catch (error) {
      console.error("Error declining connection:", error);
      return false;
    }
  }, [user]);

  // Load connection requests
  useEffect(() => {
    if (user) {
      (async () => {
        const requests = await fetchConnectionRequests(user.id);
        setConnectionRequests(requests);
        
        // Add realtime subscription for new connection requests
        const channel = supabase
          .channel('connections-changes')
          .on('postgres_changes', 
            {
              event: '*', 
              schema: 'public',
              table: 'connections',
              filter: `invitee_id=eq.${user.id}`
            },
            () => {
              fetchConnectionRequests(user.id).then(setConnectionRequests);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      })();
    }
  }, [user, fetchConnectionRequests]);

  return {
    connectionRequests,
    handleAcceptConnection,
    handleDeclineConnection
  };
};
