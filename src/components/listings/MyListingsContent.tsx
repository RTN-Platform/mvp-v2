
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building, Tent } from "lucide-react";
import AccommodationsTab from "@/components/listings/tabs/AccommodationsTab";
import ExperiencesTab from "@/components/listings/tabs/ExperiencesTab";

type Accommodation = {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_night: number;
  is_published: boolean;
  host_id: string;
};

type Experience = {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_person: number;
  is_published: boolean;
  host_id: string;
};

interface MyListingsContentProps {
  isLoading: boolean;
  isAdminUser: boolean;
  accommodations: Accommodation[];
  experiences: Experience[];
  onEditListing: (id: string, type: 'accommodation' | 'experience') => void;
  onDeleteClick: (id: string, type: 'accommodation' | 'experience') => void;
}

const MyListingsContent: React.FC<MyListingsContentProps> = ({
  isLoading,
  isAdminUser,
  accommodations,
  experiences,
  onEditListing,
  onDeleteClick
}) => {
  const [activeTab, setActiveTab] = useState<"accommodations" | "experiences">("accommodations");

  return (
    <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
      <TabsList>
        <TabsTrigger value="accommodations" className="flex items-center">
          <Building className="mr-2 h-4 w-4" /> Accommodations
        </TabsTrigger>
        <TabsTrigger value="experiences" className="flex items-center">
          <Tent className="mr-2 h-4 w-4" /> Experiences
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="accommodations">
          <AccommodationsTab 
            accommodations={accommodations}
            isLoading={isLoading}
            isAdminUser={isAdminUser}
            onEditListing={onEditListing}
            onDeleteClick={onDeleteClick}
          />
        </TabsContent>
        
        <TabsContent value="experiences">
          <ExperiencesTab 
            experiences={experiences}
            isLoading={isLoading}
            isAdminUser={isAdminUser}
            onEditListing={onEditListing}
            onDeleteClick={onDeleteClick}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MyListingsContent;
