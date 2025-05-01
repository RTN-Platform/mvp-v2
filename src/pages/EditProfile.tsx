
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, User, Edit, Hash } from "lucide-react";
import { interestsSchema } from "@/schemas/authSchemas";

// Profile form schema
const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().optional(),
  bio: z.string().max(250, { message: "Bio must be 250 characters or less" }).optional(),
  interests: interestsSchema,
  is_host: z.boolean().default(false),
});

const EditProfile: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interestInput, setInterestInput] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      location: "",
      bio: "",
      interests: [],
      is_host: false,
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        full_name: profile.full_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
        interests: profile.interests || [],
        is_host: false, // Default to false until we add this field to the profile table
      });
      
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile, form]);

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !interestInput.includes(' ')) {
      const currentInterests = form.getValues('interests') || [];
      if (!currentInterests.includes(interestInput.trim())) {
        form.setValue('interests', [...currentInterests, interestInput.trim()]);
        setInterestInput("");
      }
    }
  };

  const removeInterest = (interest: string) => {
    const currentInterests = form.getValues('interests') || [];
    form.setValue('interests', currentInterests.filter(i => i !== interest));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let newAvatarUrl = profile?.avatar_url;
      
      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        newAvatarUrl = urlData.publicUrl;
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: data.username || null,
          full_name: data.full_name,
          location: data.location || null,
          bio: data.bio || null,
          interests: data.interests || [],
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Navigate back to profile page
      navigate("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800">Edit Profile</CardTitle>
            <CardDescription>Update your personal information and profile picture</CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ""} alt="Profile" />
                    <AvatarFallback className="bg-nature-200 text-nature-700">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center gap-2">
                    <label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-nature-700 hover:text-nature-900">
                        <Edit className="h-4 w-4" />
                        Change Photo
                      </div>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Profile Form Fields */}
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Jane Doe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                            <Input className="pl-10" placeholder="username" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Banff National Park, AB" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="relative flex-grow">
                              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input
                                placeholder="Add interests (e.g. hiking, beaches)"
                                className="pl-10"
                                value={interestInput}
                                onChange={(e) => setInterestInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                              />
                            </div>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={addInterest}
                            >
                              Add
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value?.map((interest, index) => (
                              <span 
                                key={index} 
                                className="bg-nature-100 text-nature-800 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                #{interest}
                                <button 
                                  type="button" 
                                  className="ml-2 text-nature-500 hover:text-nature-700"
                                  onClick={() => removeInterest(interest)}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-nature-50 p-4 rounded-lg mt-6 border border-nature-100">
                    <h3 className="font-medium text-nature-800 mb-2">Are you a host of an experience or venue?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Share your experience or venue with our community and start welcoming guests.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="bg-white border-nature-300 hover:bg-nature-50"
                      onClick={() => navigate("/become-host")}
                    >
                      Become a Host
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between p-6 border-t border-nature-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-nature-600 hover:bg-nature-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
