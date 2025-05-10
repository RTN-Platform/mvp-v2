
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accommodationFormSchema, AccommodationFormValues } from "../form/types";

interface UseAccommodationFormProps {
  isEditing: boolean;
  initialData: any | null;
}

export const useAccommodationForm = ({ 
  isEditing = false, 
  initialData = null 
}: UseAccommodationFormProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [amenities, setAmenities] = useState<string[]>([]);

  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price_per_night: 0,
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 1,
      house_rules: "",
      is_published: false,
      booking_url: "",
    },
  });

  // Load initial data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        price_per_night: initialData.price_per_night,
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        max_guests: initialData.max_guests,
        house_rules: initialData.house_rules || "",
        is_published: initialData.is_published || false,
        booking_url: initialData.booking_url || "",
      });
      
      if (initialData.amenities && Array.isArray(initialData.amenities)) {
        setAmenities(initialData.amenities);
      }
      
      if (initialData.images && Array.isArray(initialData.images)) {
        setImageUrls(initialData.images);
      }
      
      if (initialData.cover_image && initialData.images) {
        const coverIndex = initialData.images.findIndex((url: string) => url === initialData.cover_image);
        if (coverIndex !== -1) {
          setCoverImageIndex(coverIndex);
        }
      }
    }
  }, [isEditing, initialData, form]);

  return {
    form,
    imageUrls,
    setImageUrls,
    coverImageIndex,
    setCoverImageIndex,
    amenities,
    setAmenities
  };
};
