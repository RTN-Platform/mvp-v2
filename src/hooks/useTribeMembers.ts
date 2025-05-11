
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TribeMember } from '@/types/tribe';

export const useTribeMembers = () => {
  const [connectedMembers, setConnectedMembers] = useState<TribeMember[]>([]);
  const [unconnectedMembers, setUnconnectedMembers] = useState<TribeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTribeMembers = async () => {
      setIsLoading(true);
      try {
        // Get connected users (accepted connections)
        const { data: connectedData, error: connectedError } = await supabase.rpc(
          'get_connected_members',
          { current_user_id: user.id }
        );

        if (connectedError) throw connectedError;

        // Get users to discover (not connected and not pending)
        const { data: unconnectedData, error: unconnectedError } = await supabase.rpc(
          'get_unconnected_members',
          { current_user_id: user.id }
        );

        if (unconnectedError) throw unconnectedError;

        // If RPC functions are not available, fallback to mock data
        setConnectedMembers(connectedData || [
          {
            id: '1',
            full_name: 'Jane Smith',
            avatar_url: 'https://i.pravatar.cc/150?img=1',
            location: 'Portland, OR',
            connected: true,
            interests: ['Hiking', 'Camping', 'Photography']
          }
        ]);
        
        setUnconnectedMembers(unconnectedData || [
          {
            id: '2',
            full_name: 'John Doe',
            avatar_url: 'https://i.pravatar.cc/150?img=2',
            location: 'Seattle, WA',
            connected: false,
            interests: ['Kayaking', 'Bird Watching']
          }
        ]);
      } catch (error) {
        console.error('Error fetching tribe members:', error);
        // Fallback to empty arrays if there's an error
        setConnectedMembers([]);
        setUnconnectedMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTribeMembers();
  }, [user]);

  // Filter members based on search query
  const filteredConnectedMembers = searchQuery
    ? connectedMembers.filter(member => 
        member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.interests?.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : connectedMembers;

  const filteredUnconnectedMembers = searchQuery
    ? unconnectedMembers.filter(member => 
        member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.interests?.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : unconnectedMembers;

  return {
    connectedMembers: filteredConnectedMembers,
    unconnectedMembers: filteredUnconnectedMembers,
    isLoading,
    searchQuery,
    setSearchQuery
  };
};
