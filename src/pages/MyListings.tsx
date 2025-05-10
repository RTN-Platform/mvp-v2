
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { isHost } from "@/utils/roles";
import DeleteConfirmationDialog from "@/components/listings/dialogs/DeleteConfirmationDialog";
import MyListingsContent from "@/components/listings/MyListingsContent";
import MyListingsHeader from "@/components/listings/MyListingsHeader";
import { useListings } from "@/hooks/useListings";

const MyListings: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'accommodation' | 'experience' } | null>(null);
  
  const { 
    isLoading, 
    accommodations, 
    experiences, 
    isAdminUser,
    deleteListing
  } = useListings();

  useEffect(() => {
    // Redirect if user is not a host or admin
    if (user && profile && !isHost(profile)) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be a host to access this page.",
      });
      navigate("/");
    }
  }, [user, profile, navigate, toast]);

  const handleDeleteClick = (id: string, type: 'accommodation' | 'experience') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    const success = await deleteListing(itemToDelete.id, itemToDelete.type);
    
    if (success) {
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
        <MyListingsHeader isAdminUser={isAdminUser} />

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
