
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceFormSchema, ExperienceFormValues } from "../form/types";

interface UseExperienceFormProps {
  isEditing: boolean;
  initialData: any | null;
}

export const useExperienceForm = ({ 
  isEditing = false, 
  initialData = null 
}: UseExperienceFormProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [includedItems, setIncludedItems] = useState<string[]>([]);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price_per_person: 0,
      duration: 60,
      capacity: 5,
      requirements: "",
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
        price_per_person: initialData.price_per_person,
        duration: initialData.duration || 60,
        capacity: initialData.capacity || 5,
        requirements: initialData.requirements || "",
        is_published: initialData.is_published || false,
        booking_url: initialData.booking_url || "",
      });
      
      if (initialData.included_items && Array.isArray(initialData.included_items)) {
        setIncludedItems(initialData.included_items);
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
    includedItems,
    setIncludedItems
  };
};
