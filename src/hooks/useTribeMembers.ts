
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
        // First, fetch all profiles except the current user
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, location, bio, interests')
          .neq('id', user.id);

        if (profilesError) throw profilesError;

        // Then get all connections for current user
        const { data: connections, error: connectionsError } = await supabase
          .from('connections')
          .select('inviter_id, invitee_id, status')
          .or(`inviter_id.eq.${user.id},invitee_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (connectionsError) throw connectionsError;

        // Create a Set of connected user IDs
        const connectedIds = new Set<string>();
        
        if (connections) {
          connections.forEach(connection => {
            // If user is the inviter, add the invitee to connected IDs
            if (connection.inviter_id === user.id) {
              connectedIds.add(connection.invitee_id);
            } 
            // If user is the invitee, add the inviter to connected IDs
            else if (connection.invitee_id === user.id) {
              connectedIds.add(connection.inviter_id);
            }
          });
        }

        // Process all profiles and separate into connected and unconnected
        const connected: TribeMember[] = [];
        const unconnected: TribeMember[] = [];
        
        if (allProfiles) {
          allProfiles.forEach(profile => {
            const memberData: TribeMember = {
              id: profile.id,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              location: profile.location,
              bio: profile.bio,
              interests: profile.interests,
              connected: connectedIds.has(profile.id)
            };
            
            if (connectedIds.has(profile.id)) {
              connected.push(memberData);
            } else {
              unconnected.push(memberData);
            }
          });
        }

        setConnectedMembers(connected);
        setUnconnectedMembers(unconnected);
        
        console.log(`Loaded ${connected.length} connected members and ${unconnected.length} unconnected members`);
      } catch (error) {
        console.error('Error fetching tribe members:', error);
        // Fallback to mock data if there's an error
        setConnectedMembers([
          {
            id: '1',
            full_name: 'Jane Smith',
            avatar_url: 'https://i.pravatar.cc/150?img=1',
            location: 'Portland, OR',
            connected: true,
            interests: ['Hiking', 'Camping', 'Photography']
          }
        ]);
        
        setUnconnectedMembers([
          {
            id: '2',
            full_name: 'John Doe',
            avatar_url: 'https://i.pravatar.cc/150?img=2',
            location: 'Seattle, WA',
            connected: false,
            interests: ['Kayaking', 'Bird Watching']
          }
        ]);
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
          interest?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : connectedMembers;

  const filteredUnconnectedMembers = searchQuery
    ? unconnectedMembers.filter(member => 
        member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.interests?.some(interest => 
          interest?.toLowerCase().includes(searchQuery.toLowerCase())
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
