
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import the newly created components
import { accommodationFormSchema, AccommodationFormValues } from "./form/types";
import BasicInfoSection from "./form/BasicInfoSection";
import ImageUploader from "./form/ImageUploader";
import PropertyDetailsSection from "./form/PropertyDetailsSection";
import PricingSection from "./form/PricingSection";
import AmenitiesSection from "./form/AmenitiesSection";
import HouseRulesSection from "./form/HouseRulesSection";

interface AccommodationFormProps {
  isEditing?: boolean;
  initialData?: any;
}

const AccommodationForm: React.FC<AccommodationFormProps> = ({ 
  isEditing = false, 
  initialData = null 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: AccommodationFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to create a listing",
      });
      return;
    }

    if (imageUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Images Required",
        description: "Please upload at least one image for your listing",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const coverImage = imageUrls[coverImageIndex];
      
      const accommodationData = {
        host_id: user.id,
        title: data.title,
        description: data.description,
        location: data.location,
        price_per_night: data.price_per_night,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        max_guests: data.max_guests,
        amenities: amenities,
        house_rules: data.house_rules,
        cover_image: coverImage,
        images: imageUrls,
        is_published: data.is_published,
      };

      let result;
      
      if (isEditing && initialData) {
        // Update existing listing
        const { data: updatedData, error } = await supabase
          .from("accommodations")
          .update(accommodationData)
          .eq('id', initialData.id)
          .select()
          .single();
          
        if (error) throw error;
        result = updatedData;
        
        toast({
          title: "Accommodation Updated",
          description: "Your accommodation has been updated successfully!",
        });
      } else {
        // Create new listing
        const { data: newAccommodation, error } = await supabase
          .from("accommodations")
          .insert([accommodationData])
          .select()
          .single();
          
        if (error) throw error;
        result = newAccommodation;
        
        toast({
          title: "Accommodation Created",
          description: "Your accommodation has been created successfully!",
        });
      }

      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error saving accommodation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save accommodation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                userId={user?.id}
                isEditing={isEditing}
                initialImages={initialData?.images}
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
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/my-listings")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Accommodation" : "Create Accommodation")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccommodationForm;
