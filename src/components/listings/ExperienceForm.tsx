
import React from "react";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { ExperienceFormValues } from "./form/types";
import { useExperienceForm } from "./hooks/useExperienceForm";
import { useListingForm } from "./hooks/useListingForm";
import ExperienceFormLayout from "./form/ExperienceFormLayout";

interface ExperienceFormProps {
  isEditing?: boolean;
  initialData?: any;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ 
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
    includedItems, 
    setIncludedItems 
  } = useExperienceForm({ isEditing, initialData });
  
  const { isSubmitting, handleSubmit } = useListingForm('experiences');

  const onSubmit = async (data: ExperienceFormValues) => {
    await handleSubmit({
      userId: user?.id,
      data,
      imageUrls,
      coverImageIndex,
      amenities: includedItems, // We're adapting amenities to hold includedItems for experiences
      isEditing,
      initialData,
      additionalFields: {
        included_items: includedItems
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ExperienceFormLayout
          form={form}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          coverImageIndex={coverImageIndex}
          setCoverImageIndex={setCoverImageIndex}
          includedItems={includedItems}
          setIncludedItems={setIncludedItems}
          userId={user?.id}
        />
      </form>
    </Form>
  );
};

export default ExperienceForm;
