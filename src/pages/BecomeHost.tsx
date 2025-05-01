
import React from "react";
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
  
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      venueName: "",
      venueType: "",
      venueLocation: "",
      venueDescription: "",
      contactEmail: "",
      contactPhone: "",
    },
  });
  
  const onSubmit = async (data: HostFormValues) => {
    try {
      // In a real app, we would submit this data to an API endpoint
      console.log("Host form submitted:", data);
      
      toast({
        title: "Form submitted",
        description: "Your host application has been received. We'll be in touch soon!",
      });
      
      navigate("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting form",
        description: "There was an error submitting your form. Please try again.",
      });
    }
  };

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
                >
                  Submit Application
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
