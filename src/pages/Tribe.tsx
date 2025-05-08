
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search, Clock, User, Hash, Users, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ConnectModal } from "@/components/tribe/ConnectModal";
import { useToast } from "@/hooks/use-toast";

interface TribeMember {
  id: string;
  full_name: string | null;
  location: string | null;
  avatar_url?: string | null;
  interests: string[];
  connection_status?: string;
}

interface TribeMemberProps {
  member: TribeMember;
  onConnect: (memberId: string) => void;
  isConnected?: boolean;
}

const TribeMember: React.FC<TribeMemberProps> = ({ member, onConnect, isConnected = false }) => {
  const isPending = member.connection_status === 'pending';
  const displayName = member.full_name || 'No Name Provided';
  const location = member.location || 'Location Unknown';
  // Get up to 3 interests to display
  const topInterests = member.interests?.slice(0, 3) || [];
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-3">
        <Avatar>
          <AvatarImage src={member.avatar_url || undefined} alt={displayName} />
          <AvatarFallback>
            {displayName.split(' ').map(part => part[0]).join('') || <User size={16} />}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link to={`/member/${member.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-nature-700">{displayName}</h3>
          </Link>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        {topInterests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {topInterests.map((interest, index) => (
              <span key={index} className="flex items-center text-xs bg-nature-100 text-nature-800 px-2 py-1 rounded-full">
                <Hash className="h-3 w-3 mr-1" strokeWidth={2.5} />
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No interests shared yet</p>
        )}
      </div>
      
      {isConnected ? (
        <Button 
          variant="outline" 
          className="w-full border-green-300 text-green-700 bg-green-50 hover:bg-green-100 cursor-default"
          disabled
        >
          <UserCheck size={16} className="mr-2" />
          Connected
        </Button>
      ) : isPending ? (
        <Button 
          variant="outline" 
          className="w-full border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 cursor-default"
          disabled
        >
          <Clock size={16} className="mr-2" />
          Request Pending
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="w-full border-nature-300 text-nature-700 hover:bg-nature-50"
          onClick={() => onConnect(member.id)}
        >
          Connect
        </Button>
      )}
    </Card>
  );
};

const Tribe: React.FC = () => {
  const [tribeMembers, setTribeMembers] = useState<TribeMember[]>([]);
  const [connectedMembers, setConnectedMembers] = useState<TribeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"connected" | "discover">("connected"); // Changed default tab
  const [connectingTo, setConnectingTo] = useState<TribeMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        const connected: TribeMember[] = [];
        const unconnected: TribeMember[] = [];
        
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
  }, [user]);

  // Filter members based on search query
  const filteredMembers = activeTab === "connected" 
    ? connectedMembers.filter(filterBySearchQuery)
    : tribeMembers.filter(filterBySearchQuery);

  function filterBySearchQuery(member: TribeMember) {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.location?.toLowerCase().includes(searchLower) ||
      member.interests.some(interest => interest.toLowerCase().includes(searchLower))
    );
  }

  const handleConnect = (memberId: string) => {
    const member = tribeMembers.find(m => m.id === memberId);
    if (member) {
      setConnectingTo(member);
      setIsModalOpen(true);
    }
  };

  const handleSendRequest = async (message: string) => {
    if (!user || !connectingTo) return;
    
    try {
      console.log('Sending connection request to:', connectingTo.id);
      console.log('Message:', message);
      
      const { data, error } = await supabase
        .from('connections')
        .insert([
          { inviter_id: user.id, invitee_id: connectingTo.id, message, status: 'pending' }
        ]);
      
      if (error) {
        if (error.message.includes('Rate limit exceeded')) {
          toast({
            title: "Rate Limit Exceeded",
            description: "You can only send 3 connection requests per hour.",
            variant: "destructive"
          });
        } else if (error.message.includes('unique constraint')) {
          toast({
            title: "Request Already Sent",
            description: "You've already sent a connection request to this person.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send connection request. Please try again.",
            variant: "destructive"
          });
        }
        console.error('Error sending connection request:', error);
        return;
      }

      console.log('Connection request sent successfully');
      
      // Optimistically update UI
      setTribeMembers(prev => prev.map(member => 
        member.id === connectingTo.id 
          ? {...member, connection_status: 'pending'}
          : member
      ));
      
      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${connectingTo.full_name || 'this user'}.`,
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Nature Tribe</h1>
          <p className="text-gray-600">
            Connect with fellow nature enthusiasts who share your interests
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "connected" | "discover")}>
          <TabsList className="mb-6">
            <TabsTrigger value="connected" className="flex items-center gap-2">
              <UserCheck size={16} /> My Connections
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Users size={16} /> Discover Members
            </TabsTrigger>
          </TabsList>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={`Search ${activeTab === 'connected' ? 'connections' : 'tribe members'} by name, location or interests`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <TabsContent value="connected">
            {isLoading ? (
              <div className="text-center py-8">Loading your connections...</div>
            ) : connectedMembers.length > 0 ? (
              <>
                {filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMembers.map((member) => (
                      <TribeMember 
                        key={member.id}
                        member={member}
                        onConnect={handleConnect}
                        isConnected={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    No connections found for your search.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                You don't have any connections yet. Discover and connect with other tribe members.
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover">
            {isLoading ? (
              <div className="text-center py-8">Loading tribe members...</div>
            ) : tribeMembers.length > 0 ? (
              <>
                {filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMembers.map((member) => (
                      <TribeMember 
                        key={member.id}
                        member={member}
                        onConnect={handleConnect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    No tribe members found for your search.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                No new tribe members to discover at the moment.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {connectingTo && (
        <ConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={connectingTo}
          onSendRequest={handleSendRequest}
        />
      )}
    </MainLayout>
  );
};

export default Tribe;
