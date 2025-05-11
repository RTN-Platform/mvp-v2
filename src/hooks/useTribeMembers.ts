
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
        // Fix the join syntax to use correct foreign key references
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select(`
            id,
            status,
            invitee_id,
            profiles:invitee_id(
              id, full_name, avatar_url, location, bio, interests
            )
          `)
          .eq('inviter_id', user.id)
          .eq('status', 'accepted');

        if (connectionsError) throw connectionsError;

        // Also get connections where the user is the invitee
        const { data: inviteeData, error: inviteeError } = await supabase
          .from('connections')
          .select(`
            id,
            status,
            inviter_id,
            profiles:inviter_id(
              id, full_name, avatar_url, location, bio, interests
            )
          `)
          .eq('invitee_id', user.id)
          .eq('status', 'accepted');

        if (inviteeError) throw inviteeError;

        // Get all profiles except the current user for potential connections
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, location, bio, interests')
          .neq('id', user.id);

        if (profilesError) throw profilesError;

        // Process connected members
        const connected: TribeMember[] = [];
        
        // Process connections where user is inviter
        if (connectionsData) {
          connectionsData.forEach(connection => {
            if (connection.profiles) {
              connected.push({
                id: connection.profiles.id,
                full_name: connection.profiles.full_name,
                avatar_url: connection.profiles.avatar_url,
                location: connection.profiles.location,
                bio: connection.profiles.bio,
                interests: connection.profiles.interests,
                connected: true
              });
            }
          });
        }
        
        // Process connections where user is invitee
        if (inviteeData) {
          inviteeData.forEach(connection => {
            if (connection.profiles) {
              connected.push({
                id: connection.profiles.id,
                full_name: connection.profiles.full_name,
                avatar_url: connection.profiles.avatar_url,
                location: connection.profiles.location,
                bio: connection.profiles.bio,
                interests: connection.profiles.interests,
                connected: true
              });
            }
          });
        }

        // Process unconnected members (exclude already connected ones)
        const connectedIds = new Set(connected.map(member => member.id));
        const unconnected: TribeMember[] = allProfiles
          ? allProfiles
              .filter(profile => !connectedIds.has(profile.id))
              .map(profile => ({
                id: profile.id,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                location: profile.location,
                bio: profile.bio,
                interests: profile.interests,
                connected: false
              }))
          : [];

        setConnectedMembers(connected);
        setUnconnectedMembers(unconnected);
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
