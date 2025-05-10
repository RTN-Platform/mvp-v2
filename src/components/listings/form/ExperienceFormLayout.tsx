
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tent, Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ExperienceFormValues } from "./types";
import ExperienceInfoSection from "./ExperienceInfoSection";
import ExperienceDetailsSection from "./ExperienceDetailsSection";
import PricingSection from "./PricingSection";
import IncludedItemsSection from "./IncludedItemsSection";
import RequirementsSection from "./RequirementsSection";
import ExperiencePhotosSection from "./ExperiencePhotosSection";
import PublishToggle from "./PublishToggle";
import FormActionButtons from "./FormActionButtons";

interface ExperienceFormLayoutProps {
  form: UseFormReturn<ExperienceFormValues>;
  isSubmitting: boolean;
  isEditing: boolean;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  includedItems: string[];
  setIncludedItems: React.Dispatch<React.SetStateAction<string[]>>;
  userId?: string;
}

const ExperienceFormLayout: React.FC<ExperienceFormLayoutProps> = ({
  form,
  isSubmitting,
  isEditing,
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  includedItems,
  setIncludedItems,
  userId
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tent className="h-5 w-5" /> Experience Information
            </CardTitle>
            <CardDescription>
              Provide the basic details about your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ExperienceInfoSection form={form} />
          </CardContent>
        </Card>

        {/* Photos Section */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Upload photos of your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExperiencePhotosSection 
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              coverImageIndex={coverImageIndex}
              setCoverImageIndex={setCoverImageIndex}
              userId={userId}
              isEditing={isEditing}
              initialData={isEditing ? { images: imageUrls } : undefined}
            />
          </CardContent>
        </Card>

        {/* Experience Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Experience Details
            </CardTitle>
            <CardDescription>
              Information about your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ExperienceDetailsSection form={form} />
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set the pricing for your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PricingSection 
              form={form} 
              pricingField="price_per_person"
              label="Price per person ($)"
            />
          </CardContent>
        </Card>

        {/* Included Items */}
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
            <CardDescription>
              List the items included in your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncludedItemsSection 
              includedItems={includedItems}
              setIncludedItems={setIncludedItems}
            />
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              Let guests know what they need to bring or prepare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RequirementsSection form={form} />
          </CardContent>
        </Card>
        
        {/* Publishing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
            <CardDescription>
              Control the visibility of your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PublishToggle form={form} fieldName="is_published" />
          </CardContent>
        </Card>
      </div>

      {/* Form Actions */}
      <FormActionButtons 
        isSubmitting={isSubmitting} 
        isEditing={isEditing}
        entityName="Experience"
      />
    </>
  );
};

export default ExperienceFormLayout;
