
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, MapPin, Trash2, Plus, Building, Tent, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { isHost, isAdmin } from "@/utils/roles";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Accommodation = {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_night: number;
  is_published: boolean;
  host_id: string;
};

type Experience = {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_person: number;
  is_published: boolean;
  host_id: string;
};

const MyListings: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"accommodations" | "experiences">("accommodations");
  const [isLoading, setIsLoading] = useState(true);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'accommodation' | 'experience' } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isAdminUser = profile ? isAdmin(profile) : false;

  useEffect(() => {
    if (user && profile) {
      fetchListings();
    }
    
    // Redirect if user is not a host or admin
    if (user && profile && !isHost(profile)) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be a host to access this page.",
      });
      navigate("/");
    }
  }, [user, profile, navigate]);

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      // Fetch accommodations - admin sees all, host sees only their own
      const accommodationsQuery = supabase
        .from('accommodations')
        .select('*');
      
      // For non-admin users, filter by host_id
      if (!isAdminUser && profile) {
        accommodationsQuery.eq('host_id', profile.id);
      }

      const { data: accommodationsData, error: accommodationsError } = await accommodationsQuery;

      if (accommodationsError) throw accommodationsError;
      setAccommodations(accommodationsData);

      // Fetch experiences - admin sees all, host sees only their own
      const experiencesQuery = supabase
        .from('experiences')
        .select('*');
      
      // For non-admin users, filter by host_id
      if (!isAdminUser && profile) {
        experiencesQuery.eq('host_id', profile.id);
      }

      const { data: experiencesData, error: experiencesError } = await experiencesQuery;

      if (experiencesError) throw experiencesError;
      setExperiences(experiencesData);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast({
        variant: "destructive",
        title: "Failed to load listings",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string, type: 'accommodation' | 'experience') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const { id, type } = itemToDelete;
      const table = type === 'accommodation' ? 'accommodations' : 'experiences';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state to remove the deleted item
      if (type === 'accommodation') {
        setAccommodations(prev => prev.filter(item => item.id !== id));
      } else {
        setExperiences(prev => prev.filter(item => item.id !== id));
      }

      toast({
        title: "Item deleted",
        description: `The ${type} has been successfully deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete item",
        description: error.message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const getHostName = async (hostId: string): Promise<string> => {
    if (!isAdminUser) return "You"; // If not admin, it's the current user

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', hostId)
        .single();

      if (error || !data) return "Unknown Host";
      return data.full_name || "Unnamed Host";
    } catch {
      return "Unknown Host";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdminUser ? "All Listings" : "My Listings"}
            </h1>
            <p className="text-gray-600">
              {isAdminUser 
                ? "View and manage all host listings across the platform" 
                : "Manage your accommodations and experiences"}
            </p>
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
                          src={accommodation.cover_image || 'https://picsum.photos/seed/cabin1/400/300'} 
                          alt={accommodation.title} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!accommodation.is_published && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Draft
                          </div>
                        )}
                        {isAdminUser && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
                            <span className="truncate max-w-[150px]">Host: {accommodation.host_id}</span>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(accommodation.id, 'accommodation')}
                        >
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
                    {isAdminUser 
                      ? "There are no accommodations listed on the platform yet."
                      : "Start sharing your space with nature lovers around the world."}
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
                          src={experience.cover_image || 'https://picsum.photos/seed/forest1/400/300'} 
                          alt={experience.title} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        {!experience.is_published && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Draft
                          </div>
                        )}
                        {isAdminUser && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
                            <span className="truncate max-w-[150px]">Host: {experience.host_id}</span>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClick(experience.id, 'experience')}
                        >
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
                    {isAdminUser 
                      ? "There are no experiences listed on the platform yet."
                      : "Share your expertise and connect travelers with nature."}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MyListings;
