
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TribeMember {
  id: string;
  full_name: string;
  location: string;
  avatar_url?: string;
  interests: string[];
}

const TribeMember = ({ name, location, avatar, interests }: { 
  name: string;
  location: string;
  avatar?: string;
  interests: string[];
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.split(' ').map(part => part[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span key={index} className="text-xs bg-nature-100 text-nature-800 px-2 py-1 rounded-full">
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      <Button variant="outline" className="w-full border-nature-300 text-nature-700 hover:bg-nature-50">
        Connect
      </Button>
    </Card>
  );
};

const Tribe: React.FC = () => {
  const [tribeMembers, setTribeMembers] = useState<TribeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;

        // Transform the data to match the TribeMember interface
        const formattedMembers = data.map((profile: any) => ({
          id: profile.id,
          full_name: profile.full_name || 'Anonymous User',
          location: profile.location || 'Unknown Location',
          avatar_url: profile.avatar_url,
          interests: profile.interests || []
        }));

        setTribeMembers(formattedMembers);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  // Filter tribe members based on search query
  const filteredMembers = tribeMembers.filter(member => {
    const searchString = searchQuery.toLowerCase();
    return (
      member.full_name.toLowerCase().includes(searchString) ||
      member.location.toLowerCase().includes(searchString) ||
      member.interests.some(interest => interest.toLowerCase().includes(searchString))
    );
  });

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Nature Tribe</h1>
          <p className="text-gray-600">
            Connect with fellow nature enthusiasts who share your interests
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tribe members by name, location or interests"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading tribe members...</div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, index) => (
              <TribeMember 
                key={member.id}
                name={member.full_name}
                location={member.location}
                avatar={member.avatar_url}
                interests={member.interests}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {searchQuery ? 'No tribe members found for your search.' : 'No tribe members yet.'}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Tribe;
