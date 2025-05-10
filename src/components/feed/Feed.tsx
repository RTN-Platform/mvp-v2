
import React, { useState, useEffect } from "react";
import Post from "./Post";
import { posts } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import ListingCard from "@/components/listings/cards/ListingCard";

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
  const [loading, setLoading] = useState(true);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Fetch published accommodations
        const { data: accData, error: accError } = await supabase
          .from('accommodations')
          .select('*')
          .eq('is_published', true)
          .limit(3);

        if (accError) throw accError;
        setAccommodations(accData || []);

        // Fetch published experiences
        const { data: expData, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('is_published', true)
          .limit(3);

        if (expError) throw expError;
        setExperiences(expData || []);
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

      {/* Display featured accommodations */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {accommodations.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Featured Accommodations</h2>
                <Button variant="outline" onClick={() => navigate("/accommodations")}>
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((accommodation) => (
                  <ListingCard
                    key={accommodation.id}
                    id={accommodation.id}
                    title={accommodation.title}
                    location={accommodation.location}
                    description={accommodation.description}
                    coverImage={accommodation.cover_image}
                    price={accommodation.price_per_night}
                    priceLabel="per night"
                    isPublished={accommodation.is_published}
                    hostId={accommodation.host_id}
                    linkTo={`/accommodations/${accommodation.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Display featured experiences */}
          {experiences.length > 0 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Featured Experiences</h2>
                <Button variant="outline" onClick={() => navigate("/experiences")}>
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <ListingCard
                    key={experience.id}
                    id={experience.id}
                    title={experience.title}
                    location={experience.location}
                    description={experience.description}
                    coverImage={experience.cover_image}
                    price={experience.price_per_person}
                    priceLabel="per person"
                    isPublished={experience.is_published}
                    hostId={experience.host_id}
                    linkTo={`/experiences/${experience.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Display blog posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
