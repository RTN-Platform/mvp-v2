
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Plus, Upload, X, Tent, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_person: z.number().positive({ message: "Price must be greater than 0" }),
  duration: z.number().int().positive({ message: "Duration must be at least 1 minute" }),
  capacity: z.number().int().min(1, { message: "Must accommodate at least 1 person" }),
  requirements: z.string().optional(),
  is_published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [newItem, setNewItem] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price_per_person: 0,
      duration: 60, // Default duration in minutes
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

  const onSubmit = async (data: FormValues) => {
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

  const addIncludedItem = () => {
    if (newItem.trim() && !includedItems.includes(newItem.trim())) {
      setIncludedItems([...includedItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const newFiles = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...newFiles]);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of newFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `experiences/${user?.id}/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('listings')
          .upload(filePath, file);
        
        if (error) {
          throw error;
        }
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }
      
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newFiles.length} image${newFiles.length > 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload images. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const setCoverImage = (index: number) => {
    setCoverImageIndex(index);
    toast({
      title: "Cover Image Set",
      description: "The selected image has been set as your cover image.",
    });
  };

  const removeImage = async (index: number) => {
    // If removing the cover image, reset cover image to first remaining image (or nothing)
    if (index === coverImageIndex) {
      if (imageUrls.length > 1) {
        // Set it to the first image that isn't the one being removed
        const newIndex = index === 0 ? 1 : 0;
        setCoverImageIndex(newIndex);
      } else {
        setCoverImageIndex(0);
      }
    } else if (index < coverImageIndex) {
      // If removing an image before the cover image, adjust the cover image index
      setCoverImageIndex(coverImageIndex - 1);
    }
    
    // Extract the file path from URL to delete from storage
    try {
      const urlToRemove = imageUrls[index];
      // Only attempt to delete if it's a new upload (not existing images when editing)
      if (!isEditing || !initialData?.images?.includes(urlToRemove)) {
        // URLs are in format: https://[project].supabase.co/storage/v1/object/public/listings/[path]
        const pathParts = urlToRemove.split('/listings/');
        if (pathParts.length > 1) {
          const filePath = `listings/${pathParts[1]}`;
          await supabase.storage.from('listings').remove([filePath]);
        }
      }
    } catch (error) {
      console.error('Error removing image from storage:', error);
    }
    
    // Remove the image from the state
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a catchy title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive title helps guests find your experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your experience..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description will help guests understand what makes your experience special
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Location
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter meeting point or area" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where does your experience take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published Status</FormLabel>
                      <FormDescription>
                        Set whether this experience should be visible to guests
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imageUrls.length > 0 ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={imageUrls[coverImageIndex]}
                          alt="Cover"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          Cover Image
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`Experience ${index + 1}`}
                              className={`w-full h-16 object-cover ${index === coverImageIndex ? 'ring-2 ring-nature-500' : ''}`}
                              onClick={() => setCoverImage(index)}
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop images or click to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Upload at least 5 photos. First photo will be your cover image.
                      </p>
                    </div>
                  )}
                  <div className="mt-4">
                    <Input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label htmlFor="images">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={isUploading}
                        asChild
                      >
                        <span>
                          {isUploading ? (
                            <>Uploading...</>
                          ) : (
                            <>{imageUrls.length > 0 ? "Add More Photos" : "Upload Photos"}</>
                          )}
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
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
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>How long does your experience last?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>How many guests can join?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="price_per_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per person ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Add an included item..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIncludedItem()}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addIncludedItem} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {includedItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(index)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {includedItems.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add items like Equipment, Food, Drinks, Transportation, etc.
                  </p>
                )}
              </div>
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
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any requirements or prerequisites..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Example: Hiking shoes, swimwear, valid ID, minimum fitness level, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
