
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Edit } from "lucide-react";

type ListingCardProps = {
  id: string;
  title: string;
  location: string;
  description: string;
  coverImage: string | null;
  price: number;
  priceLabel: string;
  isPublished: boolean;
  hostId?: string;
  isAdmin?: boolean;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
};

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  location,
  description,
  coverImage,
  price,
  priceLabel,
  isPublished,
  hostId,
  isAdmin = false,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card>
      <div className="relative">
        <img 
          src={coverImage || 'https://picsum.photos/seed/cabin1/400/300'} 
          alt={title} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {!isPublished && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Draft
          </div>
        )}
        {isAdmin && hostId && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center">
            <span className="truncate max-w-[150px]">Host: {hostId}</span>
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
        <p className="text-gray-700 line-clamp-2">{description}</p>
        <p className="mt-2 font-semibold">${price} {priceLabel}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 pt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDeleteClick(id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onEditClick(id)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
