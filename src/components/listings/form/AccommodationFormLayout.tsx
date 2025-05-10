
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Home, Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AccommodationFormValues } from "./types";
import BasicInfoSection from "./BasicInfoSection";
import ImageUploader from "./ImageUploader";
import PropertyDetailsSection from "./PropertyDetailsSection";
import PricingSection from "./PricingSection";
import AmenitiesSection from "./AmenitiesSection";
import HouseRulesSection from "./HouseRulesSection";
import PublishToggle from "./PublishToggle";
import FormActionButtons from "./FormActionButtons";

interface AccommodationFormLayoutProps {
  form: UseFormReturn<AccommodationFormValues>;
  isSubmitting: boolean;
  isEditing: boolean;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  userId?: string;
}

const AccommodationFormLayout: React.FC<AccommodationFormLayoutProps> = ({
  form,
  isSubmitting,
  isEditing,
  imageUrls,
  setImageUrls,
  coverImageIndex,
  setCoverImageIndex,
  amenities,
  setAmenities,
  userId
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" /> Basic Information
            </CardTitle>
            <CardDescription>
              Provide the basic details about your accommodation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <BasicInfoSection form={form} />
          </CardContent>
        </Card>

        {/* Photos Section */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <CardDescription>
              Upload photos of your accommodation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader 
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              coverImageIndex={coverImageIndex}
              setCoverImageIndex={setCoverImageIndex}
              userId={userId}
              isEditing={isEditing}
              initialImages={isEditing ? imageUrls : undefined}
              entityType="accommodations"
            />
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Information about your accommodation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PropertyDetailsSection form={form} />
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set the pricing for your accommodation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PricingSection form={form} />
          </CardContent>
        </Card>

        {/* Amenities Section */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>
              List the amenities available at your accommodation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AmenitiesSection 
              amenities={amenities}
              setAmenities={setAmenities}
            />
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card>
          <CardHeader>
            <CardTitle>House Rules</CardTitle>
            <CardDescription>
              Set guidelines for guests staying at your place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HouseRulesSection form={form} />
          </CardContent>
        </Card>

        {/* Publishing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
            <CardDescription>
              Control the visibility of your listing
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
      />
    </>
  );
};

export default AccommodationFormLayout;
