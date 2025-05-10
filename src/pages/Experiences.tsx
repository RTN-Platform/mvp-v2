
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Heart, Search, SlidersHorizontal, Home, Tent } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

interface Accommodation {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price_per_night: number;
  is_published: boolean;
  host_id: string;
  created_at?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  amenities?: string[];
  house_rules?: string | null;
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
  created_at?: string;
  images?: string[];
  requirements?: string;
  included_items?: string[];
  duration?: number;
  capacity?: number;
}

// Combined type for listings with normalized properties
interface NormalizedListing {
  id: string;
  title: string;
  location: string;
  description: string;
  cover_image: string | null;
  price: number;
  priceLabel: string;
  type: 'accommodation' | 'experience';
  tags: string[];
  is_published: boolean;
  host_id: string;
  created_at?: string;
  images?: string[];
}

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
  tags: string[];
  type: 'accommodation' | 'experience';
  rating?: number;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  location,
  image,
  rating = 4.5,
  price,
  tags,
  type,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Check if listing is in favorites on component mount
  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorited(favorites.includes(id));
    }
  }, [id, user]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    const newFavoritedState = !isFavorited;
    setIsFavorited(newFavoritedState);
    
    // Get current favorites from local storage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    // Update favorites
    let updatedFavorites;
    if (newFavoritedState) {
      // Add to favorites if not already included
      updatedFavorites = !favorites.includes(id) ? [...favorites, id] : favorites;
      
      toast({
        title: "Added to favorites",
        description: "This listing has been added to your favorites.",
      });
    } else {
      // Remove from favorites
      updatedFavorites = favorites.filter((favId: string) => favId !== id);
      
      toast({
        title: "Removed from favorites",
        description: "This listing has been removed from your favorites.",
      });
    }
    
    // Save updated favorites to local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
    // Update likes status for this specific item
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "{}");
    if (newFavoritedState) {
      likedPosts[id] = true;
    } else {
      delete likedPosts[id];
    }
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  };

  const getTypeIcon = () => {
    return type === 'accommodation' ? 
      <Home size={18} className="mr-1 text-nature-600" /> : 
      <Tent size={18} className="mr-1 text-nature-600" />;
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group">
      <Link to={`/${type}s/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[80%]">
            {tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-white/80 text-gray-800 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-nature-600/90 text-white text-xs flex items-center">
              {getTypeIcon()}
              {type === 'accommodation' ? 'Stay' : 'Experience'}
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/${type}s/${id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-nature-700 transition-colors">{title}</h3>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <button 
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1 transition-colors ${isFavorited ? 'text-nature-600' : 'text-gray-500 hover:text-nature-600'}`}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={18} className="flex-shrink-0" fill={isFavorited ? "currentColor" : "none"} />
            {!isMobile && <span className="text-sm">{isFavorited ? "Favorited" : "Add to favorites"}</span>}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-nature-800">{price}</span>
          <Button 
            asChild
            className="bg-nature-600 hover:bg-nature-700 text-white"
          >
            <Link to={`/${type}s/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to be signed in to favorite listings and add them to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const SearchSection: React.FC<{
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  listingType: string;
  setListingType: (value: string) => void;
}> = ({ searchTerm, setSearchTerm, sortOrder, setSortOrder, listingType, setListingType }) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by keyword, location, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <div className="flex items-center">
              <SlidersHorizontal size={16} className="mr-2" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center">
        <ToggleGroup type="single" value={listingType} onValueChange={(value) => value && setListingType(value)}>
          <ToggleGroupItem value="all" className="flex items-center">
            <span className="ml-1">All Listings</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="experience" className="flex items-center">
            <Tent size={16} className="mr-1" />
            <span className="ml-1">Experiences</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="accommodation" className="flex items-center">
            <Home size={16} className="mr-1" />
            <span className="ml-1">Accommodations</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

const Experiences: React.FC = () => {
  const [listings, setListings] = useState<NormalizedListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<NormalizedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("popular");
  const [listingType, setListingType] = useState("all");
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Fetch published experiences
        const { data: expData, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('is_published', true);

        if (expError) throw expError;
        
        // Fetch published accommodations
        const { data: accData, error: accError } = await supabase
          .from('accommodations')
          .select('*')
          .eq('is_published', true);

        if (accError) throw accError;
        
        // Normalize experiences
        const normalizedExperiences: NormalizedListing[] = (expData || []).map(exp => {
          // Generate tags from included_items or default tags
          const tags = exp.included_items && Array.isArray(exp.included_items) && exp.included_items.length > 0
            ? exp.included_items.slice(0, 3)
            : ["nature", "adventure", "outdoor"];
            
          return {
            id: exp.id,
            title: exp.title,
            location: exp.location,
            description: exp.description,
            cover_image: exp.cover_image,
            price: exp.price_per_person,
            priceLabel: "/person",
            type: 'experience',
            tags,
            is_published: exp.is_published,
            host_id: exp.host_id,
            created_at: exp.created_at,
            images: exp.images
          };
        });
        
        // Normalize accommodations
        const normalizedAccommodations: NormalizedListing[] = (accData || []).map(acc => {
          // Generate tags from amenities or default tags
          const tags = acc.amenities && Array.isArray(acc.amenities) && acc.amenities.length > 0
            ? acc.amenities.slice(0, 3)
            : ["stay", "lodging", "nature"];
            
          return {
            id: acc.id,
            title: acc.title,
            location: acc.location,
            description: acc.description,
            cover_image: acc.cover_image,
            price: acc.price_per_night,
            priceLabel: "/night",
            type: 'accommodation',
            tags,
            is_published: acc.is_published,
            host_id: acc.host_id,
            created_at: acc.created_at,
            images: acc.images
          };
        });
        
        // Combine all listings
        const allListings = [...normalizedExperiences, ...normalizedAccommodations];
        setListings(allListings);
        setFilteredListings(allListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    // Filter listings based on type selection
    let filtered = listings;
    
    if (listingType !== "all") {
      filtered = listings.filter(listing => listing.type === listingType);
    }
    
    // Filter based on search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(lowerTerm) || 
        listing.location.toLowerCase().includes(lowerTerm) || 
        listing.description.toLowerCase().includes(lowerTerm) ||
        listing.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
      );
    }
    
    // Sort listings based on sort order
    switch (sortOrder) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
        break;
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      default: // popular or any other value
        // Default sorting can remain as-is or implement popularity logic if available
        break;
    }
    
    setFilteredListings(filtered);
  }, [listings, searchTerm, sortOrder, listingType]);

  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  return (
    <MainLayout>
      <div className="py-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Discover Natural Experiences & Stays
          </h1>
          <p className="text-gray-600 mb-6">
            Immerse yourself in nature with our curated outdoor experiences and accommodations
          </p>
          
          <SearchSection 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            listingType={listingType}
            setListingType={setListingType}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : filteredListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.slice(0, displayCount).map((listing) => (
                <ListingCard
                  key={`${listing.type}-${listing.id}`}
                  id={listing.id}
                  title={listing.title}
                  location={listing.location}
                  image={listing.cover_image || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=80'}
                  price={`$${listing.price}${listing.priceLabel}`}
                  tags={listing.tags}
                  type={listing.type}
                />
              ))}
            </div>

            {displayCount < filteredListings.length && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  className="border-nature-600 text-nature-700 hover:bg-nature-50"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-semibold mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Experiences;
