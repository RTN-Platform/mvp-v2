
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TribeMemberInterface } from "@/components/tribe/TribeMember";

export const useTribeMembers = () => {
  const [tribeMembers, setTribeMembers] = useState<TribeMemberInterface[]>([]);
  const [connectedMembers, setConnectedMembers] = useState<TribeMemberInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        console.log('Fetching tribe members and connections for user:', user.id);
        
        // Fetch all profiles except the current user's
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }
        
        console.log('Fetched profiles:', profiles?.length || 0);
        
        // Fetch all connections involving the current user
        const { data: userConnections, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`);
        
        if (connectionsError) {
          console.error('Error fetching connections:', connectionsError);
          throw connectionsError;
        }
        
        console.log('Fetched connections:', userConnections?.length || 0);

        // Process connections to identify connected and pending members
        const connectedIds = new Set<string>();
        const pendingIds = new Set<string>();
        
        userConnections?.forEach(connection => {
          const otherUserId = connection.inviter_id === user.id 
            ? connection.invitee_id 
            : connection.inviter_id;
          
          if (connection.status === 'accepted') {
            connectedIds.add(otherUserId);
          } else if (connection.status === 'pending' && connection.inviter_id === user.id) {
            pendingIds.add(otherUserId);
          }
        });
        
        console.log('Connected IDs:', Array.from(connectedIds));
        console.log('Pending IDs:', Array.from(pendingIds));

        // Process profiles to separate connected and unconnected users
        const connected: TribeMemberInterface[] = [];
        const unconnected: TribeMemberInterface[] = [];
        
        profiles?.forEach(profile => {
          const memberData = {
            id: profile.id,
            full_name: profile.full_name,
            location: profile.location,
            avatar_url: profile.avatar_url,
            interests: profile.interests || [],
            connection_status: pendingIds.has(profile.id) ? 'pending' : null
          };
          
          if (connectedIds.has(profile.id)) {
            connected.push(memberData);
          } else {
            unconnected.push(memberData);
          }
        });
        
        console.log('Connected members:', connected.length);
        console.log('Unconnected members:', unconnected.length);

        setConnectedMembers(connected);
        setTribeMembers(unconnected);
      } catch (error) {
        console.error('Error processing profiles and connections:', error);
        toast({
          title: "Error",
          description: "Failed to load tribe members. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();

    // Set up real-time subscription for connections
    const channel = supabase
      .channel('connections-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'connections'
        },
        (payload) => {
          console.log('Connections table changed:', payload);
          // Refresh data when connections change
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  function filterBySearchQuery(member: TribeMemberInterface) {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.location?.toLowerCase().includes(searchLower) ||
      member.interests.some(interest => interest.toLowerCase().includes(searchLower))
    );
  }

  const filteredConnectedMembers = connectedMembers.filter(filterBySearchQuery);
  const filteredUnconnectedMembers = tribeMembers.filter(filterBySearchQuery);

  return {
    connectedMembers: filteredConnectedMembers,
    unconnectedMembers: filteredUnconnectedMembers,
    isLoading,
    searchQuery,
    setSearchQuery
  };
};
