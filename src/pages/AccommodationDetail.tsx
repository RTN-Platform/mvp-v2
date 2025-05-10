
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Users, Home, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import HostInfoBadge from "@/components/listings/cards/HostInfoBadge";

const AccommodationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccommodation = async () => {
      setLoading(true);
      try {
        // Fetch the accommodation
        const { data, error } = await supabase
          .from('accommodations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setAccommodation(data);
        
        // Fetch host information
        if (data.host_id) {
          const { data: hostData, error: hostError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', data.host_id)
            .single();
            
          if (!hostError && hostData) {
            setHostName(hostData.full_name || "Host");
          }
        }
      } catch (error: any) {
        console.error('Error fetching accommodation details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load accommodation details.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!accommodation) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Accommodation Not Found</h2>
          <p className="mb-6">The accommodation you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/experiences">Browse Other Listings</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleBookNow = () => {
    // If external booking URL is provided, navigate to it
    if (accommodation.booking_url) {
      window.open(accommodation.booking_url, '_blank');
    }
  };

  return (
    <MainLayout>
      <div className="pb-12">
        {/* Back button */}
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
            </Link>
          </Button>
        </div>

        {/* Title and Location - styled like the mockup */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{accommodation.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{accommodation.location}</span>
          </div>
        </div>

        {/* Main layout based on mockup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main image carousel - spans 2/3 of the width */}
          <div className="md:col-span-8 space-y-6">
            <div className="rounded-lg overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Main cover image first */}
                  <CarouselItem>
                    <div className="h-[400px] w-full">
                      <img 
                        src={accommodation.cover_image || 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?&auto=format&fit=crop&w=800&q=80'} 
                        alt={accommodation.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                  
                  {/* Additional images */}
                  {accommodation.images && 
                    accommodation.images
                      .filter((img: string) => img !== accommodation.cover_image)
                      .map((image: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="h-[400px] w-full">
                            <img 
                              src={image} 
                              alt={`${accommodation.title} - ${index + 2}`}
                              className="w-full h-full object-cover rounded-lg" 
                            />
                          </div>
                        </CarouselItem>
                      ))
                  }
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            {/* Secondary images grid like in mockup */}
            {accommodation.images && accommodation.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.images.slice(0, 3).map((image: string, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden h-36">
                    <img 
                      src={image} 
                      alt={`${accommodation.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Two-column layout for content as in mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* About This Place */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this place</h2>
                <p className="text-gray-700 whitespace-pre-line">{accommodation.description}</p>
              </Card>

              {/* Booking card - moved from sidebar per mockup */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">${accommodation.price_per_night}<span className="text-sm font-normal text-gray-500"> / night</span></div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="flex items-center mb-2">
                    <Home className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{accommodation.bedrooms} bedroom{accommodation.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Up to {accommodation.max_guests} guest{accommodation.max_guests !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </Card>
            </div>

            {/* Amenities Section */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {accommodation.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* House Rules Section */}
            {accommodation.house_rules && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                <p className="text-gray-700 whitespace-pre-line">{accommodation.house_rules}</p>
              </Card>
            )}
          </div>
          
          {/* Right sidebar - 1/3 width */}
          <div className="md:col-span-4">
            {/* Host info card */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Hosted by {hostName}</h3>
              <HostInfoBadge hostId={accommodation.host_id} />
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccommodationDetail;
