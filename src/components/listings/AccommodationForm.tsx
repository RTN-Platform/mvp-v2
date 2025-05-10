
import React from "react";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { AccommodationFormValues } from "./form/types";
import { useAccommodationForm } from "./hooks/useAccommodationForm";
import { useListingForm } from "./hooks/useListingForm";
import AccommodationFormLayout from "./form/AccommodationFormLayout";

interface AccommodationFormProps {
  isEditing?: boolean;
  initialData?: any;
}

const AccommodationForm: React.FC<AccommodationFormProps> = ({ 
  isEditing = false, 
  initialData = null 
}) => {
  const { user } = useAuth();
  const { 
    form, 
    imageUrls, 
    setImageUrls, 
    coverImageIndex, 
    setCoverImageIndex, 
    amenities, 
    setAmenities 
  } = useAccommodationForm({ isEditing, initialData });
  
  const { isSubmitting, handleSubmit } = useListingForm('accommodations');

  const onSubmit = async (data: AccommodationFormValues) => {
    await handleSubmit({
      userId: user?.id,
      data,
      imageUrls,
      coverImageIndex,
      amenities,
      isEditing,
      initialData
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AccommodationFormLayout
          form={form}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          coverImageIndex={coverImageIndex}
          setCoverImageIndex={setCoverImageIndex}
          amenities={amenities}
          setAmenities={setAmenities}
          userId={user?.id}
        />
      </form>
    </Form>
  );
};

export default AccommodationForm;
