
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tent, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import ExperienceInfoSection from "./form/ExperienceInfoSection";
import ExperienceDetailsSection from "./form/ExperienceDetailsSection";
import PricingSection from "./form/PricingSection";
import IncludedItemsSection from "./form/IncludedItemsSection";
import RequirementsSection from "./form/RequirementsSection";
import ExperiencePhotosSection from "./form/ExperiencePhotosSection";
import { experienceFormSchema, ExperienceFormValues } from "./form/types";

interface ExperienceFormProps {
  isEditing?: boolean;
  initialData?: any;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ 
  isEditing = false, 
  initialData = null 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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

  const onSubmit = async (data: ExperienceFormValues) => {
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
        description: "Please upload at least one image for your experience",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const coverImage = imageUrls[coverImageIndex];

      const experienceData = {
        host_id: user.id,
        title: data.title,
        description: data.description,
        location: data.location,
        price_per_person: data.price_per_person,
        duration: data.duration,
        capacity: data.capacity,
        included_items: includedItems,
        requirements: data.requirements,
        cover_image: coverImage,
        images: imageUrls,
        is_published: data.is_published,
      };

      let result;
      
      if (isEditing && initialData) {
        // Update existing experience
        const { data: updatedData, error } = await supabase
          .from("experiences")
          .update(experienceData)
          .eq('id', initialData.id)
          .select()
          .single();
          
        if (error) throw error;
        result = updatedData;
        
        toast({
          title: "Experience Updated",
          description: "Your experience has been updated successfully!",
        });
      } else {
        // Create new experience
        const { data: newExperience, error } = await supabase
          .from("experiences")
          .insert([experienceData])
          .select()
          .single();
          
        if (error) throw error;
        result = newExperience;
        
        toast({
          title: "Experience Created",
          description: "Your experience has been created successfully!",
        });
      }

      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error saving experience:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save experience. Please try again.",
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
            <ExperiencePhotosSection 
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              coverImageIndex={coverImageIndex}
              setCoverImageIndex={setCoverImageIndex}
              userId={user?.id}
              isEditing={isEditing}
              initialData={initialData}
            />
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
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Experience" : "Create Experience")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExperienceForm;
