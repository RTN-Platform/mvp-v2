
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Tent, ArrowLeft, CalendarCheck, Upload, Info, MapPin, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AccommodationForm from "@/components/listings/AccommodationForm";
import ExperienceForm from "@/components/listings/ExperienceForm";

const CreateListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "accommodation";
  const [activeTab, setActiveTab] = useState<"accommodation" | "experience">(
    initialType === "experience" ? "experience" : "accommodation"
  );
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    // Redirect if user is not authenticated or not a host/admin
    if (!user || (profile && profile.role !== 'host' && profile.role !== 'admin')) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be a host to create listings.",
      });
      navigate("/");
    }
  }, [user, profile, navigate]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/my-listings")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
        </div>
        <p className="text-gray-600">Add a new accommodation or experience to share with the community</p>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="accommodation" className="flex items-center">
              <Building className="mr-2 h-4 w-4" /> Accommodation
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center">
              <Tent className="mr-2 h-4 w-4" /> Experience
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accommodation">
            <AccommodationForm />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceForm />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CreateListing;
