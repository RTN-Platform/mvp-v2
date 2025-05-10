
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { isHost, isAdmin } from "@/utils/roles";
import { supabase } from "@/integrations/supabase/client";
import DeleteConfirmationDialog from "@/components/listings/dialogs/DeleteConfirmationDialog";
import MyListingsContent from "@/components/listings/MyListingsContent";

const MyListings: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [accommodations, setAccommodations] = useState([]);
  const [experiences, setExperiences] = useState([]);
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

  const handleEditListing = (id: string, type: 'accommodation' | 'experience') => {
    navigate(`/edit-listing/${type}/${id}`);
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

        <MyListingsContent 
          isLoading={isLoading}
          isAdminUser={isAdminUser}
          accommodations={accommodations}
          experiences={experiences}
          onEditListing={handleEditListing}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      <DeleteConfirmationDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        entityType={itemToDelete?.type}
      />
    </MainLayout>
  );
};

export default MyListings;
