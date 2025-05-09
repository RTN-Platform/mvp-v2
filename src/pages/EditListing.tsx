
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AccommodationForm from "@/components/listings/AccommodationForm";
import ExperienceForm from "@/components/listings/ExperienceForm";
import { isHost } from "@/utils/roles";

const EditListing: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [listingData, setListingData] = useState<any>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    // Redirect if user is not authenticated or not a host/admin
    if (!user || (profile && !isHost(profile))) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be a host to edit listings.",
      });
      navigate("/");
      return;
    }

    const fetchListing = async () => {
      if (!id || !type) {
        toast({
          variant: "destructive",
          title: "Invalid parameters",
          description: "Could not find the listing to edit.",
        });
        navigate("/my-listings");
        return;
      }

      setIsLoading(true);

      try {
        const table = type === 'accommodation' ? 'accommodations' : 'experiences';
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Check if the user has permission to edit this listing
        if (data.host_id !== user.id && profile?.role !== 'admin') {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You can only edit your own listings.",
          });
          navigate("/my-listings");
          return;
        }
        
        setListingData(data);
      } catch (error: any) {
        console.error('Error fetching listing:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not load the listing data."
        });
        navigate("/my-listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, type, user, profile, navigate, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/my-listings")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit {type === 'accommodation' ? 'Accommodation' : 'Experience'}</h1>
        </div>

        {type === 'accommodation' ? (
          <AccommodationForm isEditing={true} initialData={listingData} />
        ) : (
          <ExperienceForm isEditing={true} initialData={listingData} />
        )}
      </div>
    </MainLayout>
  );
};

export default EditListing;
