
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Hash, MapPin, MessageSquare, Clock, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface MemberProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  interests: string[] | null;
  role: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'accommodation' | 'experience';
  price: number;
  location: string;
  cover_image?: string;
}

const MemberProfile: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [hostListings, setHostListings] = useState<{ accommodations: Listing[], experiences: Listing[] }>({
    accommodations: [],
    experiences: []
  });
  const [activeTab, setActiveTab] = useState<"accommodations" | "experiences">("accommodations");

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        if (!memberId) return;
        
        setIsLoading(true);
        console.log('Fetching profile for member:', memberId);
        
        // Fetch the member's profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', memberId)
          .single();
        
        if (error) {
          console.error('Error fetching member profile:', error);
          throw error;
        }
        
        if (!data) {
          console.error('Member profile not found');
          navigate('/tribe');
          return;
        }
        
        console.log('Fetched member profile:', data);
        setProfile(data);
        
        // Fetch recent activities (this would be replaced with actual data in a real implementation)
        // In a real app, you'd fetch this from a dedicated activities table
        setRecentActivities([
          {
            id: '1',
            type: 'post',
            title: 'Shared a hiking experience',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Beautiful trail at Banff National Park'
          },
          {
            id: '2',
            type: 'booking',
            title: 'Booked a camping trip',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'connection',
            title: 'Connected with Jane Doe',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
        
        // Only fetch listings if the member is a host
        if (data.role === 'host' || data.role === 'admin') {
          // Fetch accommodations
          const { data: accommodations, error: accommodationsError } = await supabase
            .from('accommodations')
            .select('id, title, description, location, price_per_night, cover_image')
            .eq('host_id', memberId)
            .eq('is_published', true);
          
          if (accommodationsError) {
            console.error('Error fetching accommodations:', accommodationsError);
          } else {
            console.log('Fetched accommodations:', accommodations?.length || 0);
            setHostListings(prev => ({
              ...prev,
              accommodations: accommodations?.map(acc => ({
                id: acc.id,
                title: acc.title,
                description: acc.description,
                type: 'accommodation' as const,
                price: acc.price_per_night,
                location: acc.location,
                cover_image: acc.cover_image || undefined
              })) || []
            }));
          }
          
          // Fetch experiences
          const { data: experiences, error: experiencesError } = await supabase
            .from('experiences')
            .select('id, title, description, location, price_per_person, cover_image')
            .eq('host_id', memberId)
            .eq('is_published', true);
          
          if (experiencesError) {
            console.error('Error fetching experiences:', experiencesError);
          } else {
            console.log('Fetched experiences:', experiences?.length || 0);
            setHostListings(prev => ({
              ...prev,
              experiences: experiences?.map(exp => ({
                id: exp.id,
                title: exp.title,
                description: exp.description,
                type: 'experience' as const,
                price: exp.price_per_person,
                location: exp.location,
                cover_image: exp.cover_image || undefined
              })) || []
            }));
          }
        }
        
      } catch (error) {
        console.error('Error in fetchMemberProfile:', error);
        toast({
          title: "Error",
          description: "Failed to load member profile. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberProfile();
  }, [memberId, navigate, toast]);
  
  const handleSendMessage = () => {
    // This would be implemented in a future feature
    toast({
      title: "Coming Soon",
      description: "Messaging functionality will be available soon!",
    });
  };
  
  const getFirstName = () => {
    if (!profile?.full_name) return '';
    return profile.full_name.split(' ')[0];
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-500"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!profile) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The member profile you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tribe')}>Back to Tribe</Button>
        </div>
      </MainLayout>
    );
  }

  const isHost = profile.role === 'host' || profile.role === 'admin';
  const hasListings = hostListings.accommodations.length > 0 || hostListings.experiences.length > 0;
  
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left side - Avatar */}
              <div className="flex-shrink-0 flex justify-center md:justify-start">
                <Avatar className="h-24 w-24 md:h-32 md:w-32">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || "Member"} />
                  <AvatarFallback className="bg-nature-200 text-nature-700 text-lg">
                    {profile.full_name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Right side - Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.full_name || "Unnamed Member"}
                </h1>
                
                {profile.username && (
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                )}
                
                {profile.location && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={16} className="mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {/* Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="flex items-center text-xs bg-nature-100 text-nature-800 px-2 py-1 rounded-full"
                      >
                        <Hash className="h-3 w-3 mr-1" strokeWidth={2.5} />
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 italic">No interests shared</span>
                  )}
                </div>
                
                {/* Connect button for users who aren't connected yet */}
                <Button 
                  variant="outline" 
                  className="border-nature-300 text-nature-700 hover:bg-nature-50"
                  onClick={handleSendMessage}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">About {getFirstName()}</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.bio ? (
              <p className="text-gray-700">{profile.bio}</p>
            ) : (
              <p className="text-gray-500 italic">No bio provided</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activities Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.slice(0, 6).map((activity) => (
                  <li key={activity.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="bg-nature-100 p-2 rounded-full text-nature-600">
                        <Clock size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-4 text-gray-500">No recent activities</p>
            )}
          </CardContent>
        </Card>
        
        {/* Host Listings Section (conditional) */}
        {isHost && hasListings && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Listings by {getFirstName()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="accommodations" onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
                  <TabsTrigger value="experiences">Experiences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="accommodations">
                  {hostListings.accommodations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hostListings.accommodations.map(listing => (
                        <Card key={listing.id} className="overflow-hidden">
                          <div className="aspect-video bg-gray-100 relative">
                            {listing.cover_image ? (
                              <img 
                                src={listing.cover_image} 
                                alt={listing.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-nature-100 text-nature-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-800 mb-1">{listing.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin size={14} className="mr-1" />
                              {listing.location}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                            <div className="mt-2 font-medium text-nature-700">${listing.price}/night</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No accommodations available</p>
                  )}
                </TabsContent>
                
                <TabsContent value="experiences">
                  {hostListings.experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hostListings.experiences.map(listing => (
                        <Card key={listing.id} className="overflow-hidden">
                          <div className="aspect-video bg-gray-100 relative">
                            {listing.cover_image ? (
                              <img 
                                src={listing.cover_image} 
                                alt={listing.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-nature-100 text-nature-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-800 mb-1">{listing.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin size={14} className="mr-1" />
                              {listing.location}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                            <div className="mt-2 font-medium text-nature-700">${listing.price}/person</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No experiences available</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default MemberProfile;
