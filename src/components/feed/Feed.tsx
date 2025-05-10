
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import ListingCard from "@/components/listings/cards/ListingCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Accommodation {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_night: number;
  is_published: boolean;
  host_id: string;
}

interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_person: number;
  is_published: boolean;
  host_id: string;
}

const Feed: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<(Accommodation | Experience & { type: string })[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Fetch published accommodations
        const { data: accData, error: accError } = await supabase
          .from('accommodations')
          .select('*')
          .eq('is_published', true)
          .limit(6);

        if (accError) throw accError;
        
        // Fetch published experiences
        const { data: expData, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('is_published', true)
          .limit(6);

        if (expError) throw expError;
        
        // Combine and format the listings
        const formattedAccommodations = accData.map(acc => ({
          ...acc,
          type: 'accommodation',
          price: acc.price_per_night,
          priceLabel: 'per night'
        }));
        
        const formattedExperiences = expData.map(exp => ({
          ...exp,
          type: 'experience',
          price: exp.price_per_person,
          priceLabel: 'per person'
        }));
        
        // Combine all listings and sort by most recently created first
        const allListings = [...formattedAccommodations, ...formattedExperiences].sort(
          (a, b) => new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime()
        );
        
        setListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="space-y-6">
      {!user && (
        <Card className="border-nature-200 mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-nature-50 p-6 border-b border-nature-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-nature-800 mb-2">
                    Join the RTN community
                  </h2>
                  <p className="text-gray-700">
                    Join the RTN community to receive personalised content, connect with like-minded explorers, and enjoy member benefits.
                  </p>
                </div>
                <Button 
                  className="bg-nature-600 hover:bg-nature-700 text-white whitespace-nowrap"
                  onClick={() => navigate("/auth")}
                >
                  Sign up now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display latest updates (combined accommodations and experiences) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
        
        {loading ? (
          <div className="flex justify-center py-6">
            <Spinner size="lg" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={`${listing.type}-${listing.id}`}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                description={listing.description}
                coverImage={listing.cover_image}
                price={listing.price}
                priceLabel={listing.priceLabel}
                isPublished={listing.is_published}
                hostId={listing.host_id}
                linkTo={`/${listing.type}s/${listing.id}`}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-gray-50">
            <p className="text-lg text-gray-600">No listings available yet. Be the first to share your accommodation or experience!</p>
            {user && (
              <Button 
                className="mt-4 bg-nature-600 hover:bg-nature-700"
                onClick={() => navigate("/create-listing")}
              >
                Create Listing
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Feed;
