
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

const hostFormSchema = z.object({
  venueName: z.string().min(2, "Venue name must be at least 2 characters"),
  venueType: z.string().min(2, "Venue type must be at least 2 characters"),
  venueLocation: z.string().min(2, "Location must be at least 2 characters"),
  venueDescription: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().optional(),
});

type HostFormValues = z.infer<typeof hostFormSchema>;

const BecomeHost: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      venueName: "",
      venueType: "",
      venueLocation: "",
      venueDescription: "",
      contactEmail: user?.email || "",
      contactPhone: "",
    },
  });
  
  useEffect(() => {
    // Check if user has an existing application
    const checkExistingApplication = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('host_applications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setHasExistingApplication(true);
          setExistingApplication(data);
        }
      } catch (error) {
        console.error("Error checking existing application:", error);
      }
    };
    
    checkExistingApplication();
  }, [user]);
  
  const onSubmit = async (data: HostFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to submit a host application.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the application into the host_applications table
      const { data: applicationData, error } = await supabase
        .from('host_applications')
        .insert({
          user_id: user.id,
          venue_name: data.venueName,
          venue_type: data.venueType,
          venue_location: data.venueLocation,
          venue_description: data.venueDescription,
          contact_email: data.contactEmail,
          contact_phone: data.contactPhone || null,
        })
        .select()
        .maybeSingle();
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your host application has been received. We'll review it and get back to you soon!",
      });
      
      navigate("/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error submitting application",
        description: error.message || "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasExistingApplication) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto py-8">
          <Card className="border-nature-200 shadow-sm">
            <CardHeader className="border-b border-nature-100 bg-nature-50 rounded-t-lg">
              <CardTitle className="text-2xl text-nature-800">Application Status</CardTitle>
              <CardDescription>Your host application status</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-lg font-medium">
                  {existingApplication?.status === 'pending' ? (
                    <span className="text-amber-500">Your application is pending review</span>
                  ) : existingApplication?.status === 'approved' ? (
                    <span className="text-green-500">Your application has been approved!</span>
                  ) : (
                    <span className="text-red-500">Your application was declined</span>
                  )}
                </p>
                
                <p>
                  {existingApplication?.status === 'pending' ? (
                    "We've received your application and are reviewing it. We'll notify you once a decision has been made."
                  ) : existingApplication?.status === 'approved' ? (
                    "Congratulations! You can now start creating listings and hosting guests."
                  ) : (
                    existingApplication?.admin_notes || "Unfortunately, your application was not approved. Please check your messages for more details."
                  )}
                </p>
                
                <div className="pt-4">
                  <h3 className="font-medium text-lg mb-2">Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Venue Name</p>
                      <p>{existingApplication?.venue_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Venue Type</p>
                      <p>{existingApplication?.venue_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p>{existingApplication?.venue_location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Email</p>
                      <p>{existingApplication?.contact_email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="mt-1">{existingApplication?.venue_description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-6 border-t border-nature-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/profile")}
              >
                Back to Profile
              </Button>
              {existingApplication?.status === 'declined' && (
                <Button 
                  onClick={() => setHasExistingApplication(false)}
                  className="bg-nature-600 hover:bg-nature-700"
                >
                  Submit New Application
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto py-8">
        <Card className="border-nature-200 shadow-sm">
          <CardHeader className="border-b border-nature-100 bg-nature-50 rounded-t-lg">
            <CardTitle className="text-2xl text-nature-800">Become a Host</CardTitle>
            <CardDescription>Share your venue or experience with the Resort to Nature community</CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="venueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue/Experience Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mountain View Retreat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="venueType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue/Experience Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cabin, Hiking Tour, Workshop" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="venueLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Banff National Park, Alberta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="venueDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your venue or experience..."
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what makes your venue or experience special
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone (optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : "Submit Application"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BecomeHost;
