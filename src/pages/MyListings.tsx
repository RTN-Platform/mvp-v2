
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, MapPin, Trash2, Plus, Building, Tent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { isHost } from "@/utils/roles";
import { Spinner } from "@/components/ui/spinner";

const MyListings: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"accommodations" | "experiences">("accommodations");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // This is just example data - in a real implementation, we'd fetch from Supabase
  const [accommodations] = useState([
    {
      id: "acc1",
      title: "Mountain View Cabin",
      location: "Rocky Mountains, CO",
      description: "A cozy cabin with stunning mountain views",
      cover_image: "https://picsum.photos/seed/cabin1/400/300",
      price_per_night: 150,
      is_published: true
    },
    {
      id: "acc2",
      title: "Beachfront Bungalow",
      location: "Malibu, CA",
      description: "Luxurious bungalow steps from the ocean",
      cover_image: "https://picsum.photos/seed/beach1/400/300",
      price_per_night: 280,
      is_published: false
    }
  ]);

  const [experiences] = useState([
    {
      id: "exp1",
      title: "Forest Meditation Retreat",
      location: "Redwood National Park, CA",
      description: "A guided meditation experience in ancient forests",
      cover_image: "https://picsum.photos/seed/forest1/400/300",
      price_per_person: 75,
      is_published: true
    }
  ]);

  useEffect(() => {
    // In a real implementation, we'd fetch the user's listings from Supabase here
    const fetchListings = async () => {
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    fetchListings();
    
    // Redirect if user is not a host
    if (user && profile && !isHost(profile)) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be a host to access this page.",
      });
      navigate("/");
    }
  }, [user, profile, navigate]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your accommodations and experiences</p>
          </div>
          <Button 
            className="bg-nature-600 hover:bg-nature-700"
            onClick={() => navigate("/create-listing")}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Listing
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList>
            <TabsTrigger value="accommodations" className="flex items-center">
              <Building className="mr-2 h-4 w-4" /> Accommodations
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center">
              <Tent className="mr-2 h-4 w-4" /> Experiences
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="accommodations">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : accommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accommodations.map((accommodation) => (
                    <Card key={accommodation.id}>
                      <div className="relative">
                        <img 
                          src={accommodation.cover_image} 
                          alt={accommodation.title} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!accommodation.is_published && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Draft
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg">{accommodation.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{accommodation.location}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{accommodation.description}</p>
                        <p className="mt-2 font-semibold">${accommodation.price_per_night} per night</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-3 pt-0">
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                        <Button variant="default" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Building className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">No Accommodations Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your space with nature lovers around the world.
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/create-listing?type=accommodation")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Accommodation
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="experiences">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : experiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experiences.map((experience) => (
                    <Card key={experience.id}>
                      <div className="relative">
                        <img 
                          src={experience.cover_image} 
                          alt={experience.title} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!experience.is_published && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Draft
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg">{experience.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{experience.location}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{experience.description}</p>
                        <p className="mt-2 font-semibold">${experience.price_per_person} per person</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-3 pt-0">
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                        <Button variant="default" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Tent className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">No Experiences Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Share your expertise and connect travelers with nature.
                  </p>
                  <Button 
                    variant="default"
                    onClick={() => navigate("/create-listing?type=experience")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MyListings;
