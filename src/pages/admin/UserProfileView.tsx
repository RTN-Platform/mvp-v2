
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/utils/roles";
import { Spinner } from "@/components/ui/spinner";
import { interestsSchema } from "@/schemas/authSchemas";

const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  location: z.string().optional(),
  bio: z.string().max(250, { message: "Bio must be 250 characters or less" }).optional(),
  interests: interestsSchema,
  role: z.enum(['visitor', 'tribe', 'host', 'admin'])
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile: currentUserProfile, updateUserRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      location: "",
      bio: "",
      interests: [],
      role: "tribe"
    }
  });

  useEffect(() => {
    if (!userId) {
      navigate("/admin/users");
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
            username: data.username || "",
            full_name: data.full_name || "",
            location: data.location || "",
            bio: data.bio || "",
            interests: data.interests || [],
            role: data.role
          });
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate, toast, form]);

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

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      // Update role if changed
      const currentRole = form.getValues('role');
      if (data.role !== currentRole && updateUserRole) {
        const roleSuccess = await updateUserRole(userId, data.role);
        if (!roleSuccess) throw new Error("Failed to update user role");
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username || null,
          full_name: data.full_name,
          location: data.location || null,
          bio: data.bio || null,
          interests: data.interests || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "The user's profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800">Edit User Profile</CardTitle>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
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
                          <Input placeholder="username" {...field} />
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
                          <Input placeholder="Location" {...field} />
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
                            placeholder="User bio" 
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
                            <Input
                              placeholder="Add interests (e.g. hiking, beaches)"
                              value={interestInput}
                              onChange={(e) => setInterestInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                            />
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
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!updateUserRole || userId === currentUserProfile?.id}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="visitor">Visitor</SelectItem>
                            <SelectItem value="tribe">Tribe</SelectItem>
                            <SelectItem value="host">Host</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between p-6 border-t border-nature-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/users")}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="bg-nature-600 hover:bg-nature-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserProfileView;
