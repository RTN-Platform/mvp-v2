
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Profile: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/lovable-uploads/292b9d72-6ede-4ba4-9656-1ab4970d7f8f.png" alt="Rachel Green" />
            <AvatarFallback>RG</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Rachel Green</h1>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin size={16} className="mr-1" />
              <span>Banff National Park, AB</span>
            </div>
            <p className="text-gray-700 mb-4">
              Nature enthusiast and outdoor adventurer. Always seeking the next beautiful trail.
            </p>
            <Button className="bg-nature-600 hover:bg-nature-700 text-white">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">My Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">24</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">42</div>
            <div className="text-sm text-gray-600">Hikes</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">315</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="bg-nature-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-nature-700">198</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 py-8">
        This is a placeholder profile page.
      </div>
    </MainLayout>
  );
};

export default Profile;
