
import React, { useState } from "react";
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
import { MapPin, Plus, Upload, X, Calendar, Building, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_night: z.number().positive({ message: "Price must be greater than 0" }),
  bedrooms: z.number().int().min(1, { message: "Must have at least 1 bedroom" }),
  bathrooms: z.number().min(0.5, { message: "Must have at least 0.5 bathrooms" }),
  max_guests: z.number().int().min(1, { message: "Must accommodate at least 1 guest" }),
  house_rules: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AccommodationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price_per_night: 0,
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 1,
      house_rules: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to create a listing",
      });
      return;
    }

    if (!coverImage) {
      toast({
        variant: "destructive",
        title: "Cover Image Required",
        description: "Please upload a cover image for your listing",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, using placeholder images
      const demoImages = [
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
      ];

      const demoCover = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7";

      const { data: accommodationData, error } = await supabase
        .from("accommodations")
        .insert([
          {
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
            cover_image: demoCover,
            images: demoImages,
            is_published: false,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Accommodation Created",
        description: "Your accommodation has been created successfully!",
      });

      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error creating accommodation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create accommodation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  // Mock function for image upload
  const handleImageUpload = () => {
    // For demo purposes, using placeholder images
    const demoImages = [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    ];

    setImages(demoImages);
    setCoverImage(demoImages[0]);

    toast({
      title: "Images Uploaded",
      description: "Your demo images have been uploaded successfully.",
    });
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a catchy title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive title helps guests find your place
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
                        placeholder="Describe your accommodation..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description will help guests understand what makes your place special
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
                      <Input placeholder="Enter address or area" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where is your accommodation located?
                    </FormDescription>
                    <FormMessage />
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
                Upload photos of your accommodation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {coverImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={coverImage}
                          alt="Cover"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          Cover Image
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {images.filter(img => img !== coverImage).map((image, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-16 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop images or click to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Upload at least 5 photos. First photo will be your cover image.
                      </p>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleImageUpload}
                  >
                    {coverImage ? "Replace Photos" : "Upload Photos"}
                  </Button>
                </div>
              </div>
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
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
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
                Set the pricing for your accommodation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="price_per_night"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per night ($)</FormLabel>
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

          {/* Amenities Section */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                List the amenities available at your accommodation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Add an amenity..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addAmenity} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {amenities.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Add amenities like WiFi, Kitchen, Free parking, etc.
                  </p>
                )}
              </div>
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
              <FormField
                control={form.control}
                name="house_rules"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your house rules..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Example: No smoking, No parties or events, No pets, etc.
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Accommodation"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccommodationForm;
