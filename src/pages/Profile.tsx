
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Edit, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-6">
        {!user ? (
          // Show login prompt if not logged in
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-nature-600 hover:bg-nature-700"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Profile Header Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name} />
                  <AvatarFallback className="bg-nature-200 text-nature-700 text-lg">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile?.full_name || "New User"}
                  </h1>
                  
                  {profile?.username && (
                    <p className="text-gray-600 mb-2">@{profile.username}</p>
                  )}
                  
                  {profile?.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin size={16} className="mr-1" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-4">
                    {profile?.bio || "No bio yet. Edit your profile to add a bio."}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline"
                      className="border-nature-600 text-nature-700 hover:bg-nature-50"
                      onClick={() => navigate("/edit-profile")}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
