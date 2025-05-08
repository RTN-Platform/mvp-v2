
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Tent } from "lucide-react";

const CreateListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "accommodation";
  const [activeTab, setActiveTab] = useState<"accommodation" | "experience">(
    initialType === "experience" ? "experience" : "accommodation"
  );
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
          <p className="text-gray-600">Add a new accommodation or experience to share with the community</p>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle>Add New Accommodation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  The form to create a new accommodation will be implemented here.
                  This form will include fields for property details, photos, pricing, 
                  availability, house rules, and other necessary information.
                </p>
                <Button onClick={() => navigate("/my-listings")}>Back to Listings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Add New Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  The form to create a new experience will be implemented here.
                  This form will include fields for activity description, schedule, location,
                  capacity, pricing, imagery, and other necessary information.
                </p>
                <Button onClick={() => navigate("/my-listings")}>Back to Listings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CreateListing;
