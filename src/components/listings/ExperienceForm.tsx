
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
import { MapPin, Calendar, Plus, Upload, X, Tent, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters long" }),
  location: z.string().min(3, { message: "Location is required" }),
  price_per_person: z.number().positive({ message: "Price must be greater than 0" }),
  duration: z.number().int().positive({ message: "Duration must be at least 1 minute" }),
  capacity: z.number().int().min(1, { message: "Must accommodate at least 1 person" }),
  requirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ExperienceForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        description: "Please upload a cover image for your experience",
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

      const { data: experienceData, error } = await supabase
        .from("experiences")
        .insert([
          {
            host_id: user.id,
            title: data.title,
            description: data.description,
            location: data.location,
            price_per_person: data.price_per_person,
            duration: data.duration,
            capacity: data.capacity,
            included_items: includedItems,
            requirements: data.requirements,
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
        title: "Experience Created",
        description: "Your experience has been created successfully!",
      });

      navigate("/my-listings");
    } catch (error: any) {
      console.error("Error creating experience:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create experience. Please try again.",
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
                              alt={`Experience ${index + 1}`}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExperienceForm;
