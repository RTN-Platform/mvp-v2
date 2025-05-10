
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Tent, Filter, Search as SearchIcon } from "lucide-react";
import ListingCard from "@/components/listings/cards/ListingCard";

const Experiences: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "experiences" | "accommodations">("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Fetch experiences
        const { data: experiencesData, error: experiencesError } = await supabase
          .from("experiences")
          .select("*")
          .eq("is_published", true);

        if (experiencesError) throw experiencesError;
        setExperiences(experiencesData || []);

        // Fetch accommodations
        const { data: accommodationsData, error: accommodationsError } = await supabase
          .from("accommodations")
          .select("*")
          .eq("is_published", true);

        if (accommodationsError) throw accommodationsError;
        setAccommodations(accommodationsData || []);
      } catch (error: any) {
        console.error("Error fetching listings:", error);
        toast({
          variant: "destructive",
          title: "Failed to load listings",
          description: error.message || "An error occurred while loading listings.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  // Filter listings based on search query
  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAccommodations = accommodations.filter((acc) =>
    acc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render listings based on active tab
  const getFilteredListings = () => {
    switch (activeTab) {
      case "experiences":
        return filteredExperiences.map((exp) => ({
          ...exp,
          type: "experience",
          price: exp.price_per_person,
          priceLabel: "per person",
          detailUrl: `/experiences/${exp.id}`
        }));
      case "accommodations":
        return filteredAccommodations.map((acc) => ({
          ...acc,
          type: "accommodation",
          price: acc.price_per_night,
          priceLabel: "per night",
          detailUrl: `/accommodations/${acc.id}`
        }));
      case "all":
      default:
        return [
          ...filteredExperiences.map((exp) => ({
            ...exp,
            type: "experience",
            price: exp.price_per_person,
            priceLabel: "per person",
            detailUrl: `/experiences/${exp.id}`
          })),
          ...filteredAccommodations.map((acc) => ({
            ...acc,
            type: "accommodation",
            price: acc.price_per_night,
            priceLabel: "per night",
            detailUrl: `/accommodations/${acc.id}`
          }))
        ];
    }
  };

  const listings = getFilteredListings();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Experiences & Accommodations</h1>
          <p className="text-gray-600">
            Explore unique nature experiences and accommodations offered by our community
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as "all" | "experiences" | "accommodations")}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="experiences" className="flex items-center">
                <Tent className="mr-2 h-4 w-4" /> Experiences
              </TabsTrigger>
              <TabsTrigger value="accommodations" className="flex items-center">
                <Home className="mr-2 h-4 w-4" /> Stays
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={`${listing.type}-${listing.id}`}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                priceLabel={listing.priceLabel}
                coverImage={listing.cover_image}
                images={listing.images || []}
                type={listing.type}
                detailUrl={listing.detailUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No listings found matching your criteria.</p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery("")} 
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Experiences;
