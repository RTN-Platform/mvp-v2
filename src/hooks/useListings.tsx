
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/utils/roles";

export const useListings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [accommodations, setAccommodations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isAdminUser = profile ? isAdmin(profile) : false;

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

  // Delete a listing
  const deleteListing = async (id: string, type: 'accommodation' | 'experience') => {
    try {
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
      
      return true;
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete item",
        description: error.message,
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && profile) {
      fetchListings();
    }
  }, [user, profile]);

  return {
    isLoading,
    accommodations,
    experiences,
    isAdminUser,
    fetchListings,
    deleteListing
  };
};
