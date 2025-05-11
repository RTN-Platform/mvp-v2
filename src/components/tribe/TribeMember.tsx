
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, User, Hash, UserCheck, Clock } from "lucide-react";

export interface TribeMemberInterface {
  id: string;
  full_name: string | null;
  location: string | null;
  avatar_url?: string | null;
  interests: string[];
  connection_status?: string;
}

interface TribeMemberProps {
  member: TribeMemberInterface;
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

export default TribeMember;
