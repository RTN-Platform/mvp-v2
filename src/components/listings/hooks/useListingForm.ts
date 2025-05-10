
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Custom hook for handling listing form submission logic
 */
export const useListingForm = (listingType: 'accommodations' | 'experiences') => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    userId,
    data,
    imageUrls,
    coverImageIndex,
    amenities,
    isEditing,
    initialData,
    additionalFields = {}
  }: {
    userId: string | undefined;
    data: any;
    imageUrls: string[];
    coverImageIndex: number;
    amenities: string[];
    isEditing: boolean;
    initialData: any;
    additionalFields?: Record<string, any>;
  }) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to create a listing",
      });
      return false;
    }

    if (imageUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Images Required",
        description: "Please upload at least one image for your listing",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const coverImage = imageUrls[coverImageIndex];
      
      const listingData = {
        host_id: userId,
        ...data,
        amenities,
        cover_image: coverImage,
        images: imageUrls,
        ...additionalFields
      };

      let result;
      
      if (isEditing && initialData) {
        // Update existing listing
        const { data: updatedData, error } = await supabase
          .from(listingType)
          .update(listingData)
          .eq('id', initialData.id)
          .select()
          .single();
          
        if (error) throw error;
        result = updatedData;
        
        // Show different toast messages based on publish state
        if (data.is_published && !initialData.is_published) {
          toast({
            title: `${listingType === 'accommodations' ? 'Accommodation' : 'Experience'} Published`,
            description: `Your ${listingType === 'accommodations' ? 'accommodation' : 'experience'} is now live and visible to all users!`,
          });
        } else {
          toast({
            title: `${listingType === 'accommodations' ? 'Accommodation' : 'Experience'} Updated`,
            description: `Your ${listingType === 'accommodations' ? 'accommodation' : 'experience'} has been updated successfully!`,
          });
        }
      } else {
        // Create new listing
        const { data: newListing, error } = await supabase
          .from(listingType)
          .insert([listingData])
          .select()
          .single();
          
        if (error) throw error;
        result = newListing;
        
        if (data.is_published) {
          toast({
            title: `${listingType === 'accommodations' ? 'Accommodation' : 'Experience'} Published`,
            description: `Your ${listingType === 'accommodations' ? 'accommodation' : 'experience'} has been created and published successfully!`,
          });
        } else {
          toast({
            title: `${listingType === 'accommodations' ? 'Accommodation' : 'Experience'} Created`,
            description: `Your ${listingType === 'accommodations' ? 'accommodation' : 'experience'} has been saved as a draft.`,
          });
        }
      }

      navigate("/my-listings");
      return true;
    } catch (error: any) {
      console.error(`Error saving ${listingType === 'accommodations' ? 'accommodation' : 'experience'}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || `Failed to save ${listingType === 'accommodations' ? 'accommodation' : 'experience'}. Please try again.`,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};
