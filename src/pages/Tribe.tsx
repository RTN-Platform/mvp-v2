
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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
  const tribeMembers = [
    {
      name: "Alex Johnson",
      location: "Zion National Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Hiking", "Photography", "Wildlife"]
    },
    {
      name: "Emma Wilson",
      location: "Yosemite Valley",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Trail Running", "Camping", "Bird Watching"]
    },
    {
      name: "Monica Smith",
      location: "Costa Rica",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Glamping", "Yoga", "Rainforest Tours"]
    },
    {
      name: "David Park",
      location: "Glacier National Park",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Fishing", "Backpacking", "Alpine Lakes"]
    },
    {
      name: "Sarah Chen",
      location: "Olympic National Park",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Kayaking", "Tree Identification", "Waterfall Hikes"]
    },
    {
      name: "Michael Torres",
      location: "Joshua Tree",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      interests: ["Desert Hiking", "Star Gazing", "Rock Climbing"]
    }
  ];

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Nature Tribe</h1>
          <p className="text-gray-600">
            Connect with fellow nature enthusiasts who share your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tribeMembers.map((member, index) => (
            <TribeMember key={index} {...member} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tribe;
