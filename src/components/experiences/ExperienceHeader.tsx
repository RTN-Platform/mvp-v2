
import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import HostInfoBadge from "@/components/listings/cards/HostInfoBadge";

type ExperienceHeaderProps = {
  experience: {
    id: string;
    host_id: string;
    title: string;
    tagline: string;
    location: string;
    rating: number;
    reviewCount: number;
    duration: string;
    tags: string[];
  };
};

const ExperienceHeader: React.FC<ExperienceHeaderProps> = ({ experience }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {experience.tags.map((tag, idx) => (
          <Badge key={idx} variant="outline" className="bg-nature-50 text-nature-700 border-nature-200">
            #{tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-start gap-3 mb-3">
        <HostInfoBadge hostId={experience.host_id} />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
      <p className="text-lg text-gray-600 mb-3">{experience.tagline}</p>
      
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center">
          <MapPin size={16} className="text-gray-500 mr-1" />
          <span className="text-gray-600">{experience.location}</span>
        </div>
        <div className="flex items-center">
          <Star size={16} className="text-yellow-500 mr-1" />
          <span className="font-medium">{experience.rating}</span>
          <span className="text-gray-500 ml-1">({experience.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="text-gray-500 mr-1" />
          <span className="text-gray-600">{experience.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default ExperienceHeader;
