
import React from "react";
import { Building } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ListingCard from "../cards/ListingCard";
import EmptyState from "../EmptyState";
import { useNavigate } from "react-router-dom";

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

interface AccommodationsTabProps {
  accommodations: Accommodation[];
  isLoading: boolean;
  isAdminUser: boolean;
  onEditListing: (id: string, type: 'accommodation' | 'experience') => void;
  onDeleteClick: (id: string, type: 'accommodation' | 'experience') => void;
}

const AccommodationsTab: React.FC<AccommodationsTabProps> = ({
  accommodations,
  isLoading,
  isAdminUser,
  onEditListing,
  onDeleteClick
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <EmptyState 
        icon={<Building className="h-12 w-12 text-gray-400" />}
        title="No Accommodations Yet"
        description={isAdminUser 
          ? "There are no accommodations listed on the platform yet."
          : "Start sharing your space with nature lovers around the world."
        }
        actionLabel="Add Accommodation"
        onAction={() => navigate("/create-listing?type=accommodation")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          isAdmin={isAdminUser}
          onEditClick={() => onEditListing(accommodation.id, 'accommodation')}
          onDeleteClick={() => onDeleteClick(accommodation.id, 'accommodation')}
        />
      ))}
    </div>
  );
};

export default AccommodationsTab;
