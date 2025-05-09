
import React from "react";
import { Tent } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ListingCard from "../cards/ListingCard";
import EmptyState from "../EmptyState";
import { useNavigate } from "react-router-dom";

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

interface ExperiencesTabProps {
  experiences: Experience[];
  isLoading: boolean;
  isAdminUser: boolean;
  onEditListing: (id: string, type: 'accommodation' | 'experience') => void;
  onDeleteClick: (id: string, type: 'accommodation' | 'experience') => void;
}

const ExperiencesTab: React.FC<ExperiencesTabProps> = ({
  experiences,
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

  if (experiences.length === 0) {
    return (
      <EmptyState 
        icon={<Tent className="h-12 w-12 text-gray-400" />}
        title="No Experiences Yet"
        description={isAdminUser 
          ? "There are no experiences listed on the platform yet."
          : "Share your expertise and connect travelers with nature."
        }
        actionLabel="Add Experience"
        onAction={() => navigate("/create-listing?type=experience")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          isAdmin={isAdminUser}
          onEditClick={() => onEditListing(experience.id, 'experience')}
          onDeleteClick={() => onDeleteClick(experience.id, 'experience')}
        />
      ))}
    </div>
  );
};

export default ExperiencesTab;
